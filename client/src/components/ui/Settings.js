import { useContext } from "react";
import { AppContext } from "../../App.jsx";

export function Settings() {
  const {
    showSettings,
    setShowSettings,
    setMuted,
    muted,
  } = useContext(AppContext);
  if (!showSettings) return null;
  function handleAction(func) {
    return () => {
      func();
    };
  }
  return (
    <>
      <div
        className="absolute w-full h-full bg-black opacity-25 pointer-events-auto"
        onClick={() => setShowSettings(false)}
      ></div>
      <div
        className="bg-black bg-opacity-80 text-white z-10 rounded-2xl absolute top-20 right-8 px-8 py-5 flex flex-col pointer-events-auto animate-fade-in-up"
        style={{ width: "20rem" }}
      >
        <div className="text-xl font-bold text-center mb-4">Settings</div>
        <hr></hr>
      </div>
    </>
  );
}

function ToggleField({ label, shortcut, active, onToggle }) {
  return (
    <div
      className="w-full flex my-2 justify-between items-center cursor-pointer select-none group"
      onClick={onToggle}
    >
      <span>
        {label}{" "}
        {shortcut && <span className="text-gray-500">[{shortcut}]</span>}
      </span>
      {active ? (
        <span className="text-cyan-500 group-hover:text-white">On</span>
      ) : (
        <span className="text-gray-500 group-hover:text-white">Off</span>
      )}
    </div>
  );
}

// eslint-disable-next-line no-unused-vars
function ShortcutField({ label, shortcut }) {
  return (
    <div className="w-full flex my-1 justify-between items-center select-none group">
      <span>
        {label}:{" "}
        <span className="text-white bg-gray-500 px-4 rounded ml-4 pb-1">
          {shortcut}
        </span>
      </span>
    </div>
  );
}
