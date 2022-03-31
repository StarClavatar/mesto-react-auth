import React from 'react';
import Vector from '../images/Vector.svg';

// import '../blocks/header/header.css'
// import '../blocks/header/__logo/header__logo.css'

// import '../index.css';

function Header() {
    return (
        <header className="header">
            <img src={Vector} alt="логотип" className="header__logo"/>
        </header>
    );    
}

export default Header;
