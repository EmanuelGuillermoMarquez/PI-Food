import React from 'react';
import { useState , useEffect } from 'react';
import { connect, useSelector, useDispatch} from 'react-redux';
import { getUserRecipes } from '../../redux/actions/actions';
import { Link } from 'react-router-dom';
import Loader from '../loader/Loader';
import styles from './User.module.css';


function User(props) { 

    const recipeCount = props.recipeCount;
    const favCount = props.favCount;
    console.log(props);

    return (
        <>
            <div className={styles.user}>
                <div>
                    <img src={props.userimage} alt="userProfile" />
                    <h2>{props.username}</h2>
                    <p>Welcome back {props.username}, enjoy your recipes!</p>
                </div>                
            </div>
            <div className={styles.info}>
                <div>
                    <h4>User Recipes</h4>
                    <h5>{recipeCount}</h5>
                </div>
                <div>
                    <h4>Favorites</h4>
                    <h5>{favCount}</h5>
                </div>
            </div>
            <div className={styles.btn}>
                <button onClick={() => props.getRecipes()}>Get Recipes</button>
                <Link to={`/user/create`} className={styles.link}>
                    <button>New Recipe</button>
                </Link>
                <Link to={`/user/update`} className={styles.link}>
                    <button>Update</button>
                </Link>
            </div>
        </>
    );
};

export default User;