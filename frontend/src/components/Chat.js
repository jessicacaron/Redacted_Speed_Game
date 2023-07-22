import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import './Chat.css';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [selectedMessage, setSelectedMessage] = useState('');
    const messagesRef = useRef(null);
    const socketRef = useRef(null);
    const [username, setUsername] = useState(''); //test username
    const [isUsernameSubmitted, setIsUsernameSubmitted] = useState(false);
    const [isWrapperActive, setIsWrapperActive] = useState(true);
    const [isPopupActive, setIsPopupActive] = useState(true);

    useEffect(() => {
        messagesRef.current.scrollTop = messagesRef.current.scrollHeight;

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
    }, [username]); // add 'username' as a dependency

    useEffect(() => {
        if (isUsernameSubmitted) {
            socketRef.current.emit('joinChat', username);
        }
    }, [username, isUsernameSubmitted]);

    const showMessage = (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
    };

    const sendMessage = () => {
        if (!socketRef.current) {
            showMessage('No WebSocket connection.');
            return;
        }

        // Emit 'chatMessage' event to the backend with the user's username
        socketRef.current.emit('chatMessage', {
            user: username,
            message: selectedMessage,
        });

        showMessage(`${username}: ${selectedMessage}`);
        setSelectedMessage('');
    };

    const handleSelectChange = (event) => {
        setSelectedMessage(event.target.value);
    };

    //username stuff
   async function  handleUsernameSubmit(event) {
       event.preventDefault();
       setIsWrapperActive(false);
       setIsPopupActive(false);

       const form = event.target;
       const username = form.elements.username.value;

        // Perform any necessary validation before submitting the username
        if (username.trim() === '') {
            alert('Please enter a username.');
            return;
        }

       setUsername(username);

        // You can perform additional logic here if needed
        alert(`Username submitted: ${username}`);
    };

    return (
        <div>
            {isWrapperActive && isPopupActive && (
                <div className="background">
                    <main
                        className={`wrapper ${isWrapperActive ? 'active' : ''} ${
                            isPopupActive ? 'active-popup' : ''
                        }`}
                    >
                        <section className="form-box username">
                            <h2>Choose Username</h2>
                            <form onSubmit={handleUsernameSubmit}>
                                <div className="input-box">
                                    <label htmlFor="username">Username</label>
                                    <input type="text" placeholder="Enter your username" id="username" required />
                                </div>
                                <button type="submit" className="btn">
                                    Submit
                                </button>
                            </form>
                        </section>
                    </main>
                </div>
            )}

            <h1>Real Time Messaging</h1>

            <pre
                id="messages"
                style={{ height: '400px', overflow: 'scroll' }}
                ref={messagesRef}
            >
        {messages.map((message, index) => (
            <React.Fragment key={index}>
                {index > 0 && '\n\n'}
                {message.user ? `${message.user}: ${message.message}` : message}
            </React.Fragment>
        ))}
      </pre>
            <select
                id="messageBox"
                value={selectedMessage}
                onChange={handleSelectChange}
                style={{
                    display: 'block',
                    width: '100%',
                    marginBottom: '10px',
                    padding: '10px',
                }}
            >
                <option value="">Select a message</option>
                <option value="Hello">Hello</option>
                <option value="Good game">Good game</option>
                <option value="Let's start">Let's start</option>
                <option value="Let's Play Speed Classic">Let's Play Speed Classic</option>
                <option value="Let's Play California Speed">Let's Play California Speed</option>
                <option value="Bye">Bye</option>
            </select>
            <button
                id="send"
                title="Send Message!"
                style={{ width: '100%', height: '30px' }}
                onClick={sendMessage}
                disabled={!selectedMessage}
            >
                Send Message
            </button>
        </div>
    );
};

export default Chat;
