import React from 'react';
import './App.css';
import Chat from "./components/Chat";
import GameData from "./components/GameData";


// <Chat /> accesses the Chat.js
function App() {
  return (
      <div className="App">
        <Chat />
        <GameData />
      </div>
  );
}
export default App;
