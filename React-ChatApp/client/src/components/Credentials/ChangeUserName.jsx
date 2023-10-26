import React, { useEffect, useState } from "react";
import {useNavigate} from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import Swal from 'sweetalert2';

// ********* TO DO *********
// 1. Enter ChangeUserName Credentials --> userName
// 2. onSubmit verify the credentials with database &
// 3. Move to ChatHome page

const ChangeUserName = ({socket}) => {

	// Variables to store data changes
	const [emailId, setEmailId] = useState("");
    const [userName, setUserName] = useState("");

	// For Navigation
	const navigate = useNavigate();

	// componentDidMount
    useEffect(() => {
        setEmailId(sessionStorage.getItem("userEmail"));
    }, []);

    // onChange Event
	const changeValue = (event) => {
        setUserName(event.target.value);
	};

	// Clear form inputs
    const clearForm  = () => {
        setUserName("");
    };

 	// onSubmit data
	const submitData = (event) => {
        event.preventDefault();

		const postData = {
			emailId,
            userName
        };
		// console.log("ChangeUserName data: ", postData);

		// Send ChangeUserName data to server
        socket.emit("ChangeUserName", postData);

        // Receive response for ChangeUserName
        socket.on("updateUserName", (response) => {
			// console.log("ChangeUserName response: ", response);
            if(!response?.status) {
                Swal.fire(response?.message);
                clearForm();
            }else {
                Swal.fire(response?.message);
				setTimeout(() => {
					navigate("/chatHome");
				}, 200);
            }
        });
	};

	return (
		<div className="form">
			<h2>Forgot Password</h2>
			<hr />
			<Form className="px-5 py-3">
				<Form.Group className="my-3" controlId="userName">
					<Form.Label>User Name: </Form.Label>
					<Form.Control type="text" name="userName" minLength={3} placeholder="Enter userName" autoComplete="off" onChange={changeValue} value={userName} required />
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

export default ChangeUserName;