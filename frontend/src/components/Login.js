import './LoginRegister.css';
import lock from '../icons/lock-closed.svg';
import person from '../icons/person.svg';
import axios from 'axios';
import { SHA256 } from 'crypto-js';
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from '../App'



let showError = "errorOff";

function Login() {
    let { loggedInUser, setLoggedInUser } = useContext(AppContext);

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

    async function handleLoginFormSubmit(event) {
        event.preventDefault();

        const form = event.target;
        const username = form.elements.username.value;
        const password = form.elements.password.value;
        try {
            // Send initial POST request with only the username
            const response = await axios.post('http://localhost:6969/auth/ULogin', { username });
            const { userSalt: salt } = response.data; // Retrieve the salt from the server's response
            setLoggedInUser("" + username);
            console.log("" + username);
            console.log("User: " + loggedInUser);


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

            console.log("Loggedinuser: " + loggedInUser);
            setIsPopupActive(false);

            //navigate to lobby
            navigate(`/lobby?username=${username}`); // Redirect to lobby with username as query parameter


        } catch (error) {
            console.error('Error logging user', error);
            // Handle error during login
            setErrorMessage("Incorrect Username or Password!");
        }

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


                

            </main>
            {user.username}
        </div>
    );
}

export default Login;
