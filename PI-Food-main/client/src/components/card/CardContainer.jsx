import React from 'react';
import { useState , useEffect , useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { filterRecipes, orderRecipesByTitle } from '../../redux/actions/actions';
import Main from '../main/Main';
import SearchResults from '../searchresults/SearchResults';
import Card from './Card';
//import Loader from '../loader/Loader';
import style from './Card.module.css';

const DEFAULT_IMAGE = 'https://images.pexels.com/photos/1651166/pexels-photo-1651166.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';
const INITIAL_PAGE = 0;
const ITEMS = 9;

function CardContainer(props) {

    const dispatch = useDispatch();

    const ref = useRef(null);

    const sortTitleRef = useRef(null);
    
    const sortScoreRef = useRef(null);

    const diets = useSelector((state) => state.diets);

    const allRecipes = useSelector((state) => state.allRecipes);

    const filtered = useSelector((state) => state.filteredRecipes);

    //const ordered = useSelector((state) => state.orderedRecipes);
    
    const [recipes, setRecipes] = useState(allRecipes);

    const [searchedRecipes, setSearchedRecipes] = useState(props.searchedRecipes);

    const [isLoading, setIsLoading] = useState(false);

    let orderedRecipes = [];

    const INITIAL_ITEMS = [...recipes].splice(INITIAL_PAGE, ITEMS);
    const [itemsPage, setItemsPage] = useState(INITIAL_ITEMS);
    const [currentPage, setCurrentPage] = useState(INITIAL_PAGE);

    const TOTAL_PAGES = new Array(Math.ceil(recipes.length / ITEMS)).fill(0);

    const PAGES = TOTAL_PAGES.map((item, index) => {
        item = index + 1;
        return item;
    });
    
    useEffect(() => {

        //setRecipes(allRecipes);
        setItemsPage(INITIAL_ITEMS);
        setCurrentPage(INITIAL_PAGE);
        
    }, [ recipes ]);    
    
    useEffect(() => {

        filtered.length ? setRecipes(filtered) : setRecipes(allRecipes);
        //setItemsPage(INITIAL_ITEMS);
        //setCurrentPage(INITIAL_PAGE);
        
    }, [ filtered ]);
    
    const nextHandler = () => {
        const totalElements = recipes.length;
        const nextPage = currentPage + 1;
        const indexNextPage = nextPage * ITEMS;
        
        if(indexNextPage >= totalElements) {
            setItemsPage(INITIAL_ITEMS);
            setCurrentPage(INITIAL_PAGE);
            ref.current.scrollIntoView();
            return;
        };
        //console.log(nextPage);
        //console.log(indexNextPage);
        //console.log(totalElements);

        setItemsPage([...recipes].splice(indexNextPage, ITEMS));
        setCurrentPage(nextPage);
        ref.current.scrollIntoView();
    };
    const prevHandler = () => {
        const prevPage = currentPage -1;
        const indexPrevPage = prevPage * ITEMS;
        
        setItemsPage([...recipes].splice(indexPrevPage, ITEMS));
        setCurrentPage(prevPage);
        ref.current.scrollIntoView();
    };

    const onClickPageHandler = (item) => {
        const lastIndex = item * ITEMS;
        const firstIndex = lastIndex - ITEMS;
        
        setItemsPage([...recipes].slice(firstIndex, lastIndex));
        setCurrentPage(item-1);
    };

    const handleFilter = (value) => {

        dispatch(filterRecipes(value));

        //setRecipes(filtered);

        sortTitleRef.current.options.selectedIndex = 0;
        sortScoreRef.current.options.selectedIndex = 0;

        //console.log(value);
    };

    const handleOrder = (e) => {

        if(e.target.name === 'orderByTitle') {
            e.target.value === 'upward' 
                ? orderedRecipes = [...recipes].sort((itemA, itemB) => itemB.title.localeCompare(itemA.title))
                : orderedRecipes = [...recipes].sort((itemA, itemB) => itemA.title.localeCompare(itemB.title))
            sortScoreRef.current.options.selectedIndex = 0;
            return setRecipes([...orderedRecipes]);
        
        };

        if(e.target.name === 'orderByScore') {
            e.target.value === 'upward' 
                ? orderedRecipes = [...recipes].sort((itemA, itemB) => itemA.health_score - itemB.health_score)
                : orderedRecipes = [...recipes].sort((itemA, itemB) => itemB.health_score - itemA.health_score)
            sortTitleRef.current.options.selectedIndex = 0;
            return setRecipes([...orderedRecipes]);
            
        };
    };


    const onClose = () => {
        props.onCloseSearch();
        setSearchedRecipes(null);
    };

    return (
        <>
            <div className={style.patern_container}>

                <Main />

                {!isLoading && !searchedRecipes &&

                <div ref={ref} className={style.card_container}>
                    <h1>Most popular recipes:</h1>

                    <div className={style.filter}>

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

                    </div>

                    <div className={style.container}>
                        {/* <button className= { currentPage !== INITIAL_PAGE ? style.pageButton : style.noButton } onClick={currentPage !== INITIAL_PAGE ? () => prevHandler() : null } >
                            <i className='fas fa-chevron-left'></i>
                        </button> */}
                        {itemsPage.map((item) => (
                            <Card
                                key={item.id}
                                id={item.id}
                                title={item.title}
                                image={item.image ? item.image : DEFAULT_IMAGE}
                                diets={item.diets.map((diet) => diet[0].toUpperCase() + diet.slice(1)).join(', ')}
                                score={item.health_score}
                                getRecipeDetails = {props.getRecipeDetails}
                            />
                        ))}
                        
                        {/* <button className= {style.pageButton} onClick={() => nextHandler()}>
                            <i className='fas fa-chevron-right'></i>
                        </button> */}
                    </div>

                    <div className={style.div_controllers}>

                        <button className= { currentPage !== INITIAL_PAGE ? style.pageButton : style.noButton } onClick={currentPage !== INITIAL_PAGE ? () => prevHandler() : null } >
                                <i className='fas fa-chevron-left'></i>
                        </button>

                        {/* <button className= {style.pageButton} >{currentPage + 1}</button> */}

                        {PAGES.map((item, index) => <button key={index} className= {currentPage+1 === item ? style.pageButtonActive : style.pageButton} onClick={() => onClickPageHandler(item)}> {item} </button>)}

                        <button className= {currentPage +1 !== PAGES.length ? style.pageButton : style.noButton } onClick={() => nextHandler()}>
                                <i className='fas fa-chevron-right'></i>
                        </button>

                    </div>

                </div>
                }

                {!isLoading && searchedRecipes && <SearchResults 
                    searchedRecipes={searchedRecipes}
                    keyword = {props.keyword} 
                    getRecipeDetails = {props.getRecipeDetails}
                    onClose = {onClose}
                />}

            </div>



        </>   
    );
};

export default CardContainer;