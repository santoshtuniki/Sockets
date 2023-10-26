import React from 'react';
import { Route, Routes} from "react-router-dom";
import socketIO from "socket.io-client";

import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';
import './App.css';

// Credentials
import Home from './components/Credentials/Home';
import Register from './components/Credentials/Register';
import Login from './components/Credentials/Login';
import ForgotPassword from './components/Credentials/ForgotPassword';
import ChangePassword from './components/Credentials/ChangePassword';
import UpdateProfile from './components/Credentials/UpdateProfile';
import ChangeUserName from './components/Credentials/ChangeUserName';

// SmartChat
import ChatHome from './components/SmartChat/ChatHome';
import Chat from "./components/SmartChat/Chat";

const socket = socketIO.connect('http://localhost:5700');

const App = () => {
	return (
		<div className="App">
			<Container>
				<Routes> 
					<Route path='/' element={<Home socket={socket} />} />
					<Route path='/register' element={<Register socket={socket} />} />
					<Route path='/login' element={<Login socket={socket} />} />
					<Route path='/forgotPassword' element={<ForgotPassword socket={socket} />} />
					<Route path='/changePassword' element={<ChangePassword socket={socket} />} />
					<Route path='/updateProfile' element={<UpdateProfile socket={socket} />} /> 
					<Route path='/changeUserName' element={<ChangeUserName socket={socket} />} /> 

					<Route path='/chatHome' element={<ChatHome socket={socket} />} /> 
					<Route path='/chat' element={<Chat socket={socket} />} /> 
				</Routes>
			</Container>
		</div>
	);
}

export default App;