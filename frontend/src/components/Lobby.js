import './Lobby.css'
import React from 'react';
import Chat from './Chat';
import './Chat.css';
import Room from './Room'


function Lobby () {

    return (
        <div className="background">

            <div className="room">
                <Room></Room>
            </div>

            <div className="chat">
                <Chat></Chat>
            </div>

        </div>     
    );
}
export default Lobby;