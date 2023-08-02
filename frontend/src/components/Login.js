//import './App.css';
//import Welcome from './Welcome';
import lock from '../icons/lock-closed.svg';
import close from '../icons/close.svg';
import person from '../icons/person.svg';
import people from '../icons/people.svg';
import axios from 'axios';
import { SHA256 } from 'crypto-js';
import {useEffect, useRef, useState} from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";



function Login() {
    const navigate = useNavigate();

    //user login success
    const [user, setUser] = useState({ username: '', email: '' });
    const [showWelcome, setShowWelcome] = useState(false);

    //select icon listener
    const [isSelectOpen, setIsSelectOpen] = useState(false);

    //mousedown
    const selectRef = useRef(null);

    //popup login
    const [isPopupActive, setIsPopupActive] = useState(true);

    //wrapper
    const [isWrapperActive, setIsWrapperActive] = useState(false);

    function handleRegisterClick() {
        navigate("/register");
    }

    function handleLoginClick() {
        setIsWrapperActive(false);
    }

    //popup login click
    function handleLoginButtonClick() {
        setIsPopupActive(true);
    }

    //popup login close click
    function handleCloseIconClick() {
        setIsPopupActive(false);
    }

    //select icon rotation
    function handleSelectClick() {
        setIsSelectOpen(!isSelectOpen);
    }

    //mousedown use
    function handleClickOutside(event) {
        if (selectRef.current && !selectRef.current.contains(event.target)) {
            setIsSelectOpen(false);
        }
    }

    //mousedown event listener
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


    async function handleRegisterFormSubmit(event)  {
        event.preventDefault();

        const form = event.target;
        const username = form.elements.username.value;
        const email = form.elements.email.value;
        const password = form.elements.password.value;
        const confirmPassword = form.elements['password-confirm'].value;


        // Perform validation checks
        if (password !== confirmPassword) {
            // Passwords do not match
            const confirmPasswordInput = form.elements['password-confirm'];
            confirmPasswordInput.setCustomValidity("Passwords do not match");

            // Trigger form validation to display the error message
            confirmPasswordInput.reportValidity();
            return;
        }

        try {
            // Send initial POST request with only the username
            const response = await axios.post('http://localhost:6969/auth/salt', { username });
            const { salt } = response.data; // Retrieve the salt from the server's response

            // Append the salt to the password and hash it
            const saltedPassword = password + salt;
            const hashedPassword = SHA256(saltedPassword).toString();

            // Create an object with the registration data
            const registrationData = {
                username,
                email,
                password: hashedPassword,
                salt,
            };
            //setPlayer(registrationData.username);


            // Send the second POST request to register the user
            await axios.post('http://localhost:6969/auth/users', registrationData)

            console.log('User registered successfully');
            // Handle successful registration
        } catch (error) {
            console.error('Error registering user', error);
            // Handle error during registration
        }

        // Reset the form
        form.reset();

        navigate("/lobby");

    }

    async function handleLoginFormSubmit(event) {
        event.preventDefault();

        const form = event.target;
        const username = form.elements.username.value;
        const password = form.elements.password.value;

        try {
            // Send initial POST request with only the username
            const response = await axios.post('http://localhost:6969/auth/ULogin', { username });
            const { userSalt: salt } = response.data; // Retrieve the salt from the server's response

            // Append the salt to the password and hash it
            const saltedPassword = password + salt;
            const hashedPassword = SHA256(saltedPassword).toString();

            // Create an object with the login data
            const loginData = {
                username,
                password: hashedPassword,
            };

            // Send the second POST request to log in the user
            const loginResponse = await axios.post('http://localhost:6969/auth/login', loginData)

            console.log('User logged in successfully');
            // Handle successful login
            // set is authenticated to true
            setIsPopupActive(false);

            // setShowWelcome(true);
            //navigate to lobby
            navigate("/lobby");


        } catch (error) {
            console.error('Error logging user', error);
            // Handle error during login
        }

        // Reset the form
        form.reset();
    }


    return (
        <div className="App">
            <header className="App-header">
                <h2 className="logo">Logo</h2>
                <nav className="navigation">
                    <button className={`btn-login-popup ${isPopupActive ? 'active' : ''}`} onClick={handleLoginButtonClick}>
                        Login</button>
                </nav>
            </header>

            <main className={`wrapper ${isWrapperActive ? 'active' : ''} ${isPopupActive ? 'active-popup' : ''}`}>
                <span className="icon-close" onClick={handleCloseIconClick}>
                    <img className="icon-image-close" src={close} alt="Close Icon"/>
                </span>
                <section className="form-box login">
                    <h2>Login</h2>
                    <form onSubmit={handleLoginFormSubmit}>
                        <div className="input-box">
                            <span className="icon">
                                <img className="icon-image" src={person} alt="Person Icon"/>
                            </span>
                            <input type="text" id="username" required aria-label="Username" />
                            <label htmlFor="username">Username</label>
                        </div>

                        <div className="input-box">
                            <span className="icon">
                                <img className="icon-image" src={lock} alt="Lock Icon" />
                            </span>
                            <input type="password" id="password" required aria-label="Email" />
                            <label htmlFor="password">Password</label>
                        </div>

                        <div className="remember-forgot">
                            <label><input type="checkbox"/>
                            Remember me</label>
                            <a href="#">Forgot Password?</a>
                        </div>
                        <button type="submit" className="btn">Login</button>

                        <div className="login-register">
                            <p>Don't have an account? <button className="register-link" onClick={handleRegisterClick}>
                                Register
                            </button>
                            </p>
                        </div>
                    </form>
                </section>


                <section className="form-box register">
                    <h2>Registration</h2>
                    <form onSubmit={handleRegisterFormSubmit}>
                        <div className="input-box">
                            <span className="icon">
                                <img className="icon-image" src={person} alt="Person Icon"/>
                            </span>
                            <input type="text" id="username" required aria-label="Username" />
                            <label htmlFor="username">Username</label>
                        </div>
                        <div className="input-box">
                            <span className="icon">
                                <img className="icon-image" src={person} alt="Person Icon"/>
                            </span>
                            <input type="text" id="email" required aria-label="Email" />
                            <label htmlFor="email">Email</label>
                        </div>
                        <div className="input-box">
                            <span className="icon">
                                <img className="icon-image" src={lock} alt="Lock Icon" />
                            </span>
                            <input
                                title="Must be at least 3 characters"
                                pattern="[a-zA-Z0-9]{3,}"
                                type="password"
                                id="password"
                                required
                                aria-label="Password"
                            />
                            <label htmlFor="password">Password</label>
                        </div>

                        <div className="input-box">
                            <span className="icon">
                                <img className="icon-image" src={lock} alt="Lock Icon" />
                            </span>
                            <input
                                type="password"
                                id="password-confirm"
                                required
                                aria-label="Password Confirm" />
                            <label htmlFor="password-confirm">Confirm Password</label>
                        </div>

                        <div className="remember-forgot">
                            <label><input type="checkbox" required/>
                                I agree to the terms & conditions</label>
                        </div>

                        <button type="submit" className="btn">Register</button>

                        <div className="">
                            <p>Already have an account? <button className="login-link" onClick={handleLoginButtonClick}>
                                Login
                            </button>
                            </p>
                        </div>
                    </form>
                </section>

            </main>
            {showWelcome && user.username}
        </div>
    );
}

export default Login;
