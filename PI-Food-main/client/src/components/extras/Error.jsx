import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Extra.module.css';

export default function Error() {

    const navigate = useNavigate();
    
    const handleClickBack = () => navigate(-1);
  
    return ( 

        <div className={styles.container_error}>

            <div className={styles.item}>
                <div>
                    <img src='https://cdn-icons-png.flaticon.com/512/3980/3980131.png' alt='error_image'/>
                </div>

                <div className={styles.item_description}> 

                    <h1>Error 404 | Not Found </h1>

                    <h3>An unexpected error has occurred, please try again later.</h3>

                    <h4> Sorry, redirect to the previous page or home.</h4>

                    <button onClick={handleClickBack}>
                            <i className='fa fa-chevron-left' aria-hidden='true'></i>
                    </button>
                    
                </div>

            </div>
            
        </div>
    
   );
}
