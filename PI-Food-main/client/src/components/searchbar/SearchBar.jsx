import React from 'react';
import { useState } from 'react';
import styles from './Search.module.css';

export default function SearchBar(props) {

    //const [recipeID, setRecipeID] = useState('');
    const [recipeKey, setRecipeKey] = useState('');

    const handleInputChange = (e) => {
        //setRecipeID(e.target.value);
        setRecipeKey(e.target.value);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') props.onSearch(recipeKey);
        setRecipeKey('');
    };

    const handleOnClick = (e) => {
        props.onSearch(recipeKey);
        setRecipeKey('');
    };
    

    return (
        <div className={styles.container}>

            <input 
                id='searchInput' className={styles.input} 
                type='text' 
                placeholder='Search a keyword or id...' 
                onChange={handleInputChange} 
                onKeyDown={handleKeyPress}
            />

            <a onClick={handleOnClick} className={styles.button}>
                <i className='fas fa-search' aria-hidden='true' id={styles.icon}></i>
            </a>

        
        </div>
    );
};
