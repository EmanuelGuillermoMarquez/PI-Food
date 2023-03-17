import React from 'react';
import { useState , useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { redirect, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getUserRecipes } from '../../redux/actions/actions';
import styles from './Form.module.css';

export default function CreateRecipe() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const ingredientRef = useRef();
    const instructionRef = useRef();

    const diets = useSelector((state) => state.diets);

    /* function validateUser (input) {
        const regexEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
        const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,10})/;
        const error = {};

        if (!input.email) error.email = "Debe ingresar su email";
        if (!regexEmail.test(input.email)) error.email = "Ingrese un email valido";
        //if (input.email?.length > 35) error.email = "El usuario no puede contener mas de 35 caracteres";

        if (!input.password) error.password = "Debe ingresar su contraseña";
        if (!regexPassword.test(input.password)) error.password = "Ingrese una contraseña valida";
        if (input.password?.length < 6 && input.password === 0) error.password = "Ingrese una contraseña valida mayor a 6 caracteres";
        //if (input.password?.length > 10) error.password = "Ingrese una contraseña valida menor a 10 caracteres";
        return error;
    } */
    
    const initialState = {
        title: '',
        summary: '',
        health_score: '',
        ingredients: [],
        cooking:[], 
        diets: []
    };

    const initialError = {
        title: '',
        summary: '',
        health_score: ''
    };
    
    const checkStatus = new Array(13).fill(false); // Esto esta hardcodeado tratar se hacerlo con las diets.length

    const [newRecipe, setNewRecipe] = useState(initialState);

    const [errorState, setErrorState] = useState(initialError);

    const [isChecked, setIsChecked] = useState(checkStatus); 

    const countSteps = newRecipe.cooking.length +1;

    const validateData = (value) => {

        const regexTitle = /^[a-zA-Z\s]{2,20}$/i;
        const regexSummary = /^[a-zA-Z0-9\s]{10,255}$/i;
        const regexScore = /^[1-9]$/;

        const error = {};

        if(value.name === 'title') {
            if(!value.value) error.title = 'Enter a title';
            else if(!regexTitle.test(value.value)) error.title = 'Enter a correct title between 2 and 20 characters';
            return error;
        }
        
        if(value.name === 'summary') {
            if(!value.value) error.summary = 'Enter a summary';
            else if(!regexSummary.test(value.value)) error.summary = 'Enter a correct summary between 10 and 255 characters';
            return error;
        }

        if(value.name === 'health_score') {
            if(!value.value) error.health_score = 'Enter a number';
            else if(!regexScore.test(value.value)) error.health_score = 'Enter a number between 1 and 9';
            return error;
        }

        return;
    }


    const handleClickBack = () => navigate(-1);

    const handleInputChange = (e) => {
        setNewRecipe( {...newRecipe, [e.target.name]: e.target.value} );
        setErrorState(validateData(e.target));
    };

    const handleCheckboxChange = (e, position) => {
        
        const updatedCheckedState = isChecked.map((item, index) => index === position ? !item : item);
        
        if(isChecked[position]){
            setIsChecked(updatedCheckedState);
            const deleteDiet = newRecipe.diets.filter((item) => item !== e.target.value);
            setNewRecipe({...newRecipe , diets: deleteDiet});
            console.log(deleteDiet);
            return;
        };

        setIsChecked(updatedCheckedState);

        setNewRecipe( {...newRecipe, diets: [...newRecipe.diets, e.target.value]} );

        console.log(e.target.value);
    
    };
    
    const handleOnClickIngredient = (e) => {
        e.preventDefault();
        console.log(ingredientRef.current.value)
        setNewRecipe( {...newRecipe, ingredients: [...newRecipe.ingredients, ingredientRef.current.value]} );

        ingredientRef.current.value = null;
        ingredientRef.current.focus();
    };

    const handleOnClickInstruction= (e) => {
        e.preventDefault();
        console.log(instructionRef.current.value)
        setNewRecipe( {...newRecipe, cooking: [...newRecipe.cooking, {number: countSteps, step: instructionRef.current.value}]} );

        instructionRef.current.value = null;
        instructionRef.current.focus();
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log('Clickeaste Create');

        if(!newRecipe.title || !newRecipe.summary || !newRecipe.health_score) {
            window.alert('Enter the required data');
            return;
        }

        if(errorState.title || errorState.summary || errorState.health_score) {
            window.alert('Enter the required data');
            return;
        }

        const recipeData = {
            title: newRecipe.title,
            summary: newRecipe.summary,
            health_score: parseInt(newRecipe.health_score),
            instructions: {
                ingredients: newRecipe.ingredients,
                cooking: newRecipe.cooking
            },
            diets: newRecipe.diets
        };

        console.log(recipeData);

        // Axios

        await axios.post('/user/recipes', recipeData, { 
            withCredentials: true,
        })
        .then((res) => {
            window.alert(`${recipeData.title} recipe created successfully`);
            console.log(res.data);
            //return res.data;
        })
        .catch((err) => {
            window.alert('Error: Failed to create recipe, try again later');
            console.log(err.message);
        });

        dispatch(getUserRecipes());

        setNewRecipe(initialState);
        setIsChecked(checkStatus);
        navigate('/user');

    };



    return (

        <div className={styles.container}>
            <div className={styles.item}>
                <button onClick={handleClickBack}><i className='fa fa-chevron-left' aria-hidden='true'></i></button>
                <h2>Enter the details of your new food recipe</h2>
                <button type='submit' form='createRecipe'><i className='fa fa-check' aria-hidden='true'></i></button>
            </div>
            <div className={styles.div_container}>
                <form id='createRecipe' className={styles.formContainer} onSubmit={handleSubmit} >

                    <label>
                        <p>Title:</p>
                        <input className={styles.input} type='text' name='title' value={newRecipe.title} placeholder='Enter a title' onChange={handleInputChange} />
                        {errorState.title ? <p className={styles.error} >{errorState.title}</p> : <p className={styles.noerror}> ... </p>}
                    </label>

                    <label>
                        <p>Healthy score:</p>
                        <input className={styles.input} type='number' /* min='1' max='9'  */name='health_score' value={newRecipe.health_score} placeholder='Enter a number from 0 to 9' onChange={handleInputChange} /* required *//>
                        {errorState.health_score ? <p className={styles.error} >{errorState.health_score}</p> : <p className={styles.noerror}> ... </p>}
                    </label>

                    <label>
                        <p>Summary:</p>
                        <textarea name='summary' rows='5' cols='50' value={newRecipe.summary} placeholder='Enter a summary' onChange={handleInputChange} ></textarea>
                        {errorState.summary ? <p className={styles.error} >{errorState.summary}</p> : <p className={styles.noerror}> ... </p>}
                    </label>
                    
                    <p>Ingredients:</p>
                    <label className={styles.label}>
                        <p>New ingredient:</p>
                        <input className={styles.specialInput} ref={ingredientRef} type='text' name='ingredients' placeholder='Enter a ingredient' />
                        <button className={styles.button} onClick={handleOnClickIngredient}>
                            <i className='fa fa-plus' aria-hidden='true'></i>
                        </button>
                    </label>

                    <p>Cooking Instructions:</p>
                    <label className={styles.label}>
                        <p>Step number {countSteps}:</p>
                        <input className={styles.specialInput} ref={instructionRef} type='text' name='cooking' placeholder='Enter a cooking step' />
                        <button className={styles.button} onClick={handleOnClickInstruction}>
                            <i className='fa fa-plus' aria-hidden='true'></i>
                        </button>
                    </label>
                    
                    <p>Select type of diets:</p>
                    <ul className={styles.ulDiets}>
                        {diets.map((diet, index) => (
                            <li key={index}>
                                <label>
                                    <input className={styles.specialInput} type='checkbox' name='diets' value={diet} onChange={(e) => handleCheckboxChange(e,index)} checked={isChecked[index]}/>{diet}
                                </label>
                            </li>
                        ))}
                    </ul>
                </form>
            </div>
            <div className={styles.item} >
                <button type='submit' form='createRecipe'><i className='fa fa-check' aria-hidden='true'></i></button>
            </div>
        </div>
    );
};
