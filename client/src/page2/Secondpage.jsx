import React, { useRef, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Signup.css'
import { SocketContext } from '../App';


const Secondpage = () => {
  const socket = useContext(SocketContext);
  const navigate = useNavigate();
  const [text_to_display,set_text_to_display]=useState('Searching for a user');

  useEffect(() => {
    if (!socket) return;
      // console.log('Socket connected in Login component:', socket.id);
      console.log(`Socket connected in secondpage component:${socket.id}`);
      socket.emit('joinRoom');
      // document.getElementById('id').innerHTML=`<p>find users</p>`;
      
      socket.on('2players_connected', () => {
        set_text_to_display(`Found a user. Game starting in a while`);
        setTimeout(() => {
          navigate('/codeeditor');
        }, 5000);
      });
    }, [])


  return (
    <div >
      <p id='one'>{text_to_display}</p>
      <div id="loader"></div>
    </div>
  )
}

export default Secondpage
