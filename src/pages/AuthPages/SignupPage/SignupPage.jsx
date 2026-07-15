import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Signup.module.css';
import ErrorMessageBox from '../../../components/ErrorMessageBox/ErrorMessageBox.jsx';
import Input from '../../../components/Input/Input.jsx'
import Button from "../../../components/Button/Button.jsx";
import Logo from "../../../assets/Logo.png";
import image from "../../../assets/Workplace.jpg"

const SignupPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState(''); // New state for password confirmation
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleSignup = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setIsLoading(true);

        // Check if passwords match
        if (password !== passwordConfirmation) {
            setErrorMessage('Passwords do not match.');
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:8000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password, password_confirmation: passwordConfirmation }), // Include password confirmation
            });

            if (response.ok) {
                navigate('/login'); // Redirect to Login page after successful signup
            } else {
                const errorData = await response.json();
                setErrorMessage(errorData.message || 'Signup failed.');
                setIsLoading(false);
            }
            // eslint-disable-next-line no-unused-vars
        } catch (error) {
            setErrorMessage('An error occurred while signing up.');
        }
    };

    return (
        <div className={`clear-both flex w-screen h-screen ${styles.background}`}>
            <div className={`float-left w-2/5 flex flex-col justify-between content-center p-5`}>
                <div className={`rounded-2xl w-15 h-15 ml-3`}>
                    <img className={`rounded-full cursor-pointer ${styles.logo}`}
                    src={Logo}
                    alt={""}/>
                </div>
                <div className={`w-full justify-items-center`}>
                    <p className={`mb-0 ${styles.title}`}>Create an Account</p>
                    <p className={`${styles.subtitle}`}>Create an account and own that job</p>
                </div>

                <div className={`w-full flex-wrap content-center justify-items-center`}>
                    <form onSubmit={handleSignup} className={`w-3/5`}>
                        <Input
                            label="Full name:"

                            type="text"
                            autocomplete="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            />

                        <Input
                            label="Email address:"

                            type="email"
                            autocomplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}

                            autoCapitalize="off"
                            autoCorrect="off"
                        />

                        <Input
                            label="Password:"

                            type="password"
                            autocomplete="new-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <Input
                            label="Confirm password:"

                            type="password"
                            value={passwordConfirmation}
                            onChange={(e) => setPasswordConfirmation(e.target.value)}
                        />

                        <Button
                            type={"submit"}
                            label="Create an Account" loading={isLoading}/>
                    </form>
                </div>

                <div className={`ml-7`}>
                    <p className={`${styles.aap} italic`}>Already a Portfolioer? {' '}
                        <a href="/login" className={`text-black no-underline hover:underline`}>
                            Login
                        </a>
                    </p>
                </div>

                {errorMessage && <ErrorMessageBox message={errorMessage}/>}
            </div>

            <div className={`w-3/5 h-full flex flex-col justify-center items-center bg-black overflow-hidden drop-shadow`}>
                <img
                    src={image}
                    alt={""}
                    className={`${styles.image} w-fit h-fit`}
                />
            </div>
        </div>
    );
};

export default SignupPage;