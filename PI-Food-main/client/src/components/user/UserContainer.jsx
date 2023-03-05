import React from 'react';
import axios from 'axios';
import { useRef , useState , useEffect } from 'react';
import { useSelector, useDispatch} from 'react-redux';
import { getRecipeDetail, getUserRecipes } from '../../redux/actions/actions';
import { useNavigate } from 'react-router-dom';
import User from './User';
import Loader from '../loader/Loader';
import SearchResults from '../searchresults/SearchResults';
import styles from './User.module.css';

const DEFAULT_IMAGE = 'https://cdn.icon-icons.com/icons2/933/PNG/512/round-account-button-with-user-inside_icon-icons.com_72596.png';

function UserContainer() {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const ref = useRef(null);

    const userDates = useSelector((state) => state.user);
    const userRecipes = useSelector((state) => state.userRecipes);
    const userFavorites = useSelector((state) => state.favoriteRecipes);
    const recipeDetails = useSelector((state) => state.recipeDetails);

    const [user, setUser] = useState({});
    const [recipes, setRecipes] = useState([]);
    const [details, setDetails] = useState(null);
    const [result, setResult] = useState(null);
    const [favorites, setFavorites] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    

    useEffect(() => {
        console.log('init');
        dispatch(getUserRecipes());
            
        setUser(userDates);
        setRecipes(userRecipes);
        setFavorites(userFavorites);

    },[userDates]);

    useEffect(() => {
        console.log('init2');

        setRecipes(userRecipes);
        setFavorites(userFavorites);

    },[userRecipes]);

    console.log(user);
    console.log(userRecipes);
    console.log(recipes);

    const onScroll = () => {
        ref.current.scrollIntoView();    
        console.log('scroll');    
    };

    const getRecipes = () => {
        setIsLoading(true);
        setResult(userRecipes);

        onScroll();

        setTimeout(() => {
            setIsLoading(false);
            
        }, 2000);

    };

    const getDetails = (id) => {
        setIsLoading(true);

        dispatch(getRecipeDetail(id));
    
        setTimeout(() => {
            
            setDetails(recipeDetails);
            navigate(`/recipe/${id}`);
            setIsLoading(false);
      
        }, 2000)
    };

    const onClose = () => {
        setResult(null);
    }

    const deleteUserRecipe = async (id) => {
        console.log('Delete');
        await axios.delete(`http://localhost:3001/user/recipes/${id}` , { withCredentials: true })
            .then((res) => window.alert(res.data))
            .catch((err) => {
                console.log(err.message);
                window.alert(`Error: Can not delete recipe ${id}`);
            });
        dispatch(getUserRecipes());
        onClose();
    };



    return (
        <>
            <div className={styles.patern_container}>
                <div className={styles.container}>

                    <User 
                        key = {user.id}
                        username = {user.username}
                        userimage = {user.image ? user.image : DEFAULT_IMAGE }
                        recipeCount = {userRecipes.length}
                        favCount = {userFavorites.length}
                        getRecipes = {getRecipes}
                    />


                </div>
            </div>

            <div ref={ref}></div>

            {isLoading && <Loader/>}
            
            {!isLoading && result && <SearchResults
                searchedRecipes = {result}
                getRecipeDetails = {getDetails}
                onClose = {onClose}
                deleteUserRecipe = {deleteUserRecipe}
            />}

        </>

    );
};

export default UserContainer;