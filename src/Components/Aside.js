import React, { useState } from 'react';
import Styles from '../Styles/Aside.module.css';

const Aside = ({ children, titles }) => {
    const [showTitles, setShowTitles] = useState(false);

    const handleMouseEnter = () => {
        setShowTitles(true);
    };

    const handleMouseLeave = () => {
        setShowTitles(false);
    };

    // Clonar los children y pasarles el prop show
    const clonedChildren = React.Children.map(children, child =>
        React.cloneElement(child, { show: showTitles })
    );

    return (
        <aside
            className={Styles.aside}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {titles.map((title, index) => (
                <div key={index} className={Styles.home}>
                   
                    {title.icon}
                    {showTitles && title.title}
                </div>
            ))}
            {clonedChildren}
        </aside>
    );
};

export default Aside;
