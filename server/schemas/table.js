const { Schema, model } = require('mongoose');

const tableSchema = new Schema({
  players: {
    type: [String],
    required: true
  }
})

module.exports = model('table', tableSchema);
