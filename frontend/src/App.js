import React from 'react';
import './App.css';
import Chat from "./components/Chat";
import Register from './components/Register';
import { BrowserRouter, Routes, Route } from "react-router-dom";



// <Chat /> accesses the Chat.js
function App() {


  return (
<BrowserRouter>
      <Routes>
          <Route path="/" element={<Register />} />
          <Route path="lobby" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;

 