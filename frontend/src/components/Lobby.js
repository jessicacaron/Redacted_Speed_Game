import './Lobby.css'
import React from 'react';
import Chat from './Chat';
import Register from './Register'
import './Chat.css';
import { useState } from "react";
import { useNavigate } from "react-router-dom";


function Lobby () {
    const navigate = useNavigate();

    function handleCreateClassicBtnClick() {
        navigate("/classic");
    }

    return (
        <div>
            <div className="row1">
                <div className="col1"><h1></h1></div>
                <div className="col2"><Chat></Chat></div>
            </div>

            <div className="row2">
                <div className="button-div">
                    <button className="button-create" onClick={handleCreateClassicBtnClick}>Create Classic Game</button>
                </div>
            </div>
        </div>     
    );
}
export default Lobby;