import React, { useState, useEffect, useRef } from "react";
import "./Room.css";
import io from "socket.io-client";
import { useLocation, useNavigate } from "react-router-dom";

const COUNTDOWN_DURATION = 5; // in seconds

const Room = () => {
    const [socket, setSocket] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [joinedRoom, setJoinedRoom] = useState(null);
    const [waitingRooms, setWaitingRooms] = useState([]);
    const [readyUsers, setReadyUsers] = useState([]);
    const [countdownStarted, setCountdownStarted] = useState(false); // tracks if countdown from back end has started
    const [startButtonClicked, setStartButtonClicked] = useState(false);

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const username = queryParams.get('username') || 'Guest';
    const navigate = useNavigate();

    useEffect(() => {
        // Connect to the Socket.IO backend
        const newSocket = io.connect('http://localhost:6969');
        setSocket(newSocket);

        // Listen for 'roomList' event to get the list of rooms
        newSocket.on('roomList', (rooms) => {
            setRooms(rooms);
        });

        // Listen for 'waitingRooms' event to get the list of waiting rooms
        newSocket.on('waitingRooms', (waitingRooms) => {
            setWaitingRooms(waitingRooms);
        });

        // Request the list of waiting rooms from the server
        newSocket.emit('getWaitingRooms');

        // Listen for 'userJoinedRoom' event to update joinedRoom state
        newSocket.on('userJoinedRoom', (room) => {
            setJoinedRoom(room);
        });

        // Listen for 'readyUp' event to update the readyUsers state
        newSocket.on("readyUp", (room) => {
            setReadyUsers(room.usersReady);
        });

        // Listen for 'startCountdown' event to indicate that countdown has started
        newSocket.on("startCountdown", () => {
            console.log("\nReceived countdown started from server.");
            setCountdownStarted(true);
        });

        // Listen for 'countdownEnd' event to navigate to /classic after the countdown
        newSocket.on("countdownEnd", () => {
            console.log("Received countdown ended from server.");
            navigate("/classic");
        });

        return () => {
            if (newSocket) {
                newSocket.disconnect();
            }
        };
    }, [navigate]);


    // Render countdown when countdownStarted is set to true
    useEffect(() => {
        if (countdownStarted) {
            let countdownValue = COUNTDOWN_DURATION;
            const interval = setInterval(() => {
                countdownValue -= 1;
                if (countdownValue <= 0) {
                    clearInterval(interval);
                }
                const countdownElement = document.querySelector('.waiting-room p');
                if (countdownElement) {
                    countdownElement.innerText = `Game starting in: ${countdownValue}`;
                }
            }, 1000);

            // Cleanup the interval when component unmounts or countdown ends
            return () => clearInterval(interval);
        }
    }, [countdownStarted]);

    const handleCreateRoom = (roomType) => {
        if (socket) {
            // Emit 'createRoom' event to the backend with the user's username and room type
            socket.emit('createRoom', {username, roomType});
        }
    };

    const handleJoinRoom = (roomId) => {
        if (socket) {
            console.log("room name being joined into: ", roomId);
            // Emit 'joinRoom' event to the backend with the user's username and room name
            socket.emit('joinRoom', { username, roomId });
        }
    };

    const handleReadyUp = () => {
        console.log("frontend readyUp triggered")
        if (socket && joinedRoom) {
            setStartButtonClicked(true);
            // Emit 'readyUp' event to the backend with the user's username and room name
            socket.emit("readyUp", { username, room: joinedRoom.name });
            console.log("room data being sent from frontend: ", joinedRoom.name);
        }
    };

    return (
        <div className="room-container">
            <div className="create-room">
                <h2>Create a Room</h2>
                <p>Your username: {username}</p>
                <button onClick={() => handleCreateRoom('Classic')}>Create Classic Room</button>
                <button onClick={() => handleCreateRoom('California')}>Create California Room</button>
            </div>

            {/* Display the list of available rooms */}
            {waitingRooms.length > 0 && (
                <div className="available-rooms">
                    <h2>Available Rooms</h2>
                    {waitingRooms.map((room) => (
                        <div key={room.roomId} className="available-room-item">
                            <span>{room.name}</span>
                            <p>Room Type: {room.type}</p>
                            <p>Users in this room:</p>
                            <ul>
                                {room.users.map((user) => (
                                    <li key={user}>{user}</li>
                                ))}
                            </ul>

                            <button onClick={() => handleJoinRoom(room.name)}>Join</button>

                        </div>
                    ))}
                </div>
            )}

            {joinedRoom && (
                <div className="waiting-room">
                    <h2>Waiting Room: {joinedRoom.name}</h2>
                    <p>Room Type: {joinedRoom.type}</p>
                    <p>Users in this room:</p>
                    <ul>
                        {joinedRoom.users.map((user) => (
                            <li key={user}>
                                {user} {readyUsers.includes(user) && "(Ready)"}
                            </li>
                        ))}
                    </ul>

                    <button
                        onClick={() => handleReadyUp()}
                        disabled={readyUsers.includes(username) || startButtonClicked}
                    >
                        {startButtonClicked ? (
                            countdownStarted ? "Starting Soon." : "Waiting for others..."
                        ) : (
                            "Start"
                        )}
                    </button>
                </div>
            )}
        </div>
    );
};

export default Room;