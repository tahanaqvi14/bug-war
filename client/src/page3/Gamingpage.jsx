import React, { useContext, useEffect, useState } from 'react';
import { SocketContext } from '../App';
import { useNavigate } from 'react-router-dom';

const Gamingpage = () => {
  const socket = useContext(SocketContext);
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    if (!socket) return;

    socket.on('Gaming_screen', (data) => {
      console.log('Received from server:', data);
      if (data.playerData) {
        setPlayers(data.playerData); // store the array
      }
    });

    socket.on('end_for_all',()=>{
      document.getElementById('info').innerHTML=`game over`
    })

  }, [socket]);


  const handleMoveForward = () => {
    socket.emit('move_forward');
  };


  return (
    <div>
      <div id='info'>

      {players.length === 0 ? (
        <p>wait...</p>
      ) : (
        players.map((p, i) => (
          <p key={i}>
            {p.username}: {p.score}
          </p>
        ))
      )}
      </div>

      <button onClick={handleMoveForward}> click me to increment</button>
    </div>
  );
};

export default Gamingpage;
