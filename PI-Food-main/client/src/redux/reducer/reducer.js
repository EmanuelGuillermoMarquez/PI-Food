import { GET_USER_ACCESS , GET_USER_EXIT , GET_ALL_RECIPES , GET_USER_RECIPES , GET_RECIPE_DETAIL , FILTER_RECIPES , DELETE_RECIPE , GET_DIETS } from '../actions/actionType';

const initialState = {
    user: null,
    allRecipes: [],
    userRecipes: [],
    favoriteRecipes: [],
    filteredRecipes: [],
    recipeDetails: {},
    diets:[]
};

const reducer = (state = initialState, action) => {
    switch(action.type) {
        case GET_USER_ACCESS:
            return {
                ...state,
                user: action.payload
            };
        case GET_USER_EXIT:
            return {
                ...state,
                user: action.payload
            };
        case GET_ALL_RECIPES:
            return {
                ...state,
                allRecipes: action.payload
            };
        case GET_USER_RECIPES:
            return {
                ...state,
                userRecipes: action.payload
            };
        case GET_RECIPE_DETAIL:
            return {
                ...state,
                recipeDetails: action.payload
            };
        case FILTER_RECIPES:
            return {
                ...state,
                filteredRecipes: state.allRecipes.filter((item) => item.diets.include(action.payload))
            };
        case DELETE_RECIPE:
            return {
                ...state,
                userRecipes: action.payload
            };
        case GET_DIETS:
            return {
                ...state,
                diets: action.payload
            };
        default:
            return {...state};
    };
};

export default reducer;