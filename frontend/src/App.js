import React, { useState, createContext } from 'react'
import './App.css';
import Lobby from './components/Lobby';
import Login from './components/Login';
import Register from './components/Register';
import GameClassic from "./components/GameClassic";
import { BrowserRouter, Routes, Route, Router } from "react-router-dom";


export const AppContext = createContext();


function App() {
  let [loggedInUser, setLoggedInUser] = useState([]);
  let [gameSelected, setGameSelected ] = useState([]);


  return (
    <AppContext.Provider value={{ loggedInUser, setLoggedInUser, gameSelected, setGameSelected }}>
      <BrowserRouter>  
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/lobby" element={<Lobby />} />
            <Route path="/classic" element={<GameClassic />} />
        </Routes>
      </BrowserRouter>
    </AppContext.Provider>
  );
}
export default App;

 