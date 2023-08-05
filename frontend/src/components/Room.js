import React, { useState, useEffect, useRef } from "react";
import "./Room.css";
import io from "socket.io-client";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const socket = io.connect('http://localhost:6969')



const Room = () => {
    const [socket, setSocket] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [joinedRoom, setJoinedRoom] = useState(null);
    const [waitingRooms, setWaitingRooms] = useState([]);

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const username = queryParams.get('username') || 'Guest';

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

        return () => {
            if (newSocket) {
                newSocket.disconnect();
            }
        };
    }, []);

    const handleCreateRoom = (roomType) => {
        if (socket) {
            // Emit 'createRoom' event to the backend with the user's username and room type
            socket.emit('createRoom', { username, roomType });
        }
    };

    const handleJoinRoom = (roomId) => {
        if (socket) {
            // Emit 'joinRoom' event to the backend with the user's username and room name
            socket.emit('joinRoom', { username, roomId });
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
                            <li key={user}>{user}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Room;