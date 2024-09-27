import React, { useState } from 'react';
import "../App.css";
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { Avatar } from '@mui/material';
import Button from '@mui/material/Button';

export default function Chat() {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

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
    const changeChatPerson = (index) => {
        return () => {
            setCurrChatPerson(contactsuggestion[index]);
        }
    };
    const [contactsuggestion, setContactSuggestion] = useState([
        { name: 'Powerpuff girls', lastmessage: 'Hi' },
        {  name: 'Alex', lastmessage: 'Hi' },
        {name: 'Mr.Bean', lastmessage: 'Hi' },
        { name: 'A', lastmessage: 'Hi' },
        {name: 'V', lastmessage: 'Hi' },
        { name: 'V', lastmessage: 'Hi' },
        { name: 'V', lastmessage: 'Hi' },
        { name: 'V', lastmessage: 'Hi' },
        {  name: 'V', lastmessage: 'Hi' },
    ]);
      
    const [currchatperson, setCurrChatPerson] = useState(contactsuggestion[1]);
    
    const [alignment, setAlignment] = React.useState('web');

    const handleChange = (event, newAlignment) => {
        setAlignment(newAlignment);
    };
    return (
        <div className="chatpage">
            <div className="chatpage--left">
                    {/* <input type="text" placeholder="Search or start new chat" className="chatpage--search"/> */}
                {/* <hr/> */}
                <ToggleButtonGroup
                    color="primary"
                    value={alignment}
                    exclusive
                    onChange={handleChange}
                    aria-label="Platform"
                    >
                    <ToggleButton value="inq">In Queue</ToggleButton>
                    <ToggleButton value="current">Current Chat</ToggleButton>
                    <ToggleButton value="previous">Previous Chats</ToggleButton>
                </ToggleButtonGroup>
                <div className='chatpage--contactlist'>
                    {
                        alignment=='inq' && 
                        <>
                        {contactsuggestion.map((contactsuggestion, index) => (
                            <div className="chatpage--contact" onClick={changeChatPerson(index)}>
                                <Avatar alt="/" />
                                <div className="chatpage--contactdetails">
                                    <span className="chatpage--contactname" >{contactsuggestion.name}</span>
                                    <span className="chatpage--contactlastchat">{contactsuggestion.lastmessage}</span>
                                    
                                </div>
                                <Button
                                    // fullWidth
                                    variant="contained"
                                    // onClick={validateInputs}
                                    >
                                    +
                                </Button>
                            </div>
                        ))} 
                        </>  
                    }
                </div>
            </div>

            <div className="chatpage--right">
                <div className="chatpage--rightnavbar">
                    <Avatar/>
                    <div className="chatpage--rightfriendinfo">
                        <p className="chatpage--rightfriendname">{currchatperson.name}</p>
                        <p className="chatpage--rightfriendstat"></p>
                    </div>
                </div>
                <div className="chatpage--rightchats">
                    <div className="chatpage--container">
                        {messages.map((message, index) => (
                            <div key={index} className={`chatpage--message ${message.isYou ? 'chatpage--message-me' : 'chatpage--message-them'}`}>
                                <p>{message.text}</p>
                            </div>
                        ))}
                    </div>
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
    )
}