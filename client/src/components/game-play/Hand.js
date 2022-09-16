import React from "react";
import CountUp from 'react-countup';
import { useGame } from "../../contexts/Game";
import {
  indexFromPosition,
  positionFromIndex
} from "../../utilities/position_converter";
import { Card } from "./Card";
import { ChatBubble } from "./ChatBubble";
import seatImg from "./../../assets/texture/seat.png";
import boneIconImg from "./../../assets/texture/bone-icon.png";

export function Hand({ style, position, rotate, styleForCards }) {
  const {
    players,
    winners,
    seatIndex,
    isWatcher,
    turnIndex,
    isPlaying,
    showDown,
    betTypes,
    bigblindSize,
    MONEY_EFFECT_DURATION,
    takeAction,
    currentBetSize
  } = useGame();

  const [disableCard, setDisableCard] = React.useState(false);
  const [disableSleeve, setDisableSleeve] = React.useState(false);
  const [newCards, setNewCards] = React.useState({ cards: [], sleeve: [], from: null, to: null });
  const [showCheat, setShowCheat] = React.useState(false);

  const positionIndex = indexFromPosition(position, isWatcher ? position : seatIndex);
  const divStyles = {
    backgroundImage: `url(${seatImg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    // boxShadow: "0rem 2rem rgba(0, 0, 0, 0.5)"
    display: "flex",
    justifyContent: "center",
    alignItems: players?.[positionIndex] ? "end" : "center",
    width: "8rem",
    height: "10rem",
    position: "relative",
    backgroundRepeat: "no-repeat",
    transform: `rotate(${rotate}deg)`,
    padding: "10px"
  }

  // const transformRotateReverse = `transform: rotate(-${rotate})`;
  const transformRotateReverse = `rotate(${rotate*-1}deg)`;
  const thisPlayer = players[seatIndex];

  React.useEffect(() => {
    setShowCheat(false)
  }, [])

  React.useEffect(() => {
    if (thisPlayer && thisPlayer.sleeve) {
      setNewCards({ cards: thisPlayer.cards, sleeve: thisPlayer.sleeve, to: null, from: null })
    }
  }, [thisPlayer, currentBetSize, players]);

  const clickCard = (e, card) => {
    e.stopPropagation();
    if (!showCheat) return
    // if (disableCard) return
    // setDisableCard(true)
    // setDisableSleeve(false)
    setNewCards((prev) => {
      const cards = [...prev.cards];
      const sleeve = [...prev.sleeve];

      if (prev.to) {
        const cardIndex = cards.findIndex(({ value, suit }) => value === card.value && suit === card.suit);
        const sleeveIndex = sleeve.findIndex(({ value, suit }) => value === prev.to.value && suit === prev.to.suit);
        if (cardIndex < 0) {
          return {
            ...prev,
            from: {...card}
          }
        }

        if (sleeveIndex < 0) {
          return {
            ...prev,
            from: {...card}
          }
        }

        cards[cardIndex] = {...prev.to};
        sleeve[sleeveIndex] = {...card};

        return {
          cards,
          sleeve,
          from: null,
          to: null
        }
      }

      return {
        ...prev,
        from: {...card}
      }
    })
  }

  const clickSleeve = (e, sleeveCard) => {
    e.stopPropagation();
    if (!showCheat) return
    // if (disableSleeve) return
    // setDisableCard(false)
    // setDisableSleeve(true)
    setNewCards((prev) => {
      const cards = [...prev.cards];
      const sleeve = [...prev.sleeve];

      if (prev.from) {
        const sleeveIndex = sleeve.findIndex(({ value, suit }) => value === sleeveCard.value && suit === sleeveCard.suit);
        const cardIndex = cards.findIndex(({ value, suit }) => value === prev.from.value && suit === prev.from.suit);
        if (sleeveIndex < 0) {
          return {
            ...prev,
            to: {...sleeveCard}
          }
        }

        if (cardIndex < 0) {
          return {
            ...prev,
            to: {...sleeveCard}
          }
        }

        cards[cardIndex] = {...sleeveCard};
        sleeve[sleeveIndex] = {...prev.from};

        return {
          cards,
          sleeve,
          from: null,
          to: null
        }
      }

      return {
        ...prev,
        to: {...sleeveCard}
      }
    })
  }

  const confirmCheat = (e) => {
    e.stopPropagation();
    if (showCheat) {
      takeAction({ type: "cheat", data: { cards: newCards.cards, sleeve: newCards.sleeve } });
    }
    setShowCheat((prev) => !prev);
  }

  if (!players || !players[positionIndex]) return (
    <div
      className={"w-0 h-0 relative flex justify-center items-center cursor-pointer"}
      style={style}
    >
      <div>
        <div
          // className={
          //   "bg-black text-center text-white text-xl pb-1 rounded-lg relative border-gray-800 transition duration-300" +
          //   (turnIndex === positionIndex
          //     ? " bg-lime-300 text-gray-800 font-bold"
          //     : "") +
          //   (isBroke ? " text-red-500" : "")
          // }
          style={divStyles}
        >
          <span style={{color: "#615651", fontSize: "20px", transform: transformRotateReverse}}>empty</span>
        </div>
      </div>
    </div>
  );
  const handPlayer = players[positionIndex];
  const actionType = handPlayer.folded ? "fold" : betTypes[positionIndex];
  const isBroke = !handPlayer.cards?.length && handPlayer.bones < bigblindSize;
  const newStyle = {
    ...style
  }
  if (style.top && position !== 0) {
    newStyle.top = `${+newStyle.top.slice(0, -1) - 5}%`
  } else if (style.bottom && position !== 0) {
    newStyle.bottom = `${+newStyle.bottom.slice(0, -1) + 5}%`
  }

  return (
    <div
      className={"w-0 h-0 relative flex justify-center items-center"}
      style={newStyle}
    >
      <div className='flex flex-col justify-center items-center'>
        <div className={`z-20 ${position !== 0 ? "-mb-2" : ""}`} style={{
          transform: `${position === 0 ? "translateY(35px)" : "none"}`,
          fontSize: "16px"
        }}>
          <div
            className={
              "whitespace-nowrap px-1" +
              (handPlayer?.name?.length > 12 ? " text-sm mt-1" : "")
            }
            style={{
              color: "#afafaf"
            }}
          >
            {position === 0 ? "you" : handPlayer.name}
          </div>
          <div className=''>
            {position !== 0 && (
            <div className='flex justify-center items-center text-white'>
              <CountUp preserveValue={true} end={handPlayer.bones} duration={MONEY_EFFECT_DURATION} />
              <img className='ml-2 -mt-1' src={boneIconImg} width="16px" height="16px" />
            </div> )}
            { turnIndex !== positionIndex &&
              actionType &&
              actionType !== "blind" && position !== 0 &&
              <div className='absolute ' style={{
                // top: "100%",
                // left: "80%"
              }}>
                <div className='relative border-arrow font-bold border-2 rounded-lg text-white bg-black px-4 font-balsamiq' style={{
                  borderColor: "#e5c23a",
                  fontSize: "1em",
                }}>
                  {
                    <div className='-mb-1.5'>{actionType.toUpperCase()}</div>
                  }
                </div>
              </div>
            }
          </div>
        </div>
        <div
          className={
            "relative flex justify-center items-center flex-row box-border relative overflow-x-visible" +
            // (position === 0 ? " scale-125" : "") +
            (winners.length > 0
              ? winners.some(
                  (winner) =>
                    positionFromIndex(winner.index, seatIndex) === position
                )
                ? ""
                : " opacity-50"
              : "")
          }
        >
          {(!isWatcher && !handPlayer.folded && position === 0 && handPlayer?.sleeve && !!handPlayer.sleeve.length && isPlaying) && <div
            className={
              "flex font-balsamiq flex-col translate-y-3 border-x border-b border-white rounded-xl p-4 z-20" +
              (handPlayer.folded ? " opacity-50" : "")
            }
          >
            <div className={`${showCheat ? "active" : ""} absolute text-white font-bold whitespace-nowrap px-2 border-text`} style={{
              top: "-10%",
              left: "50%",
              transform: "translate(-50%, 10%)"
            }}>
              {showCheat ? "Choose card" : "Cards to cheat:"}
            </div>
            <div className='flex flex-row z-20'>
              {newCards.sleeve.map((card, index) => (
                <Card
                key={index}
                index={index}
                card={card}
                hidden={!showDown && position !== 0}
                isActive={newCards.to?.value === card.value && newCards?.to.suit === card.suit}
                isSleeve={true}
                onClick={clickSleeve}
                className={`${disableSleeve ? 'cursor-not-allowed' : 'cursor-pointer'} w-24 mx-0.5`}
                />
              ))}
            </div>
            <div onClick={confirmCheat} className='cursor-pointer absolute whitespace-nowrap px-2 font-bold text-white color-dog-bg_red border border-transparent rounded-lg px-4' style={{
              bottom: "-10%",
              left: "50%",
              transform: "translate(-50%, 8%)",
              fontSize: "15px"
            }}>
              {showCheat ? "CHANGE" : "CHEAT"}
            </div>
          </div>}

          <div
            // className={
            //   "bg-black text-center text-white text-xl pb-1 rounded-lg relative border-gray-800 transition duration-300" +
            //   (turnIndex === positionIndex
            //     ? " bg-lime-300 text-gray-800 font-bold"
            //     : "") +
            //   (isBroke ? " text-red-500" : "")
            // }
            style={divStyles}
            className={position === 0 ? "mx-2" : ""}
          >
            {/* <img src={seatImg} /> */}
            {/* <div className="absolute right-full top-full -translate-y-2/3 translate-x-1/3 rounded-full border-black border overflow-hidden w-12 h-12"> */}
            {/* <div style={{ width: '50%' }}> */}
              <img style={{ transform: transformRotateReverse }} src={`https://cooldogs.io${handPlayer.image}`} alt="avatar" />
            {/* </div> */}
            {/* {!isPlaying && handPlayer.ready && (
              <div
                className={
                  "absolute bottom-full w-full h-18 bg-white text-black rounded-md"
                }
              >
                READY
              </div>
            )} */}
            {
              handPlayer.isCheating && (
                <div
                  className='absolute cursor-pointer'
                  onClick={() => takeAction({ type: 'stopCheat', userId: handPlayer.user_id })}
                  style={{
                    transform: transformRotateReverse,
                    borderColor: "#ff005c",
                    top: "50%"
                  }}
                >
                  <div
                    className='animate-bounce bg-black text-lg text-white border-4 rounded-lg px-1'
                    style={{
                      borderColor: "#ff005c"
                    }}
                  >
                    <div className='-mb-1'>
                      cheating...
                    </div>
                  </div>
                </div>
              )
            }
          </div>
          <ChatBubble
            seatIndex={positionIndex}
            offset={(() => {
              if (handPlayer.folded || !handPlayer.cards.length) {
                if (!isPlaying && handPlayer.ready) return 3;
                return 6;
              }
              return 6;
            })()}
          />
          {(!handPlayer.folded || position === 0) && (
            <div className='z-20'>
              <div className='text-center text-white font-balsamiq font-bold'>
                {showCheat && position === 0 ? "Choose card to swap" : ""}
              </div>
              <div
                className={
                  "flex flex-row translate-y-3" +
                  (handPlayer.folded ? " opacity-50" : "")
                }
                style={{...styleForCards, transform: `rotate(${rotate}deg)`}}
              >
                {
                  position === 0 ? newCards.cards.map((card, index) => (
                    <Card
                      key={index}
                      index={index}
                      card={card}
                      hidden={!showDown && isWatcher}
                      onClick={clickCard}
                      isActive={newCards.from?.value === card.value && newCards.from?.suit === card.suit}
                      className={`${disableCard ? 'cursor-not-allowed' : 'cursor-pointer'} w-28 mr-1`}
                    />
                  )) : handPlayer.cards.map((card, index) => (<Card 
                      key={index}
                      card={card}
                      className={"w-16"}
                      hidden={!showDown && (isWatcher || position !== 0)}
                    />
                  ))
                }
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
