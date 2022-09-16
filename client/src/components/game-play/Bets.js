import React from "react";
import { useGame } from "../../contexts/Game";
import { indexFromPosition } from "../../utilities/position_converter";
import { AiOutlineCheckCircle } from "react-icons/ai";
import CountUp from "react-countup";
import boneIconImg from "./../../assets/texture/bone-icon.png";

export function Bets() {
  return (
    <div className="absolute w-full h-full pointer-events-none">
      <Pot />
      <Bet style={{ bottom: "120%", left: "50%" }} position={0} />
      <Bet style={{ bottom: "130%", left: "10%" }} position={1} />
      <Bet style={{ bottom: "170%", left: "28%" }} position={2} />
      <Bet style={{ bottom: "175%", left: "50%" }} position={3} />
      <Bet style={{ bottom: "170%", right: "28%" }} position={4} />
      <Bet style={{ bottom: "130%", right: "10%" }} position={5} />
    </div>
  );
}

function Bet({ style, position }) {
  const { seatIndex, bets, betTypes, isWatcher, MONEY_EFFECT_DURATION } = useGame();
  const index = indexFromPosition(position, isWatcher ? position : seatIndex);
  const amount = bets[index];
  const betType = betTypes[index];
  if (!betType) return null;
  return (
    <div
      className="absolute w-0 h-0 flex items-center justify-center z-20"
      style={style}
    >
      {amount > 0 && (
        // <div
        //   className={
        //     "rounded-lg text-center text-xl w-20 h-10 absolute flex items-center justify-center text-white font-bold border-dotted"
        //   }
        //   style={{
        //     borderWidth: "0.28rem",
        //     borderColor: borderFromAmount(amount),
        //     boxShadow: "0rem 0.5rem 0.3rem 0.1rem rgba(0, 0, 0, 0.2)",
        //     backgroundColor: colorFromAmount(amount),
        //   }}
        // >
        //   <CountUp end={amount} preserveValue={true} duration={MONEY_EFFECT_DURATION} />
        // </div>
        <div
          className={
            // "rounded-lg text-center text-xl w-20 h-10 flex items-center justify-center text-white font-bold border-dotted"
            "text-center text-xl w-20 h-10 flex items-center justify-center text-white mt-2"
          }
          style={{
            // borderWidth: "0.28rem",
            // borderColor: borderFromAmount(pot),
            // boxShadow: "0rem 0.5rem 0.3rem 0.1rem rgba(0, 0, 0, 0.2)",
            // backgroundColor: colorFromAmount(pot),
          }}
        >
          <CountUp end={amount} preserveValue={true} duration={MONEY_EFFECT_DURATION} />
          <img className='ml-2 mb-2' src={boneIconImg} width="15px" />
        </div>
      )}
      {/* {betType === "check" && amount === 0 && (
        <div className="text-5xl text-slate-700">
          <AiOutlineCheckCircle />
        </div>
      )} */}
    </div>
  );
}

function Pot() {
  const { pot, MONEY_EFFECT_DURATION } = useGame();
  if (pot === 0) return null;
  return (
    <div
      className="absolute flex items-center flex-col justify-center z-20 font-balsamiq font-bold"
      style={{ bottom: "145%", left: "73%" }}
    >
      <div className='flex justify-center items-center -mb-3' style={{
        color: "#e5c23a",
        fontSize: ""
      }}>
        TOTAL POT
      </div>
      <div
        className={
          // "rounded-lg text-center text-xl w-20 h-10 flex items-center justify-center text-white font-bold border-dotted"
          "text-center text-xl w-20 h-10 flex items-center justify-center text-white"
        }
        style={{
          // borderWidth: "0.28rem",
          // borderColor: borderFromAmount(pot),
          // boxShadow: "0rem 0.5rem 0.3rem 0.1rem rgba(0, 0, 0, 0.2)",
          // backgroundColor: colorFromAmount(pot),
        }}
      >
        <CountUp end={pot} preserveValue={true} duration={MONEY_EFFECT_DURATION} />
        <img className='ml-4 mb-1' src={boneIconImg} width="15px" />
      </div>
    </div>
  );
}

var colors = [
  "#FF0000", // red
  "#FF8800", // orange
  "#FF00FF", // magenta
  "#57CC16", // lime
  "#8822FF", // purple blue
  "#ba3f3f", // brown
  "#000000", // black
];

var borderColors = [
  "#ffffff",
  "#ffffff",
  "#ffffff",
  "#ffffff",
  "#ffffff",
  "#ffffff",
  "#ffffff",
];

const colorFromAmount = (amount) => {
  let colorName = colors[amount % colors.length];
  return colorName;
};

const borderFromAmount = (amount) => {
  return borderColors[amount % borderColors.length];
};
