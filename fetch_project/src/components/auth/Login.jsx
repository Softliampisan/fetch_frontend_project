import { useContext, useRef } from 'react';
import { Card, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import Auth from '../services/AuthService';
import LoginStatusContext from '../contexts/LoginStatusContext';

function Login() {
    const API_BASE_URL = import.meta.env.VITE_BASE_URL;
    const [loginStatus, setLoginStatus] = useContext(LoginStatusContext);
    const navigate = useNavigate();
    const nameRef = useRef(null);
    const emailRef = useRef(null);

    const handleLogin = async (e) => {
        e.preventDefault();
        const name = nameRef.current.value;
        const email = emailRef.current.value;

        if (!name || !email) {
            alert('You must provide both a name and an email!');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email }),
            });

            if (response.status === 400) {
                alert('Please enter a valid name or email!');
                return;
            } else if (response.status === 200) {
                Auth.login({ name }); 
                setLoginStatus('loggedIn');
                navigate('/available_dogs');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className='login-container'>
            <Card className='login-card'>
                <Card.Body>
                    <h3 className='text-center'>Login</h3>
                    <Form onSubmit={handleLogin}>
                        <div className='text-start form-group-container'>
                            <Form.Group>
                                <Form.Label htmlFor='name'>Name</Form.Label>
                                <Form.Control ref={nameRef} id='name' type='text' autoComplete='name' />
                            </Form.Group>
                            <Form.Group className='email-group'>
                                <Form.Label htmlFor='email'>Email</Form.Label>
                                <Form.Control ref={emailRef} id='email' type='text' autoComplete='email' />
                            </Form.Group>
                            <Button type='submit' variant='primary'>
                                Login
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    );
}
export default Login;