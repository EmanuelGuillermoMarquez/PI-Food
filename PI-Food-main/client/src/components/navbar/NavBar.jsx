import React from 'react';
//import { connect } from 'react-redux';
import { NavLink, useLocation } from 'react-router-dom';
import Menu from '../menu/Menu';
import SearchBar from '../searchbar/SearchBar';
import styles from './Nav.module.css';

const IMG_NAV = 'https://cdn.icon-icons.com/icons2/1447/PNG/512/32391cooking_98877.png'


function NavBar(props) {

    const location = useLocation();

    let isHidden = false;

    if(location.pathname === '/' || location.pathname === '/register' || location.pathname === '/login' || location.pathname === '/about') isHidden = true;

    //console.log(location);

    return (
        <nav className={styles.container}>

            <NavLink to='/home' className={styles.navlink}>

                <div className={styles.item}>
                    <img src= {IMG_NAV} alt="logo" />
                    <h3>Foodie App</h3>
                </div>

            </NavLink>
            
            { !isHidden && <SearchBar onSearch = {props.onSearch} />}
            
            <Menu />
            
        </nav>
    );
};

export default NavBar;

/* const mapStateToProps = (state) => ({})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(NavBar) */
