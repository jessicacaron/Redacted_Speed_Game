import React from 'react';
import Chat from './Chat';
import Register from './Register'
import './Chat.css';


const Lobby = () => {
    return (
        <div>
            <div className="row1">
                <div className="col1"><h1><Register></Register></h1></div>
                <div className="col2"><Chat></Chat></div>
            </div>
        </div>     
    );
}
export default Lobby;