import React, { useEffect, useRef, useState, useContext } from 'react';
import './css/codeeditor.css';
import { SocketContext } from '../App';
import { useStore } from '../../store/Store';
import { gsap } from "gsap";

const Navbar = () => {
    const socket = useContext(SocketContext)
    const [player, setplayerinfo] = useState([])
    const matchinfo = useStore((state) => state.data);
    const setData = useStore((state) => state.setData);

    const [timeLeft, setTimeLeft] = useState(5 * 60 + 23); // 5:23 initially
    const boxRef = useRef(null);
    const [displaytext,setdisplaytext]=useState('Game is getting started1');

    useEffect(() => {
        if (matchinfo?.participants) {
            setplayerinfo(matchinfo.participants);
        }
    }, [matchinfo])

    useEffect(() => {
        if (timeLeft <= 0) return;
        const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
        return () => clearTimeout(timer);
      }, [timeLeft]);

      const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
      const seconds = String(timeLeft % 60).padStart(2, "0");
    
      useEffect(() => {
        const tl = gsap.timeline();

        tl.fromTo(
          boxRef.current,
          { y: -100, opacity: 0 }, // starts above the screen
          { y: 0, opacity: 1, duration: 2, ease: "power2.out" } // drops down & appears
        )
        .to(
          boxRef.current,
          { y: -100, opacity: 0, duration: 2, delay: 5.3, ease: "power2.in" } // then goes back up & fades out
        );
      
      }, [displaytext]);
    
      useEffect(() => {
        if (!socket) return;

        socket.on('notify',(data,updatedMatch)=>{
            console.log(data)
            console.log(updatedMatch)
            let displayName = player.find(p => p.username === data)?.displayName;
            console.log(player)
            console.log(displayName)
            setdisplaytext(`${displayName} solved a problem!`)
            setData(updatedMatch)
        })
    

        return () => {
          socket.off('2players_connected');
          socket.off('welcome');
        };
      }, [socket,player]);

      
    return (
        <div className="countdown-page">
            <div className="main-container">
                <div className="top-bar">
                    {/* Countdown Section */}
                    <div className="countdown-container">
                        <div
                            className="countdown-clock"
                            style={{ color: timeLeft <= 0 ? "#FF0000" : "var(--sun-yellow)" }}
                        >
                            {timeLeft > 0 ? `${minutes}:${seconds}` : "00:00"}
                        </div>
                    </div>

                    <div >
                        <p className='text-2xl' ref={boxRef}>{displaytext}</p>
                    </div>

                    {/* Players Section */}
                    <div className="players-container">
                        {/* Player 1 */}
                        <div className="player-card">
                            <div className="position-badge position-3">
                                {player[0]?.displayName?.slice(0, 2)?.toUpperCase() || "--"}
                            </div>
                            <div className="player-info">
                                <div className="player-name">{player[0]?.displayName || "Unknown"}</div>
                            </div>
                            <span>Points: {player[0]?.points ?? 0}</span>
                        </div>

                        {/* Player 2 */}
                        <div className="player-card">
                            <div className="position-badge position-4">
                                {player[1]?.displayName?.slice(0, 2)?.toUpperCase() || "--"}
                            </div>
                            <div className="player-info">
                                <div className="player-name">{player[1]?.displayName || "Unknown"}</div>
                            </div>
                            <span>Points: {player[1]?.points ?? 0}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Navbar
