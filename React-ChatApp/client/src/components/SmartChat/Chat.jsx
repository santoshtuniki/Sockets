import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {Form, Button, Row, Col} from "react-bootstrap";
import {v4 as uuidv4} from "uuid";

import {faCircle, faPaperPlane, faComments, faUsers} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Swal from 'sweetalert2';

const Chat = ({socket}) => {

	// Variables to store data changes
	const [userName, setUserName] = useState("");
	const [roomName, setRoomName] = useState("");
	const [myChat, setMyChat] = useState("");

	const [messages, setMessages] = useState([]);
	const [friends, setFriends] = useState([]);

	// For Navigation
	const navigate = useNavigate(); 

	// componentDidMount
	useEffect(() => {
		setUserName(sessionStorage.getItem("userName"));
		setRoomName(JSON.parse(sessionStorage.getItem("selectedRoom")).roomName);
	}, []);

	// Handle Previous Messages
	const handlePrevious = (data) => {
		// console.log("handlePrevious: ", data);
		if (data?.status) {
			data.previous.map(msg => changeMessages(msg));
		} else {
			Swal.fire(data?.message);
		}
	};

	// Handle Joining Message
	const handleJoin = (data) => {
		// console.log("handleJoin: ", data);
		if (data?.status) {
			changeMessages(data?.users);
		}
	};

	// Handle Users Messages
	const handleResponse = (data) => {
		// console.log("handleResponse: ", data);
		if (data?.status) {
			changeMessages(data?.users);
		} else {
			Swal.fire(data?.message);
		}
	};

	// Handle Users
	const handleRoomUsers = async ({users}) => {
		console.log("handleRoomUsers: ", users);
		sessionStorage.setItem("friends", JSON.stringify(users));

		console.log("friends.length: ", friends.length)

		if(users?.length>0){
			console.log("friends: ", friends);
			newFriend(friends, users)
		}
	};

	// Add new friend
	const newFriend = (prevFriends, users) => {
		console.log("prevFriends: ", prevFriends);

		// if no prevFriends
		if(prevFriends.length===0){
			prevFriends = [...users];
		}else{
			// if has prevFriends
			users.map((user) => {
				const index = prevFriends.findIndex((obj) => obj._id===user._id);
				console.log("index: ", index);

				if(user.isConnected==="falsy"){
					prevFriends.splice(index, 1, {...user, isConnected: false});
					console.log("prevFriends after falsy: ", prevFriends);
				}else if(user.isConnected===true && prevFriends[index].isConnected===false){
					prevFriends.splice(index, 1, user);
					console.log("prevFriends after falsy: ", prevFriends);
				}
				return user
			});
		}

		console.log("newFriend result: ", prevFriends);
		setFriends(prevFriends);
	}

	// componentDidUpdate
	// Response to Message, Joining message, and Friends list
	useEffect(() => {
		socket.on('prev_messages', handlePrevious);
		socket.on('joinMessage', handleJoin);
		socket.on("response", handleResponse);
		socket.on("roomUsers", handleRoomUsers);
	
		return () => {
			socket.off('prev_messages', handlePrevious);
			socket.off('joinMessage', handleJoin);
			socket.off("response", handleResponse);
			socket.off("roomUsers", handleRoomUsers); 
		};
	}, [socket]);


	// Send Message to server
	const emitMessage = (event) => {
		console.log("friends: ", friends)
		event.preventDefault();
		socket.emit("message", myChat);
		setMyChat("");
	};

	// Change Message Array
	const changeMessages = (message) => {
		// console.log("changeMessages: ", message);
		setMessages((prevMessages) => [...prevMessages, {...message, _id: uuidv4()}]);
	};
	
	// onChange message
	const changeInput = (event) => {
		setMyChat(event.target.value)
	};

	// Session storage clean
	const leaveChat = () => {
		socket.disconnect();
		sessionStorage.clear();
		navigate("/login");
	};

	return (
		<div id="chat">   
			<h2>Welcome {userName}</h2>
			<Button className="leave" variant="info" type="button" size="lg" onClick={leaveChat}>
				LEAVE
			</Button>
			<hr />
			<Row>
				<Col xs md={4} lg={3}>
					<div className="room">
						<div><FontAwesomeIcon icon={faComments} /> Group Name</div>
						{
							roomName && <div>{roomName}</div>
						}    
					</div>
					<div className="friends">
						<div><FontAwesomeIcon icon={faUsers} /> Group Members</div>
						<ul>
							{
								friends?.map((friend) => {
									return (
										<li key={friend._id}>
											{friend.userName} <FontAwesomeIcon icon={faCircle} className={friend.isConnected===true? "green" : "orange"} />
										</li>
									)
								})
							}
						</ul>
					</div>
				</Col>
				<Col xs md={8} lg={9}> 
					<div className="chat-messages">
						{
							messages.map((user) => {
								return (
									<div className="message" key={user._id}>
										<p className="meta">
											{user?.userName}  <span>{user?.message?.time}</span>	<span className="date">{user?.message?.date}</span>
										</p>
										<p className="text">{user?.message?.text}</p>
									</div>
								)
							})
						}
					</div>
					<hr />
					<Form className="py-2">
						<Form.Control type="text" name="message" placeholder="Enter message" onChange={changeInput} autoComplete="off" value={myChat} required />
						<Button variant="success" type="submit" size="md" onClick={emitMessage}>
							<FontAwesomeIcon icon={faPaperPlane} /> Send
						</Button>
					</Form>
				</Col>
			</Row> 
		</div>
	)
};

export default Chat;