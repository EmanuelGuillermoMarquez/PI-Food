import React from 'react';
import { useState , useEffect , useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './Search.module.css'

const DEFAULT_IMAGE = 'https://images.pexels.com/photos/1651166/pexels-photo-1651166.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';
const INITIAL_PAGE = 0;
const ITEMS = 8;

function SearchResults(props) {

    const diets = useSelector((state) => state.diets);

    //const userRecipes = useSelector((state) => state.userRecipes);

    const ref = useRef(null);
    
    let filteredRecipes = [];
    
    const INITIAL_ITEMS = [...props.searchedRecipes].splice(INITIAL_PAGE, ITEMS);

    const [itemsPage, setItemsPage] = useState(INITIAL_ITEMS);
    const [currentPage, setCurrentPage] = useState(INITIAL_PAGE);

    const onScroll = () => {
        ref.current.scrollIntoView();        
    };

    const handleFilter = (value) => {
        if(value === 'All Diets') return setItemsPage(INITIAL_ITEMS);

        filteredRecipes = props.searchedRecipes.filter((item) => item.diets.includes(value.toLowerCase()));
        setItemsPage([...filteredRecipes].splice(INITIAL_PAGE, ITEMS));

        console.log(value)
    };

    const nextHandler = () => {
        const totalElements = props.searchedRecipes.length;
        const nextPage = currentPage +1;
        const indexNextPage = nextPage * ITEMS;
        
        if(indexNextPage >= totalElements) {
            setItemsPage(INITIAL_ITEMS);
            setCurrentPage(INITIAL_PAGE);
            onScroll();
            return;
        };

        setItemsPage([...props.searchedRecipes].splice(indexNextPage, ITEMS));
        setCurrentPage(nextPage);
        onScroll();
    };
 

    return (
        <div className={styles.container}>

            
            {props.keyword &&
                <h2>Recipes found with keyword: "{props.keyword}"</h2>
            }
            
            
            <div ref={ref} className={styles.filter} > 
                <h3> Filter diets </h3>

                <select name='diet' onChange={(e) => handleFilter(e.target.value)}>

                    <option defaultValue={null} >All Diets</option>

                    {diets.map((item, index) => (
                        <option key={index} value={item}>{item}</option>
                    ))}
                    
                </select>

                <button onClick={() => props.onClose()}><i className='fa fa-times' aria-hidden='true'></i></button>
            
            </div>

            {itemsPage.length 
            
                ? itemsPage.map((item) => (
                
                <div className={styles.item} key={item.id} >
                    <img src={item.image ? item.image : DEFAULT_IMAGE} alt='img' />
                    <h4>{item.title}</h4>

                    {props.deleteUserRecipe && 
                    <button className={styles.button} onClick={() => {
                        props.deleteUserRecipe(item.id);
                        setItemsPage(INITIAL_ITEMS);
                        setCurrentPage(INITIAL_PAGE);
                    }}>
                        <i className='fas fa-trash-alt'></i>
                    </button> 
                    }

                    <button className={styles.button} onClick={() => props.getRecipeDetails(item.id)}>
                        <i className='fas fa-info-circle'></i>
                    </button> 
                </div>
                
                ))
            
                : <div>
                    <h2>Not found recipes</h2>
                </div>
            }
            
            {!(props.searchedRecipes.length <= ITEMS) && <button onClick={() => nextHandler()} className={styles.nextButton}>
                <i className='fas fa-caret-down' aria-hidden='true'></i>
            </button> }

        </div>
    );
};

export default SearchResults;