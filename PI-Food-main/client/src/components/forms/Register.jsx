import React from 'react';
import { useState , useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './Form.module.css';

export default function Register() {

    const navigate = useNavigate();
    
    const dispatch = useDispatch();
    
    const [userData, setUserData] = useState({
        username: '',
        email: '',
        password: '',
    });
    
    const [userError, setUserError] = useState({
        username: '',
        email: '',
        password: '',
    });

    const handleClickBack = () => navigate(-1);

    const validateData = (input) => {
        const regexUsername = /^[a-zA-Z0-9]+$/;
        const regexEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
        const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,10})/;
        const error = {};

        if(input.name === 'username') {
            if(!input.value) error.username = 'Enter the required data';
            else if(!regexUsername.test(input.value)) error.username = 'Enter a valid username';
            return error;
        };

        if(input.name === 'email') {
            if(!input.value) error.email = 'Enter the required data';
            else if(!regexEmail.test(input.value)) error.email = 'Enter a valid email';
            return error;
        };

        if(input.name === 'password') {
            if(!input.value) error.password = 'Enter the required data';
            else if(!regexPassword.test(input.value)) error.password = 'Enter a valid password';
            else if(input.value?.length < 6 && input.value === 0) error.password = 'Enter a password longer than 6 characters';
            return error;
        };

        return;
    }

    const handleInputChange = (e) => {
        setUserData( {...userData, [e.target.name]: e.target.value} );
        setUserError( validateData(e.target) );
    };
    
          
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Clickeaste Register');

        if(!userData.username || !userData.email || !userData.password) {
            window.alert('Enter the required data');
            return;
        }

        if(userError.username || userError.email || userError.password) {
            window.alert('Enter the required data');
            return;
        }
        
        //Axios new user

        await axios.post(`/user/register`, {
            username: userData.username,
            email: userData.email,
            password: userData.password
        } , { 
            withCredentials: true
        })
            .then((res) => {
                window.alert(`User ${userData.username} created successfully`);
                console.log(res.data);
                //return res.data;
            })
            .catch((err) => {
                window.alert('Error: Failed to create user, try again later');
                console.log(err.message);
                return;
                
            });

        

        navigate('/login');

        setUserData({
            username: '',
            email: '',
            password: '',
        });

    };



    return (

        <div className={styles.container}>

            <div className={styles.item}>

                <button onClick={handleClickBack}><i className='fa fa-chevron-left' aria-hidden='true'></i></button>

                <h2>Register new user</h2>

                <button type='submit' form='register'><i className='fa fa-check' aria-hidden='true'></i></button>

            </div>

            <div className={styles.div_container}>
                <form id='register' className={styles.formContainer} onSubmit={handleSubmit} autoComplete="off">

                    <label>
                        <p>Username:</p>
                        <input className={styles.input} type='text' name='username' value={userData.username} placeholder='Enter a username' onChange={handleInputChange} />
                        {userError.username ? <p className={styles.error} >{userError.username}</p> : <p className={styles.noerror}> ... </p>}
                    </label>

                    <label>
                        <p>Email:</p>
                        <input className={styles.input} type='email' name='email' value={userData.email} placeholder='Enter a email@email.com' onChange={handleInputChange} />
                        {userError.email ? <p className={styles.error} >{userError.email}</p> : <p className={styles.noerror}> ... </p>}
                    </label>

                    <label>
                        <p>Password:</p>
                        <input className={styles.input} type='password' name='password' value={userData.password} placeholder='Enter a pa55word' onChange={handleInputChange}  autoComplete="new-password"/>
                        {userError.password ? <p className={styles.error} >{userError.password}</p> : <p className={styles.noerror}> ... </p>}
                    </label>

                </form>
            </div>
            <div className={styles.item} >
                <button type='submit' form='register'><i className='fa fa-check' aria-hidden='true'></i></button>
            </div>
        </div>
    );
};
