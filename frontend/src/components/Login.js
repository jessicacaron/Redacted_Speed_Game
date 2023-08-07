import './LoginRegister.css';
import lock from '../icons/lock-closed.svg';
import person from '../icons/person.svg';
import axios from 'axios';
import { SHA256 } from 'crypto-js';
import { useState } from "react";
import { useNavigate } from "react-router-dom";


let showError = "errorOff";

function Login() {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState("");

    //document.getElementById("errorMessage").style.display = "none";


    //user login success
    const [user, setUser] = useState({ username: '', email: '' });

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
        //form.reset();

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

            //navigate to lobby
            navigate(`/lobby?username=${username}`); // Redirect to lobby with username as query parameter


        } catch (error) {
            console.error('Error logging user', error);
            // Handle error during login
            setErrorMessage("Incorrect Username or Password!");
        }

        // Reset the form
        //form.reset();
    }


    return (
        <div className="App">
            <div className="title">
                <h1>SPEED</h1>
                <h2>CLASSIC &</h2>
                <h2>CALIFORNIA</h2>
            </div>
            <main className={`wrapper ${isWrapperActive ? 'active' : ''} ${isPopupActive ? 'active-popup' : ''}`}>
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
                        <button type="submit" className="button">Login</button>
                        {errorMessage && <div className="error"> {errorMessage} </div>}
                        <div className="login-register">
                            <p>Don't have an account? <button className="register-link" onClick={handleRegisterClick}>
                                Register
                            </button>
                            </p>
                        </div>
                    </form>
                </section>


                <section className="form-box register">
                    <h2>Register</h2>
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

                        <button type="submit" className="button">Register</button>

                        <div className="login-register">
                            <p>Already have an account? <button className="login-link" onClick={handleLoginButtonClick}>
                                Login
                            </button>
                            </p>
                        </div>
                    </form>
                </section>

            </main>
            {user.username}
        </div>
    );
}

export default Login;
