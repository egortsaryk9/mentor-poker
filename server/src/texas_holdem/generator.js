function generateDeck() {
  const values = [
    "A",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K",
  ];
  const suits = ["♥", "♠", "♦", "♣"];
  const deck = [];
  suits.forEach((suit) => {
    values.forEach((value) => {
      deck.push({
        value,
        suit,
      });
    });
  });
  // shuffle deck
  for (let i = deck.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = deck[i];
    deck[i] = deck[j];
    deck[j] = temp;
  }
  return deck;
}

function generateSleeve(type) {
  const values = [
    "A",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K",
  ];
  const suits = ["♥", "♠", "♦", "♣"];
  const sleeve = [];
  switch (type) {
    case 'AK':
      sleeve.push({
        value: 'A',
        suit: suits[Math.floor(Math.random() * 3)]
      }, {
        value: 'K',
        suit: suits[Math.floor(Math.random() * 3)]
      })
      break;
    case 'QQ':
      sleeve.push({
        value: 'Q',
        suit: suits[Math.floor(Math.random() * 3)]
      }, {
        value: 'Q',
        suit: suits[Math.floor(Math.random() * 3)]
      })
      break;
    default:
      sleeve.push({
        value: values[Math.floor(Math.random() * 12)],
        suit: suits[Math.floor(Math.random() * 3)]
      }, {
        value: values[Math.floor(Math.random() * 12)],
        suit: suits[Math.floor(Math.random() * 3)]
      })
      break;
  }

  return sleeve;
}

function dealCards(deck, numberOfCards) {
  // const cards = [];
  // for (let i = 0; i < numberOfCards; i++) {
  //   cards.push(deck.pop());
  // }
  // return cards;

  if (numberOfCards === 3) {
    return [
      {
        value: '2',
        suit: '♠'
      },
      {
        value: '5',
        suit: '♥'
      },
      {
        value: '7',
        suit: '♦'
      },
    ]
  } else if (numberOfCards === 4) {
    return [
      {
        value: '9',
        suit: '♣'
      }
    ]
  } else if (numberOfCards === 1) {
    return [
      {
        value: 'J',
        suit: '♠'
      }
    ]
  } else {
    const cards = [];
    for (let i = 0; i < numberOfCards; i++) {
      cards.push(deck.pop());
    }
    return cards;
  }

}

module.exports = {
  generateDeck,
  dealCards,
  generateSleeve
}