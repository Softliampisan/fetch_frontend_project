import { useState, useEffect } from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import LoginStatusContext from '../contexts/LoginStatusContext';
import Auth from '../services/AuthService';
import fetch_logo from '../../assets/fetch_logo.png';

function NavBar() {
    const [loginStatus, setLoginStatus] = useState(Auth.isAuthenticated() ? 'loggedIn' : null);
    const navigate = useNavigate();

    useEffect(() => {
        const checkSession = () => {
            if (!Auth.isAuthenticated()) {
                setLoginStatus(null);
                navigate('/login');
            }
        };
        const interval = setInterval(checkSession, 60000); // Check session every minute
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <Navbar bg='dark' variant='dark' fixed='top'>
                <Container fluid>
                    <Navbar.Toggle aria-controls='responsive-navbar-nav' />
                    <Navbar.Brand as={Link} to='/'>
                        <img
                            alt='Fetch logo'
                            src={fetch_logo}
                            width='30'
                            height='30'
                            className='d-inline-block align-top'
                        />{' '}
                        Fetch
                    </Navbar.Brand>
                    <Navbar.Collapse id='responsive-navbar-nav'>
                        <Nav className='me-auto'>
                            {loginStatus === 'loggedIn' && (
                                <>
                                    <Nav.Link as={Link} to='/available_dogs'>Available Dogs</Nav.Link>
                                    <Nav.Link as={Link} to='/favorites'>My Favorites</Nav.Link>
                                </>
                            )}
                        </Nav>
                        <Nav className='ms-auto'>
                            {loginStatus === 'loggedIn' ? (
                                <Nav.Link onClick={() => { Auth.logout(); setLoginStatus(null); navigate('/login'); }}>
                                    Logout
                                </Nav.Link>
                            ) : (
                                <Nav.Link as={Link} to='/login'>Login</Nav.Link>
                            )}
                        </Nav>
                    </Navbar.Collapse>

                </Container>
            </Navbar>

            <LoginStatusContext.Provider value={[loginStatus, setLoginStatus]}>
                <Outlet />
            </LoginStatusContext.Provider>
        </>
    );
}

export default NavBar;
