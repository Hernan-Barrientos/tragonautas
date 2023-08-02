import React, { useState, useEffect } from 'react';
import './Menu.css';
import logotr from './images/tragonautasLogo.png';
import longlogo from './images/logo-horiz-negro.png';
import wslogo from './images/whatsapp-logo-png-0.png';
import iglogo from './images/ig.webp';
import mapslogo from './images/Google_Maps_Icon.webp';
import bike from './images/delivery.png';

const ShowMenu = () => {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState('');

  const ServerUrl = "https://api.tragonautas420.com.ar"; // Assuming this is your API URL

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${ServerUrl}/categories`);
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories from the API:', error);
    }
  };
  

  const handleCategoryClick = (categoryId) => {
    const updatedCategories = categories.map((category) =>
      category.name === categoryId ? { ...category, selected: !category.selected } : { ...category, selected: false }
    );
    setCategories(updatedCategories);
  };

  return (
    <div className="menu tragonautas-menu-body">
      <header className="tragonautas-menu-header">
        <img src={logotr} className="tragonautas-logo" alt="logo" />
      </header>
      <div className="App2">
        <div className='category-list whatsapp'>
          <a href='https://www.instagram.com/tragonautas4.20/' target='blank'><img src={iglogo} alt="ig logo" className='wsapplogo'></img></a>
          <a href='https://www.google.com.ar/maps/place/C.+30+1909,+Berazategui+Oeste,+Provincia+de+Buenos+Aires/@-34.792317,-58.2289264,17.5z/data=!4m6!3m5!1s0x95a328e77b391ee1:0xcb194ee2557f2c8f!8m2!3d-34.7919809!4d-58.2269779!16s%2Fg%2F11qn63wshr?entry=ttu' target='blank'>
            <img src={mapslogo} alt="maps logo" className='wsapplogo'></img></a>
          <a href='https://wa.me/+541130997258' target='blank'><img src={wslogo} alt="wsapp logo" className='wsapplogo'></img></a>
        </div>
      </div>
      <ul className="category-list">
        {categories.map((category) => (
          <li key={category.name}>
            <div
              className={`category-button ${category.selected ? 'active' : ''}`}
              onClick={() => handleCategoryClick(category.name)}
            >
            <div className="category-name">{category.name.replace(/^[^_]*_/, '').replace(/_/g, ' ')}</div>
            </div>
            {category.selected && (
              <ul className="item-list">
                {category.items.map((item) => (
                  <li key={item.id} className="menu-item">
                    <div className="item-details">
                      <div className="item-name margenbajotitle">{item.nombre}</div>
                      <div className='boxinfo'>
                        {item.precio_unico > 0 && <div className="item-details margenbajo">${item.precio_unico}</div>}
                        {item.precio_tamaño_grande > 0  && <div className="item-details margenbajo">de litro: ${item.precio_tamaño_grande}</div>}
                        {item.precio_tamaño_chico > 0 && <div className="item-details margenbajo">de medio: ${item.precio_tamaño_chico}</div>}
                        {item.precio_tamaño_grande_sin_alcohol > 0 && <div className="item-details margenbajo">Sin Alcohol de litro: ${item.precio_tamaño_grande_sin_alcohol}</div>}
                        {item.precio_tamaño_chico_sin_alcohol > 0 && <div className="item-details margenbajo">Sin Alcohol de medio: ${item.precio_tamaño_chico_sin_alcohol}</div>}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ShowMenu;
