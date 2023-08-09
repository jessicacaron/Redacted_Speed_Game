import lock from '../icons/lock-closed.svg';
import person from '../icons/person.svg';
import mail from '../icons/mail.svg';
import axios from 'axios';
import { SHA256 } from 'crypto-js';
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from '../App'




function Register() {
    const navigate = useNavigate();

    //user login success
    const [user, setUser] = useState({ username: '', email: '' });

    //popup login
    const [isPopupActive, setIsPopupActive] = useState(true);
    let { loggedInUser, setLoggedInUser } = useContext(AppContext);

    //wrapper
    const [isWrapperActive, setIsWrapperActive] = useState(true);

    function handleRegisterClick() {
        setIsWrapperActive(true);
    }

    function handleLoginClick() {
        setIsWrapperActive(false);
    }

    //popup login click
    function handleLoginButtonClick() {
        navigate("/");
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
            setLoggedInUser("" + username);


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

        navigate(`/lobby?username=${username}`); // Redirect to lobby with username as query parameter

    }

    


    return (
        <div className="App">
            <div className="title">
                <h1>SPEED</h1>
                <h2>CLASSIC &</h2>
                <h2>CALIFORNIA</h2>
            </div>

            <main className={`wrapper ${isWrapperActive ? 'active' : ''} ${isPopupActive ? 'active-popup' : ''}`}>


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
                                <img className="icon-image" src={mail} alt="Mail Icon"/>
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

export default Register;
