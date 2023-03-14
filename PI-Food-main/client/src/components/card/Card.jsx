import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import style from './Card.module.css'

function Card(props) {

    //console.log(props);

    return (
        
        <Link to={`/recipe/${props.id}`} className={style.link} onClick={() => props.getRecipeDetails(props.id)}>

            <div className={style.item}>

                <h4>{props.title}</h4>

                <p>{props.diets}</p>

                <p>Healthy Score: {props.score}</p>
                
                {!props.image 
                    ? <i id={style.spinner} className='fas fa-spinner-third'></i> 
                    : <img src={props.image} alt="RecipeImage" />
                }

            </div>

        </Link>

    );
};

export default Card;