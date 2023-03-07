import React from 'react';
import { useState , useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getRecipeDetail, getUserRecipes } from '../../redux/actions/actions';
import styles from './Form.module.css';

export default function UpdateRecipe() {

    const navigate = useNavigate();
    
    const dispatch = useDispatch();
    const ingredientRef = useRef();
    const instructionRef = useRef();

    const recipes = useSelector((state) => state.userRecipes);
    const details = useSelector((state) => state.recipeDetails);
    const diets = useSelector((state) => state.diets);

    const [updateRecipe, setUpdateRecipe] = useState(null);
    const [atributte, setAtributte] = useState(null);
    const [value, setValue] = useState('');


    const handleClickBack = () => navigate(-1);

    const handleSelectRecipe = (value) => {
        console.log(value);
        dispatch(getRecipeDetail(value));
        setUpdateRecipe(value);
    };

    const handleSelectAtributte = (value) => {
        console.log(value);
        setAtributte(value);
        if(value === 'cooking') setValue([]);
    };

    const handleOnChange = (e) => {

        if(atributte === 'health_score') {
            setValue(parseInt(e.target.value));
        }
        else{
            setValue(e.target.value);
        };
    };

    const handleOnClick = (e) => {
        e.preventDefault();

        if(atributte === 'ingredients') {
            setValue([...value, ingredientRef.current.value]);
            ingredientRef.current.value = null;
            ingredientRef.current.focus();
        }
        else if(atributte === 'cooking') {
            const count = value.length +1;
            setValue([...value, {number: count , step: instructionRef.current.value}]);
            instructionRef.current.value = null;
            instructionRef.current.focus();
        };
        
    };


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
    
          
    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log('Clickeaste Update');

        
        const recipeData = {
            atributte,
            value
        };
        
        if(atributte === 'ingredients') {
            recipeData.atributte = 'instructions';
            recipeData.value = {
                ingredients: value,
                cooking: details.instructions.cooking
            };
        };
        if(atributte === 'cooking') {
            recipeData.atributte = 'instructions';
            recipeData.value = {
                ingredients: details.instructions.ingredients,
                cooking: value
            };
        };
        

        console.log(recipeData);

        // Axios

        await axios.put(`/user/recipes/${updateRecipe}`, recipeData , { 
            withCredentials: true
        })
            .then((res) => {
                window.alert(`${details.title} recipe updated successfully`);
                console.log(res.data);
                //return res.data;
            })
            .catch((err) => {
                window.alert('Error: Failed to update recipe, try again later');
                console.log(err.message);
            });

        dispatch(getUserRecipes());
        dispatch(getRecipeDetail(updateRecipe));

        setUpdateRecipe(null);
        setAtributte(null);
        setValue('');
        
        navigate('/user');
    };



    return (

        <div className={styles.container}>

            <div className={styles.item}>

                <button onClick={handleClickBack}><i className='fa fa-chevron-left' aria-hidden='true'></i></button>

                <h2>Select a recipe to update</h2>

                <button type='submit' form='updateRecipe'><i className='fa fa-check' aria-hidden='true'></i></button>

            </div>
            <div className={styles.div_container}>
                <form id='updateRecipe' className={styles.formContainer} onSubmit={handleSubmit} >

                    <div className={styles.select}>

                        <select name='recipe' onChange={(e) => handleSelectRecipe(e.target.value)}>

                            <option defaultValue={null} >Select recipe...</option>

                            {recipes.map((item, index) => (
                                <option key={index} value={item.id}>{item.title}</option>
                            ))}
                        
                        </select>

                        <select name='atributte' onChange={(e) => handleSelectAtributte(e.target.value)}>
                            <option defaultValue={null} >Select atributte...</option>
                            <option value={'title'}>Title</option>
                            <option value={'summary'}>Summary</option>
                            <option value={'health_score'}>Healthy score</option>
                            <option value={'ingredients'}>Ingredients</option>
                            <option value={'cooking'}>Cooking instructions</option>
                            {/* <option value={'diets'}>Diets</option> */}
                        </select>

                    </div>

                    {atributte === 'title' && 
                        
                        <label>
                        <p>New summary:</p>
                        <input className={styles.input} type='text' name='title' value={value} placeholder='Enter a new value' onChange={handleOnChange} required/>
                        </label>
                       
                    }
                    {atributte === 'summary' && 
                        
                        <label>
                        <p>New summary:</p>
                        <textarea name='summary' rows='5' cols='50' value={value} placeholder='Enter a new value' onChange={handleOnChange} required></textarea>
                        </label>
                        
                    }
                    {atributte === 'health_score' && 
                        
                        <label>
                        <p>New healthy score:</p>
                        <input className={styles.input} type='number' min='1' max='9' name='health_score' value={value} placeholder='Enter a new value' onChange={handleOnChange} required/>
                        </label>
                        
                    }
                    {atributte === 'ingredients' && 
                        
                        <label>
                        <p>New ingredients:</p>
                        <input className={styles.specialInput2} type='text' name='ingredients' placeholder='Enter a new value' ref={ingredientRef} />
                        <button className={styles.button} onClick={handleOnClick}><i className='fa fa-plus' aria-hidden='true'></i></button>
                        </label>
                        
                    }
                    {atributte === 'cooking' && 
                        
                        <label>
                        <p>New cooking instructions:</p>
                        <input className={styles.specialInput2} type='text' name='cooking' placeholder='Enter a new value' ref={instructionRef} />
                        <button className={styles.button} onClick={handleOnClick}><i className='fa fa-plus' aria-hidden='true'></i></button>
                        </label>
                        
                    }

                    {/* Implementar funcion para modificar el tipo de dietas */}

                </form>
            </div>
            <div className={styles.item} >
                <button type='submit' form='updateRecipe'><i className='fa fa-check' aria-hidden='true'></i></button>
            </div>
        </div>
    );
};
