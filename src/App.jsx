import React, { useEffect, useState, useRef } from 'react';

import 'animate.css';
import './loading page css/style.css'
import posterImage from './loading page css/poster1.png';


const App = () => {
  const [progress, setProgress] = useState(0);

  // ✅ useRef - survives re-renders without causing new re-renders
  const intervalRef = useRef(null);
// React re-renders → intervalRef.current stays the same!

  useEffect(() => {
    let currentPhase = 0;
    const animateProgress = () => {
      // Clear any existing interval first
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      if (currentPhase === 0) {
        // Phase 0: Animate from 0 to 40
        // Line 22: Start timer and save its ID
        //We keep the timer ID because clearInterval() needs to know WHICH timer to stop!
        // Without the ID, it's like trying to turn off a specific light bulb in a room with 10 light bulbs - you need to know which switch controls which bulb!


        intervalRef.current = setInterval(() => {

          setProgress(prev => {
            if (prev >= 40) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
              currentPhase = 1;
              // Pause at 40 for 1 second
              setTimeout(() => {
                currentPhase = 2;
                animateProgress();
              }, 1000);
              return 40;
            }
            return prev + 2;
          });
        }, 50);
      } else if (currentPhase === 2) {
        // Phase 2: Animate from 40 to 70
        intervalRef.current = setInterval(() => {
          setProgress(prev => {
            if (prev >= 70) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
              currentPhase = 3;
              // Pause at 70 for 1 second
              setTimeout(() => {
                currentPhase = 4;
                animateProgress();
              }, 1000);
              return 70;
            }
            return prev + 2;
          });
        }, 50);
      } else if (currentPhase === 4) {
        // Phase 4: Animate from 70 to 100
        intervalRef.current = setInterval(() => {
          setProgress(prev => {
            if (prev >= 100) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
              return 100;
            }
            return prev + 2;
          });
        }, 50);
      }
    };

    animateProgress();

    // Cleanup interval on component unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  return (
    <div id='bg' style={{ 
      backgroundImage: "url('/poster1.png')",
      backgroundSize: 'cover',
      backgroundPosition: 'top',
      backgroundRepeat: 'no-repeat',
      width: '100%',
      height: '100%'
    }}>

      <div className='bg-black flex justify-center flex-col space-y-2 items-center h-screen' style={{ fontFamily: 'Nippo, Arial' }}>
        <div>
          <h1 className='text-5xl text-neutral-50 animate__animated animate__lightSpeedInRight' style={{ animationDuration: '1.5s' }}>Bug War</h1>

        </div>
        <div className="w-2/6 h-4 mb-4 bg-gray-200 rounded-full dark:bg-gray-700" style={{ fontWeight: 700 }}>
          <div className="h-4 bg-blue-600 rounded-full dark:bg-blue-500" id='progress-fill' style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  )
}

export default App
