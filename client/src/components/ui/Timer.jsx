import React from 'react';
import { useTimer } from 'react-timer-hook';
import { useGame } from "../../contexts/Game";

const MyTimer = ({ className, style }) => {
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
    timer
  } = useGame();
  
  if (!timer) return null
  
  const expiryTimestamp = new Date().getTime() + timer;

  return (
    <Timer className={className} style={style} expiryTimestamp={expiryTimestamp} />
  );
}

const Timer = ({ expiryTimestamp, className, style }) => {
  const {
    seconds,
    minutes,
    hours,
    days,
    isRunning,
    start,
    pause,
    resume,
    restart,
  } = useTimer({ expiryTimestamp, onExpire: () => console.warn('onExpire called') });


  return (
    <div className={className} style={{textAlign: 'center', ...style}}>
      {/* <h1>react-timer-hook </h1>
      <p>Timer Demo</p> */}
      <div className='flex justify-center items-center'>
        {/* <span>{days}</span>:<span>{hours}</span>: */}
        <div>{minutes < 1 ? "00" : minutes < 10 ? `0${minutes}` : minutes}</div><div>:</div><div>{seconds < 1 ? "00" : seconds < 10 ? `0${seconds}` : seconds}</div>
      </div>
      {/* <p>{isRunning ? 'Running' : 'Not running'}</p> */}
      {/* <button onClick={start}>Start</button>
      <button onClick={pause}>Pause</button>
      <button onClick={resume}>Resume</button>
      <button onClick={() => {
        // Restarts to 5 minutes timer
        const time = new Date();
        time.setSeconds(time.getSeconds() + 300);
        restart(time)
      }}>Restart</button> */}
    </div>
  );
}

export default MyTimer;