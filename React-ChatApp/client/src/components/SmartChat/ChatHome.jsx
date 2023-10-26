import React, { useEffect, useState } from "react";
import {useNavigate} from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import Swal from 'sweetalert2';

const ChatHome = ({socket}) => {

	// Variables to store data changes
	const [userName, setUserName] = useState("");
	const [roomName, setRoomName] = useState("");
	const [rooms, setRooms] = useState([]);
	const [showRoom, setShowRoom] = useState(false);

	// For Navigation
	const navigate = useNavigate(); 
	
	// componentDidMount
	useEffect(() => {
		setUserName(sessionStorage.getItem("userName"));
	}, []);

	// componentDidUpdate
	useEffect(() => {
		// window.location.reload();
		socket.on("allRooms", handleRooms);
		return () => {
			socket.off("allRooms", handleRooms);
		}
	});

	// Handle rooms
	const handleRooms = (roomsList) => {
		// console.log("RoomsList: ", roomsList);
		if(roomsList?.status){
			setRooms(roomsList?.rooms);		
		}else{
			Swal.fire(roomsList?.message);
		}
	};

	// onChange roomName
	const changeRoomName = (event) => {
		const value = event.target.value;
		if(value === "other"){
			setShowRoom(true);
			return;
		}else if(value === "") {
			Swal.fire("Please select a room...");
		}else{
			setShowRoom(false);
			setRoomName(value);
		}
	};

	// onChange hiddenRoom
	const changeHiddenRoom = (event) => {
		setRoomName(event.target.value);
	};

	// Add Room to db?
	const addRoom = () => {
		// console.log("Rooms: ", rooms)
		const roomsCollection = rooms.map((room) => room.roomName);

		if(showRoom && roomsCollection.indexOf(roomName)===-1) {
			// Send newRoom to server
			socket.emit("newRoom", roomName);

			// Receive reply from server
			 socket.on("addNewRoom", (response) => {
				console.log("newRoom response: ", response)
				if(response.status){
					join(response.rooms);;
				}
				Swal.fire(response.message)
			})
		}else if(showRoom){ 
			Swal.fire("Room already exists. Enter new roomName...");
			setRoomName("");
		}
	};

	// Join Room
	const join = (selectedRoom) => {

		// console.log("selected: ", selectedRoom)
		const name = selectedRoom?.roomName;
		const id = selectedRoom?._id;
		const userId = sessionStorage.getItem("userId");

		// Send data to server
		socket.emit("joinUsers", {userName, userId, roomName: name, roomId: id});

		// session storage
		sessionStorage.setItem("selectedRoom", JSON.stringify(selectedRoom));
		sessionStorage.setItem("socketId", socket.id);

		// Receive reply from server
		socket.on("onJoining", (data) => {
			console.log(data?.message);
		});
	};

	// onSubmit data 
	const submitData =  (event) => {
		event.preventDefault();	

		if(showRoom){
			addRoom();
		}else {
			const selectedRoom = rooms.filter((room) => room.roomName === roomName); 
			if(selectedRoom.length>0){
				// console.log("selectedRoom: ", selectedRoom);
				join(selectedRoom[0]);
			}
		}		
			
		setTimeout(() => {
			navigate("/chat");
		}, 200);
	};

	return (
		<div className="form">
			<h2>Welcome</h2>
			<hr />
			<Form className="px-5 py-3">
				<Form.Group className="my-3" controlId="userName">
					<Form.Label>User Name: </Form.Label>
					<Form.Control type="text" minLength={3} name="userName" placeholder="Enter userName" autoComplete="off" value={userName} disabled />
				</Form.Group>
 
				{
					showRoom ? ( 
						<Form.Group className="my-3" controlId="roomName">
							<Form.Label>Room Name: </Form.Label>
							<Form.Control type="text" minLength={4} name="roomName" placeholder="Enter roomName" autoComplete="off" onChange={changeHiddenRoom} required />
						</Form.Group> ) : (
						<Form.Group className="my-3">
							<Form.Label>Room Name: </Form.Label>
							<Form.Select aria-label="roomName" name="roomName" onChange={changeRoomName}>
								<option value="">Select Room</option>
									{
										rooms?.length>0 && rooms.map((room) => {
											return <option key={room._id} value={room.roomName}>{room.roomName}</option>
										})
									}
								<option value="other">Other</option>
							</Form.Select>
						</Form.Group> 
					)
				}

				<div className="btn-center mt-4">
					<Button variant="success" type="submit" size="lg" onClick={submitData}>
						Join Chat
					</Button>
				</div>
			</Form>
		</div>
	)
};

export default ChatHome;