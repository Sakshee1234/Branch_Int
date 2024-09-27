import React, { useEffect, useState } from 'react';
import "../App.css";
import { Avatar } from '@mui/material';
import Button from '@mui/material/Button';
import io from 'socket.io-client';
const socket = io('http://localhost:5000');

export default function Chat() {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [alignment, setAlignment] = useState('inq');
    const [currentChat, setCurrentChat] = useState(null);
    const [chatQueue, setChatQueue] = useState([]);
    const [username, setUsername] = useState(localStorage.getItem('username') || '');

    useEffect(() => {
        const handleUpdateQueue = (queue) => {
            setChatQueue(queue);
            //sort on basis of priority high above etc
            const priorityOrder = { high: 1, medium: 2, low: 3 };

            const sortedQueue = queue.sort((a, b) => {
                return priorityOrder[a.priority] - priorityOrder[b.priority];
            });
            setChatQueue(sortedQueue);
        };

        const handleReceiveMessage = (data) => {
            if (data.agentId === socket.id) {
                setMessages(prevMessages => [...prevMessages, data.message]);
            }
        };

        socket.on('updateQueue', handleUpdateQueue);
        socket.on('receiveMessage', handleReceiveMessage);
        socket.emit('requestQueue');

        return () => {
            socket.off('updateQueue', handleUpdateQueue);
            socket.off('receiveMessage', handleReceiveMessage);
        };
    }, []);

    const handleInputChange = (e) => {
        setNewMessage(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newMessage.trim() !== '') {
            const messageData = {
                agentId: socket.id,
                customerId: currentChat.customerId,
                message: newMessage
            };
            socket.emit('sendMessage', messageData);
            setNewMessage('');
        }
    };

    const changeChatPerson = (index) => () => {
        const selectedChat = chatQueue[index];
        const agentId = socket.id;
        socket.emit('assignChat', { customerId: selectedChat.customerId, agentId, username });
        setCurrentChat(selectedChat);
        setMessages([])
    };

    return (
        <div className="chatpage">
            <div className="chatpage--left">
                <div className='chatpage--contactlist'>
                    <div className="chatpage--contactlist-title">
                        <h2>Chat Queue</h2>
                    </div>
                    {alignment === 'inq' && chatQueue.map((contact, index) => (
                        <div className="chatpage--contact" key={index} onClick={changeChatPerson(index)}>
                            <Avatar alt="/" />
                            <div className="chatpage--contactdetails">
                                <span className="chatpage--contactname">{contact.username}</span>
                                <span className="chatpage--contactlastchat">{contact.priority}</span>
                            </div>
                            <Button variant="contained">+</Button>
                        </div>
                    ))}
                </div>
            </div>
            <div className="chatpage--right">
                {currentChat && (
                    <div className="chatpage--rightnavbar">
                        <Avatar />
                        <div className="chatpage--rightfriendinfo">
                            <p className="chatpage--rightfriendname">{currentChat.username}</p>
                        </div>
                    </div>
                )}
                <div className="chatpage--rightchats">
                    {messages.map((message, index) => (
                        <div key={index} >
                            <p className="chatpage--message" >{message}</p>
                        </div>
                    ))}
                </div>
                {
                    !currentChat && (
                        <>
                        <div className="chatpage--welcome">
                            <h1>Welcome, {username}!</h1>
                            <p>Select a chat from the queue to start a conversation.</p>
                            <div className="chatpage--instructions">
                                <p><strong>Instructions:</strong></p>
                                <ul>
                                    <li>Click on a chat from the left panel to view and respond to messages.</li>
                                    <li>Chats are sorted by priority: High, Medium, Low.</li>
                                    <li>Use the input box below to type and send your messages.</li>
                                </ul>
                            </div>
                            <div className="chatpage--visual-indicator">
                                <p>👈 Select a chat to get started!</p>
                            </div>
                        </div>
                        </>
                    )
                }
                { currentChat &&
                    <div className="chatpage--rightsendmessage">
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Type your message..."
                            value={newMessage}
                            onChange={handleInputChange}
                            className="chatpage--chatinput"
                        />
                        {/* <button className='chatpage--sendchat' type="submit">
                            <span className="material-symbols-outlined">send</span>
                        </button> */}
                        <Button variant="contained" type="submit">Send</Button>
                    </form>
                </div>}
            </div>
        </div>
    );
}
