import axios from 'axios';
import { GET_USER_ACCESS , GET_ALL_RECIPES , GET_USER_RECIPES , GET_RECIPE_DETAIL , FILTER_RECIPES , DELETE_RECIPE , GET_DIETS } from './actionType';

export function getUserAccess(userData) {
    return async (dispatch) => {
        const user = await axios.post('http://localhost:3001/user/login', userData , { withCredentials: true })
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


export function getAllRecipes(payload) {
    if(payload) return {
        type: GET_ALL_RECIPES,
        payload
    };

    return async (dispatch) => {
        const result = await axios.get('http://localhost:3001/recipes', { withCredentials: true })
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
        const result = await axios.get('http://localhost:3001/user/recipes', { withCredentials: true })
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
        const result = await axios.get(`http://localhost:3001/recipes/${id}`, { withCredentials: true })
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

/* export function deleteRecipe(id) {
    return async (dispatch) => {
        await axios.delete(`http://localhost:3001/user/recipes/${id}` , { withCredentials: true })
            .then((res) => res.data)
            .catch((err) => {
                console.log(err.message);
                window.alert(`Error: Can not delete recipe ${id}`);
        });
        const result = await axios.get(`http://localhost:3001/user/recipes`)
            .then((res) => res.data)
            .catch((err) => {
                console.log(err.message);
                window.alert('Error updating user recipes. Try again');
        });

        dispatch({
            type: DELETE_RECIPE,
            payload: result
        });
    };
};
 */
export function getDiets() {
    return async (dispatch) => {
        const result = await axios.get('http://localhost:3001/diets')
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