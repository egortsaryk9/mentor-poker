const tableSchema = require('../schemas/table');
const fs = require('fs/promises');
const axios = require('axios');

const tableService = {
  async getTablesListFromURI() {
    // const tables = await fs.readFile(`${__dirname}/tables.json`, 'utf8');
    // return JSON.parse(tables)?.data;
    
    const response = await axios.get(`https://cooldogs.io/api/poker/rooms?key=${process.env.DOG_KEY}`);
    return response.data.data;
  },

  async getTableByIdFromURI(roomId) {
    const tables = await this.getTablesListFromURI();
    return tables.find(({ id }) => id === roomId);
  },

  async getTablesListFromDB() {
    const tables = await tableSchema.find();
    return tables;
  },

  async createTable(data) {
    const table = await tableSchema.create(data);
    return table;
  },

  async updateTable(_id, updatedData) {
    const table = await tableSchema.updateOne({ _id }, updatedData);
    return table;
  },

  async deleteTable(_id) {
    const table = await tableSchema.deleteOne({ _id });
    return table;
  }
};

module.exports = tableService;