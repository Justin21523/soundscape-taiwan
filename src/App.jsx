import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import SoundscapeSection from "./SoundscapeSection";

function App() {
  return (
    <div className="app">
      <header>
        <h1>聲色台灣</h1>
        <h2>聽見與看見的寶島故事</h2>
        <p>Scroll 下來，一起用聲音與影像認識台灣文化的多元美！</p>
      </header>
      <SoundscapeSection />
    </div>
  );
}

export default App;

