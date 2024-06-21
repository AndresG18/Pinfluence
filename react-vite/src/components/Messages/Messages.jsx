import { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import './Messages.css';
import { useNavigate } from 'react-router-dom';

let socket;

export default function Messages() {
    const [users, setUsers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [chatInput, setChatInput] = useState('');
    const user = useSelector(state => state.session.user);
    const [activeID, setActiveID] = useState('');
    const [active, setActive] = useState(false);
    const [activeUser, setActiveUser] = useState(null);
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/');
            return;
        }

        const fetchUsers = async () => {
            const allUsers = await getAllUsers();
            const filteredUsers = await Promise.all(
                allUsers.filter(u =>
                    user.following.some(f => f.followed_id === u.id) ||
                    user.followers.some(f => f.follower_id === u.id)
                ).map(async (u) => {
                    const lastMessageTime = await getLastMessageTime(u.id);
                    return { ...u, lastMessageTime };
                })
            );
            setUsers(sortUsersByLastMessage(filteredUsers));
        };

        fetchUsers();

        const url = import.meta.env.MODE === 'development' ? "http://127.0.0.1:8000" : "https://pinfluence-e4ch.onrender.com";
        socket = io(url);

        socket.on("chat", (data) => {
            console.log(`Received message: ${data.content}`);
            setMessages(prevMessages => {
                const updatedMessages = [...prevMessages, data];
                sortUsers();
                return updatedMessages;
            });
        });

        return () => {
            if (socket) socket.disconnect();
        };
    }, [user, navigate]);

    useEffect(() => {
        if (activeID) {
            fetchMessages(activeID);
        }
    }, [activeID]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const getAllUsers = async () => {
        const response = await fetch('/api/users');
        const data = await response.json();
        return data.users;
    };

    const getLastMessageTime = async (userId) => {
        const response = await fetch(`/api/messages/${userId}`);
        const data = await response.json();
        return data.messages.length > 0 ? new Date(data.messages[data.messages.length - 1].timestamp) : new Date(0);
    };

    const handleUserClick = async (userId) => {
        setActiveID(userId);
        setActive(true);
        const activeUser = users.find(u => u.id === userId);
        setActiveUser(activeUser);
        fetchMessages(userId);
    };

    const fetchMessages = async (userId) => {
        const response = await fetch(`/api/messages/${userId}`);
        const data = await response.json();
        setMessages(data.messages);
        scrollToBottom();
        sortUsers();
    };

    const handleBackClick = () => {
        setActive(false);
        setActiveUser(null);
        setActiveID('');
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({});
    };

    const updateChatInput = (e) => {
        setChatInput(e.target.value);
    };

    const sendChat = async (e) => {
        e.preventDefault();
        const response = await fetch('/api/messages/new', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                recipient_id: activeID,
                content: chatInput
            })
        });
        if (response.ok) {
            const newMessage = await response.json();
            setMessages(prevMessages => [...prevMessages, newMessage]);
            setChatInput("");
            sortUsers();
        }
    };

    const sortUsersByLastMessage = (usersToSort) => {
        return usersToSort.sort((a, b) => b.lastMessageTime - a.lastMessageTime);
    };

    const sortUsers = async () => {
        const updatedUsers = await Promise.all(
            users.map(async (u) => {
                const lastMessageTime = await getLastMessageTime(u.id);
                return { ...u, lastMessageTime };
            })
        );
        setUsers(sortUsersByLastMessage(updatedUsers));
    };

    const filteredMessages = messages.filter(message =>
        (message.sender_id === user.id && message.recipient_id === activeID) ||
        (message.sender_id === activeID && message.recipient_id === user.id)
    );

    return (
        <div className="Messages">
            <div className={`users ${active ? 'hidden' : ''}`}>
                <h2>Messages</h2>
                {users.map(u => (
                    <div key={u.id} onClick={() => handleUserClick(u.id)} className={`user-link ${activeID === u.id ? 'active' : ''}`}>
                        <div className='message-user'>
                            <img src={u?.profile_image ?? 'https://pinfluence-2024.s3.us-east-2.amazonaws.com/pinfluence_pfp.webp'} className='pfp-in' />
                            <p>{u.username}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="chat">
                {active ? (
                    <div>
                        {activeUser && (
                            <div className="active-user-info">
                                <FontAwesomeIcon style={{ marginLeft: '-5%' }} icon={faArrowLeft} className="back-arrow" onClick={handleBackClick} />
                                <img src={activeUser.profile_image ?? 'https://pinfluence-2024.s3.us-east-2.amazonaws.com/pinfluence_pfp.webp'} className='pfp-in-large' />
                                <h2>{activeUser.username}</h2>
                            </div>
                        )}
                        <div className="messages-container">
                            {filteredMessages.map((message, ind) => (
                                <div key={ind} className={`message-wrapper ${message.sender_id === user.id ? 'sent-wrapper' : 'received-wrapper'}`}>
                                    {message.sender_id !== user.id && (
                                        <img
                                            src={activeUser?.profile_image ?? 'https://pinfluence-2024.s3.us-east-2.amazonaws.com/pinfluence_pfp.webp'}
                                            alt={activeUser?.username}
                                            className="message-profile-image"
                                        />
                                    )}
                                    <div className={`message ${message.sender_id === user.id ? 'sent' : 'received'}`}>
                                        <div className="message-content">{message.content}</div>
                                    </div>
                                    {message.sender_id === user.id && (
                                        <img
                                            src={user?.profile_image ?? 'https://pinfluence-2024.s3.us-east-2.amazonaws.com/pinfluence_pfp.webp'}
                                            alt={user?.username}
                                            className="message-profile-image"
                                        />
                                    )}
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                        <form onSubmit={sendChat} className="chat-form">
                            <input
                                value={chatInput}
                                onChange={updateChatInput}
                                className="chat-input"
                                placeholder="Type a message..."
                            />
                            {chatInput.length > 0 && <button type="submit" className="send-button">Send</button>}
                        </form>
                    </div>
                ) : (
                    <h1>Chat with followers/following</h1>
                )}
            </div>
        </div>
    );
}