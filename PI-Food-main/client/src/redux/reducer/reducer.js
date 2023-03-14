import { GET_USER_ACCESS , GET_USER_EXIT , GET_ALL_RECIPES , GET_USER_RECIPES , GET_RECIPE_DETAIL , FILTER_RECIPES , DELETE_RECIPE , GET_DIETS , ORDER_BY_TITLE , ORDER_BY_SCORE } from '../actions/actionType';

const initialState = {
    user: null,
    allRecipes: [],
    userRecipes: [],
    favoriteRecipes: [],
    filteredRecipes: [],
    orderedRecipes: [],
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
                filteredRecipes: action.payload === 'All Diets'
                                    ? []
                                    : state.allRecipes.filter((item) => item.diets.includes(action.payload.toLowerCase()))
            };
        case ORDER_BY_TITLE:
            return {
                ...state,
                orderedRecipes: action.payload === 'upward'
                                    ? state.allRecipes.sort((itemA, itemB) => itemA.title.localeCompare(itemB.title))
                                    : state.allRecipes.sort((itemA, itemB) => itemB.title.localeCompare(itemA.title))
            };
        case ORDER_BY_SCORE:
            return {
                ...state,
                orderedRecipes: action.payload === 'upward'
                                    ? state.allRecipes.sort((itemA, itemB) => itemA.health_score - itemB.health_score)
                                    : state.allRecipes.sort((itemA, itemB) => itemB.health_score - itemA.health_score)
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