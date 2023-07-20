import React, { useState, useEffect, useRef } from "react";

export default function GameData() {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState("");
  const messagesRef = useRef(null);
  const wsRef = useRef(null);

  useEffect(() => {
    wsRef.current = new WebSocket("ws://localhost:6969");
    wsRef.current.onopen = () => console.log("Connection opened!");
    wsRef.current.onmessage = (event) => showMessage(event.data);
    wsRef.current.onclose = () => {
      wsRef.current = null;
    };

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  // Function to send a JSON package containing a string and a collection of 10 random numbers to the server
  const sendRandomData = () => {
    const randomNumbers = [];
    for (let i = 0; i < 10; i++) {
      const randomNumber = Math.floor(Math.random() * 100) + 1; // Generating random numbers between 1 and 100 (change this as per your requirement)
      randomNumbers.push(randomNumber);
    }

    const dataToSend = {
      message: "Hello from the client!",
      numbers: randomNumbers,
    };

    wsRef.current.send(JSON.stringify(dataToSend));
    console.log("Sent data to server:", dataToSend);
  };

// Function to handle received messages from the server
const showMessage = (message) => {
    try {
      if (typeof message === "object" && message instanceof Blob) {
        // Handle Blob data separately, if needed
        console.log("Received Blob data:", message);
      } else {
        const parsedData = JSON.parse(message);
        setMessages((prevMessages) => [...prevMessages, parsedData]);
      }
    } catch (error) {
      console.error("Error parsing JSON data:", error);
    }
  };

  return (
    <div>
      <h1>Real Time Messaging</h1>
      <button onClick={sendRandomData}>Get Cards</button>
      <div ref={messagesRef}>
        {messages.map((message, index) => (
          <p key={index}>{message}</p>
        ))}
      </div>
    </div>
  );
}

//Here is the newest test for version 2.0