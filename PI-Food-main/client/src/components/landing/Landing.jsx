import React from 'react';
import { NavLink } from "react-router-dom";
import styles from './Landing.module.css';

export default function Landing(props) {
    return (

        <div className={styles.container}>

            <div className={styles.item_title}>
                <h1>Foodie App</h1>
            </div>

            <div className={styles.item_section}>

                <div className={styles.item}>
                    <div className={styles.item_image}>
                        <img src='https://images.pexels.com/photos/15076700/pexels-photo-15076700.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' alt='section_image'/>
                    </div>
                    <p>
                        Welcome to our website, the perfect place to find inspiration and create delicious dishes in your own kitchen.
                    </p>
                    <NavLink to='/home' className={styles.navlink}>
                        <button onClick={() => {
                            props.getRecipes()
                            console.log('Welcome')
                        }}>
                            Get Start!
                        </button>
                    </NavLink>
                </div>

                <div className={styles.item}>  
                    <div className={styles.item_image}>
                        <img src='https://images.pexels.com/photos/361184/asparagus-steak-veal-steak-veal-361184.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' alt='item_image'/>
                    </div>
                    <ul>
                        <li>Detailed and easy instructions</li>
                        <li>Useful tips to prepare tasty and healthy dishes in a short time</li>
                        <li>Options for different lifestyles: vegetarian, vegan, gluten free and more</li>
                    </ul>
                    
                </div>
                
                <div className={styles.item}>
                    <div className={styles.item_image}>
                        <img src='https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' alt='item_image'/>
                    </div>
                    <p>
                    Our goal is to make cooking easy and fun. Explore our collection of flavors and start cooking like a pro!
                    </p>
                    
                    <NavLink to='/register' className={styles.navlink}>
                        <button onClick={() => console.log('Register')}>Sign up!</button>
                    </NavLink>
                </div>

            </div>
        
        </div>
  )
}
