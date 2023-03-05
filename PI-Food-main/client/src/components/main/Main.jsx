import React from "react";
import { NavLink } from "react-router-dom";
import styles from './Main.module.css';

export default function Main() {

    return (
        
        <div className={styles.container}>

            <div className={styles.item}>
                <h1>Healthy and fresh recipes for every day</h1>
                <h4>More than 5000 healthy and delicious meals...</h4>
                <div>
                    <NavLink to='/login' className={styles.navlink}>
                        <button onClick={() => null}>Log In</button>
                    </NavLink>
                </div>
            </div>
            
        </div>
    );

};
