import React, { useState, useEffect } from 'react';
import "../App.css";
import { Avatar } from '@mui/material';
import Button from '@mui/material/Button';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

export default function ChatCustomer() {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [priority, setPriority] = useState('');
    const [username, setUsername] = useState(localStorage.getItem('username') || '');
    const [agentName, setAgentName] = useState('null');
    const [wait,setWait]=useState(false);

    useEffect(() => {
        const handleReceiveMessage = (data) => {
            if (data.customerId === socket.id) { // Ensure it's the right recipient
                if (data.agentName) {
                    setAgentName(data.agentName);
                }
                setMessages(prevMessages => [...prevMessages, data.message]);
                setWait(false);
            }
        };

        socket.on('receiveMessage', handleReceiveMessage);

        return () => {
            socket.off('receiveMessage', handleReceiveMessage);
        };
    }, []);

    const handleStartChat = (priority) => {
        const initialMessage = {
            customerId: socket.id,
            username: username,
            priority: priority
        };
        socket.emit('initiateChat', initialMessage);
        setPriority(priority);
        setWait(true);
    };

    const handleInputChange = (e) => {
        setNewMessage(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newMessage.trim() !== '') {
            const messageData = {
                customerId: socket.id,
                message: newMessage
            };
            socket.emit('sendMessage', messageData);
            setMessages(prevMessages => [...prevMessages, newMessage]);
            setNewMessage('');
        }
    };

    return (
        <div className="chatpage">
            <div className="chatpage--rightcust">
                {   
                    priority!='' && !wait && (
                    <div className="chatpage--rightnavbar">
                        <Avatar />
                        <div className="chatpage--rightfriendinfo">
                            <p className="chatpage--rightfriendname">Agent {agentName}</p>
                            <p className="chatpage--rightfriendstat"></p>
                        </div>
                    </div>)}
                <div className="chatpage--rightchats">
                    {priority === '' && (
                        <div className="chatpage--priority">
                            <h1>Choose a priority</h1>
                            <Button variant="contained" onClick={() => handleStartChat('low')}>Low</Button>
                            <Button variant="contained" onClick={() => handleStartChat('medium')}>Medium</Button>
                            <Button variant="contained" onClick={() => handleStartChat('high')}>High</Button>
                        </div>
                    )}
                    {wait && (
                        <div className="chatpage--priority">
                            <h1>Wait while we connect you to an agent...</h1>
                        </div>
                    )}
                    {!wait && messages.map((message, index) => (
                        <div key={index} >
                            <p className="chatpage--message">{message}</p>
                        </div>
                    ))}
                </div>
                {priority!='' && !wait && (
                    <div className="chatpage--rightsendmessage">
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                placeholder="Type your message..."
                                value={newMessage}
                                onChange={handleInputChange}
                                className="chatpage--chatinput"
                            />
                            {/* <button className='chatpage--sendchat' type="submit"><span className="material-symbols-outlined">send</span></button> */}
                            <Button variant="contained" type="submit">Send</Button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}
