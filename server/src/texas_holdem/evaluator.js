const { Hand, Game } = require('pokersolver');

class Game2 extends Game {
  constructor(descr, seatIndex) {
    super(descr)
    this.descr = descr;
    this.seatIndex = seatIndex;
  }
}

const HandRank = {
  "no hand": 0,
  "high card": 1,
  pair: 2,
  "two pair": 3,
  "three of a kind": 4,
  straight: 5,
  flush: 6,
  "full house": 7,
  "four of a kind": 8,
  "straight flush": 9,
};

const findWinners = (players, board) => {
  const convertToString = (cardsArray) => {
    return cardsArray.map(({value, suit}) => `${mapingVal[value]}${maping[suit]}`);
  }

  const maping = {
    "♥": "h",
    "♠": "s",
    "♦": "d",
    "♣": "c",
    "h": "♥",
    "s": "♠",
    "d": "♦",
    "c": "♣"
  }

  const mapingVal = {
    '1': 'A',
    '2': '2',
    '3': '3',
    '4': '4',
    '5': '5',
    '6': '6',
    '7': '7',
    '8': '8',
    '9': '9',
    '10': 'T',
    'J': 'J',
    'Q': 'Q',
    'K': 'K',
    'A': 'A',
    'T': '10',
  }

  const results = players
    .filter((player) => player?.cards.length === 2 && !player.folded)
    .map((player) => Hand.solve([...convertToString(player.cards), ...convertToString(board)], new Game2('qwe', player.seatIndex)));
    

  const winners = Hand.winners(results); // hand

  return winners.map(({name, descr, cards, game: { seatIndex }}) => ({type: name, descr, index: seatIndex, cards: cards.map(({value, suit}) => ({value: mapingVal[value], suit: maping[suit]})) }))
}


module.exports = {
  HandRank,
  findWinners
};
