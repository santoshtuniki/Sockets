import React, { useState } from "react";
import {useNavigate} from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import Swal from 'sweetalert2';

// ********* TO DO *********
// 1. Enter Login Credentials --> emailId, password
// 2. onSubmit verify the credentials with database &
// 3. Move to ChatHome page
// 4. Go to ForgotPassword if password is lost

const Login = ({socket}) => {

    // Variables to store data changes
    const [emailId, setEmailId] = useState("");
    const [password, setPassword] = useState("");

    // For Navigation
	const navigate = useNavigate();

	// onChange Event
	const changeValue = (event) => {
        const {name, value} = event.target;
        switch(name){
            case "emailId":
                setEmailId(value);
                break;
            case "password":
                setPassword(value);
                break;
            default:
                console.log("Invalid")
        }
	};

	// Clear form inputs
    const clearForm  = () => {
        setEmailId("");
        setPassword("");
    };

	// onSubmit data
	const submitData = (event) => {
        event.preventDefault();

		const postData = {
            emailId,
            password
        };
		// console.log("Login data: ", postData);

        // Send login data to server
        socket.emit("login", postData);

        // Receive response for login
        socket.on("onLogin", (response) => {
			// console.log("Login response: ", response);
            if(!response.status) {
				clearForm();
                Swal.fire(response?.message);
            }else {
                sessionStorage.setItem("userEmail", emailId);
                sessionStorage.setItem("userName", response?.user?.userName);
                sessionStorage.setItem("userId", response?.user?._id);

                Swal.fire(response?.message);
				setTimeout(() => {
					navigate("/chatHome");
				}, 200);
            }
        });
	};

	return (
		<div className="form">
			<h2>Login</h2>
			<hr />
			<Form className="px-5 py-3">
                <Form.Group className="my-3" controlId="emailId">
					<Form.Label>Email: </Form.Label>
					<Form.Control type="email" name="emailId" placeholder="Enter emailId" autoComplete="off" onChange={changeValue} value={emailId} required />
				</Form.Group>

                <Form.Group className="my-3" controlId="password">
					<Form.Label>Password: </Form.Label>
					<Form.Control type="password" name="password" placeholder="Enter password" autoComplete="off" onChange={changeValue} value={password} required />
				</Form.Group>

				<div className="btn-center mt-4">
                    <Button variant="primary" type="button" size="lg" onClick={() => navigate("/forgotPassword")}>
						Forgot Password
					</Button>

					<Button variant="success" type="button" size="lg" onClick={submitData}>
						Login
					</Button>
				</div> 
			</Form>
		</div>
	)
};

export default Login;