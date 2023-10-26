import React, { useState } from "react";
import {useNavigate} from "react-router-dom";
import { Form, Button } from "react-bootstrap";

import Swal from 'sweetalert2';

// ********* TO DO *********
// 1. Enter Registration Credentials --> firstName, lastName, emailId, password, confirmPassword
// 2. onSubmit Save the credentials to database &
// 3. Move to Login page

const  Register = ({socket}) => {

    // Variables to store data changes
	const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [emailId, setEmailId] = useState("");
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // For Navigation
	const navigate = useNavigate();

	// onChange Event
	const changeValue = (event) => {
        const {name, value} = event.target;
        switch(name){
            case "firstName":
                setFirstName(value);
                break;
            case "lastName":
                setLastName(value);
                break;
            case "emailId":
                setEmailId(value);
                break;
            case "userName":
                setUserName(value);
                break;
            case "password":
                setPassword(value);
                break;
            case "confirmPassword":
                setConfirmPassword(value);
                break;
            default:
                console.log("Invalid")
        }
	};

    // Clear form inputs
    const clearForm  = () => {
        setFirstName("");
        setLastName("");
        setEmailId("");
        setUserName("");
        setPassword("");
        setConfirmPassword("");
    };

	// onSubmit data
	const submitData = (event) => {
        event.preventDefault();

		const postData = {
            firstName,
            lastName,
            emailId,
            userName,
            password,
            confirmPassword
        };
        // console.log("Register data: ", postData);

        // Send register data to server
        socket.emit("register", postData);

        // Receive response for register
        socket.on("onRegister", (response) => {
            // console.log("Register response: ", response);
            if(!response?.status) {
                Swal.fire(response?.message);
                clearForm();
            }else {
                Swal.fire(response?.message);
                setTimeout(() => {
                    navigate("/login");
                }, 200);
            }
        });
	};

	return (
		<div className="form">
			<h2>Register</h2>
			<hr />
			<Form className="px-5 py-3">
				<Form.Group className="my-3" controlId="firstName">
					<Form.Label>First Name: </Form.Label>
					<Form.Control type="text" name="firstName" minLength={3} placeholder="Enter firstName" autoComplete="off" onChange={changeValue} value={firstName} required />
				</Form.Group>
 
				<Form.Group className="my-3" controlId="lastName">
					<Form.Label>Last Name: </Form.Label>
					<Form.Control type="text" name="lastName" minLength={3} placeholder="Enter lastName" autoComplete="off" onChange={changeValue} value={lastName} required />
				</Form.Group>

                <Form.Group className="my-3" controlId="emailId">
					<Form.Label>Email: </Form.Label>
					<Form.Control type="email" name="emailId" placeholder="Enter emailId" autoComplete="off" onChange={changeValue} value={emailId} required />
				</Form.Group>

                <Form.Group className="my-3" controlId="userName">
					<Form.Label>User Name: </Form.Label>
					<Form.Control type="text" name="userName" minLength={3} placeholder="Enter userName" autoComplete="off" onChange={changeValue} value={userName} required />
				</Form.Group>

                <Form.Group className="my-3" controlId="password">
					<Form.Label>Password: </Form.Label>
					<Form.Control type="password" name="password" placeholder="Enter password" autoComplete="off" onChange={changeValue} value={password} required />
				</Form.Group>

                <Form.Group className="my-3" controlId="confirmPassword">
					<Form.Label>Confirm Password: </Form.Label>
					<Form.Control type="password" name="confirmPassword" placeholder="Enter confirmPassword" autoComplete="off" onChange={changeValue} value={confirmPassword} required />
				</Form.Group>

				<div className="btn-center mt-4">
                    <Button variant="success" type="button" size="lg" onClick={submitData}>
						Register
					</Button>
				</div>
			</Form>
		</div>
	)
};

export default  Register;