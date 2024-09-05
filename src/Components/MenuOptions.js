import React, { useState } from 'react';
import Styles from '../Styles/Moreoptions.module.css';
import { AiFillCaretDown } from "react-icons/ai";
import { Link } from 'react-router-dom';

const MenuOptions = ({ title, linkTo, details, show }) => {
    const [showDetails, setDetails] = useState(false);
    const [isClicked, setClicked] = useState(false);

    const handleMouseEnter = () => {
        setDetails(true);
    };

    const handleMouseLeave = () => {
        setDetails(false);
    };

    const handleMouseClick = () => {
        // Alternar estado de clic
        setClicked(!isClicked);
    }

    // Mostrar detalles si está clicado o el ratón está sobre el menú
    const shouldShowDetails = isClicked || showDetails;

    return (
        <div className={Styles.MenuWrapper}>
            <div 
                className={Styles.Info}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {show && (
                    <>
                        <p>
                            {title}
                        </p>
                    </>
                )}
                <AiFillCaretDown  onClick={handleMouseClick}/>
            </div>

            {shouldShowDetails && show && (
                <div 
                    className={Styles.Options} 
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    {details.map((detail, index) => (
                        <div key={index}>
                            <Link to = {linkTo+'/'+detail.title+'/'+detail.idWorkEnv}>
                                {detail.title}
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MenuOptions;
