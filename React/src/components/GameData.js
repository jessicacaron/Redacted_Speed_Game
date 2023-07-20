import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";

export default function GameData() {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState("");
  const messagesRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    messagesRef.current.scrollTop = messagesRef.current.scrollHeight;

    // Connect to the Socket.IO server
    socketRef.current = io.connect("http://localhost:6969");

    // Listen for 'gameData' event from the server
    socketRef.current.on("gameData", (data) => {
      showMessage(data);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const showMessage = (message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const sendRandomData = () => {
    const randomNumbers = [];
    for (let i = 0; i < 10; i++) {
      const randomNumber = Math.floor(Math.random() * 100) + 1;
      randomNumbers.push(randomNumber);
    }

    const dataToSend = {
      message: "Hello from the client!",
      numbers: randomNumbers,
    };

    socketRef.current.emit("gameData", dataToSend);
    console.log("Sent data to server:", dataToSend);
  };

  return (
      <div>
        <h1>Real Time Messaging</h1>
        <button onClick={sendRandomData}>Get Cards</button>
        <div ref={messagesRef}>
          {messages.map((message, index) => (
              <p key={index}>
                {message.message}: {message.numbers.join(", ")}
              </p>
          ))}
        </div>
      </div>
  );
}
