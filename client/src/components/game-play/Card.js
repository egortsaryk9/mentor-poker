import React from "react";
import { useGame } from "../../contexts/Game";
import cardBack from "../../assets/texture/card-back.png";
import { cardUrls } from './../../utilities/card';
import { AiFillCheckCircle } from "react-icons/ai";

export function Card({ isSleeve, isActive, index, card, hidden, onClick, className }) {
  const { winners } = useGame();
  const hands = winners.map((winner) => winner.cards);
  const showDown = winners.length > 0;
  const highLight =
    card && !isSleeve &&
    hands.some((hand) =>
      hand.some((c) => c.suit === card.suit && c.value === card.value)
    );

  const suitMap = {
    "♠": 'SPADE',
    "♦": 'DIAMOND',
    "♣": 'CLUB',
    "♥": 'HEART',
  }
  return (
    <div
      className={
        // "transition duration-500 w-16 h-24 m-0.5 flex justify-center items-center select-none rounded-lg relative" +
        "transition duration-500 -mx-1 flex justify-center items-center select-none rounded-lg relative" +
        (isActive ? " card-active" : "") +
        (showDown ? (highLight ? " -translate-y-5" : " ") : " ") +
        // (card ? " bg-white" : " bg-transparent") +
        ` ${className}`
      }
      onClick={(e) => (onClick ? onClick(e, {...card, index}) : false)}
    >
      {isActive && (
        <div className='absolute w-full h-full flex justify-center items-center border-2 rounded-xl' style={{
          borderColor: "#68f988",
          backgroundColor: "#80808073"
        }}>
          <AiFillCheckCircle style={{
            color: "#68f988",
            fontSize: "40px"
          }} />
        </div>
      )}
      {card && !hidden && (
        // <div className={["♥", "♦"].includes(card.suit) ? " text-red-600" : "text-black"}>
        //   <div className="absolute top-0.5 left-1">
        //     <div className="text-3xl h-6 font-bold font-playing-card">{card.value}</div>
        //     <div className="text-3xl h-6 mt-0.5">{card.suit}</div>
        //   </div>
        //   <div className="absolute bottom-0 right-0 clear-both">
        //     <div className="text-6xl">{card.suit}</div>
        //   </div>
        // </div>
        <img src={cardUrls[`${suitMap[card.suit]}_${card.value}`]} />
      )}
      {hidden && (
        <div
          className="w-full h-full rounded-lg"
          style={{
            // backgroundImage: `url(${cardBack})`,
            // backgroundSize: "cover",
            // backgroundPosition: "center"
          }}
        >
          <img src={cardBack} />
        </div>
      )}
    </div>
  );
}
