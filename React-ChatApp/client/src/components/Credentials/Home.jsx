import React from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";

// ********* TO DO *********
// 1. Move to Login page (OR)
// 2. Move to Register page  

const Home = () => {

    // For Navigation
	const navigate = useNavigate();
    
    return (
		<div className="form">
			<h1>WELCOME TO ONPASSIVE TECHNOLOGIES</h1>
			<hr />
			<Form className="px-5 py-3">
				<div className="btn-center mt-4">
                    <Button variant="primary" type="button" size="lg" onClick={() => navigate("/register")}>
						Register
					</Button>
                    <Button variant="success" type="button" size="lg" onClick={() => navigate("/login")}>
						Login
					</Button>
				</div>
			</Form>
		</div>
	)
};

export default Home;