import React from 'react';
import { useState , useEffect , useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './Search.module.css'

const DEFAULT_IMAGE = 'https://images.pexels.com/photos/1651166/pexels-photo-1651166.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';
const INITIAL_PAGE = 0;
const ITEMS = 9;

function SearchResults(props) {

    const diets = useSelector((state) => state.diets);

    //const userRecipes = useSelector((state) => state.userRecipes);

    const ref = useRef(null);

    const sortTitleRef = useRef(null);
    
    const sortScoreRef = useRef(null);

    const [recipes, setRecipes] = useState(props.searchedRecipes);
    
    const [filteredRecipes, setFilteredRecipes] = useState([]);

    let orderedRecipes = [];
    
    const INITIAL_ITEMS = [...recipes].splice(INITIAL_PAGE, ITEMS);

    const [itemsPage, setItemsPage] = useState(INITIAL_ITEMS);
    const [currentPage, setCurrentPage] = useState(INITIAL_PAGE);

    const onScroll = () => {
        ref.current.scrollIntoView();        
    };

    const nextHandler = () => {
        const totalElements = recipes.length;
        const nextPage = currentPage +1;
        const indexNextPage = nextPage * ITEMS;
        
        if(indexNextPage >= totalElements) {
            setItemsPage(INITIAL_ITEMS);
            setCurrentPage(INITIAL_PAGE);
            onScroll();
            return;
        };

        setItemsPage([...recipes].splice(indexNextPage, ITEMS));
        setCurrentPage(nextPage);
        onScroll();

    };

    const handleFilter = (value) => {
        if(value === 'All Diets') {
            //setFilteredRecipes([]);
            setRecipes([...props.searchedRecipes]);
            sortTitleRef.current.options.selectedIndex = 0;
            sortScoreRef.current.options.selectedIndex = 0;
            return //setItemsPage(INITIAL_ITEMS);
        }

        //setFilteredRecipes(props.searchedRecipes.filter((item) => item.diets.includes(value.toLowerCase())));

        setRecipes([...props.searchedRecipes].filter((item) => item.diets.includes(value.toLowerCase())));

        //setItemsPage([...filteredRecipes].splice(INITIAL_PAGE, ITEMS));

        sortTitleRef.current.options.selectedIndex = 0;
        sortScoreRef.current.options.selectedIndex = 0;

        console.log(value);


    };

    const handleOrder = (e) => {

        if(e.target.name === 'orderByTitle') {
            e.target.value === 'upward' 
                ? orderedRecipes = [...recipes].sort((itemA, itemB) => itemB.title.localeCompare(itemA.title))
                : orderedRecipes = [...recipes].sort((itemA, itemB) => itemA.title.localeCompare(itemB.title))
            return setRecipes([...orderedRecipes]);
        
        };

        if(e.target.name === 'orderByScore') {
            e.target.value === 'upward' 
                ? orderedRecipes = [...recipes].sort((itemA, itemB) => itemA.health_score - itemB.health_score)
                : orderedRecipes = [...recipes].sort((itemA, itemB) => itemB.health_score - itemA.health_score)
            return setRecipes([...orderedRecipes]);
            
        };
    };

    useEffect(() => {
        setItemsPage(INITIAL_ITEMS);
    }, [recipes]);

    
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

                <h3> Order by title </h3>

                <select ref={sortTitleRef} name='orderByTitle' onChange={(e) => handleOrder(e)}>

                    <option defaultValue={null} >Order...</option>
                    <option value={'upward'} >Upward</option>
                    <option value={'downward'} >Downward</option>
                    
                </select>

                <h3> Order by score </h3>

                <select ref={sortScoreRef} name='orderByScore' onChange={(e) => handleOrder(e)}>

                    <option defaultValue={null} >Order...</option>
                    <option value={'upward'} >Upward</option>
                    <option value={'downward'} >Downward</option>
                    
                </select>

                <button onClick={() => props.onClose()}><i className='fa fa-times' aria-hidden='true'></i></button>
            
            </div>

            {itemsPage.length 
            
                ? itemsPage.map((item) => (
                
                <div className={styles.item} key={item.id} >
                    <img src={item.image ? item.image : DEFAULT_IMAGE} alt='img' />
                    
                    <div className={styles.div_recipe}>
                        <h4>{item.title}</h4>
                        <p>{
                            item.diets.map((diet) => diet[0].toUpperCase() + diet.slice(1)).join(', ')   
                        }</p>
                    </div>

                    <h5>Healthy Score: {item.health_score}</h5>

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