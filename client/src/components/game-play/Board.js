import React from "react";
import { useGame } from "../../contexts/Game";
import { Card } from "./Card";

export function Board() {
  const { board, winners } = useGame();
  if (!board) return null;
  return (
    <div className="relative clear-both">
      {/* <div className="bg-gray-500 bg-opacity-50 rounded-lg flex flex-row"> */}
      <div className="rounded-lg flex flex-row">
        {board.map((card, index) => (
          <Card card={card} key={index} className={"w-24 h-36"} />
        ))}
        {new Array(5 - board.length).fill(null).map((_, index) => (
          <Card key={index} card={null} hidden={true} className={"w-24 h-36"} />
        ))}
      </div>
      <div className="absolute w-full flex justify-center bg-stone-900 rounded-md">
        {winners.length > 0 && (
          <div className="text-4xl text-center text-white clear-both">
            {winners[0].type.toUpperCase()}
          </div>
        )}
      </div>
    </div>
  );
}
