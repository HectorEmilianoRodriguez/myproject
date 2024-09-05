import React, { useState } from 'react';
import Styles from '../Styles/InfoDiv.module.css';

const InfoDiv = (props) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleContainer = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className={Styles.Wrapper} onClick={toggleContainer}>
            <div className={Styles.Info}>
                {props.Info}
            </div>
            <p>{props.Desc}</p>
            {isOpen && (
                <div className={Styles.Container}>
                    {props.children}
                </div>
            )}
        </div>
    );
};

export default InfoDiv;
