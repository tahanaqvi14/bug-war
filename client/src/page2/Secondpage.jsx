import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Signup.css';
import { SocketContext } from '../App';

const Secondpage = () => {
  const socket = useContext(SocketContext);
  const navigate = useNavigate();

  const [textToDisplay, setTextToDisplay] = useState('Searching for a user');
  const [usernames, setUsernames] = useState([]);
  const [personal_username,setpersonal_username]=useState('')
  useEffect(() => {
    if (!socket) return;

    console.log(`Socket connected in secondpage component: ${socket.id}`);
    socket.on('welcome',(data)=>{
      setpersonal_username(data.username);
    })
    socket.emit('joinRoom');


    socket.on('2players_connected', (data) => {
      console.log(data.matchinfo.matchDate)

      // ✅ update state instead of a local variable
      // setUsernames(data.roominfo.players.map(player => player.username));
      setTextToDisplay('Found a user. Game starting in a while');
      setTimeout(() => {
        // navigate('/codeeditor'); // uncomment if needed
      }, 5000);
    });

    // Cleanup listener on unmount
    return () => socket.off('2players_connected');
  }, [socket]);


  
  return (
    <div>
      <p id='one'>{textToDisplay}</p>
      <div id="loader"></div>
      <h2>Players name :</h2>
      <p>{personal_username}</p>
      {/* <ul>
        {usernames.map((username, index) => (
          <li key={index}>{username}</li>
        ))}
      </ul> */}
    </div>
  );
};

export default Secondpage;
