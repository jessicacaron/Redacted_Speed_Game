import React from 'react';
import './App.css';
import Chat from "./components/Chat";
import Lobby from './components/Lobby';
import Login from './components/Login';
import Register from './components/Register';
import GameClassic from "./components/GameClassic";
import { BrowserRouter, Routes, Route } from "react-router-dom";



// <Chat /> accesses the Chat.js
function App() {


  return (
<BrowserRouter>
      <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/lobby" element={<Lobby />} />
          <Route path="/classic" element={<GameClassic />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;

 