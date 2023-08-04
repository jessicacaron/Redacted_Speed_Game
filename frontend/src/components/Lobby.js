import './Lobby.css'
import React from 'react';
import Chat from './Chat';
import './Chat.css';
import { useNavigate } from "react-router-dom";
import Room from './Room'


function Lobby () {
    const navigate = useNavigate();

    function handleCreateClassicBtnClick() {
        navigate("/classic");
    }

    return (
        <div className="background">

            <div className="room">
                <Room></Room>

                <div className="button-div">
                    <button className="button-create" onClick={handleCreateClassicBtnClick}>Create Classic Game</button>
                </div>
            </div>

            <div className="chat">
                <Chat></Chat>
            </div>

        </div>     
    );
}
export default Lobby;