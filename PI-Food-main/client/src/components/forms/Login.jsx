import React from 'react';
import { useState , useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styles from './Form.module.css';

export default function Login(props) {

    const navigate = useNavigate();
    
    const [userData, setUserData] = useState({
      email: '',
      password: '',
    });
    
    const [userError, setUserError] = useState({
      email: '',
      password: '',
    });
    
    const handleClickBack = () => navigate(-1);
    
    function validateUser (input) {
      const regexEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
      const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,10})/;
      const error = {};

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
      setUserError( validateUser(e.target) );
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      console.log('Clickeaste Login');
      props.userLogIn(userData);

    }
    
  
    return (
        <div className={styles.container}>
          
          <div className={styles.item}>
            <button onClick={handleClickBack}><i className='fa fa-chevron-left' aria-hidden='true'></i></button>

            <h1 >Foodie App Login</h1>

            <button type='submit' form='login'><i className='fa fa-check' aria-hidden='true'></i></button>

          </div>

        
          <div className={styles.div_container} >

              <form id='login' className={styles.formContainer} onSubmit={handleSubmit} autoComplete="off">
                  
                <label>
                  <p>Email:</p>
                  <input className={styles.input} type='email' name='email' value={userData.email} placeholder='Enter a email@email.com' onChange={handleInputChange} required />
                  {userError.email ? <p className={styles.error} >{userError.email}</p> : <p className={styles.noerror}> ... </p>}
                </label>

                <label>
                  <p>Password:</p>
                  <input className={styles.input} type='password' name='password' value={userData.password} placeholder='Enter a pa55word' onChange={handleInputChange} required autoComplete="new-password"/>
                  {userError.password ? <p className={styles.error} >{userError.password}</p> : <p className={styles.noerror}> ... </p>}
                </label>
                      
              </form>
          </div>

          <div className={styles.item} >
                <button type='submit' form='login'><i className='fa fa-check' aria-hidden='true'></i></button>
            </div>

        </div>
    );
};