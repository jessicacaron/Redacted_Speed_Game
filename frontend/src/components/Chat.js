import React, { useState, useEffect, useRef, useContext } from 'react';
import io from 'socket.io-client';
import './Chat.css';
import {useLocation} from "react-router-dom";
import { AppContext } from '../App';


const Chat = () => {
    const [messages, setMessages] = useState([]);
    const messagesRef = useRef(null);
    const socketRef = useRef(null);
    const [isUsernameSubmitted, setIsUsernameSubmitted] = useState(false);
    let { loggedInUser } = useContext(AppContext);

    const location =  useLocation();
    const queryParams = new URLSearchParams(location.search);
    const username = queryParams.get("username") || "Guest"; // Guest as default if no  username is found

    useEffect(() => {

        // Connect to the Socket.IO backend
        socketRef.current = io.connect('http://localhost:6969');

        // Join the chat room
        socketRef.current.emit('joinChat', username);

        // Listen for 'chatMessage' event from the backend
        socketRef.current.on('chatMessage', (message) => {
            showMessage(message);
        });

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, [username], [messages]); // add 'username' as a dependency

    useEffect(() => {
        if (isUsernameSubmitted) {
            socketRef.current.emit('joinChat', username);
        }
    }, [username, isUsernameSubmitted]);

    const showMessage = (message) => {
        if (typeof message === 'string') {
            // Handle plain text messages
            setMessages((prevMessages) => [...prevMessages, message]);
        } else {
            // Handle messages with usernames
            setMessages((prevMessages) => [...prevMessages, `${message.user}: ${message.message}`]);
        }
    };

    const sendMessage = (message) => {
        if (!socketRef.current) {
            showMessage('No WebSocket connection.');
            return;
        }

        // Emit 'chatMessage' event to the backend with the user's username
        socketRef.current.emit('chatMessage', {
            user: username,
            message: message,
        });
    };

    const predefinedMessages = ['Hello', 'Good game', "Let's start", "Let's play Classic Speed", "Let's play California Speed", 'Bye'];

    return (
        <div className="container">

            <div className="container-messages">
                <pre id="messages" ref={messagesRef}>
                    {messages.map((message, index) => (
                        <React.Fragment key={index}>
                            {index > 0 && '\n\n'}
                            {message.user ? (
                                <button className="message-button" onClick={() => sendMessage(message.message)}>
                                    {message.user}: {message.message}
                                </button>
                            ) : (
                                message
                            )}
                        </React.Fragment>
                    ))}
                </pre>
            </div>

            <div className="divider"></div>

            <div className="container-predefined">
                {predefinedMessages.map((message, index) => (
                    <button key={index} className="predefined-button" onClick={() => sendMessage(message)}>
                        {message}
                    </button>
                ))}
            </div>

        </div>
    );
};

export default Chat;
