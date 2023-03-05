import React from 'react';
import { useState , useEffect } from 'react';
import { connect, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Main from '../main/Main';
import SearchResults from '../searchresults/SearchResults';
import Card from './Card';
//import Loader from '../loader/Loader';
import style from './Card.module.css';

const DEFAULT_IMAGE = 'https://images.pexels.com/photos/1651166/pexels-photo-1651166.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';
const INITIAL_PAGE = 0;
const ITEMS = 3;

function CardContainer(props) {

    const allRecipes = useSelector((state) => state.allRecipes);

    const [searchedRecipes, setSearchedRecipes] = useState(props.searchedRecipes);

    const [isLoading, setIsLoading] = useState(false);
    
    //const [allRecipes, setAllRecipes] = useState(recipes)

    const INITIAL_ITEMS = [...allRecipes].splice(INITIAL_PAGE, ITEMS);
    const [itemsPage, setItemsPage] = useState([]);
    const [currentPage, setCurrentPage] = useState(INITIAL_PAGE);
    
    useEffect(() => {

        setItemsPage(INITIAL_ITEMS);
        
    }, [allRecipes])

    
    const nextHandler = () => {
        const totalElements = allRecipes.length;
        const nextPage = currentPage + 1;
        const indexNextPage = nextPage * ITEMS;
        
        if(indexNextPage >= totalElements) {
            setItemsPage(INITIAL_ITEMS);
            setCurrentPage(INITIAL_PAGE);
            return;
        };
        console.log(nextPage);
        console.log(indexNextPage);
        console.log(totalElements);

        setItemsPage([...allRecipes].splice(indexNextPage, ITEMS));
        setCurrentPage(nextPage);
    };
    const prevHandler = () => {
        const prevPage = currentPage -1;
        const indexPrevPage = prevPage * ITEMS;
        
        setItemsPage([...allRecipes].splice(indexPrevPage, ITEMS));
        setCurrentPage(prevPage);
    };

    const onClose = () => {
        props.onCloseSearch();
        setSearchedRecipes(null);
    }

    return (
        <>
            <div className={style.patern_container}>

                <Main />

                {!isLoading && !searchedRecipes &&

                <div className={style.card_container}>
                    <h1>Most popular recipes:</h1>
                    <div className={style.container}>
                        <button className= { currentPage !== INITIAL_PAGE ? style.pageButton : style.noButton } onClick={currentPage !== INITIAL_PAGE ? () => prevHandler() : null } >
                            <i className='fas fa-chevron-left'></i>
                        </button>
                        {itemsPage.map((item) => (
                            <Card
                                key={item.id}
                                id={item.id}
                                title={item.title}
                                image={item.image ? item.image : DEFAULT_IMAGE}
                                getRecipeDetails = {props.getRecipeDetails}
                            />
                        ))}
                        
                        <button className= {style.pageButton} onClick={() => nextHandler()}>
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