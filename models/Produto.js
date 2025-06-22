const mongoose = require('mongoose');

// Definição do Schema (Modelo) para o Produto
const ProdutoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  descricao: { type: String, required: true },
  cor: { type: String, required: true },
  peso: { type: Number, required: true },
  tipo: { type: String, required: true },
  preco: { type: Number, required: true },
  dataCadastro: { type: Date, default: Date.now }, // Define um valor padrão para a data
});

// Exporta o modelo 'Produto' baseado no Schema definido
// A coleção no MongoDB será nomeada 'produtos' (pluralizado automaticamente)
module.exports = mongoose.model('Produto', ProdutoSchema);
