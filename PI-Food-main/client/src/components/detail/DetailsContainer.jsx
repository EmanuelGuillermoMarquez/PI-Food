import React from 'react';
import axios from 'axios';
import { useState , useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams , useNavigate } from 'react-router-dom';
import { getRecipeDetail } from '../../redux/actions/actions';
import Details from './Details';
import Loader from '../loader/Loader';


const DEFAULT_IMAGE = 'https://images.pexels.com/photos/1651166/pexels-photo-1651166.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';

function DetailsContainer(props) {

    const {id} = useParams();

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const details = useSelector((state) => state.recipeDetails);

    const [recipeDetails, setRecipeDetails] = useState(details);

    useEffect(() => {

        console.log('init');
        
        dispatch(getRecipeDetail(id));

        setRecipeDetails(details);

        
    }, [ id ]);

    console.log(id);

    useEffect(() => {

        console.log('init');

        setRecipeDetails(details);

        
    }, [ details ]);
    
    console.log(details);

    const handleClickBack = () => navigate(-1);

    const getScore = () => {
        const str = recipeDetails.health_score?.toString()
        const count = recipeDetails.health_score ? parseInt(str[0]) : 0;
        let aux = 0;
        const score = [];
        while(aux !== count) {
            score.push((<i key={aux} className='fas fa-star' aria-hidden='true' ></i>));
            aux ++;
        };

        // Aca la idea es que me muestre estrellas vacias por lo que faltaba para llegar a 5 pero no se esta visualizando y ademas de la API vienen con numero de 0 a 100 creo

        /* if(count < 5) {
            let aux = 0;
            let rest = 5 - count;
            while(aux !== rest) {
                score.push((<i key={count+aux} className='fas fa-star-o' aria-hidden='true' ></i>)); 
                aux ++;
            };
        } */
        return score;
    };

    const healthyScore = getScore();


    return (

        <>

            {!recipeDetails.title && <Loader/>}
        
            {recipeDetails.title && recipeDetails.id == id &&
                <Details
                key = {id}
                image = {recipeDetails.image ? recipeDetails.image : DEFAULT_IMAGE}
                healthyScore = {healthyScore}
                diets = {recipeDetails.diets?.map((item) => item[0].toUpperCase() + item.slice(1))}
                ingredients = {recipeDetails.instructions?.ingredients.map((item) => item[0].toUpperCase() + item.slice(1))}
                title = {recipeDetails.title}
                summary = {recipeDetails.summary}
                cooking = {recipeDetails.instructions?.cooking}
                handleClickBack = {handleClickBack}
            />}
        
        </>

    );
};

export default DetailsContainer;

