import React, { useContext, useEffect } from "react";
import {
  AiFillUpCircle,
  AiFillCheckSquare
} from "react-icons/ai";
import { AppContext } from "../../App.jsx";
import { useGame } from "../../contexts/Game";
import { Card } from './../game-play/Card';
import MyTimer from './../ui/Timer';
import CountUp from 'react-countup';
import BoneIconImg from "./../../assets/texture/bone-icon.png";
import TimerImg from "./../../assets/texture/timer-img.png";

export function ActionBar() {
  const {
    takeAction,
    isPlaying,
    players,
    seatIndex,
    isWatcher,
    turnIndex,
    availableActions,
    showDown,
    bigblindSize,
    MONEY_EFFECT_DURATION
  } = useGame();

  const [showSelectBetSize, setShowSelectBetSize] = React.useState(false);
  const [showCheat, setShowCheat] = React.useState(false);
  
  const playersCount = players.filter(Boolean).length;

  if (playersCount < 1) return null;
  if (!players || !players[seatIndex]) return null;

  const thisPlayer = players[seatIndex];
  const disable = !isPlaying || seatIndex !== turnIndex;
  return (
    <div className="w-full flex items-center justify-between pointer-events-auto px-6">
      {isPlaying &&
        !disable &&
        (
          <div className='font-balsamiq text-white text-right' style={{width: "140px"}}>
            <div style={{fontSize: "16px"}}>
              YOUR TURN:
            </div>
            <div className='flex items-center justify-end'>
              <img className='mr-4' src={TimerImg} width="30px" height="30px" />
              <MyTimer style={{fontSize: '40px'}} /> 
            </div>
          </div>
              //   <div className='font-balsamiq text-white'>
                //   <div style={{fontSize: "16px"}}>
                //     YOUR BALANCE:
                //   </div>
                //   <div className='flex items-center justify-end'>
                //     <CountUp preserveValue={true} end={thisPlayer.bones} duration={MONEY_EFFECT_DURATION} style={{fontSize: "24px"}} />
                //     <img className='ml-4' src={BoneIconImg} width="20px" />
                //   </div>
                // </div>
        )
      }
      {!isWatcher && isPlaying &&
        !disable &&
        (
          <div className='flex'>
            {
              availableActions.map((action, index) => {
                let className;
                let displaySize;
                if (action.type === "cheat") return null
                switch (action.type) {
                  case "fold":
                    className = "color-dog-bg_red";
                    break;
                  case "check":
                  case "call":
                    className = "color-dog-bg_green";
                    displaySize = action.size;
                    break;
                  case "bet":
                    className = "color-dog-bg_green";
                    break;
                  case "raise":
                    className = "color-dog-bg_green";
                    break;
                  default:
                    break;
                }
                return (
                  <ActionButton
                    showSelectBetSize={showSelectBetSize}
                    setShowSelectBetSize={setShowSelectBetSize}
                    cards={thisPlayer.cards}
                    key={index}
                    availableAction={action}
                    takeAction={takeAction}
                    title={action.type + (displaySize ? ` ${displaySize}` : "")}
                    className={className}
                  />
                );
              })
            }
          </div>
        )
      }
      {/* {isPlaying &&
        seatIndex !== turnIndex &&
        !thisPlayer.folded &&
        thisPlayer.cards?.length > 0 &&
        !showDown && (
          <div className="flex items-center justify-center tracking-widest text-2xl text-black opacity-50 m-8 p-4">
            - WAIT FOR YOUR TURN -
          </div>
        )} */}
        {
          !isWatcher && (
            <div className={`${!isWatcher && isPlaying && !disable ? '' : 'ml-auto'} font-balsamiq text-white`}>
              <div style={{fontSize: "16px"}}>
                YOUR BALANCE:
              </div>
              <div className='flex items-center justify-end'>
                <CountUp preserveValue={true} end={thisPlayer.bones} duration={MONEY_EFFECT_DURATION} style={{fontSize: "40px"}} />
                <img className='ml-4' src={BoneIconImg} width="30px" />
              </div>
            </div>
          )
        }
    </div>
  );
}

export const Button = ({ action, title, className, mainClasses, style }) => {
  return (
    <button
      className={
        mainClasses ? mainClasses :
        className +
        " text-white p-4 rounded-full uppercase m-8 text-4xl w-64 text-center"
      }
      onClick={() => {
        action();
      }}
      style={style}
    >
      {title}
    </button>
  );
};

export const ActionButton = ({
  title,
  takeAction,
  className,
  showSelectBetSize,
  setShowSelectBetSize,
  cards,
  availableAction,
}) => {
  const inputRef = React.useRef();
  const [betSize, setBetSize] = React.useState(0);
  const [disableCard, setDisableCard] = React.useState(false);
  const [disableSleeve, setDisableSleeve] = React.useState(false);
  const [newCards, setNewCards] = React.useState({ cards: [], sleeve: [], from: null, to: null });
  const { currentBetSize, bigblindSize, pot } = useGame();
  const isAggressive =
    availableAction.type === "raise" || availableAction.type === "bet";
  const expand = isAggressive && showSelectBetSize;
  const buttonClickHandler = () => {
    if (isAggressive) {
      if (!showSelectBetSize) {
        setShowSelectBetSize(true);
      }
    } else {
      takeAction({ type: availableAction.type });
    }
  };

  const confirm = (e) => {
    e.stopPropagation();
    const size = parseInt(betSize) - currentBetSize;
    //setBetSizesetBetSizesetBetSize
    // const size = parseInt(betSize);
    if (size < availableAction.minSize || size > availableAction.maxSize) {
      alert("Invalid bet size");
      return;
    }
    setShowSelectBetSize(false);
    takeAction({ type: availableAction.type, size: size });
  };

  const minusButtonHandler = (e) => {
    e.stopPropagation();
    let newBetSize = betSize - bigblindSize;
    if (newBetSize - currentBetSize < availableAction.minSize) {
      newBetSize = availableAction.minSize + currentBetSize;
    }
    setBetSize(newBetSize);
  };

  const checkBetSize = (value) => {
    if (typeof value === "string") value = parseInt(value);
    if (!value) return;
    if (value < availableAction.minSize + currentBetSize) {
      value = availableAction.minSize + currentBetSize;
      // value = availableAction.minSize;
    } else if (value > availableAction.maxSize + currentBetSize) {
      value = availableAction.maxSize + currentBetSize;
      // value = availableAction.maxSize;
    }
    setBetSize(value);
  };

  const plusButtonHandler = (e) => {
    e.stopPropagation();
    var newBetSize = betSize + bigblindSize;
    if (newBetSize - currentBetSize > availableAction.maxSize) {
      newBetSize = availableAction.maxSize + currentBetSize;
    }
    setBetSize(newBetSize);
  };

  const valueOfPercent = (percent) => {
    return Math.round((pot * percent) / 100);
  };

  const potPercentDisable = (percent) => {
    let bet = valueOfPercent(percent);
    return bet < availableAction.minSize + currentBetSize;
  };

  useEffect(() => {
    if (availableAction) {
      setBetSize(availableAction.minSize + currentBetSize);
      // setBetSize(availableAction.minSize);
      setNewCards({ cards, sleeve: availableAction.sleeve, to: null, from: null })
    }
  }, [availableAction, currentBetSize, cards]);

  useEffect(() => {
    if (inputRef?.current) inputRef.current.value = betSize;
  }, [betSize]);

  return (
    <div
      className={
        className +
        (availableAction.type === "fold" ? " text-white" : " text-black") +
        " p-4 font-balsamiq font-bold rounded-xl uppercase mx-2 text-4xl text-center flex flex-row items-center justify-center flex-nowrap select-none overflow-hidden" +
        (expand ? "" : " active:brightness-50 cursor-pointer")
      }
      style={{
        // width: expand ? "20rem" : "14rem",
        justifyContent: expand ? "space-around" : "center",
        transition: "width 0.2s ease-in-out",
      }}
      tabIndex="-1"
      onClick={buttonClickHandler}
    >
      <div className="" onClick={() => setShowSelectBetSize(false)}>
        {title}
      </div>
      {expand && (
        <>
          <input
            className="w-20 mx-4 bg-white rounded-full text-xl text-black font-bold p-2 text-center cursor-pointer outline-none"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
            onBlur={(e) => checkBetSize(e.target.value)}
            defaultValue={betSize}
            disabled
            ref={inputRef}
          ></input>
          {/* <div className="flex items-center justify-center text-white h-full hover:text-slate-700 cursor-pointer active:scale-95">
            <AiOutlinePlusCircle onClick={plusButtonHandler} />
          </div> */}
          <div className=" relative">
            <div
              className="flex items-center justify-center text-white rounded-full h-full hover:text-slate-700 text-7xl cursor-pointer active:scale-95"
              title="Confirm"
            >
              <AiFillCheckSquare className='text-black hover-check-square' onClick={confirm} />
            </div>
          </div>
        </>
      )}
      {/* {expandCheat && (
        <div className='flex'>
          <div className='flex mr-4'>
            {newCards.cards.map((card, index) => (
              <Card
                key={index + 100}
                card={card}
                onClick={clickCard}
                className={`${disableCard ? 'cursor-not-allowed' : 'cursor-pointer'} w-16 h-24`}
                // hidden={!showDown && position !== 0}
              />
            ))}
          </div>
          <div className='flex'>
            {newCards?.sleeve.map((card, index) => (
              <Card
                key={index}
                card={card}
                onClick={clickSleeve}
                className={`${disableSleeve ? 'cursor-not-allowed' : 'cursor-pointer'} w-16 h-24`}
                // hidden={!showDown && position !== 0}
              />
            ))}
          </div>
          <div className="self-center">
            <AiFillUpCircle onClick={confirmCheat} />
          </div>
        </div>
      )} */}
    </div>
  );
};

const ActionSubButton = ({ children, onClick, value, disable, title }) => {
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        if (!disable) onClick(value);
      }}
      className={
        "flex items-center justify-center rounded-full px-4 py-1 font-bold bg-white text-cyan-500 h-full text-lg whitespace-nowrap" +
        (disable
          ? " opacity-50"
          : " hover:bg-slate-700 cursor-pointer active:scale-95")
      }
      title={title}
    >
      {children}
    </div>
  );
};
