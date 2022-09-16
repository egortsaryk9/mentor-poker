import { createContext, useEffect, useRef, useState } from "react";
import "./App.css";
import { ActionBar } from "./components/ui/ActionBar";
import { Chat } from "./components/ui/Chat";
import MenuBar from "./components/ui/MenuBar";
import { Table } from "./components/game-play/Table";
import { GameProvider } from "./contexts/Game";
import { getSocket } from "./socket/socket";
import { Info } from "./components/ui/Info";
import { ControlPanel } from "./components/ui/ControlPanel";
import { Settings } from "./components/ui/Settings";
import { Logout } from "./components/ui/Logout";
import BouncingDotsLoader from './components/BouncingDotsLoader';
import axios from 'axios';
import MyTimer from './components/ui/Timer';
import background from './assets/texture/background.png';

export const AppContext = createContext({});

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [onlyWatch, setOnlyWatch] = useState(false);
  const [socket, setSocket] = useState(null);
  const [chatHidden, setChatHidden] = useState(true);
  const [chatHint, setChatHint] = useState("- Press T to chat -");
  const [muted, setMuted] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showControlPanel, setShowControlPanel] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [disableShortcuts, setDisableShortcuts] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const containerRef = useRef(null);

  const login = (userData, address, onFail = () => {}) => {
    address = address || "http://localhost:8000";
    const socket = getSocket(userData.user_id, userData.room_id, address);
    socket.on("connect", () => {
      socket.emit('join', userData)
    });
    socket.on('join_success', (token) => {
      localStorage.setItem('cool-dog_jwt', token);
      setLoggedIn(true);
    })
    socket.on("connect_error", () => {
      alert("Can't connect to server!");
      setLoggedIn(false);
      // onFail();
    });
    socket.on("error", (error) => {
      console.log(error, 'error')
      if (error.type === 101) {
        setLoggedIn(false);
        setOnlyWatch(true);
      }

      if (error.type === 102) {
        setLoggedIn(true)
      }

      if (error.type === 403) {

      }
      // alert("Can't connect to room!");

      // onFail();
    });
    socket.on("disconnect", () => {
      // alert("Disconnected from server!");
      setLoggedIn(false);
    });
    setSocket(socket);
  };

  useEffect(() => {
    document.cookie=`X-CSRF-Token=${Math.random()}`
    // document.cookie="asdzxc=222222"
    const queryParams = new URLSearchParams(window.location.search);
    const hash = queryParams.get('hash');

    if (hash && !loggedIn) {
      const request = () => {
        axios.post(`/api/join`, { hash })
          .then(({ data }) => {
            // {
            //   bones: 100
            //   image: "https://cooldogs.io/images/zero.PNG"
            //   name: "qwe"
            //   room_data: {small_bet: 10, big_bet: 20}
            //   room_id: "882260253"
            //   user_id: "783056234"
            // }
            setCurrentUser(data);
            if (!onlyWatch) login(data);
          })
          .catch ((err) => {
            if (err) {

            }
            setTimeout(request, 3000)
          })
      }

      request();
    }
  }, [loggedIn]);

  useEffect(() => {
    if (showControlPanel || !chatHidden) setDisableShortcuts(true);
    else setDisableShortcuts(false);
  }, [chatHidden, showControlPanel]);

  useEffect(() => {
    const keyDown = (e) => {
      if (!loggedIn) return;
      if (disableShortcuts) return;
      if (e.key === "t" || e.key === "T" || e.key === "`") {
        setChatHidden(false);
      }
    };
    document.addEventListener("keydown", keyDown);
    return () => {
      document.removeEventListener("keydown", keyDown);
    };
  }, [loggedIn, chatHidden, disableShortcuts]);

  useEffect(() => {
    if (chatHidden) containerRef?.current?.focus();
    else setChatHint("");
  }, [chatHidden]);

  return (
    <AppContext.Provider
      value={{
        socket,
        chatHidden,
        chatHint,
        muted,
        showInfo,
        showControlPanel,
        showSettings,
        showLogout,
        setMuted,
        setShowSettings,
        setShowLogout,
        currentUser
      }}
    >
      <div
        className="relative h-screen"
        style={{
          backgroundImage: `url(${background})`,
          backgroundSize: "100% 100%",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
      >
      {/* <div className=""> */}
        { (!loggedIn && !onlyWatch) && <BouncingDotsLoader className="mt-5" text='Search for an available room' /> }
        {(loggedIn || onlyWatch) && (
          // <div>
            <GameProvider>
              {/* <div className="absolute top-0 w-full flex flex-col justify-end pointer-events-none">
                <MyTimer />
              </div> */}
              <div className="absolute w-full h-full justify-center items-center flex pb-28">
                <Table />
              </div>
              <div className="absolute w-full h-full flex flex-col justify-end pointer-events-none">
                <ActionBar />
              </div>
              <div className="absolute w-full h-full flex flex-col justify-end pointer-events-none">
                {/* <MenuBar
                  toggleChat={() => setChatHidden((hid) => !hid)}
                  toggleInfo={() => setShowInfo((show) => !show)}
                  toggleControlPanel={() =>
                    setShowControlPanel((show) => !show)
                  }
                /> */}
              </div>
              <div className="absolute w-full h-full flex flex-col justify-center items-center pointer-events-none">
                {chatHint && (
                  <div className="text-black opacity-30 tracking-wider uppercase text-2xl absolute top-4 text-center">
                    {chatHint}
                  </div>
                )}
                <Chat hidden={chatHidden} setHidden={setChatHidden} />
              </div>
              <div className="absolute w-full h-full flex flex-col justify-center items-center pointer-events-none">
                {/* <Info
                  hidden={!showInfo}
                  setHidden={(hidden) => setShowInfo(!hidden)}
                /> */}
              </div>
              <div className="absolute w-full h-full flex flex-col justify-center items-center pointer-events-none">
                {/* <ControlPanel
                  hidden={!showControlPanel}
                  setHidden={(hidden) => setShowControlPanel(!hidden)}
                /> */}
              </div>
              <div className="absolute w-full h-full flex flex-col justify-end pointer-events-none">
                {/* <Settings /> */}
              </div>
              <div className="absolute w-full h-full flex flex-col justify-end pointer-events-none">
                {/* <Logout /> */}
              </div>
            </GameProvider>
          // </div>
        )}
      </div>
    </AppContext.Provider>
  );
}

export default App;
