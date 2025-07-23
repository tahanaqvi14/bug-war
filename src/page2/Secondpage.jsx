import React, { useEffect } from 'react'
import lottie from 'lottie-web'
import racingCarAnimation from './Racing car updated.json' // Adjust the path accordingly
import './styles.css' // This should contain clip-custom

const Secondpage = () => {
  useEffect(() => {
    const container = document.getElementById('lottie-background')
    if (container.firstChild) {
      container.innerHTML = ''
    }

    const screenWidth = window.innerWidth
    let aspectSetting = 'xMidYMid slice'
    if (screenWidth > 900) {
      aspectSetting = 'xMinYMid slice'
    }

    lottie.loadAnimation({
      container,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: racingCarAnimation,
      rendererSettings: {
        preserveAspectRatio: aspectSetting,
      },
    })

    const handleResize = () => {
      clearTimeout(window.lottieResizeTimer)
      window.lottieResizeTimer = setTimeout(() => {
        window.location.reload()
      }, 300)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="w-screen h-screen overflow-hidden text-white">
      {/* Lottie Background */}
      <div id="lottie-background" className="fixed inset-0 -z-10 pointer-events-none bg-black" />

      {/* Header Title */}
      <div className="title-container text-center font-['Excon'] text-[#ffcc33]">
        <div className="game-title text-4xl font-extrabold">
          <div id="bug-title" className="flex items-center justify-center gap-2">
            <div>BUG</div>
            <img src="./bug.svg" alt="Bug Icon" className="w-[50px]" />
            <div>WARS</div>
          </div>
        </div>
        <div className="subtitle text-[#fff3cc] text-2xl font-semibold mt-2 tracking-wide">
          <span className="line inline-block h-[2px] w-[50px] bg-[#ffcc33] mx-4" />
          CODE RACERS
          <span className="line inline-block h-[2px] w-[50px] bg-[#ffcc33] mx-4" />
        </div>
      </div>

      {/* Card */}
      <div id="down_side" className="flex flex-row items-center justify-start p-3">
        <span className="flex items-center justify-center">
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#f59e0b] to-[#b45309] shadow-[0_10px_25px_rgba(180,83,9,0.6)]">
            {/* Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-40 clip-custom" />

            {/* Card Content */}
            <div className="relative z-10 p-4 space-y-6 text-white">
              {/* Header */}
              <div className="flex items-center space-x-4">
                <div className="bg-yellow-400 rounded-full p-2 shadow-lg shadow-yellow-500/50">
                  <i className="fas fa-headset text-xl text-black" />
                </div>
                <div>
                  <h2 className="inline text-xl font-extrabold tracking-wide">BugWarrior</h2>
                  <p className="text-yellow-300 font-semibold text-lg -mt-1">Johnson</p>
                </div>
              </div>

              {/* Rank */}
              <div className="flex items-center space-x-4">
                <div className="bg-yellow-400 rounded-md p-2 shadow-lg shadow-yellow-500/40">
                  <i className="fas fa-flag-checkered text-xl text-black" />
                </div>
                <h3 className="text-yellow-300 font-bold text-xl tracking-wide">Gold Racer</h3>
              </div>

              {/* Actions */}
              <div>
                <button className="mt-4 w-full bg-yellow-400 hover:bg-yellow-500 transition rounded-lg py-2 font-semibold text-black shadow-md shadow-yellow-500/50">
                  Start Game
                </button>
                <div className="flex flex-row space-x-2">
                  <button className="mt-4 w-full bg-yellow-400 hover:bg-yellow-500 transition rounded-lg py-2 font-semibold text-black shadow-md shadow-yellow-500/50">
                    Login
                  </button>
                  <button className="mt-4 w-full bg-yellow-400 hover:bg-yellow-500 transition rounded-lg py-2 font-semibold text-black shadow-md shadow-yellow-500/50">
                    Sign up
                  </button>
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="mt-6 grid grid-cols-3 gap-4 text-black">
                <button className="bg-yellow-300 hover:bg-yellow-400 transition rounded-lg py-3 flex flex-col items-center justify-center shadow-md shadow-yellow-400/50">
                  <i className="fas fa-medal text-2xl mb-1" />
                  <span className="text-xs hidden font-semibold">Leaderboard</span>
                </button>
                <button className="bg-yellow-300 hover:bg-yellow-400 transition rounded-lg py-3 flex flex-col items-center justify-center shadow-md shadow-yellow-400/50">
                  <i className="fas fa-cogs text-xl mb-1" />
                  <span className="text-sm hidden font-semibold">Settings</span>
                </button>
                <button className="bg-yellow-300 hover:bg-yellow-400 transition rounded-lg py-3 flex flex-col items-center justify-center shadow-md shadow-yellow-400/50">
                  <i className="fas fa-envelope text-2xl mb-1" />
                  <span className="text-sm font-semibold">Messages</span>
                </button>
              </div>
            </div>
          </div>
        </span>
      </div>
    </div>
  )
}

export default Secondpage
