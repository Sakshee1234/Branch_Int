import React, { useState } from 'react';
import "../App.css";
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { Avatar } from '@mui/material';
import Button from '@mui/material/Button';

export default function ChatCustomer() {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [conversation, setConversation] = useState([ ]);
    const [priority, setPriority] = useState('');


    const handleInputChange = (e) => {
        setNewMessage(e.target.value);
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        if (newMessage.trim() !== '') {
          setMessages([...messages, { text: newMessage, isYou: true }]);
          setNewMessage('');
        }
    };
    const [alignment, setAlignment] = React.useState('web');

    const handleChange = (event, newAlignment) => {
        setAlignment(newAlignment);
    };
    return (
        <>
            <div className="chatpage">
            <div className="chatpage--right">
                <div className="chatpage--rightnavbar">
                    <Avatar/>
                    <div className="chatpage--rightfriendinfo">
                        <p className="chatpage--rightfriendname">Agent---</p>
                        <p className="chatpage--rightfriendstat"></p>
                    </div>
                </div>
                <div className="chatpage--rightchats">
                    {
                        priority === '' ? 
                        <div className="chatpage--priority">
                            <h1>Choose a priority</h1>
                            <div>
                            <Button variant="contained" onClick={() => setPriority('low')}>Low</Button>
                            <Button variant="contained" onClick={() => setPriority('medium')}>Medium</Button>
                            <Button variant="contained" onClick={() => setPriority('high')}>High</Button>
                            </div>
                        </div>
                        :
                        <div className="chatpage--container">
                        {messages.map((message, index) => (
                            <div key={index} className={`chatpage--message ${message.isYou ? 'chatpage--message-me' : 'chatpage--message-them'}`}>
                                <p>{message.text}</p>
                            </div>
                        ))}
                    </div>
                    }
                </div>
                <div className="chatpage--rightsendmessage">
                    <form onSubmit={handleSubmit} >
                        <input
                        type="text"
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={handleInputChange}
                        className="chatpage--chatinput"
                        />
                        <button className='chatpage--sendchat' type="submit"><span className="material-symbols-outlined">send</span></button>
                    </form>
                </div>
            </div>
        </div>
        </>
        
    )
}