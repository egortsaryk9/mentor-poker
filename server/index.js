const express = require('express');
const mongoose = require('mongoose');

const userService = require('./services/user');

const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const socket = require("socket.io");

const createGame = require("./src/game_controller/game");
const rl = require("readline");
const { randomId } = require("./src/utils/random_id");

const config = require('./config');
const tableList = require('./src/game_controller/tablesList')
const jwt = require('jsonwebtoken');

/* Middleware */
// const notFoundRequest = require('./middleware/404');
const errorHandler = require('./middleware/errorHandler');

/* Routes */
const routes = require('./routes');

/* Application initialization */
const app = express();

/* For access to public files */
// app.use(express.static(path.join(__dirname, 'public')));

/* Parse incoming requests */
app.use(bodyParser.urlencoded({ extended: false })); // x-www-urlencoded
app.use(bodyParser.json()); // json

/* Use middleware */
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use((req, res, next) => {
  next()
})
/* Use Routes */
app.use('/api', routes);

// app.use(notFoundRequest);
app.use(errorHandler);

const PORT = process.env.PORT || 8000;

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}. NODE_ENV is ${process.env.NODE_ENV}`)
})


const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});


app.use(express.static(path.join(__dirname, "./client/build")));

const connections = [];

const playerData = new Array(9).fill(null);
var chatLogging = true;


function broadcast(to, state) {
  io.to(to).emit("game_state", state);
}

io.on("connection", (socket) => {
  const roomId = Number(socket.handshake.query.roomId);
  const currentTable = tableList.getTable(roomId)

  currentTable.addBroadcast(broadcast)

  let seatIndex = '';
  socket.join(roomId);
  // CONNECTION
  socket.on("join", (data) => {
    if (!currentTable.state.players.includes(null)) {
      socket.emit('error', { type: 101, msg: "Out of seat" })
      // currentTable.addWatcher({ ...data, socketId: socket.id, isWatcher: true });
      // socket.emit("seat_watcher", data);
      // currentTable.broadcastForAllWatchers()
      // currentTable.broadcastForAllPlayers()
      socket.disconnect();
      return
    }

    if (currentTable.state.players.some((p) => p?.user_id === data.user_id)) {
      socket.emit('error', { type: 102, msg: 'Already joined' })
      
      return
    }

    
    // SELECT SEAT
    seatIndex = currentTable.randomAvailableSeat();
    if (seatIndex === -1) {
      seatIndex = currentTable.randomAvailableSeat();
    }
    const token = jwt.sign({ seatIndex, userId: data.user_id, roomId: data.room_id, socketId: socket.id }, process.env.JWT_SECRET);

    currentTable.addPlayer(seatIndex, { ...data, socketId: socket.id, token });
    socket.emit('join_success', token)
    currentTable.broadcastForAllWatchers()
    currentTable.broadcastForAllPlayers()
    socket.on("info_request", (data) => {
      if (data['cool-dog_jwt']) {
        decodedToken = jwt.verify(data['cool-dog_jwt'], process.env.JWT_SECRET);

        if (decodedToken.roomId !== roomId) {
          socket.emit('error', { type: 403, msg: 'You have no permission' });
          return
        }

        if (currentTable.state.players.find((user) => user?.user_id === decodedToken.userId)) {
          socket.emit("seat_index", seatIndex);
          socket.emit("game_state", currentTable.getStateForPlayer(decodedToken.userId));
        } else {
          socket.emit("seat_index", seatIndex);
          socket.emit("game_state", currentTable.getPublicState());
        }
      } else {
        socket.emit("seat_index", seatIndex);
        socket.emit("game_state", currentTable.getPublicState());
      }
    });

    if (currentTable.countQualifiedPlayers() > 1 && !currentTable.state.playing) {
      if (currentTable.state.timerId) {
        clearTimeout(currentTable.state.timerId)
        currentTable.state.timerId = '';
      }
      currentTable.state.timerId = setTimeout(() => {
        currentTable.state.players.forEach(p => {
          if (p && !p.sleeve.length) {
            currentTable.setReady(p.seatIndex, '');
          }
        })
        if (currentTable.state.timerId) {
          clearTimeout(currentTable.state.timerId)
          currentTable.state.timerId = '';
        }
        currentTable.checkToStart();
        currentTable.broadcastForAllWatchers()
        currentTable.broadcastForAllPlayers()
      }, currentTable.state.timeToMove)
    }
  });

  socket.on("send-msg", (data) => {
    // socket.to(sendUserSocket).emit("msg-recieve", data.msg);
  });

  const name = socket.handshake.query.name;
  const info = `${name} joined the table`;
  io.to(roomId).emit("chat_message", {
    desc: info,
    content: info,
  });
  connections.push(socket);

  // DISCONNECT
  socket.on("disconnect", async () => {
    const info = `${name} left the table`;
    io.to(roomId).emit("chat_message", {
      desc: info,
      content: info,
    });

    
    const user = currentTable.state.players.find(p => p?.socketId === socket.id);

    if (!user) {
      return
    }
    
    userService.userLeaveRoom(user.hash, user.bones).then(res => console.log(res, 'res')).catch(err => console.log(err, 'err'))
    connections.splice(connections.indexOf(socket), 1);

    currentTable.removeUser(socket.id);
    socket.disconnect()

    if (currentTable.countQualifiedPlayers() < 2) {
      clearTimeout(currentTable.state.timerId)
      currentTable.state.timerId = '';
    }
  });

  // PLAYER ACTION
  socket.on("player_action", (action) => {
    let currentUser = null;
    if (action['cool-dog_jwt']) {
      decodedToken = jwt.verify(action['cool-dog_jwt'], process.env.JWT_SECRET);

      currentUser = currentTable.state.players.find((user) => user?.user_id === decodedToken.userId);
      if (decodedToken.roomId !== roomId && currentUser && !currentUser.folded) {
        socket.emit('error', { type: 403, msg: 'You have no permission' });
        return
      }
    }
    switch (action.type) {
      case "fold":
        if (seatIndex === currentTable.state.turnIndex) {
          currentTable.fold();
          currentTable.broadcastForAllWatchers()
          currentTable.broadcastForAllPlayers()
        }
        break;
      case "check":
        if (seatIndex === currentTable.state.turnIndex) {
          currentTable.check();
          currentTable.broadcastForAllWatchers()
          currentTable.broadcastForAllPlayers()
        }
        break;
      case "call":
        if (seatIndex === currentTable.state.turnIndex) {
          currentTable.call();
          currentTable.broadcastForAllWatchers()
          currentTable.broadcastForAllPlayers()
        }
        break;
      case "bet":
        if (seatIndex === currentTable.state.turnIndex) {
          currentTable.bet(action.size);
          currentTable.broadcastForAllWatchers()
          currentTable.broadcastForAllPlayers()
        }
        break;
      case "raise":
        if (seatIndex === currentTable.state.turnIndex) {
          currentTable.raise(action.size);
          currentTable.broadcastForAllWatchers()
          currentTable.broadcastForAllPlayers()
        }
        break;
      case "ready":
        if (seatIndex === currentTable.state.turnIndex || currentTable.state.turnIndex === -1) {
          currentTable.setReady(seatIndex, action.sleeveType);
          currentTable.checkToStart();
          currentTable.broadcastForAllWatchers()
          currentTable.broadcastForAllPlayers()
        }
        break;
      case "cheat":
        if (action?.data) {
          currentTable.cheat(seatIndex, action.data);
          currentTable.broadcastForAllWatchers()
          currentTable.broadcastForAllPlayers()
        }
        break;
      case "stopCheat":
        if (action?.userId) {
          currentTable.stopCheat(action.userId);
          currentTable.broadcastForAllWatchers()
          currentTable.broadcastForAllPlayers()
        }
      default:
        break;
    }
  });

  // CHAT
  socket.on("chat_message", (message) => {
    const chat = `<${name}> ${message}`;
    io.to(roomId).emit("chat_message", {
      id: randomId(),
      desc: chat,
      content: message,
      senderID: seatIndex,
    });
  });
});
