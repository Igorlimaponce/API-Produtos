// Importação dos módulos necessários
require('dotenv').config(); // Carrega variáveis de ambiente do arquivo .env
const express = require('express');
const mongoose = require('mongoose');
const produtoRoutes = require('./routes/produtoRoutes'); // Importa as rotas de produtos

// Inicialização do Express
const app = express();

// Middlewares para o Express
// Habilita o Express para receber dados em formato JSON
app.use(express.json());
// Habilita o Express para lidar com dados de formulários URL-encoded
app.use(
  express.urlencoded({
    extended: true,
  }),
);

// Middleware para as rotas de produtos
// Qualquer requisição para /produtos será gerenciada pelo produtoRoutes
app.use('/produtos', produtoRoutes);

// Rota inicial da API (endpoint raiz)
app.get('/', (req, res) => {
  res.json({ message: 'Bem-vindo à API de Produtos!' });
});

// Conexão com o MongoDB
// Substitua <username> e <password> pelas suas credenciais do MongoDB Atlas
const DB_USER = process.env.DB_USER || "seu_usuario_aqui";
const DB_PASSWORD = process.env.DB_PASSWORD || "sua_senha_aqui";

mongoose
  .connect(
    `mongodb+srv://postgre:${DB_PASSWORD}@cluster0.jrvvwcl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
  )
  .then(() => {
    console.log('Conectado ao MongoDB com sucesso!');
    // Inicia o servidor na porta 3000 após a conexão bem-sucedida
    app.listen(3000, () => {
      console.log('Servidor rodando na porta 3000');
    });
  })
  .catch((err) => {
    // Captura e exibe erros de conexão com o banco de dados
    console.error('Erro ao conectar ao MongoDB:', err);
  });
