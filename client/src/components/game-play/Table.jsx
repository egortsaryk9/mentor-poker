import { createContext, useEffect, useRef, useState } from "react";
import { useGame } from "../../contexts/Game";
import { Bets } from "./Bets";
import { Board } from "./Board";
import { DealerButton } from "./DealerButton";
import { Hand } from "./Hand";
import dotPattern from "../../assets/texture/dot-pattern.png";
import boardImg from "./../../assets/texture/board.png";
import boneIconImg from "./../../assets/texture/bone-icon.png";
import { Button } from './../ui/ActionBar';
import MyTimer from './../ui/Timer';
import TimerImg from './../../assets/texture/timer-img.png';
import { Card } from "./Card";

export function Table() {
  const { takeAction, bigblindSize, isPlaying, players, seatIndex } = useGame();
  const [showWaitForPlayer, setShowWaitForPlayer] = useState(false);
  const [showWaitForNextRound, setShowWaitForNextRound] = useState(true);
  
  useEffect(() => {
    if (!isPlaying && thisPlayer) {
      setShowWaitForNextRound(false);
    }
  }, []);

  useEffect(() => {
    if (playersCount < 2) {
      // setShowWaitForNextRound(false);
      setShowWaitForPlayer(true);
    } else {
      setShowWaitForPlayer(false)
    }
  }, [players]);

  const playersCount = players.filter(Boolean).length;
  const thisPlayer = players[seatIndex];

  if (!thisPlayer) return null

  const clickCrossWaitForNext = () => {
    setShowWaitForNextRound(false);
  }

  return (
    <div
      // className="relative bg-lime-400 bg-rad border-slate-700 rounded-full w-3/4 h-1/2 flex items-center justify-center"
      // className="w-full h-full relative flex items-center justify-center"
      className="w-full h-full relative flex items-center justify-center"
      style={{
        maxHeight: "30rem",
        // width: '810px',
        // height: '100%',
        // borderWidth: "0.5rem",
        // backgroundImage: `url(${boardImg})`,
        // backgroundSize: "cover",
        // backgroundPosition: "center",
        // boxShadow: "0rem 2rem rgba(0, 0, 0, 0.5)"
      }}
    >
      {showWaitForPlayer && (
        <div
          className='flex justify-center items-center text-white absolute border-2 rounded-xl border-white p-6 font-balsamiq z-50'
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            maxWidth: "340px",
            backgroundColor: "rgba(255,255,255,0.10196078431372549)"
          }}
        >
          <div className='mr-6'>
            <span className='font-bold pt-1 block flex justify-center items-center text-2xl rounded-full' style={{
              width: "25px",
              height: "25px",
              backgroundColor: "#e0c300",
              borderRadius: "100%",
              color: "#457b46"
            }}>
              !
            </span>
          </div>
          <div className='text-xl' style={{fontSize: "20px"}}>
            Waiting for at least 1 another player to start the game
          </div>
        </div>
      )}

      {showWaitForNextRound && (
        <div
          className='text-white absolute border border-transparent overflow-hidden rounded-xl z-50'
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            maxWidth: "340px",
            filter: "drop-shadow(0px 9px 15px rgba(43,75,76,0.5))",
            backgroundColor: "#141313"
          }}
        >
          <div className='p-6' style={{
            filter: "drop-shadow(rgba(43, 75, 76, 0.5) 0px 9px 15px)",
            backgroundColor: "rgb(14 26 6 / 86%)"
          }}>
            <div className='text-center text-xl -mb-3' style={{
              color: "#e5c23a",
              fontSize: "24px"
            }}>
              DOGKER HOLDEM
            </div>
            <div className="close-btn cursor-pointer" onClick={clickCrossWaitForNext}>
              <div className="wrapper">
                <div className="arrow">
                  <div className="line"></div>
                  <div className="line"></div>
                </div>
              </div>
            </div>
          </div>
          <div className='p-6 text-center font-roboto' style={{
            filter: "drop-shadow(rgba(43, 75, 76, 0.5) 0px 9px 15px)",
            backgroundColor: "rgb(20 19 19 / 94%)"
          }}>
            <div className='font-bold text-xl mb-8' style={{
                fontSize: "20px"
              }}>
              Please wait for next hand
            </div>
            <div className='relative p-8 rounded-xl' style={{
              border: "1px solid rgb(99, 140, 74)"
            }}>
              <div className='absolute font-bold text-xl z-10 px-4' style={{
                color: "rgb(99, 140, 74)",
                fontSize: "14px",
                top: "-10%",
                left: "50%",
                background: "#151515",
                transform: "translate(-50%, -10%)",
              }}>
                Stakes limits
              </div>
              <div className='text-xl flex justify-center items-center font-bold' style={{
                fontSize: "24px"
              }}>
                <div style={{
                  color: "rgb(99, 140, 74)",
                }}>
                  {bigblindSize}/{bigblindSize * 2}
                </div>
                <span className='mx-2'>
                  Bones
                </span>
                <img src={boneIconImg} width="25px"/>
              </div>
            </div>
          </div>
        </div>
      )}

      {playersCount > 1 && !isPlaying && !thisPlayer.ready && thisPlayer.bones >= bigblindSize && playersCount > 0 && (
        <div
          className='text-white absolute border border-transparent overflow-hidden rounded-xl z-50'
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            // maxWidth: "340px",
            filter: "drop-shadow(0px 9px 15px rgba(43,75,76,0.5))",
            backgroundColor: "#141313"
          }}
        >
          <div className='p-6 flex justify-center items-center text-xl ' style={{
            filter: "drop-shadow(rgba(43, 75, 76, 0.5) 0px 9px 15px)",
            backgroundColor: "rgb(14 26 6 / 86%)",
          }}>
            <div className='text-center -mb-3' style={{
              color: "#e5c23a",
              fontSize: "24px"
            }}>
              CHOOSE YOUR HAND 
            </div>
            {/* <div className="close-btn cursor-pointer" onClick={clickCross}>
              <div className="wrapper">
                <div className="arrow">
                  <div className="line"></div>
                  <div className="line"></div>
                </div>
              </div>
            </div> */}
            <img className='mx-4' src={TimerImg} width="25px" />
            <MyTimer className="-mb-3" style={{
              fontSize: "28px"
            }} />
          </div>
          <div className='px-6 pb-6 pt-8 text-center font-roboto' style={{
            filter: "drop-shadow(rgba(43, 75, 76, 0.5) 0px 9px 15px)",
            backgroundColor: "rgb(20 19 19 / 94%)"
          }}>
            <div className='font-bold text-xl mb-8' style={{
                fontSize: "20px"
              }}>
              Select the set of cards you want to play with
            </div>
            <div className='relative p-8' style={{
              // border: "1px solid rgb(99, 140, 74)"
            }}>
              {/* <div className='absolute font-bold text-xl z-10 px-4' style={{
                color: "rgb(99, 140, 74)",
                fontSize: "14px",
                top: "-10%",
                left: "50%",
                background: "#151515",
                transform: "translate(-50%, -10%)",
              }}>
                Stakes limits
              </div>
              <div className='text-xl flex justify-center items-center font-bold' style={{
                fontSize: "24px"
              }}>
                <div style={{
                  color: "rgb(99, 140, 74)",
                }}>
                  {bigblindSize}/{bigblindSize * 2}
                </div>
                <span className='mx-2'>
                  Bones
                </span>
                <img src={boneIconImg} width="25px"/>
              </div> */}
            <div className='flex flex-row'>
              <Button
                action={() => takeAction({ type: "ready", sleeveType: 'AK' })}
                title={(<div className='flex'>
                  <div className='absolute px-2 whitespace-nowrap font-medium' style={{
                    top: "-8%",
                    left: "50%",
                    transform: "translate(-50%, -8%)",
                    fontSize: "16px",
                    backgroundColor: "#151515"
                  }}>
                    Variant 1
                  </div>
                  <Card card={{ value: 'A', suit: '♥' }} />
                  <Card card={{ value: 'K', suit: '♠' }} />
                  <div className='absolute font-medium font-balsamiq px-4 rounded-xl border-transparent' style={{
                    bottom: "-10%",
                    left: "50%",
                    lineHeight: "unset",
                    color: "rgb(21 21 21)",
                    transform: "translate(-50%, 0)",
                    backgroundColor: "rgb(104, 249, 136)",
                    fontSize: "18px"
                  }}>
                    CHOOSE
                  </div>
                </div>)}
                mainClasses="border rounded-xl relative px-6 pb-8 pt-4"
                style={{
                  color: "#68f988",
                  borderColor: "#68f988"
                }}
              />
              <Button
                action={() => takeAction({ type: "ready", sleeveType: 'QQ' })}
                title={(<div className='flex'>
                  <div className='absolute px-2 whitespace-nowrap font-medium' style={{
                    top: "-8%",
                    left: "50%",
                    transform: "translate(-50%, -8%)",
                    fontSize: "16px",
                    backgroundColor: "#151515"
                  }}>
                    Variant 2
                  </div>
                  <Card card={{ value: 'Q', suit: '♥' }} />
                  <Card card={{ value: 'Q', suit: '♠' }} />
                  <div className='absolute font-medium font-balsamiq px-4 rounded-xl border-transparent' style={{
                    bottom: "-10%",
                    left: "50%",
                    lineHeight: "unset",
                    color: "rgb(21 21 21)",
                    transform: "translate(-50%, 0)",
                    backgroundColor: "rgb(104, 249, 136)",
                    fontSize: "18px"
                  }}>
                    CHOOSE
                  </div>
                </div>)}
                mainClasses="border rounded-xl relative px-6 pb-8 pt-4 mx-4"
                style={{
                  color: "#68f988",
                  borderColor: "#68f988"
                }}
                />
              <Button
                action={() => takeAction({ type: "ready", sleeveType: 'random' })}
                title={(<div className='flex'>
                  <div className='absolute px-2 whitespace-nowrap font-medium' style={{
                    top: "-8%",
                    left: "50%",
                    transform: "translate(-50%, -8%)",
                    fontSize: "16px",
                    backgroundColor: "#151515"
                  }}>
                    Random
                  </div>
                  <Card hidden={true} />
                  <Card hidden={true} />
                  <div className='absolute font-medium font-balsamiq px-4 rounded-xl border-transparent' style={{
                    bottom: "-10%",
                    left: "50%",
                    lineHeight: "unset",
                    color: "rgb(21 21 21)",
                    transform: "translate(-50%, 0)",
                    backgroundColor: "rgb(104, 249, 136)",
                    fontSize: "18px"
                  }}>
                    CHOOSE
                  </div>
                </div>)}
                mainClasses="border rounded-xl relative px-6 pb-8 pt-4"
                style={{
                  color: "#68f988",
                  borderColor: "#68f988"
                }}
                />
            </div>
            </div>
          </div>
        </div>
      )}
      <div className='absolute h-full'>

        {/* <img className='relative h-full z-10' src={boardImg} alt="" /> */}
        <div
          className='relative h-full z-10'
          style={{
            width: "50rem",
            height: "30rem",
            backgroundImage: `url(${boardImg})`,
            backgroundPosition: "center",
            backgroundSize: "100%",
            backgroundRepeat: "no-repeat"
          }}
        >
          {isPlaying && (
            <div className='absolute w-0 h-0' style={{
              top: "34%",
              left: "15%"
            }}>
              <div style={{width: "30rem"}}>
                <Board />
              </div>
            </div>
          )}
        </div>
        {/* <img className='absolute h-full z-10' src={boardImg} alt="" /> */}

      {/* <div
        className="flex items-center absolute top-20 w-72 h-28 rounded-b-xl rounded-xl bg-gray-300 opacity-50"
        style={{
          backgroundSize: "cover",
          backgroundPosition: "center",
          top: "30%"
        }}
      >
        <div className="w-full text-center text-slate-700">
          BLIND LEVEL: {bigblindSize}/{bigblindSize * 2}
        </div>
      </div> */}
      {/* <div
        // className="relative bg-lime-400 bg-rad border-slate-700 rounded-full w-3/4 h-1/2 flex items-center justify-center"

      > */}
      {/* <div style={{
        backgroundImage: `url(${boardImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        width: '810px',
        height: '100%'
      }}> */}

      {/* </div> */}
      {/* <img style={{width: '810px'}} src={boardImg} alt='' /> */}
      {/* <Board /> */}
      {/* {isPlaying && <DealerButton />} */}
      <Bets />
      <Hand
        style={{ top: "100%", left: "50%", position: "absolute" }}
        position={0}
      />
      <Hand
        style={{ top: "50%", left: "-5%", position: "absolute" }}
        styleForCards={{
          position: "absolute",
          left: "80%",
          top: "22%"
        }}
        rotate={90}
        position={1}
      />
      <Hand
        style={{ top: "0%", left: "13%", position: "absolute" }}
        styleForCards={{
          position: "absolute",
          top: "70%",
          left: "50%",
        }}
        rotate={150}
        position={2}
      />
      <Hand
        style={{ top: "-8%", left: "50%", position: "absolute" }}
        styleForCards={{
          position: "absolute",
          top: "75%",
          left: "7%"
        }}
        rotate={180}
        position={3}
      />
      <Hand
        style={{ top: "0%", right: "13%", position: "absolute" }}
        styleForCards={{
          position: "absolute",
          top: "70%",
          right: "50%",
        }}
        rotate={-150}
        position={4}
      />
      <Hand
        style={{ top: "50%", right: "-5%", position: "absolute" }}
        styleForCards={{
          position: "absolute",
          right: "80%",
          top: "22%"
        }}
        rotate={-90}
        position={5}
      />
      </div>

    </div>
  );
}
