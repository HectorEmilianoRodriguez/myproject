// SearchBar.jsx
import React from 'react';
import { useState } from 'react';
import Styles from '../Styles/SearchBar.module.css';
import { AiOutlineFileSearch } from "react-icons/ai";

const SearchBar = ({ getSearchData, placeholder }) => {

    const [loading, setLoading] = useState(false); //estado de carga para la espera de peticiones

    const handleChange = (event) => {
        const searchText = event.target.value;
    
        if (searchText.trim() === '') {
            // Si el campo de búsqueda está vacío, desactiva el estado de carga y limpia los resultados
            setLoading(false);
            getSearchData('', setLoading); 
        } else {
            // Si hay texto en el campo de búsqueda, activa el estado de carga y realiza la búsqueda
            setLoading(true);
            getSearchData(searchText, setLoading);
        }
    };
    


    return (
        <div className={Styles.wrapper}>
            <input 
                type='search' 
                placeholder={placeholder} 
                className={Styles.inputS} 
                onChange={(e) => handleChange(e)} 
            
            />

            {loading && <div>Buscando...</div>}

            <AiOutlineFileSearch />
        </div>
    );
};

export default SearchBar;
