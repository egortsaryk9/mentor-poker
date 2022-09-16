// const Table = require('./table');

class TableList {
  constructor(tablesMap = new Map()) {
    if (!(tablesMap instanceof Map)) throw new Error('tablesMap should be instanceof Map')
    this.state = tablesMap;
  }

  get list() {
    return this.state;
  }

  getTable(id) {
    return this.state.get(id);
  }

  addTable(id, data) {
    // this.state.set(id, new Table(data));
    this.state.set(id, data);
  }

  deleteTable(id) {
    // this.state.set(id, new Table(data));
    this.state.delete(id);
  }
}

module.exports = new TableList();