import React from 'react';
import style from './Detail.module.css';


export default function Details(props) {

    return (

        <div className={style.container} key={props.id}>

            <div className={style.itemLateral}>

                <img className={style.img} src={props.image} alt="RecipeImage" />

                <h4>Health Score:</h4>

                <div className={style.score}>
                    {props.healthyScore.map((item) => item)}
                </div>

                <h4>Type of diets:</h4>

                <ul className={style.ul_diets} >

                    {props.diets?.map((item, index) => (
                        <li key={index}>{item}</li>
                    ))}

                </ul>

                <h4>Ingresdients:</h4>

                <ul className={style.ul_ingredients}>

                    {props.ingredients?.map((item, index) => (
                        <li key={index}>{item}</li>
                    ))}

                </ul>

            </div>

            <div className={style.itemMain}>

                <div className={style.item_section}>

                    <button className={style.section_btn} onClick={() => props.handleClickBack()}><i className='fa fa-chevron-left' aria-hidden='true'></i></button>

                    <h2>{props.title}</h2>

                </div>

                <p dangerouslySetInnerHTML={{__html: props.summary}}></p>

                <h3>Cooking instructions:</h3>

                <ol>

                    {props.cooking?.map((item, index) => (
                        <li key={index} >{item.step}</li>
                    ))}

                </ol>     
            </div>

        </div>
    );
};
