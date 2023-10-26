import React, { useEffect, useState } from "react";
import {useNavigate} from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import Swal from 'sweetalert2';

// ********* TO DO *********
// 1. Enter ChangePassword Credentials --> emailId, password, confirmPassword
// 2. onSubmit verify the credentials with database &
// 3. Move to Login page

const ChangePassword = ({socket}) => {

    // Variables to store data changes
    const [emailId, setEmailId] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // For Navigation
	const navigate = useNavigate();

    // componentDidMount
    useEffect(() => {
        setEmailId(sessionStorage.getItem("userEmail"));
    }, []);

	// onChange Event
	const changeValue = (event) => {
        const {name, value} = event.target;
        switch(name){
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
        setPassword("");
        setConfirmPassword("");
    };

	// onSubmit data
	const submitData = (event) => {
        event.preventDefault();

		const postData = {
            emailId,
            password,
            confirmPassword
        };
        // console.log("ChangePassword data: ", postData);

        // Send changePassword data to server
        socket.emit("changePassword", postData);

        // Receive response fro changePassword
        socket.on("updatePassword", (response) => {
            // console.log("ChangePassword response: ", response);
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
			<h2>Change Password</h2>
			<hr />
			<Form className="px-5 py-3">
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
						Change Password
					</Button>
				</div>
			</Form>
		</div>
	)
};

export default ChangePassword;