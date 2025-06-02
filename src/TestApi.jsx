import React, { useReducer, useEffect, useCallback, useRef, useState } from 'react';
import './Menu.css';
import logo from './images/logo-negro-1-240x241.png';
import logoCoffee from './images/logo-blanco-1-240x241.png';

const ServerUrl = "http://localhost:3001";

const initialState = {
  token: sessionStorage.getItem('jwtToken') || undefined,
  categories: [],
  form: {
    'nombre de item': '',
    'item Con Alcohol': false,
    'disponible Chico': true,
    'disponible Grande': true,
    'precio tamaño Chico': 0,
    'precio tamaño Grande': 0,
    'sin Alcohol': false,
    'precio tamaño Chico Sin Alcohol': 0,
    'precio tamaño Grande Sin Alcohol': 0,
    'precio Unico': 0,
    'list Order': 0,
  },
  editedItem: null,
  error: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_TOKEN':
      return { ...state, token: action.payload };
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload };
    case 'UPDATE_FORM':
      return { ...state, form: { ...state.form, ...action.payload } };
    case 'SET_EDITED_ITEM':
      return { ...state, editedItem: action.payload };
    case 'SET_ERROR':
      // Mostrar el error en un alert antes de actualizar el estado
      alert(action.payload);
      return { ...state, error: action.payload };
    case 'RESET_FORM':
      return { ...state, form: initialState.form };
    default:
      return state;
  }
};

const MenuRG = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const dragItem = useRef();
  const dragOverItem = useRef();

  // Detector de dispositivo táctil
  useEffect(() => {
    const handleTouchStart = () => {
      setIsTouchDevice(true);
    };

    const handleMouseDown = () => {
      setIsTouchDevice(false);
    };

    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('mousedown', handleMouseDown);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch(`${ServerUrl}/categories`);
      const data = await response.json();
      dispatch({ type: 'SET_CATEGORIES', payload: data });
    } catch {
      dispatch({ type: 'SET_ERROR', payload: 'No se pudo conectar al servidor' });
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const moveItem = async (categoryId, fromIndex, toIndex) => {
    const category = state.categories.find(c => c.id === categoryId);
    if (!category || fromIndex < 0 || fromIndex >= category.items.length || toIndex < 0 || toIndex >= category.items.length) return;

    const items = [...category.items];
    const [movedItem] = items.splice(fromIndex, 1);
    items.splice(toIndex, 0, movedItem);
    items.forEach((item, index) => item.ListOrder = index);

    try {
      const orderedIds = items.map(item => item.id);
      const response = await fetch(`${ServerUrl}/categories/${categoryId}/items/reorder`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ orderedIds })
      });
      if (response.ok) {
        const updatedCategories = state.categories.map(cat =>
          cat.id === categoryId ? { ...cat, items } : cat
        );
        dispatch({ type: 'SET_CATEGORIES', payload: updatedCategories });
      } else {
        dispatch({ type: 'SET_ERROR', payload: 'Error al ordenar los ítems' });
      }
    } catch {
      dispatch({ type: 'SET_ERROR', payload: 'Error al conectar con el servidor' });
    }
  };

  const moveCategory = async (fromIndex, toIndex) => {
    if (fromIndex < 0 || toIndex < 0 || fromIndex >= state.categories.length || toIndex >= state.categories.length) return;

    const categories = [...state.categories];
    const [movedCategory] = categories.splice(fromIndex, 1);
    categories.splice(toIndex, 0, movedCategory);
    categories.forEach((category, index) => { category.categoryOrder = index; });

    try {
      const response = await fetch(`${ServerUrl}/categories/order`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ updatedOrder: categories.map(category => ({ id: category.id, categoryOrder: category.categoryOrder })) })
      });
      if (response.ok) {
        dispatch({ type: 'SET_CATEGORIES', payload: categories });
      } else {
        dispatch({ type: 'SET_ERROR', payload: 'Error al reordenar las categorías' });
      }
    } catch {
      dispatch({ type: 'SET_ERROR', payload: 'Error al conectar con el servidor' });
    }
  };

  const handleLogin = async () => {
    const clave = prompt('Ingrese la clave de administrador:');
    if (!clave) return;
    try {
      const response = await fetch(`${ServerUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clave }),
      });
      const data = await response.json();
      if (response.ok && data.token) {
        dispatch({ type: 'SET_TOKEN', payload: data.token });
        sessionStorage.setItem('jwtToken', data.token);
        alert('Acceso concedido.');
      } else {
        dispatch({ type: 'SET_ERROR', payload: data.error || 'Clave incorrecta' });
      }
    } catch {
      dispatch({ type: 'SET_ERROR', payload: 'Error al verificar la clave' });
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('jwtToken');
    dispatch({ type: 'SET_TOKEN', payload: undefined });
    alert('Sesión cerrada.');
  };

  // Helper para headers con token
  const authHeaders = () => state.token ? { 'Content-Type': 'application/json', 'Authorization': `Bearer ${state.token}` } : { 'Content-Type': 'application/json' };

  const handleCategoryClick = (categoryId) => {
    dispatch({
      type: 'SET_CATEGORIES',
      payload: state.categories.map((category) => ({
        ...category,
        selected: category.id === categoryId ? !category.selected : false,
      })),
    });
  };

  const handleAddCategory = async () => {
    const newCategoryName = prompt('Ingrese el nombre de la categoría:');
    if (!newCategoryName) return;
    try {
      const response = await fetch(`${ServerUrl}/categories`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ categoryName: newCategoryName }),
      });
      if (response.ok) {
        await fetchCategories();
      } else {
        dispatch({ type: 'SET_ERROR', payload: 'Error al agregar la categoría' });
      }
    } catch {
      dispatch({ type: 'SET_ERROR', payload: 'Error al conectar con el servidor' });
    }
  };

  const handleEditCategory = async (categoryId) => {
    if (!state.form['nombre de categoria']) return;
    try {
      const response = await fetch(`${ServerUrl}/categories/${categoryId}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ categoryName: state.form['nombre de categoria'] }),
      });
      if (response.ok) {
        await fetchCategories();
        alert('Categoría modificada correctamente');
      } else {
        dispatch({ type: 'SET_ERROR', payload: 'Error al modificar la categoría' });
      }
    } catch {
      dispatch({ type: 'SET_ERROR', payload: 'Error al conectar con el servidor' });
    }
  };

  const handleDeleteCategory = async (categoryId, categoryName) => {
    if (!window.confirm(`¿Desea eliminar la categoría ${categoryName} y todos sus elementos?, esta accion no se puede revertir.`)) return;
    try {
      const response = await fetch(`${ServerUrl}/categories/${categoryId}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
      if (response.ok) {
        await fetchCategories();
      } else {
        dispatch({ type: 'SET_ERROR', payload: 'Error al eliminar la categoría' });
      }
    } catch {
      dispatch({ type: 'SET_ERROR', payload: 'Error al conectar con el servidor' });
    }
  };

  const handleAddItem = async (categoryId) => {
    const { 'nombre de item': nombre, 'precio Unico': precioUnico, 'list Order': listOrder } = state.form;
    if (!nombre || (parseFloat(precioUnico) === 0 && !state.form['disponible Chico'] && !state.form['disponible Grande'])) return;
    try {
      const response = await fetch(`${ServerUrl}/categories/${categoryId}/items`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          nombre,
          con_alcohol: state.form['item Con Alcohol'],
          disponible_chico: state.form['disponible Chico'],
          disponible_grande: state.form['disponible Grande'],
          precio_tamaño_chico: parseFloat(state.form['precio tamaño Chico']),
          precio_tamaño_grande: parseFloat(state.form['precio tamaño Grande']),
          sin_alcohol: state.form['sin Alcohol'],
          precio_tamaño_chico_sin_alcohol: parseFloat(state.form['precio tamaño Chico Sin Alcohol']),
          precio_tamaño_grande_sin_alcohol: parseFloat(state.form['precio tamaño Grande Sin Alcohol']),
          precio_unico: parseFloat(state.form['precio Unico']),
          ListOrder: parseInt(listOrder)
        }),
      });
      if (response.ok) {
        await fetchCategories();
        dispatch({ type: 'RESET_FORM' });
      } else {
        dispatch({ type: 'SET_ERROR', payload: 'Error al agregar el item' });
      }
    } catch {
      dispatch({ type: 'SET_ERROR', payload: 'Error al conectar con el servidor' });
    }
  };

  const handleEditItem = async (categoryId, itemId) => {
    const { 'nombre de item': nombre, 'precio Unico': precioUnico, 'list Order': listOrder } = state.form;
    if (!nombre || (parseFloat(precioUnico) === 0 && !state.form['disponible Chico'] && !state.form['disponible Grande'])) return;
    try {
      const response = await fetch(`${ServerUrl}/categories/${categoryId}/items/${itemId}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({
          nombre,
          con_alcohol: state.form['item Con Alcohol'],
          disponible_chico: state.form['disponible Chico'],
          disponible_grande: state.form['disponible Grande'],
          precio_tamaño_chico: parseFloat(state.form['precio tamaño Chico']),
          precio_tamaño_grande: parseFloat(state.form['precio tamaño Grande']),
          sin_alcohol: state.form['sin Alcohol'],
          precio_tamaño_chico_sin_alcohol: parseFloat(state.form['precio tamaño Chico Sin Alcohol']),
          precio_tamaño_grande_sin_alcohol: parseFloat(state.form['precio tamaño Grande Sin Alcohol']),
          precio_unico: parseFloat(state.form['precio Unico']),
          ListOrder: parseInt(listOrder)
        }),
      });
      if (response.ok) {
        await fetchCategories();
        dispatch({ type: 'SET_EDITED_ITEM', payload: null });
        dispatch({ type: 'RESET_FORM' });
      } else {
        dispatch({ type: 'SET_ERROR', payload: 'Error al editar el item' });
      }
    } catch {
      dispatch({ type: 'SET_ERROR', payload: 'Error al conectar con el servidor' });
    }
  };

  const handleDeleteItem = async (categoryId, itemId) => {
    if (!window.confirm('¿Desea eliminar este item?')) return;
    try {
      const response = await fetch(`${ServerUrl}/categories/${categoryId}/items/${itemId}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
      if (response.ok) {
        await fetchCategories();
      } else {
        dispatch({ type: 'SET_ERROR', payload: 'Error al eliminar el item' });
      }
    } catch {
      dispatch({ type: 'SET_ERROR', payload: 'Error al conectar con el servidor' });
    }
  };

  const handleEditItemClick = (item) => {
    dispatch({ type: 'SET_EDITED_ITEM', payload: item });
    dispatch({
      type: 'UPDATE_FORM',
      payload: {
        'nombre de item': item.nombre || '',
        'item Con Alcohol': !!item.con_alcohol,
        'disponible Chico': !!item.disponible_chico,
        'disponible Grande': !!item.disponible_grande,
        'precio tamaño Chico': item.precio_tamaño_chico.toString() || '0',
        'precio tamaño Grande': item.precio_tamaño_grande.toString() || '0',
        'sin Alcohol': !!item.sin_alcohol,
        'precio tamaño Chico Sin Alcohol': item.precio_tamaño_chico_sin_alcohol.toString() || '0',
        'precio tamaño Grande Sin Alcohol': item.precio_tamaño_grande_sin_alcohol.toString() || '0',
        'precio Unico': item.precio_unico.toString() || '0',
        'list Order': item.ListOrder.toString() || '0',
      },
    });
  };

  // Drag and drop handlers
  const handleDragStart = (index) => {
    dragItem.current = index;
  };

  const handleDragEnter = (index) => {
    dragOverItem.current = index;
  };

  const handleDragEnd = async (categoryId) => {
    const fromIndex = dragItem.current;
    let toIndex = dragOverItem.current;
    dragItem.current = null;
    dragOverItem.current = null;
    if (fromIndex !== undefined && toIndex !== undefined && fromIndex !== toIndex) {
      // If dropping below the last item, move to the end
      const category = state.categories.find(c => c.id === categoryId);
      if (category && toIndex >= category.items.length) {
        toIndex = category.items.length - 1;
      }
      await moveItem(categoryId, fromIndex, toIndex);
    }
  };

  const handleTouchStart = (index) => {
    dragItem.current = index;
  };

  const handleTouchMove = (e) => {
    const touchLocation = e.touches[0];
    const element = document.elementFromPoint(touchLocation.clientX, touchLocation.clientY);
    if (element && element.dataset.index) {
      dragOverItem.current = parseInt(element.dataset.index, 10);
    } else if (element && element.closest('.menu-item')) {
      // fallback for nested elements
      const li = element.closest('.menu-item');
      if (li && li.dataset.index) {
        dragOverItem.current = parseInt(li.dataset.index, 10);
      }
    }
  };

  const handleTouchEnd = async (categoryId) => {
    const fromIndex = dragItem.current;
    let toIndex = dragOverItem.current;
    dragItem.current = null;
    dragOverItem.current = null;
    if (fromIndex !== undefined && toIndex !== undefined && fromIndex !== toIndex) {
      const category = state.categories.find(c => c.id === categoryId);
      if (category && toIndex >= category.items.length) {
        toIndex = category.items.length - 1;
      }
      await moveItem(categoryId, fromIndex, toIndex);
    }
  };

  const handleCategoryDragStart = (index) => {
    dragItem.current = index;
  };

  const handleCategoryDragEnter = (index) => {
    dragOverItem.current = index;
  };

  const handleCategoryDragEnd = async () => {
    const fromIndex = dragItem.current;
    const toIndex = dragOverItem.current;
    dragItem.current = null;
    dragOverItem.current = null;
    if (fromIndex !== undefined && toIndex !== undefined && fromIndex !== toIndex) {
      await moveCategory(fromIndex, toIndex);
    }
  };

  const handleCategoryTouchStart = (index) => {
    dragItem.current = index;
  };

  const handleCategoryTouchEnd = async () => {
    const fromIndex = dragItem.current;
    const toIndex = dragOverItem.current;
    dragItem.current = null;
    dragOverItem.current = null;
    if (fromIndex !== undefined && toIndex !== undefined && fromIndex !== toIndex) {
      await moveCategory(fromIndex, toIndex);
    }
  };

  return (
    <div className="menu">      <div className="App">        <header className="tragonautas-menu-header">
          <div className="header-left">
            <img src={logoCoffee} className="tragonautas-logo" alt="logo" style={{ opacity: 1 }} />
          </div>
          <div className="login-container">
            <button className="pass-button" onClick={state.token ? handleLogout : handleLogin}>
              {state.token ? 'Cerrar sesion' : 'Iniciar sesión'}
            </button>
            <div className={`login-indicator ${state.token ? 'logged-in' : 'logged-out'}`} />
          </div>
        </header>
      </div>      {/* Los errores ahora se muestran como alerts */}

      <ul className="category-list">
        {state.categories.map((category) => (
          <li key={category.id}>
            <div className="category-header">
              <div
                className={`category-button ${category.selected ? 'active' : ''}`}
                onClick={() => handleCategoryClick(category.id)}
              >
                <div className="category-actions">
                  <input
                    type="text"
                    placeholder={category.name}
                    value={state.form['nombre de categoria'] || ''}
                    onChange={(e) =>
                      dispatch({ type: 'UPDATE_FORM', payload: { 'nombre de categoria': e.target.value } })
                    }
                  />
                  <button className="edit-button category-section" onClick={() => handleEditCategory(category.id)}>✅</button>
                  <button className="delete-button category-section" onClick={() => handleDeleteCategory(category.id,category.name)}>❌</button>
                </div>
              </div>
            </div>
            {category.selected && (
              <ul className="item-list">
                {category.items.map((item, index) => (
                  <li
                    key={item.id}
                    className="menu-item"
                    onDragOver={e => {
                      e.preventDefault();
                      dragOverItem.current = index;
                    }}
                    onDragEnter={() => { dragOverItem.current = index; }}
                    onDragEnd={() => handleDragEnd(category.id)}
                    onTouchMove={e => {
                      const touchLocation = e.touches[0];
                      const element = document.elementFromPoint(touchLocation.clientX, touchLocation.clientY);
                      if (element && element.dataset.index) {
                        dragOverItem.current = parseInt(element.dataset.index, 10);
                      } else if (element && element.closest('.menu-item')) {
                        // fallback for nested elements
                        const li = element.closest('.menu-item');
                        if (li && li.dataset.index) {
                          dragOverItem.current = parseInt(li.dataset.index, 10);
                        }
                      }
                    }}
                    onTouchEnd={() => handleTouchEnd(category.id)}
                    data-index={index}
                    style={{ cursor: 'default', opacity: state.editedItem && state.editedItem.id === item.id ? 0.5 : 1 }}
                  >
                    <div className="container-item-details">
                      <div className="item-details">
                        {state.editedItem && state.editedItem.id === item.id ? (
                          <>
                            {Object.entries(state.form)
                              .filter(([key]) => key !== 'list Order')
                              .map(([key, value]) => (
                                <div key={key} className="update-input">
                                  <span className="item-property">{key}:</span>
                                  {typeof value === 'boolean' ? (
                                    <input
                                      className="inputItems"
                                      type="checkbox"
                                      checked={value}
                                      onChange={(e) =>
                                        dispatch({ type: 'UPDATE_FORM', payload: { [key]: e.target.checked } })
                                      }
                                    />
                                  ) : (
                                    <input
                                      className="inputItems"
                                      type={key.includes('precio') ? 'number' : 'text'}
                                      value={value}
                                      placeholder={key}
                                      onChange={(e) =>
                                        dispatch({ type: 'UPDATE_FORM', payload: { [key]: e.target.value } })
                                      }
                                    />
                                  )}
                                </div>
                              ))}
                            <button className="edit-button inputedit" onClick={() => handleEditItem(category.id, item.id)}>
                              Aceptar edición ✅
                            </button>
                          </>
                        ) : (
                          <div className="item-name">
                            {item.nombre}
                            <div className="item-actions-container">
                              <div className="item-actions">
                                <button title='Editar' className="edit-button" onClick={() => handleEditItemClick(item)}>✏️</button>
                                <button title='Eliminar' className="delete-button" onClick={() => handleDeleteItem(category.id, item.id)}>❌</button>
                                <button
                                  title='Arrastrar para mover'
                                  className="edit-button"
                                  draggable
                                  onDragStart={() => handleDragStart(index)} // Start the drag
                                  onTouchStart={() => handleTouchStart(index)} // Start the touch
                                >
                                  ↕️
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
                <li className="add-item">
                  AGREGAR NUEVO ELEMENTO
                  {Object.entries(state.form)
                    .filter(([key]) => key !== 'list Order')
                    .map(([key, value]) => (
                      <div key={key}>
                        <label>{key}</label>
                        {typeof value === 'boolean' ? (
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={(e) => dispatch({ type: 'UPDATE_FORM', payload: { [key]: e.target.checked } })}
                          />
                        ) : (
                          <input
                            type={key.includes('precio') ? 'number' : 'text'}
                            value={value}
                            placeholder={key}
                            onChange={(e) => dispatch({ type: 'UPDATE_FORM', payload: { [key]: e.target.value } })}
                          />
                        )}
                      </div>
                    ))}
                  <button className="add-button" onClick={() => handleAddItem(category.id)}>AGREGAR ELEMENTO ➕</button>
                </li>
              </ul>
            )}
          </li>
        ))}
        <li className="add-category">
          <button className="add-category-button" onClick={handleAddCategory}>Agregar categoría</button>
        </li>
      </ul>
    </div>
  );
};

export default MenuRG;