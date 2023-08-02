import React, { useState, useEffect, useRef } from 'react';
import './Menu.css';
import logo from './images/logo-negro-1-240x241.png';
import logotr from './images/tragonautasLogo.png';
import longlogo from './images/logo-horiz-negro.png';
import wslogo from './images/whatsapp-logo-png-0.png';
import iglogo from './images/ig.webp';
import mapslogo from './images/Google_Maps_Icon.webp';
import bike from './images/delivery.png';

const MenuRG = () => {
  const [categories, setCategories] = useState([]);
  const categoria = useRef(null);
  const [categoryName, setCategoryName] = useState('');
  const [itemName, setItemName] = useState('');
  const [itemConAlcohol, setItemConAlcohol] = useState(false);
  const [disponibleChico, setDisponibleChico] = useState(true);
  const [disponibleGrande, setDisponibleGrande] = useState(true);
  const [preciotamañoChico, setPreciotamañoChico] = useState(0);
  const [preciotamañoGrande, setPreciotamañoGrande] = useState(0);
  const [sinAlcohol, setSinAlcohol] = useState(false);
  const [preciotamañoChicoSinAlcohol, setPreciotamañoChicoSinAlcohol] = useState(0);
  const [preciotamañoGrandeSinAlcohol, setPreciotamañoGrandeSinAlcohol] = useState(0);
  const [precioUnico, setPrecioUnico] = useState(0);
  const [listOrder, setListOrder] = useState(0);

  const [itemImage, setItemImage] = useState('logo-negro-1-240x241.png');
  const [laPalabra, setLaPalabra] = useState('');
  const [editedItem, setEditedItem] = useState(null);

  const ServerUrl = "https://api.tragonautas420.com.ar";

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${ServerUrl}/categories`);
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      alert("NO SE PUDO REALIZAR LA CONEXION");
    }
  };

  const handleCategoryClick = (categoryId) => {
    const updatedCategories = categories.map((category) =>
      category.name === categoryId ? { ...category, selected: !category.selected } : { ...category, selected: false }
    );
    setCategories(updatedCategories);
  };

  const definirPalabra = async () => {
    const pass = await prompt('Ingrese la clave');
    setLaPalabra(pass);
    localStorage.setItem('clave', pass);
  };

  useEffect(() => {
    const savedClave = localStorage.getItem('clave');
    if (savedClave) {
      setLaPalabra(savedClave);
    }
  }, []);
  


  const handleAddCategory = async () => {
    const newCategoryName = prompt('Ingrese el nombre de la categoría:').replace(/\s+/g, '_');
    if (newCategoryName) {
      const response = await fetch(`${ServerUrl}/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          categoryName: newCategoryName,
          claveSecreta: laPalabra,
        }),
      });
      if (response.ok) {
        const newCategory = await response.json();
        setCategories((prevCategories) => [
          ...prevCategories,
          { ...newCategory, selected: false },
        ]);
      } else {
        alert('Error al agregar la categoría. Contraseña incorrecta.');
      }
    }
  };

  const handleEditCategory = async (categoryId, categoryNameToUpdate) => {
    if (categoryNameToUpdate) {
      const response = await fetch(
        `${ServerUrl}/categories/${categoryId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            categoryName: categoryNameToUpdate,
            claveSecreta: laPalabra,
          }),
        }
      );
      if (response.ok) {
        const updatedCategory = await response.json();
        setCategories((prevCategories) =>
          prevCategories.map((category) =>
            category.id === updatedCategory.id ? updatedCategory : category
          )
        );
        window.alert('Categoría modificada correctamente');
      } else {
        alert('Error al modificar la categoría. Contraseña incorrecta.');
      }
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm('¿Desea eliminar la categoría?')) {
      const response = await fetch(`${ServerUrl}/categories/${categoryId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          claveSecreta: laPalabra
        }),
      });
      if (response.ok) {
        setCategories((prevCategories) =>
          prevCategories.filter((category) => category.id !== categoryId)
        );
      } else {
        alert('Error al eliminar la categoría. Contraseña incorrecta.');
      }
    }
  };

  const handleAddItem = async (categoryId) => {
    const newItemName = itemName;
    const newItemPrice = parseFloat(precioUnico); // Assuming precioUnico is the new price field
    const newItemDescription = ''; // Empty description since it's not included in the new fields

    if (newItemName && !isNaN(newItemPrice)) {
      const response = await fetch(
        `${ServerUrl}/categories/${categoryId}/items`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nombre: newItemName,
            con_alcohol: itemConAlcohol,
            disponible_chico: disponibleChico,
            disponible_grande: disponibleGrande,
            precio_tamaño_chico: preciotamañoChico,
            precio_tamaño_grande: preciotamañoGrande,
            sin_alcohol: sinAlcohol,
            precio_tamaño_chico_sin_alcohol: preciotamañoChicoSinAlcohol,
            precio_tamaño_grande_sin_alcohol: preciotamañoGrandeSinAlcohol,
            precio_unico: newItemPrice, // Using the new price field here
            claveSecreta: laPalabra,
          }),
        }
      );
      if (response.ok) {
        const newItem = await response.json();
        setCategories((prevCategories) =>
          prevCategories.map((category) =>
            category.id === categoryId
              ? { ...category, items: [...category.items, newItem] }
              : category
          )
        );
      } else {
        alert('Error al agregar el item. Contraseña incorrecta.');
      }
    }
  };

  const handleEditItem = async (categoryId, itemId) => {
    const updatedItemName = itemName;
    const updatedItemPrice = parseFloat(precioUnico); // Assuming precioUnico is the new price field



      const response = await fetch(
        `${ServerUrl}/categories/${categoryId}/items/${itemId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nombre: updatedItemName,
            con_alcohol: itemConAlcohol,
            disponible_chico: disponibleChico,
            disponible_grande: disponibleGrande,
            precio_tamaño_chico: preciotamañoChico,
            precio_tamaño_grande: preciotamañoGrande,
            sin_alcohol: sinAlcohol,
            precio_tamaño_chico_sin_alcohol: preciotamañoChicoSinAlcohol,
            precio_tamaño_grande_sin_alcohol: preciotamañoGrandeSinAlcohol,
            precio_unico: updatedItemPrice, // Using the new price field here
            ListOrder: listOrder,
            claveSecreta: laPalabra,
          }),
        }
      );
      if (response.ok) {
        const updatedItem = await response.json();
        setCategories((prevCategories) =>
          prevCategories.map((category) =>
            category.id === categoryId
              ? {
                  ...category,
                  items: category.items.map((item) =>
                    item.id === itemId ? updatedItem : item
                  ),
                }
              : category
          )
        );
        setEditedItem(null);
      } else {
        alert('Error al editar el item. Contraseña incorrecta.');
      }

  };

  const handleDeleteItem = async (categoryId, itemId) => {
    if (window.confirm('¿Desea eliminar este item?')) {
      const response = await fetch(
        `${ServerUrl}/categories/${categoryId}/items/${itemId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            claveSecreta: laPalabra
          }),
        }
      );
      if (response.ok) {
        setCategories((prevCategories) =>
          prevCategories.map((category) =>
            category.id === categoryId
              ? {
                  ...category,
                  items: category.items.filter((item) => item.id !== itemId),
                }
              : category
          )
        );
      } else {
        alert('Error al eliminar el item. Contraseña incorrecta.');
      }
    }
  };

  const handleMoveItem = async (categoryId, itemId, newIndex) => {
    try {
      const response = await fetch(
        `${ServerUrl}/categories/${categoryId}/items/${itemId}/move`, // Updated endpoint URL
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            newIndex,
            claveSecreta: laPalabra
          }),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }
      // No need to call response.json() again as we already called it to check response.ok
      const updatedCategories = await response.json();
      setCategories(updatedCategories); // Assuming the API now returns the updated categories
    } catch (error) {
      alert(error.message);
    }
  };
  

  const handleEditItemClick = (item) => {
    setEditedItem(item);
    setItemName(item.nombre);
    setItemConAlcohol(item.con_alcohol);
    setDisponibleChico(item.disponible_chico);
    setDisponibleGrande(item.disponible_grande);
    setPreciotamañoChico(item.precio_tamaño_chico);
    setPreciotamañoGrande(item.precio_tamaño_grande);
    setSinAlcohol(item.sin_alcohol);
    setPreciotamañoChicoSinAlcohol(item.precio_tamaño_chico_sin_alcohol);
    setPreciotamañoGrandeSinAlcohol(item.precio_tamaño_grande_sin_alcohol);
    setPrecioUnico(item.precio_unico);
    setListOrder(item.ListOrder)
    
  };

  return (
    <div className="menu">
      <div className="App">
        <header className="tragonautas-menu-header">
          <img src={logotr} className="tragonautas-logo" alt="logo" />
          <button className="pass-button" onClick={definirPalabra}>Enviar clave</button>
        </header>
      </div>

      <ul className="category-list">
        {categories.map((category, index) => (
          <li key={category.name}>
            <div className="category-header">
              <div
                className={`category-button ${category.selected ? 'active' : ''}`}
                onClick={() => handleCategoryClick(category.name)}
              >
                <div className="category-actions">
                  <input
                    ref={categoria}
                    key={categories.id}
                    type="text"
                    name={`inputCategory${index}`}
                    placeholder={category.name}
                    onChange={(e) => setCategoryName(e.target.value)}
                  />
                  <button
                    className="edit-button category-section"
                    onClick={() => {
                      console.log("category.name en este momento: ", category.name)
                      handleEditCategory(category.name, categoryName);
                    }}
                  >
                    ✅
                  </button>
                  <button
                    className="delete-button category-section"
                    onClick={() => handleDeleteCategory(category.name)}
                  >
                    ❌
                  </button>

                </div>
              </div>
            </div>
            {category.selected && (
              <ul className="item-list">
                {category.items.map((item, itemIndex) => (
                  <li key={item.id} className="menu-item">
                    <div className='container-item-details'>
                      <div className="item-details">
                        {editedItem && editedItem.id === item.id ? (
                          <>
                            <div className='update-input'>
                              <span className='item-property'>nombre:</span>
                              <input
                                className='inputItems'
                                type="text"
                                name={`inputCategory${index}`}
                                placeholder={item.nombre}
                                value={itemName}
                                onChange={(e) => setItemName(e.target.value)}
                              />
                            </div>
                            <div className='update-input'>
                              <span className='item-property'>con_alcohol:</span>
                              <input
                                className='inputItems'
                                type="checkbox"
                                name={`inputCategory${index}`}
                                checked={itemConAlcohol}
                                onChange={(e) => setItemConAlcohol(e.target.checked)}
                              />
                            </div>
                            <div className='update-input'>
                              <span className='item-property'>disponible_chico:</span>
                              <input
                                className='inputItems'
                                type="checkbox"
                                name={`inputCategory${index}`}
                                checked={disponibleChico}
                                onChange={(e) => setDisponibleChico(e.target.checked)}
                              />
                            </div>
                            <div className='update-input'>
                              <span className='item-property'>disponible_grande:</span>
                              <input
                                className='inputItems'
                                type="checkbox"
                                name={`inputCategory${index}`}
                                checked={disponibleGrande}
                                onChange={(e) => setDisponibleGrande(e.target.checked)}
                              />
                            </div>
                            {/*(id, name, con_alcohol, disponible_chico, disponible_grande, precio_tamaño_chico, precio_tamaño_grande, sin_alcohol, precio_tamaño_chico_sin_alcohol, precio_tamaño_grande_sin_alcohol, precio_unico) */}
                            <div className='update-input'>
                              <span className='item-property'>precio_tamaño_chico:</span>
                              <input
                                className='inputItems'
                                type="number"
                                name={`inputCategory${index}`}
                                placeholder={`$${item.precio_tamaño_chico}`}
                                value={preciotamañoChico}
                                onChange={(e) => setPreciotamañoChico(e.target.value)}
                              />
                            </div>{console.log("item es: ",item)}
                            <div className='update-input'>
                              <span className='item-property'>precio_tamaño_grande:</span>
                              <input
                                className='inputItems'
                                type="number"
                                name={`inputCategory${index}`}
                                placeholder={`$${item.precio_tamaño_grande}`}
                                value={preciotamañoGrande}
                                onChange={(e) => setPreciotamañoGrande(e.target.value)}
                              />
                            </div>
                            <div className='update-input'>
                              <span className='item-property'>sin_alcohol:</span>
                              <input
                                className='inputItems'
                                type="checkbox"
                                name={`inputCategory${index}`}
                                checked={sinAlcohol}
                                onChange={(e) => setSinAlcohol(e.target.checked)}
                              />
                            </div>
                            <div className='update-input'>
                              <span className='item-property'>precio_tamaño_chico_sin_alcohol:</span>
                              <input
                                className='inputItems'
                                type="number"
                                name={`inputCategory${index}`}
                                placeholder={`$${item.precio_tamaño_chico_sin_alcohol}`}
                                value={preciotamañoChicoSinAlcohol}
                                onChange={(e) => setPreciotamañoChicoSinAlcohol(e.target.value)}
                              />
                            </div>
                            <div className='update-input'>
                              <span className='item-property'>precio_tamaño_grande_sin_alcohol:</span>
                              <input
                                className='inputItems'
                                type="number"
                                name={`inputCategory${index}`}
                                placeholder={`$${item.precio_tamaño_grande_sin_alcohol}`}
                                value={preciotamañoGrandeSinAlcohol}
                                onChange={(e) => setPreciotamañoGrandeSinAlcohol(e.target.value)}
                              />
                            </div>
                            <div className='update-input'>
                              <span className='item-property'>precio_unico:</span>
                              <input
                                className='inputItems'
                                type="number"
                                name={`inputCategory${index}`}
                                placeholder={`$${item.precio_unico}`}
                                value={precioUnico}
                                onChange={(e) => setPrecioUnico(e.target.value)}
                              />
                              <span className='item-property'>orden en la lista:</span>
                              <input
                                className='inputItems'
                                type="number"
                                name={`inputCategory${index}`}
                                placeholder={`${item.ListOrder}`}
                                value={listOrder}
                                onChange={(e) => setListOrder(e.target.value)}
                              />
                            </div>
                            <div className="item-actions">
                              <button
                                className="edit-button inputedit"
                                onClick={() => handleEditItem(category.name, item.id)}
                              >
                                Aceptar edicion ✅
                              </button>
                       
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="item-actions">
                              <div className='item-name'>{item.nombre}</div>

                            </div>
                          </>
                        )}
                      </div>
                      <div className='centrador'></div>
                      <button
                        className="edit-button"
                        onClick={() => handleEditItemClick(item)}
                      >
                        Editar ✏️
                      </button>
                      <button
                        className="delete-button"
                        onClick={() => handleDeleteItem(category.name, item.id)}
                      >
                        Eliminar ❌
                      </button>
                     
                    </div>
                  </li>
                ))}
                <li className="add-item">
                  AGREGAR NUEVO ELEMENTO
                  <input
                    type="text"
                    name={`inputCategory${index}`}
                    placeholder={'nombre'}
                    onChange={(e) => setItemName(e.target.value)}
                  />
                  Activar precios "con alcohol"<input
                    type="checkbox"
                    name={`inputCategory${index}`}
                    checked={itemConAlcohol}
                    onChange={(e) => setItemConAlcohol(e.target.checked)}
                  />
                 precio grande<input
                    type="checkbox"
                    name={`inputCategory${index}`}
                    checked={disponibleChico}
                    onChange={(e) => setDisponibleChico(e.target.checked)}
                  />
                 precio chico<input
                    type="checkbox"
                    name={`inputCategory${index}`}
                    checked={disponibleGrande}
                    onChange={(e) => setDisponibleGrande(e.target.checked)}
                  />
                  <input
                    type="number"
                    name={`inputCategory${index}`}
                    placeholder={'precio_tamaño_chico'}
                    onChange={(e) => setPreciotamañoChico(e.target.value)}
                  />
                  <input
                    type="number"
                    name={`inputCategory${index}`}
                    placeholder={'precio_tamaño_grande'}
                    onChange={(e) => setPreciotamañoGrande(e.target.value)}
                  />
                 <input
                    type="checkbox"
                    name={`inputCategory${index}`}
                    checked={sinAlcohol}
                    onChange={(e) => setSinAlcohol(e.target.checked)}
                  />Activar precios "sin alcohol" 
                  <input
                    type="number"
                    name={`inputCategory${index}`}
                    placeholder={'precio_tamaño_chico_sin_alcohol'}
                    onChange={(e) => setPreciotamañoChicoSinAlcohol(e.target.value)}
                  />
                  <input
                    type="number"
                    name={`inputCategory${index}`}
                    placeholder={'precio_tamaño_grande_sin_alcohol'}
                    onChange={(e) => setPreciotamañoGrandeSinAlcohol(e.target.value)}
                  />
                  <input
                    type="number"
                    name={`inputCategory${index}`}
                    placeholder={'precio_unico'}
                    onChange={(e) => setPrecioUnico(e.target.value)}
                  />
                  <input
                    type="number"
                    name={`inputCategory${index}`}
                    placeholder={'orden_del_item'}
                    onChange={(e) => setListOrder(e.target.value)}
                  />
                  <button
                    className="add-button"
                    onClick={() => handleAddItem(category.name)}
                  >
                    AGREGAR ELEMENTO ➕
                  </button>
                </li>
              </ul>
            )}
          </li>
        ))}
         <li className="add-category">
          <button className="add-category-button" onClick={handleAddCategory}>
            Agregar categoría
          </button>
        </li>
      </ul>
    </div>
  );
};

export default MenuRG;
