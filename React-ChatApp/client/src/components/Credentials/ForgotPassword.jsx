import React, { useState } from "react";
import {useNavigate} from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import Swal from 'sweetalert2';

// ********* TO DO *********
// 1. Enter ForgotPassword Credentials --> emailId
// 2. onSubmit verify the credentials with database &
// 3. Move to ChangePassword page

const ForgotPassword = ({socket}) => {

	// Variables to store data changes
    const [emailId, setEmailId] = useState("");

	// For Navigation
	const navigate = useNavigate();

    // onChange Event
	const changeEmailId = (event) => {
        setEmailId(event.target.value);
	};

	// Clear form inputs
    const clearForm  = () => {
        setEmailId("");
    };

 	// onSubmit data
	const submitData = (event) => {
        event.preventDefault();
        sessionStorage.setItem("userEmail", emailId);

		const postData = {
            emailId
        };
		// console.log("ForgotPassword data: ", postData);

		// Send forgotPassword data to server
        socket.emit("forgotPassword", postData);

        // Receive response for forgotPassword
        socket.on("onForgot", (response) => {
			// console.log("ForgotPassword response: ", response);
            if(!response?.status) {
                Swal.fire(response?.message);
                clearForm();
            }else {
                Swal.fire(response?.message);
				setTimeout(() => {
					navigate("/changePassword");
				}, 200);
            }
        });
	};

	return (
		<div className="form">
			<h2>Forgot Password</h2>
			<hr />
			<Form className="px-5 py-3">
                <Form.Group className="my-3" controlId="emailId">
					<Form.Label>Email: </Form.Label>
					<Form.Control type="email" minLength={3} name="emailId" placeholder="Enter emailId" autoComplete="off" onChange={changeEmailId} value={emailId} required />
				</Form.Group>

				<div className="btn-center mt-4">
                    <Button variant="success" type="button" size="lg" onClick={submitData}>
						Submit
					</Button>
				</div>
			</Form> 
		</div>
	)
};

export default ForgotPassword;