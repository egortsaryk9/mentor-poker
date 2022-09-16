const { tableService } = require('../services');
const { ForbiddenError, BadRequestError } = require('./../errors');
const { validationResult } = require('express-validator');

const tableController = {
  getTablesList: async (req, res, next) => {
    try {
      const tablesList = await tableService.getTablesListFromURI();

      res.json(tablesList);
    } catch (err) {
      next(err);
    }
  },

  createTable: async (req, res, next) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        throw new BadRequestError('QQQ');
      }

      const {
        players
      } = req.body

      const newTable = await tableService.createTable({
        players
      });

      res.json({
        msg: "New table created",
        data: newTable
      })
    } catch (err) {
      next(err);
    }
  },

  updateTask: async (req, res, next) => {
    try {
      // throw new ForbiddenError('You have no permision to update task');
    } catch (err) {
      next(err);
    }
  },

  deleteTask: async (req, res, next) => {
    try {
      // throw new ForbiddenError('You have no permision to delete task');

      res.json({
        msg: "Employee deleted"
      })
    } catch (err) {
      next(err);
    }
  }
}

module.exports = tableController;
