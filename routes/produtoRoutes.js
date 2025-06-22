const router = require('express').Router();
const Produto = require('../models/Produto');

// --- ROTAS CRUD ---

// ROTA CREATE (POST): Cadastrar um novo produto
router.post('/', async (req, res) => {
  // Extrai os dados do corpo da requisição (req.body)
  const { nome, descricao, cor, peso, tipo, preco } = req.body;

  // Validação simples: verifica se todos os campos obrigatórios foram enviados
  if (!nome || !descricao || !cor || !peso || !tipo || !preco) {
    return res.status(422).json({ error: 'Todos os campos são obrigatórios!' });
  }

  // Cria um objeto de produto com os dados recebidos
  const produto = {
    nome,
    descricao,
    cor,
    peso,
    tipo,
    preco,
  };

  try {
    // Tenta criar o produto no banco de dados
    await Produto.create(produto);
    // Retorna uma mensagem de sucesso com status 201 (Created)
    res.status(201).json({ message: 'Produto cadastrado com sucesso!' });
  } catch (error) {
    // Em caso de erro no servidor, retorna um status 500 com a mensagem de erro
    res.status(500).json({ error: error.message });
  }
});

// ROTA READ (GET): Listar todos os produtos
router.get('/', async (req, res) => {
  try {
    // Busca todos os documentos na coleção 'produtos'
    const produtos = await Produto.find();
    // Retorna a lista de produtos com status 200 (OK)
    res.status(200).json(produtos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ROTA READ (GET): Listar um produto por ID ou Nome
router.get('/:identificador', async (req, res) => {
  const identificador = req.params.identificador;

  try {
    let produto;
    // Tenta encontrar por ID primeiro
    if (identificador.match(/^[0-9a-fA-F]{24}$/)) {
        produto = await Produto.findOne({ _id: identificador });
    }
    
    // Se não encontrar por ID, tenta encontrar por nome
    if (!produto) {
        // Usamos uma regex para busca 'case-insensitive'
        produto = await Produto.findOne({ nome: { $regex: new RegExp(`^${identificador}$`, 'i') } });
    }

    // Se o produto não for encontrado, retorna erro 404
    if (!produto) {
      return res.status(404).json({ message: 'Produto não encontrado.' });
    }

    // Retorna o produto encontrado com status 200
    res.status(200).json(produto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ROTA UPDATE (PUT): Atualizar um produto por ID
router.put('/:id', async (req, res) => {
  const id = req.params.id;
  const { nome, descricao, cor, peso, tipo, preco } = req.body;

  // Cria um objeto com os dados a serem atualizados
  const produto = {
    nome,
    descricao,
    cor,
    peso,
    tipo,
    preco,
  };

  try {
    // Tenta atualizar o produto no banco de dados pelo ID
    const updatedProduto = await Produto.updateOne({ _id: id }, produto);

    // Se nenhum produto foi modificado (ID não encontrado)
    if (updatedProduto.matchedCount === 0) {
      return res.status(404).json({ message: 'Produto não encontrado para atualização.' });
    }

    // Retorna o objeto que foi usado para a atualização
    res.status(200).json(produto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ROTA DELETE (DELETE): Deletar um produto por ID
router.delete('/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const produto = await Produto.findOne({ _id: id });
    
    // Se o produto não for encontrado, retorna erro 404
    if (!produto) {
      return res.status(404).json({ message: 'Produto não encontrado para exclusão.' });
    }
    
    // Tenta deletar o produto
    await Produto.deleteOne({ _id: id });

    // Retorna uma mensagem de sucesso
    res.status(200).json({ message: 'Produto deletado com sucesso!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;
