import React, { useContext, useEffect } from "react";
import { AppContext } from "../App.jsx";

const GameContext = React.createContext({});

export function GameProvider({ children }) {
  const { socket, currentUser } = useContext(AppContext);
  const [deck, setDeck] = React.useState([]);
  const [players, setPlayers] = React.useState([]);
  const [bets, setBets] = React.useState([]);
  const [betTypes, setBetTypes] = React.useState([]);
  const [board, setBoard] = React.useState([]);
  const [winners, setWinners] = React.useState([]);
  const [pot, setPot] = React.useState(0);
  const [seatIndex, setSeatIndex] = React.useState(0);
  const [isWatcher, setIsWatcher] = React.useState(false);
  const [turnIndex, setTurnIndex] = React.useState(0);
  const [buttonIndex, setButtonIndex] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [currentBetSize, setCurrentBetSize] = React.useState(0);
  const [showDown, setShowDown] = React.useState(false);
  const [availableActions, setAvailableActions] = React.useState([]);
  const [bigblindSize, setBigblindSize] = React.useState(0);
  const [timer, setTimer] = React.useState(0);

  const MONEY_EFFECT_DURATION = 0.5;

  useEffect(() => {
    socket.on("game_state", (gameState) => {
      setDeck(gameState.deck);
      setPlayers(gameState.players);
      setBets(gameState.bets);
      setBetTypes(gameState.betTypes);
      setBoard(gameState.board);
      setTurnIndex(gameState.turnIndex);
      setButtonIndex(gameState.buttonIndex);
      setIsPlaying(gameState.playing);
      setCurrentBetSize(gameState.currentBetSize);
      setPot(gameState.pot);
      setShowDown(gameState.showDown);
      setAvailableActions(gameState.players.find((p) => p?.user_id === currentUser?.user_id)?.availableActions || []);
      setBigblindSize(gameState.bigblindSize);
      setWinners(gameState.winners);
      setTimer(gameState.timeToMove);
    });
    socket.on("seat_index", (index) => {
      setSeatIndex(index);
    });
    socket.on("seat_watcher", () => {
      setIsWatcher(true);
    });
    const coolDogJwt = localStorage.getItem('cool-dog_jwt');
    socket.emit("info_request", { 'cool-dog_jwt': coolDogJwt });
  }, [seatIndex, socket]);

  // UPDATE TITLE
  useEffect(() => {
    let title = "";
    if (board.length > 0) {
      for (const card of board) {
        title += card.value + card.suit + " ";
      }
    }
    if (seatIndex === turnIndex) {
      title += "Your Turn!";
    }
    if (winners.length >= 1) {
      title += players[winners[0].index].name + " wins!";
    }
    if (title) document.title = title;
    else document.title = "Texas Hold'em Abis";
  }, [board, players, seatIndex, turnIndex, winners]);

  const takeAction = (action) => {
    if (isPlaying && (action.type === 'stopCheat' || action.type === 'cheat')) {
      const coolDogJwt = localStorage.getItem('cool-dog_jwt');
      socket.emit("player_action", { 'cool-dog_jwt': coolDogJwt, ...action });
    }
    if (isPlaying && turnIndex !== seatIndex) return;

    const coolDogJwt = localStorage.getItem('cool-dog_jwt');
    socket.emit("player_action", { 'cool-dog_jwt': coolDogJwt, ...action });
  };

  const value = {
    socket,
    deck,
    board,
    players,
    bets,
    betTypes,
    pot,
    seatIndex,
    isWatcher,
    turnIndex,
    buttonIndex,
    isPlaying,
    currentBetSize,
    showDown,
    availableActions,
    bigblindSize,
    winners,
    takeAction,
    timer,
    MONEY_EFFECT_DURATION,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = React.useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
}
