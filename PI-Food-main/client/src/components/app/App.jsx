import React from 'react';
import axios from 'axios';
import { useState , useEffect } from 'react';
import { useNavigate, useLocation, Routes , Route , NavLink, Navigate } from 'react-router-dom';
import { useDispatch , useSelector } from 'react-redux';
import { getAllRecipes , getDiets, getUserAccess, getRecipeDetail, getUserExit } from '../../redux/actions/actions';

import Login from '../forms/Login';
import NavBar from '../navbar/NavBar';
import Landing from '../landing/Landing';
import CardContainer from '../card/CardContainer';
import Loader from '../loader/Loader';
import DetailsContainer from '../detail/DetailsContainer';
import UserContainer from '../user/UserContainer';
import CreateRecipe from '../forms/CreateRecipe';
import UpdateRecipe from '../forms/UpdateRecipe';
import Register from '../forms/Register';
import About from '../extras/About';
import Error from '../extras/Error';

import styles from './App.module.css';

axios.defaults.baseURL = 'http://localhost:3001';
 
function App() {

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);

  const recipes = useSelector((state) => state.allRecipes);

  const recipeDetails = useSelector((state) => state.recipeDetails);
  
  const [userAccess, setUserAccess] = useState(false);

  const [searchedRecipes, setSearchedRecipes] = useState(null);
  
  const [keyword, setKeyword]  = useState(null);
  
  const [loading, setLoading] = useState(false);

  const userLogIn = async (userData) => {
    
    setLoading(true);

    dispatch(getUserAccess(userData));

    const result = await axios.post('/user/login', userData , { withCredentials: true })
      .then((res) => res.data)
      .catch((err) => console.log(err))

    if (result) {
      setUserAccess(true)
      setLoading(false);
      navigate('/user');
    } 
    else {
      setLoading(false);
      window.alert('The user entered does not exist, please register');
      navigate('/register');
    };
  };

  const userLogOut = async () => {
    if(userAccess) {
      dispatch(getUserExit());
      setUserAccess(false);
      navigate('/');
    };
  };

  useEffect(() => {
    
    dispatch(getDiets());

    dispatch(getAllRecipes());

  }, []);


  const getRecipes = () => {

    setLoading(true);

    dispatch(getAllRecipes());
    
    setTimeout(() => {
      if(recipes) setLoading(false);
      
    }, 1000);

  };

  const getRecipeDetails = async (id) => {

    setLoading(true);

    dispatch(getRecipeDetail(id));

    setTimeout(() => {

      if(recipeDetails) {
        navigate(`/recipe/${id}`);
        setLoading(false);
      }
      else {
        navigate('/error');
        setLoading(false);
      }
    }, 3000)

  };

  const onSearch = async (key) => {
    setLoading(true);
    navigate('/home');
    

    // Search by ID
    if(!isNaN(key) || key.length === 36) {
      await axios.get(`/recipes/${key}`)
        .then((res) => {
          console.log('Ok');
          navigate(`/recipe/${key}`);
        })
        .catch((err) => {
          console.log(err.message);
          window.alert(`Error: Recipe ${key} not found`);
          navigate('/error');
        });
        //navigate('/home');
        //getRecipeDetails(key);
        //console.log('Ok');
    }

    // Search by Keyword
    else {
      await axios.get(`/recipes?key=${key}`)
        .then((res) => {
          console.log('Ok');
          setSearchedRecipes(res.data);
          setKeyword(key);
          navigate('/home');
        })
        .catch((err) => {
          console.log(err.message);
          setSearchedRecipes([]);
          setKeyword(key);
          navigate('/home');
        });
    }

    document.getElementById('searchInput').value=null;
    setLoading(false);
  };

  const onCloseSearch = () => {
    setSearchedRecipes(null);
    setKeyword(null);
  };


  return (
    <>
        
      <NavBar 
        onSearch = {onSearch}
        logOut = {userLogOut} 
      />

      <Routes>

        <Route path='*' element={<Navigate to ='/error' />}/>

        <Route 
            path='/'
            element= {<Landing 
              getRecipes = {getRecipes}
            />}
        />

        <Route 
          path='/home'
          element= {!loading && <CardContainer  
            getRecipeDetails = {getRecipeDetails} 
            searchedRecipes = {searchedRecipes}
            keyword = {keyword}
            onCloseSearch = {onCloseSearch}
          />}
        />

        <Route
          path='/login'
          element= {<Login userLogIn = {userLogIn}/>}
        />

        <Route
          path='/register'
          element= {<Register/>}
        />

        <Route
          path='/user'
          element= {<UserContainer/>}
        />

        <Route
          path='/user/create'
          element= {<CreateRecipe/>}
        />

        <Route
          path='/user/update'
          element= {<UpdateRecipe/>}
        />

        <Route
          path='/recipe/:id'
          element= {!loading && <DetailsContainer />}
        />

        <Route
          path='/about'
          element= {<About/>}
        />

        <Route
          path='/error'
          element= {<Error/>}
        />

      </Routes>

      {loading && <Loader/>}

      <footer className={styles.footer}>
        <h5 onClick={() => navigate('/about')}>Developed with coffee by Emanuel 🖤</h5>
      </footer>
  </>

  );
};

export default App
