const { userService, tableService } = require('../services');
const { ForbiddenError, BadRequestError, NotFoundError } = require('./../errors');
const { validationResult } = require('express-validator');
const tableList = require('./../src/game_controller/tablesList');
const newGame = require('./../src/game_controller/game');

const userController = {
  getUserByHash: async (req, res, next) => {
    try {
      const { hash } = req.body;
      const user = await userService.getUserByHash(hash);

      if (!user) throw new NotFoundError('User not found');

      const table = await tableService.getTableByIdFromURI(user.room_id);

      if (!table) throw new BadRequestError("Can't connect to room");

      const tableIsExists = tableList.getTable(user.room_id);

      if (!tableIsExists) {
        tableList.addTable(table.id, newGame({ roomId: table.id, blindSize: table.bet }, () => {}, () => {}, () => {}))
      }

      res.json(user);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = userController;
