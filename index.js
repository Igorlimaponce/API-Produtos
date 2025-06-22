// Importação dos módulos necessários
require('dotenv').config(); // Carrega variáveis de ambiente do arquivo .env
const express = require('express');
const mongoose = require('mongoose');
const produtoRoutes = require('./routes/produtoRoutes'); // Importa as rotas de produtos
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

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

// Configurações do Swagger JSDoc
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Produtos',
      version: '1.0.0',
      description: 'Uma API simples para gerenciar um CRUD de produtos.',
    },
    servers: [
      {
        url: 'https://api-produtos-300p.onrender.com', // **IMPORTANTE: Substitua pela sua URL do Render**
      },
    ],
  },
  apis: ['./routes/*.js'], // Caminho para os arquivos que contêm as anotações
};

const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Conexão com o MongoDB
//  <password> pelas suas credenciais do MongoDB Atlas
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
