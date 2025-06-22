const router = require('express').Router();
const Produto = require('../models/Produto');

/**
 * @swagger
 * components:
 *   schemas:
 *     Produto:
 *       type: object
 *       required:
 *         - nome
 *         - descricao
 *         - cor
 *         - peso
 *         - tipo
 *         - preco
 *       properties:
 *         _id:
 *           type: string
 *           description: O ID gerado automaticamente pelo MongoDB para o produto.
 *         nome:
 *           type: string
 *           description: Nome do produto.
 *         descricao:
 *           type: string
 *           description: Descrição detalhada do produto.
 *         cor:
 *           type: string
 *           description: Cor do produto.
 *         peso:
 *           type: number
 *           description: Peso do produto em kg.
 *         tipo:
 *           type: string
 *           description: Categoria ou tipo do produto.
 *         preco:
 *           type: number
 *           description: Preço do produto.
 *         dataCadastro:
 *           type: string
 *           format: date
 *           description: A data em que o produto foi cadastrado.
 *       example:
 *         nome: "Smartphone Modelo X"
 *         descricao: "Um smartphone com câmera de 108MP e 256GB de armazenamento."
 *         cor: "Preto Grafite"
 *         peso: 0.180
 *         tipo: "Eletrônico"
 *         preco: 2999.90
 */

/**
 * @swagger
 * tags:
 *   - name: Produtos
 *     description: A API para gerenciamento de produtos
 */

/**
 * @swagger
 * /produtos:
 *   get:
 *     summary: Lista todos os produtos
 *     tags: [Produtos]
 *     responses:
 *       200:
 *         description: A lista de todos os produtos.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Produto'
 */
router.get('/', async (req, res) => {
  try {
    const produtos = await Produto.find();
    res.status(200).json(produtos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /produtos:
 *   post:
 *     summary: Cadastra um novo produto
 *     tags: [Produtos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Produto'
 *     responses:
 *       201:
 *         description: Produto cadastrado com sucesso.
 *       422:
 *         description: Erro de validação (campos obrigatórios).
 */
router.post('/', async (req, res) => {
  const { nome, descricao, cor, peso, tipo, preco } = req.body;
  if (!nome || !descricao || !cor || !peso || !tipo || !preco) {
    return res.status(422).json({ error: 'Todos os campos são obrigatórios!' });
  }
  const produto = { nome, descricao, cor, peso, tipo, preco };
  try {
    await Produto.create(produto);
    res.status(201).json({ message: 'Produto cadastrado com sucesso!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /produtos/{identificador}:
 *   get:
 *     summary: Busca um produto por ID ou Nome
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: identificador
 *         required: true
 *         description: O ID ou Nome do produto a ser buscado.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Os dados do produto.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Produto'
 *       404:
 *         description: Produto não encontrado.
 */
router.get('/:identificador', async (req, res) => {
  const identificador = req.params.identificador;
  try {
    let produto;
    if (identificador.match(/^[0-9a-fA-F]{24}$/)) {
        produto = await Produto.findOne({ _id: identificador });
    }
    if (!produto) {
        produto = await Produto.findOne({ nome: { $regex: new RegExp(`^${identificador}$`, 'i') } });
    }
    if (!produto) {
      return res.status(404).json({ message: 'Produto não encontrado.' });
    }
    res.status(200).json(produto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /produtos/{id}:
 *   put:
 *     summary: Atualiza um produto pelo ID
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: O ID do produto a ser atualizado.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Produto'
 *     responses:
 *       200:
 *         description: Produto atualizado com sucesso.
 *       404:
 *         description: Produto não encontrado.
 */
router.put('/:id', async (req, res) => {
  const id = req.params.id;
  const { nome, descricao, cor, peso, tipo, preco } = req.body;
  const produto = { nome, descricao, cor, peso, tipo, preco };
  try {
    const updatedProduto = await Produto.updateOne({ _id: id }, produto);
    if (updatedProduto.matchedCount === 0) {
      return res.status(404).json({ message: 'Produto não encontrado para atualização.' });
    }
    res.status(200).json(produto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /produtos/{id}:
 *   delete:
 *     summary: Deleta um produto pelo ID
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: O ID do produto a ser deletado.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Produto deletado com sucesso.
 *       404:
 *         description: Produto não encontrado.
 */
router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const produto = await Produto.findOne({ _id: id });
    if (!produto) {
      return res.status(404).json({ message: 'Produto não encontrado para exclusão.' });
    }
    await Produto.deleteOne({ _id: id });
    res.status(200).json({ message: 'Produto deletado com sucesso!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
