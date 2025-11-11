import React from 'react';
import medal from './medal.svg';

const Popup = () => {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0, 0, 0, 0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center',flexDirection:'column', backgroundColor: 'rgba(0, 0, 0, 0.7)', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)', padding: '40px 50px', maxWidth: '400px', textAlign: 'center', color: '#fac48c', animation: 'fadeInScale 0.4s ease-out'}}>
        
        <img src={medal} alt="Victory Medal" style={{width: '90px',marginBottom: '20px',filter: 'drop-shadow(0 0 10px rgba(247, 141, 30, 0.5))'}}/>
        <h2 style={{fontSize: '2rem',marginBottom: '10px',color: '#f78d1e'}}>
        🎉 You Won!
        </h2>
        
        <p style={{fontSize: '1.1rem',marginBottom: '10px'}}>
          Great job! Your coding skills are unmatched.
        </p>

        <p style={{fontSize: '1rem',fontStyle: 'italic',color: '#a66b2c',marginTop: '20px'}}>
          You will be redirected to the main menu in a while...
        </p>
      </div>

      <style>
        {`
          @keyframes fadeInScale {
            from { transform: scale(0.8); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
        `}
      </style>
    </div>
  );
};

export default Popup;
