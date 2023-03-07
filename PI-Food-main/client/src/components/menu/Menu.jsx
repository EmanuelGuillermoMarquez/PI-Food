import React from 'react';
import { useRef } from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import styles from './Menu.module.css';

export default function Menu(props) {

    const user = useSelector((state) => state.user);
    const labelRef = useRef();

    const handlerClick = (e) => {
        e.preventDefault();
        labelRef.current.click();
        console.log(labelRef.current);
    }

    return (
        <div className={styles.container}>
            <input type="checkbox" id={styles.active}/>
            <label ref={labelRef} htmlFor={styles.active} className={styles.appMenuBtn}></label>
            <div className={styles.appWrapper}>
                
                <ul onClick={handlerClick}>
                    
                    {user?.username && <NavLink to={`/user/`} className={styles.navlink}>
                        <li>{user?.username}</li>
                    </NavLink>}
                    
                    <NavLink to='/login' className={styles.navlink}>
                        <li>Log In</li>
                    </NavLink>
                    
                    <NavLink to='/register' className={styles.navlink}>
                        <li>Register</li>
                    </NavLink>
                    
                    <NavLink to='/about' className={styles.navlink}>
                        <li>About</li>
                    </NavLink>

                    {user?.username &&
                        <li onClick={() => props.logOut()}>
                            <i className='fas fa-power-off'></i>
                        </li>
                    }

                </ul>
                
            </div>
        </div>
    );
};
