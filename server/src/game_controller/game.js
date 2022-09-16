const { findWinners, HandRank } = require("../texas_holdem/evaluator");
const { generateDeck, dealCards, generateSleeve } = require("../texas_holdem/generator");
const { randomId } = require("../utils/random_id");

const ROUND_TIME = 1500;
const SHOWDOWN_TIME = 6000;
const TIME_TO_MOVE = 30000;
const CHEATS_COUNT = 1;
const BETS_COUNT = 4;
const MAX_PLAYERS_COUNT = 6;
const TIME_TO_STOP_CHEATING = 1500;

function createGame({ roomId = randomId(), blindSize = 10 }) {
  const state = {
    id: roomId, // TO IDENTIFY GAMES WHEN RESETTING
    players: new Array(MAX_PLAYERS_COUNT).fill(null),
    watchers: [],
    bets: new Array(MAX_PLAYERS_COUNT).fill(0),
    betTypes: new Array(MAX_PLAYERS_COUNT).fill(null),
    deck: [],
    board: [],
    timeToMove: TIME_TO_MOVE,
    timerId: '',
    timerForCheatId: '',
    timeToCheat: TIME_TO_STOP_CHEATING,
    betsCount: 0,
    pot: 0,
    banks: {},
    playing: false,
    turnIndex: -1,
    buttonIndex: -1,
    completeActionSeat: -1,
    winners: [],
    currentBetSize: 0,
    round: 0, // 0 = preflop, 1 = flop, 2 = turn, 3 = river
    availableActions: [
      /* type: "bet", maxSize: "1000" */
    ],
    bigblindIncrement: 10,
    bigblindSize: blindSize,
    minRaiseSize: 0,
    winAmount: 0,
  };

  const getPublicState = () => {
    const publicPlayersInfo = state.players.map((p) => (p ? {
      avatarURL: p.avatarURL,
      bones: p.bones,
      cards: new Array(p.cards.length).fill({}),
      image: p.image,
      name: p.name,
      ready: p.ready,
      room_id: p.room_id,
      seatIndex: p.seatIndex,
      user_id: p.user_id,
      isCheating: p.isCheating
    } : null))

    // avatarURL: ""
    // bones: 100
    // cards: []
    // image: "/images/game/bone.png"
    // name: "zxc"
    // ready: false
    // room_id: 1
    // seatIndex: 2
    // sleeve: []
    // bones: 1000
    // token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZWF0SW5kZXgiOjIsInVzZXJJZCI6OTE0Mzk3ODUzLCJyb29tSWQiOjEsInNvY2tldElkIjoieEdMZ0g2WmdkZjk4am5xbkFBQUciLCJpYXQiOjE2NjE5NDM1MTJ9.MjvY2M5-3dxMkmaHbJOgCZg2FdVd1p0t6y8Tu2c8FXc"
    // user_id: 914397853
    return {
      id: state.id, // TO IDENTIFY GAMES WHEN RESETTING
      watchers: state.watchers,
      bets: state.bets,
      betTypes: state.betTypes,
      // deck: [],
      board: state.board,
      pot: state.pot,
      banks: state.banks,
      players: publicPlayersInfo,
      playing: state.playing,
      timeToMove: state.timeToMove,
      turnIndex: state.turnIndex,
      buttonIndex: state.buttonIndex,
      completeActionSeat: state.completeActionSeat,
      winners: state.winners,
      currentBetSize: state.currentBetSize,
      round: state.round, // 0 = preflop, 1 = flop, 2 = turn, 3 = river
      // availableActions: [
      //   /* type: "bet", maxSize: "1000" */
      // ],
      bigblindIncrement: state.bigblindIncrement,
      bigblindSize: state.bigblindSize,
      minRaiseSize: state.minRaiseSize,
      winAmount: state.winAmount,
    }
  }

  const getStateForPlayer = (playerId) => {
    const playersInfoForPlayer = state.players.map((p) => {
      if (!p) return null

      const {
        avatarURL,
        bones,
        cards,
        image,
        name,
        ready,
        room_id,
        seatIndex,
        sleeve,
        token,
        user_id,
        isCheating
      } = p;

      const res = {
        avatarURL,
        bones,
        cards: new Array(cards.length).fill({}),
        image,
        name,
        ready,
        room_id,
        seatIndex,
        user_id,
        isCheating
      };
      if (playerId === user_id) {
        res.cards = cards;
        res.sleeve = sleeve;
        res.availableActions = state.availableActions;
        const cheatAction = res.availableActions.find((a) => a.type==="cheat");
        if (cheatAction) {
          cheatAction.sleeve = sleeve
        }
      }

      return res;
    })

    // avatarURL: ""
    // bones: 100
    // cards: []
    // image: "/images/game/bone.png"
    // name: "zxc"
    // ready: false
    // room_id: 1
    // seatIndex: 2
    // sleeve: []
    // bones: 1000
    // token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZWF0SW5kZXgiOjIsInVzZXJJZCI6OTE0Mzk3ODUzLCJyb29tSWQiOjEsInNvY2tldElkIjoieEdMZ0g2WmdkZjk4am5xbkFBQUciLCJpYXQiOjE2NjE5NDM1MTJ9.MjvY2M5-3dxMkmaHbJOgCZg2FdVd1p0t6y8Tu2c8FXc"
    // user_id: 914397853
    return {
      id: state.id, // TO IDENTIFY GAMES WHEN RESETTING
      watchers: state.watchers,
      bets: state.bets,
      betTypes: state.betTypes,
      // deck: [],
      board: state.board,
      pot: state.pot,
      banks: state.banks,
      players: playersInfoForPlayer,
      playing: state.playing,
      timeToMove: state.timeToMove,
      turnIndex: state.turnIndex,
      buttonIndex: state.buttonIndex,
      completeActionSeat: state.completeActionSeat,
      winners: state.winners,
      currentBetSize: state.currentBetSize,
      round: state.round, // 0 = preflop, 1 = flop, 2 = turn, 3 = river
      // availableActions: [
      //   /* type: "bet", maxSize: "1000" */
      // ],
      bigblindIncrement: state.bigblindIncrement,
      bigblindSize: state.bigblindSize,
      minRaiseSize: state.minRaiseSize,
      winAmount: state.winAmount,
    }
  }

  let broadcast = () => {};
  // COMMANDS

  const randomAvailableSeat = () => {
    const availableSeats = [];
    for (let i = 0; i < MAX_PLAYERS_COUNT; i++) {
      if (!state.players[i]) availableSeats.push(i);
    }
    if (availableSeats.length === 0) return -1;
    return availableSeats[Math.floor(Math.random() * availableSeats.length)];
  };

  const addPlayer = (seatIndex, data) => {
    // var avatarURL = robohashAvatars.generateAvatar({
    //   username: name,
    //   background: robohashAvatars.BackgroundSets.RandomBackground1,
    //   characters: robohashAvatars.CharacterSets.Kittens,
    //   height: 400,
    //   width: 400,
    // });
    var avatarURL = '';
    if (state.players[seatIndex]) return false;
    state.players[seatIndex] = {
      seatIndex,
      name: data.name,
      avatarURL,
      cards: [],
      sleeve: [],
      cheatsCount: 0,
      bonesOnStartRound: data.bones,
      isCheating: false,
      ...data
    };
    if (!state.playing)
      state.players.forEach((player) => {
        if (player) player.ready = false;
      });
    return true;
  };

  const addWatcher = (data) => {
    state.watchers.push(data);
  }

  const removePlayer = (seatIndex) => {
    if (state.turnIndex === seatIndex) {
      fold() || nextTurn();
    }
    // onPlayerKicked(seatIndex);
    state.players[seatIndex] = null;
    if (!state.playing)
      state.players.forEach((player) => {
        if (player) player.ready = false;
      });
    else {
      if (countPlayers() == 1) {
        collectBets();
        showDown();
      }
    }
  };

  const removeUser = (socketId) => {
    const user = state.players.find(p => p?.socketId === socketId) || state.watchers.find(w => w?.socketId === socketId);
    
    if (user.isWatcher) {
      state.watchers.filter(w => w.socketId !== socketId)
    } else {
      if (state.turnIndex === user.seatIndex) {
        fold() || nextTurn();
      }
      // onPlayerKicked(seatIndex);
      state.players[user.seatIndex] = null;
      if (!state.playing)
        state.players.forEach((player) => {
          if (player) player.ready = false;
        });
      else {
        if (countPlayers() == 1) {
          collectBets();
          showDown();
        }
      }

      broadcastForAllWatchers()
      broadcastForAllPlayers()
    }
  }

  const removeBrokePlayers = () => {
    const ids = state.players.filter(
      (player) => player && player.bones < state.bigblindSize
    );
    ids.forEach((id) => {
      removePlayer(id.seatIndex);
    });
  };

  const fillMoney = (name) => {
    const seatIndex = state.players.findIndex(
      (player) => player && player.name === name
    );
    if (seatIndex === -1) return false;
    state.players[seatIndex].bones = Math.max(
      state.players[seatIndex].bones,
      1000
    );
    return true;
  };

  const setMoney = (name, amount) => {
    const seatIndex = state.players.findIndex(
      (player) => player && player.name === name
    );
    if (seatIndex === -1) return false;
    state.players[seatIndex].bones = amount;
    return true;
  };

  const setReady = (seatIndex, sleeveType) => {
    state.players[seatIndex].ready = true;
    state.players[seatIndex].sleeve = generateSleeve(sleeveType);
    state.players[seatIndex].availableActions = [{
      type: "cheat",
      sleeve: state.players[seatIndex].sleeve
    }]

    if (state.players.every(p => p ? p.sleeve.length : true)) {
      clearTimeout(state.timerId)
      state.timerId = '';

    //   checkToStart();
    //   // broadcast(roomId, getPublicState());
    //   broadcastForAllWatchers()
    //   broadcastForAllPlayers()
    }
  };

  const setBlinds = (bigblindSize = 10, bigblindIncrement = 10) => {
    state.bigblindSize = bigblindSize;
    state.bigblindIncrement = bigblindIncrement;
  };

  // PLAYERS & COUNTINGS

  const checkToStart = () => {
    if (countQualifiedPlayers() <= 1) return;
    if (
      state.players.every(
        (player) =>
          !player || player.ready || player.bones < state.bigblindSize
      ) &&
      !state.playing
    ) {
      startGame();
    } else {

    }
  };

  const countPlayers = () => {
    return state.players.filter((player) => player).length;
  };

  const countActivePlayers = () => {
    return state.players.filter(
      (player) => player?.cards?.length && !player.folded
    ).length;
  };

  const countQualifiedPlayers = () => {
    return state.players.filter(
      (player) => player && player.bones >= state.bigblindSize
    ).length;
  };

  // ACTIONS

  const deal = (seatIndex) => {
    state.players[seatIndex].cards = dealCards(state.deck, 2);
  };

  const fold = (withoutCheck) => {
    if (!withoutCheck && !state.availableActions.find((action) => action.type === "fold"))
      return false;
    state.players[state.turnIndex].folded = true;
    if (state.completeActionSeat === state.turnIndex) {
      // OPEN ACTION FOLDED
      nextTurn(true);
      return true;
    }
    nextTurn();
    return true;
  };

  const check = (withoutCheck) => {
    if (!withoutCheck && !state.availableActions.find((action) => action.type === "check"))
      return false;
    state.betTypes[state.turnIndex] = "check";
    nextTurn();
    return true;
  };

  const call = () => {
    const callAction = state.availableActions.find(
      (action) => action.type === "call"
    );
    if (!callAction) return false;
    const toCall = callAction.size;
    state.bets[state.turnIndex] += toCall;
    state.betTypes[state.turnIndex] = "call";
    state.players[state.turnIndex].bones -= toCall;
    nextTurn();
    return true;
  };

  const bet = (betSize) => {
    const betAction = state.availableActions.find(
      (action) => action.type === "bet"
    );
    if (!betAction) return false;
    if (!betSize) return false;
    if (betSize > betAction.maxSize) return false;
    if (betSize < betAction.minSize) return false;
    state.players[state.turnIndex].bones -= betSize;
    state.currentBetSize = betSize;
    state.bets[state.turnIndex] = betSize;
    state.minRaiseSize = betSize;
    state.betTypes[state.turnIndex] = "bet";
    state.completeActionSeat = state.turnIndex;
    state.betsCount += 1;
    nextTurn();
    return true;
  };

  const raise = (raiseSize) => {
    const raiseAction = state.availableActions.find(
      (action) => action.type === "raise"
    );
    if (!raiseAction) return false;
    if (!raiseSize) return false;
    if (raiseSize > raiseAction.maxSize) return false;
    if (raiseSize < raiseAction.minSize) return false;
    const toCall = state.currentBetSize - state.bets[state.turnIndex];

    // state.players[state.turnIndex].bones -= (raiseSize - toCall);
    // state.bets[state.turnIndex] = raiseSize;
    // state.players[state.turnIndex].bones -= raiseSize;
    // state.bets[state.turnIndex] += raiseSize;

    state.players[state.turnIndex].bones -= raiseSize + toCall;
    state.bets[state.turnIndex] += raiseSize + toCall;
    state.betTypes[state.turnIndex] = "raise";
    state.currentBetSize += raiseSize;
    state.minRaiseSize = raiseSize;
    state.completeActionSeat = state.turnIndex;
    state.betsCount += 1;
    nextTurn();
    return true;
  };

  const cheat = (seatIndex, { cards, sleeve }) => {
    const cheatingPlayer = state.players.find(p => p?.seatIndex === seatIndex);
    if (cheatingPlayer.cheatsCount >= CHEATS_COUNT) {
      return false
    }

    const cheatAction = cheatingPlayer.availableActions.find(
      (action) => action.type === "cheat"
    );

    if (!cheatAction) return false;

    if (!Array.isArray(cards) && !Array.isArray(sleeve) && cards.length !== 2 && sleeve.length !== 2) return false;

    const checkIsChanged = (cards1, cards2) => {
      const firstIndex = cards1.findIndex(({ value, suit }) => cards2[0].value === value && cards2[0].suit === suit);
      const secondIndex = cards1.findIndex(({ value, suit }) => cards2[1].value === value && cards2[1].suit === suit);
      return firstIndex === -1 || secondIndex === -1
    }

    const availableCards = [...cheatingPlayer.cards, ...cheatingPlayer.sleeve].every(({
      value: v1,
      suit: s1
    }) => [...cards, ...sleeve].some(({
      value: v2,
      suit: s2
    }) => {

      return v1 === v2 && s1 === s2;
    }));

    if (!availableCards) return false;

    const cardsIsChanged = checkIsChanged(cards, cheatingPlayer.cards);
    const sleeveIsChanged = checkIsChanged(sleeve, cheatingPlayer.sleeve);

    if (!cardsIsChanged && !sleeveIsChanged) return false

    state.timerForCheatId = setTimeout(() => {
      cheatingPlayer.cards = cards;
      cheatingPlayer.sleeve = sleeve;
      cheatingPlayer.isCheating = false;
      broadcastForAllWatchers()
      broadcastForAllPlayers()
    }, TIME_TO_STOP_CHEATING)
    
    cheatingPlayer.cheatsCount += 1;
    cheatingPlayer.isCheating = true;

    prepareTurn()
    
    return true
  }

  const stopCheat = (userId) => {
    const cheatingPlayer = state.players.find(p => p?.user_id === userId);
    if (cheatingPlayer.isCheating) {
      clearTimeout(state.timerForCheatId);
      // cheatingPlayer.folded = true;
      cheatingPlayer.isCheating = false;
      fold(true);
    }
  }

  const blind = (position, size) => {
    if (state.players[position].bones < size) return false;
    const blindSize = size;
    state.players[position].bones -= blindSize;
    state.bets[position] = blindSize;
    state.betTypes[position] = "blind";
    state.currentBetSize = Math.max(state.currentBetSize, blindSize);
    state.minRaiseSize = size;
    return true;
  };

  // TURNS

  const nextIndex = (index) => {
    if (state.players.every((player) => !player)) return -1;
    do {
      index = (index + 1) % state.players.length;
    } while (index < 0 || !state.players[index]);
    return index;
  };

  const isQualified = (seatIndex) => {
    return (
      state.players[seatIndex] &&
      state.players[seatIndex].bones >= state.bigblindSize
    );
  };

  const nextQualifiedIndex = (index) => {
    if (
      state.players.every(
        (player) => !player || player.bones < state.bigblindSize
      )
    )
      return -1;
    do {
      index = (index + 1) % state.players.length;
    } while (
      index < 0 ||
      !state.players[index] ||
      state.players[index].bones < state.bigblindSize
    );
    return index;
  };

  const nextActiveIndex = (index) => {
    if (
      state.players.every((player) => !player?.cards?.length || player.folded)
    )
      return -1;
    do {
      index = (index + 1) % state.players.length;
    } while (
      index < 0 ||
      !state.players[index]?.cards?.length ||
      state.players[index].folded
    );
    return index;
  };

  const nextTurn = (carryCompleteActionSeat) => {
    if (state.timerId) clearTimeout(state.timerId)

    state.timerId = '';

    if (countActivePlayers() == 1) {
      state.turnIndex = -1;
      setTimeout(() => nextRound(), ROUND_TIME);
      return;
    }
    const nextIndex = nextActiveIndex(state.turnIndex);
    if (carryCompleteActionSeat) {
      state.completeActionSeat = nextIndex;
    } else if (nextIndex == state.completeActionSeat) {
      state.turnIndex = -1;
      setTimeout(() => nextRound(), ROUND_TIME);
      return;
    }
    state.turnIndex = nextIndex;
    if (state.players.filter((p, i) => p?.bones > 0).length <= 1 && state.betTypes.every(b => b === null)) {

      prepareTurn(true);
      // check(true);
      nextTurn()
      return;
    }

    prepareTurn();
    state.timerId = setTimeout(() => {check() || fold()}, TIME_TO_MOVE)
  };

  const nextButton = () => {
    state.buttonIndex = nextQualifiedIndex(state.buttonIndex);
  };

  const nextRound = () => {
    state.round += 1;
    state.betsCount = 0;
    state.turnIndex = nextActiveIndex(state.buttonIndex);
    collectBets();
    state.completeActionSeat = state.turnIndex;

    if (countPlayers() == 0) {
      return;
    }

    if (countActivePlayers() == 1) {
      showDown();
      return;
    }
    switch (state.round) {
      case 1:
        state.board = dealCards(state.deck, 3);
        break;
      case 2:
        state.board = [...state.board, ...dealCards(state.deck, 1)];
        break;
      case 3:
        state.board = [...state.board, ...dealCards(state.deck, 4)];
        break;
      case 4:
        showDown();
        return;
      default:
        break;
    }
    // broadcast(state.id, getPublicState());
    if (state.players.filter((p, i) => p?.bones > 0).length <= 1 && state.betTypes.every(b => b === null)) {

      prepareTurn(true);
      // check(true);
      nextTurn()
      broadcastForAllWatchers()
      broadcastForAllPlayers()
      return;
    }
    broadcastForAllWatchers()
    broadcastForAllPlayers()

    prepareTurn();
    state.timerId = setTimeout(() => {check() || fold()}, TIME_TO_MOVE)
  };

  const collectBets = () => {
    state.currentBetSize = 0;

    state.pot += state.bets.reduce((a, b) => a + b, 0);
    state.bets.fill(0);
    state.betTypes.fill(null);
    state.minRaiseSize = 0;

    const banks = state.players.reduce((acc, p, index, array) => {
      if (p && p.ready) {
        if (p.bones <= 0) {
          const otherPot = acc.otherPots.find(op => op.pot === p.bonesOnStartRound);
          if (otherPot) {
            otherPot.users.push(p.user_id)
          } else {
            acc.otherPots.push({
              pot: p.bonesOnStartRound,
              users: [p.user_id]
            })
          }
        }
      }
      if (index === array.length - 1) {
        if (acc.otherPots.length) {
          const sorted = acc.otherPots.sort((a, b) => a.pot - b.pot);

          sorted.forEach(s => {
            array.forEach(a => {
              if (a && s.pot <= a.bonesOnStartRound && !s.users.includes(a.user_id)) {
                s.users.push(a.user_id)
              }
            })
          })

          acc.mainPot = acc.otherPots[0].pot * acc.otherPots[0].users.length
        }
      }

      return acc;
    }, {
      mainPot: state.pot,
      otherPots: []
    })

    state.banks = banks;

  };

  const prepareTurn = (withoutBroadcast) => {
    // CALCULATE AVAILABLE ACTIONS
    availableActions = [];
    if (withoutBroadcast) {
      state.availableActions = availableActions;
      return
    }
    const lastBet = state.bets[state.turnIndex];
    const toCall = state.currentBetSize - lastBet;
    const currentPlayer = state.players[state.turnIndex];
    const bones = state.players[state.turnIndex].bones;

    if (toCall > 0 && bones > 0) {
      availableActions.push({
        type: "fold", // can fold if not calling
      });
      availableActions.push({
        type: "call",
        size: Math.min(toCall, bones), // effective bones call size
      });
    }
    if (toCall === 0 || bones === 0) {
      availableActions.push({
        type: "check",
      });
    }
    if (state.currentBetSize > 0 && bones + lastBet > state.currentBetSize && state.betsCount < BETS_COUNT) {
      availableActions.push({
        type: "raise",
        // minSize: state.round > 1 ? Math.min(state.bigblindSize * 2 + lastBet, bones) : Math.min(state.bigblindSize + lastBet, bones),
        // maxSize: state.round > 1 ? Math.min(state.bigblindSize * 2 + lastBet, bones) : Math.min(state.bigblindSize + lastBet, bones),
        minSize: Math.min(
          state.minRaiseSize,
          bones + lastBet - state.currentBetSize // effective bones raise size
        ),
        maxSize: Math.min(
          state.minRaiseSize,
          bones + lastBet - state.currentBetSize // effective bones raise size
        ),
      });
    }
    if (state.currentBetSize === 0 && bones > 0 && state.betsCount < BETS_COUNT) {
      availableActions.push({
        type: "bet",
        minSize: state.round > 1 ? Math.min(state.bigblindSize * 2, bones) : Math.min(state.bigblindSize, bones), // effective bones bet size
        maxSize: state.round > 1 ? Math.min(state.bigblindSize * 2, bones) : Math.min(state.bigblindSize, bones),
      });
    }
    if (currentPlayer.cheatsCount < CHEATS_COUNT) {
      availableActions.push({
        type: "cheat",
        sleeve: currentPlayer.sleeve
      })
    }
    state.availableActions = availableActions;
    state.players.forEach(p => {
      if (p && p.socketId !== currentPlayer.socketId) {
        if (p.cheatsCount < CHEATS_COUNT) {
          p.availableActions = [{
            type: "cheat",
            sleeve: p.sleeve
          }]
        } else {
          p.availableActions = [];
        }
      }
    })
    // broadcast(state.id, getPublicState());
    broadcastForAllWatchers()
    broadcastForAllPlayers()
  };

  const showDown = () => {
    clearTimeout(state.timerId);
    state.timerId = '';
    state.turnIndex = -1;
    state.showDown = true;
    state.winners = findWinners(state.players, state.board);
    const winAmount = Math.floor(state.pot / state.winners.length);
    state.winAmount = winAmount;

    for (let winner of state.winners) {
      const info = `${
        state.players[winner.index].name
      } won ${winAmount} with ${winner.type.toUpperCase()} ${winner.cards
        .map((c) => c.value + c.suit)
        .join(" ")}`;
      // if (!onInfo) {
      // } else onInfo(info, info);
    }

    broadcast(state.id, state);
    // broadcastForAllWatchers()
    // broadcastForAllPlayers()
    // setTimeout(() => postShowDown(), SHOWDOWN_TIME);
    postShowDown();
  };

  const postShowDown = () => {
    state.winners.forEach(
      (winner) => (state.players[winner.index].bones += state.winAmount)
    );
    state.pot = 0;
    state.playing = false;
    // state.bigblindSize += state.bigblindIncrement;
    state.winners = [];
    state.board = [];
    state.players.forEach((player) => {
      if (player) {
        player.ready = false;
        player.cards = [];
        player.sleeve = [];
        player.folded = false;
      }
    });

    if (countPlayers() === 0) {
      nextButton();
      checkToStart();
      // broadcast(state.id, getPublicState());
      broadcastForAllWatchers()
      broadcastForAllPlayers()
    } else {
      setTimeout(() => {
        nextButton();
        checkToStart();
        // broadcast(state.id, getPublicState());
        broadcastForAllWatchers()
        broadcastForAllPlayers()

        if (state.timerId) {
          clearTimeout(state.timerId)
          state.timerId = '';
        }
        state.timerId = setTimeout(() => {
          state.players.forEach(p => {
            if (p && !p.sleeve.length) {
              setReady(p.seatIndex, '');
            }
          })
          if (state.timerId) {
            clearTimeout(state.timerId)
            state.timerId = '';
          }
          checkToStart();
          // broadcast(roomId, getPublicState());
          broadcastForAllWatchers()
          broadcastForAllPlayers()
        }, state.timeToMove)
      }, SHOWDOWN_TIME);

    }
  };

  const startGame = () => {
    if (state.playing) {
      console.log("Game already started");
      return;
    }
    if (state.players.every((player) => player === null)) {
      console.log("No players to start game");
      return;
    }
    state.playing = true;
    state.deck = generateDeck();
    state.board = [];
    state.players.forEach((player) => {
      if (player) {
        player.folded = false;
        player.bonesOnStartRound = player.bones;
        player.cheatsCount = 0;
        player.isCheating = false;
      }
    });
    state.winners = [];
    state.showDown = false;
    state.round = 0;
    if (state.buttonIndex < 0 || !isQualified(state.buttonIndex)) nextButton();
    let tempIndex = state.buttonIndex;
    if (state.players[tempIndex].bones >= state.bigblindSize)
      deal(tempIndex, 2);
    tempIndex = nextQualifiedIndex(tempIndex);
    while (tempIndex != state.buttonIndex) {
      if (state.players[tempIndex].bones >= state.bigblindSize)
        deal(tempIndex, 2);
      tempIndex = nextQualifiedIndex(tempIndex);
    }
    tempIndex = nextQualifiedIndex(tempIndex); // TO SMALL BLIND
    blind(tempIndex, state.bigblindSize / 2);
    tempIndex = nextQualifiedIndex(tempIndex); // TO BIG BLIND
    blind(tempIndex, state.bigblindSize);
    tempIndex = nextQualifiedIndex(tempIndex); // TO UTG
    state.turnIndex = tempIndex;
    state.completeActionSeat = tempIndex;

    prepareTurn();
    state.timerId = setTimeout(() => {check() || fold()}, TIME_TO_MOVE)
  };

  const addBroadcast = (broadcastFunc) => {
    broadcast = broadcastFunc;
  }

  const broadcastForAllPlayers = () => {
    // broadcast = broadcastFunc;
    state.players.forEach(p => {
      if (p) {
        broadcast(p.socketId, getStateForPlayer(p.user_id))
      }
    })
  }

  const broadcastForAllWatchers = () => {
    // broadcast = broadcastFunc;
    state.watchers.forEach(w => {
      if (w) {
        broadcast(w.socketId, getPublicState())
      }
    })
  }

  const game = {
    state,
    startGame,
    setReady,
    checkToStart,
    deal,
    fold,
    check,
    bet,
    call,
    raise,
    cheat,
    stopCheat,
    addPlayer,
    addWatcher,
    removePlayer,
    removeUser,
    removeBrokePlayers,
    fillMoney,
    setMoney,
    nextTurn,
    nextButton,
    randomAvailableSeat,
    setBlinds,
    addBroadcast,
    getStateForPlayer,
    getPublicState,
    broadcastForAllPlayers,
    broadcastForAllWatchers,
    countQualifiedPlayers
  };

  return game;
}

module.exports = createGame;
