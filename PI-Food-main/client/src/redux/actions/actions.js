import axios from 'axios';
import { GET_USER_ACCESS , GET_USER_EXIT , GET_ALL_RECIPES , GET_USER_RECIPES , GET_RECIPE_DETAIL , FILTER_RECIPES , DELETE_RECIPE , GET_DIETS } from './actionType';

export function getUserAccess(userData) {
    return async (dispatch) => {
        const user = await axios.post('/user/login', userData , { withCredentials: true })
            .then((res) => {
                console.log(res.data);
                return res.data.user;
            })
            .catch((err) => {
                console.log(err);
                return null;
            }); 

        dispatch({
            type: GET_USER_ACCESS,
            payload: user
        });
    };
};

export function getUserExit() {
    return async (dispatch) => {
        await axios.post('/user/logout', { withCredentials: true })
            .then((res) => window.alert(res.data))
            .catch((err) => window.alert(`Error Loggin Out: ${err}`));

        dispatch({
            type: GET_USER_EXIT,
            payload: null
        });
    };
};


export function getAllRecipes(payload) {
    if(payload) return {
        type: GET_ALL_RECIPES,
        payload
    };

    return async (dispatch) => {
        const result = await axios.get('/recipes', { withCredentials: true })
        .then((res) => res.data)
        .catch((err) => {
            console.log(err.message);
            window.alert(`Error: ${err.message}. Try again`);
            return [];
        });

        dispatch({
            type: GET_ALL_RECIPES,
            payload: result
        });
    };
};

export function getUserRecipes() {
    return async (dispatch) => {
        const result = await axios.get('/user/recipes', { withCredentials: true })
            .then((res) => res.data)
            .catch((err) => {
                console.log(err.message);
                return [];
        });

        dispatch({
            type: GET_USER_RECIPES,
            payload: result
        });
    };
};

export function getRecipeDetail(id) {
    return async (dispatch) => {
        const result = await axios.get(`/recipes/${id}`, { withCredentials: true })
            .then((res) => res.data)
            .catch((err) => {
                console.log(err.message);
                window.alert(`Error: ${err.message}. Try again`);
                /* navigate('/error'); */
        });

        dispatch({
            type: GET_RECIPE_DETAIL,
            payload: result
        });
    };
};

export function filterRecipes(value) {
    // Filtrar por el tipo de dieta
    return {
        type: FILTER_RECIPES,
        payload: value
    }
};

export function getDiets() {
    return async (dispatch) => {
        const result = await axios.get('/diets')
            .then((res) => res.data)
            .catch((err) => {
                console.log(err.message);
                window.alert('Error: Get Diets');
        });

        const diets = result.map((item) => item.name);

        dispatch({
            type: GET_DIETS,
            payload: diets
        });
    };
};