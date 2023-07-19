import React, { useState, useEffect, useRef } from 'react';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [selectedMessage, setSelectedMessage] = useState('');
    const messagesRef = useRef(null);
    const wsRef = useRef(null);

    useEffect(() => {
        messagesRef.current.scrollTop = messagesRef.current.scrollHeight;

        wsRef.current = new WebSocket('ws://localhost:6969');
        wsRef.current.onopen = () => console.log('Connection opened!');
        wsRef.current.onmessage = async (event) => showMessage(event.data);
        wsRef.current.onclose = () => {
            wsRef.current = null;
        };

        return () => {
            if (wsRef.current) {
                wsRef.current.close();
            }
        };
    }, []);

    const showMessage = async (message) => {
        if (typeof message !== 'string') {
            try {
                message = await message.text();
            } catch (error) {
                console.error('Error converting Blob to text:', error);
                return;
            }
        }

        setMessages((prevMessages) => [...prevMessages, message]);
    };

    const sendMessage = () => {
        if (!wsRef.current) {
            showMessage('No WebSocket connection.');
            return;
        }

        wsRef.current.send(selectedMessage);
        showMessage(selectedMessage);
        setSelectedMessage('');
    };

    const handleSelectChange = (event) => {
        setSelectedMessage(event.target.value);
    };

    return (
        <div>
            <h1>Real Time Messaging</h1>
            <pre
                id="messages"
                style={{ height: '400px', overflow: 'scroll' }}
                ref={messagesRef}
            >
        {messages.map((message, index) => (
            <React.Fragment key={index}>
                {index > 0 && '\n\n'}
                {message}
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
