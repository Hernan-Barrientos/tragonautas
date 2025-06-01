import React, { useReducer, useEffect, useCallback } from 'react';
import './Menu.css';
import logo from './images/logo-negro-1-240x241.png';
import logotr from './images/tragonautasLogo.png';

const ServerUrl = "http://localhost:3001";

const initialState = {
  claveAdmin: sessionStorage.getItem('claveAdmin') || undefined,
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
    case 'SET_CLAVE_ADMIN':
      return { ...state, claveAdmin: action.payload };
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload };
    case 'UPDATE_FORM':
      return { ...state, form: { ...state.form, ...action.payload } };
    case 'SET_EDITED_ITEM':
      return { ...state, editedItem: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'RESET_FORM':
      return { ...state, form: initialState.form };
    default:
      return state;
  }
};

const MenuRG = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          claveSecreta: state.claveAdmin,
          orderedIds
        })
      });
      if (response.ok) {
        const updatedCategories = state.categories.map(cat =>
          cat.id === categoryId ? { ...cat, items } : cat
        );
        dispatch({ type: 'SET_CATEGORIES', payload: updatedCategories });
      } else {
        dispatch({ type: 'SET_ERROR', payload: 'Error al reordenar los ítems' });
      }
    } catch {
      dispatch({ type: 'SET_ERROR', payload: 'Error al conectar con el servidor' });
    }
  };

  const handleSendClave = async () => {
    const clave = prompt('Ingrese la clave de administrador:');
    if (!clave) return;
    try {
      const response = await fetch(`${ServerUrl}/passint`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clave }),
      });
      const data = await response.json();
      if (data.valid) {
        dispatch({ type: 'SET_CLAVE_ADMIN', payload: clave });
        sessionStorage.setItem('claveAdmin', clave);
        alert('Clave correcta. Acceso concedido.');
      } else {
        dispatch({ type: 'SET_ERROR', payload: 'Clave incorrecta' });
      }
    } catch {
      dispatch({ type: 'SET_ERROR', payload: 'Error al verificar la clave' });
    }
  };

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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categoryName: newCategoryName, claveSecreta: state.claveAdmin }),
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categoryName: state.form['nombre de categoria'], claveSecreta: state.claveAdmin }),
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

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm(`¿Desea eliminar la categoría: ${categoryId}?`)) return;
    try {
      const response = await fetch(`${ServerUrl}/categories/${categoryId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ claveSecreta: state.claveAdmin }),
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
        headers: { 'Content-Type': 'application/json' },
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
          ListOrder: parseInt(listOrder),
          claveSecreta: state.claveAdmin
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
        headers: { 'Content-Type': 'application/json' },
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
          ListOrder: parseInt(listOrder),
          claveSecreta: state.claveAdmin
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ claveSecreta: state.claveAdmin }),
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

  return (
    <div className="menu">
      <div className="App">
        <header className="tragonautas-menu-header">
          <img src={logotr} className="tragonautas-logo" alt="logo" />
          <button className="pass-button" onClick={handleSendClave}>Enviar clave</button>
        </header>
      </div>

      {state.error && <div className="error">{state.error}</div>}

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
                  <button className="delete-button category-section" onClick={() => handleDeleteCategory(category.id)}>❌</button>
                </div>
              </div>
            </div>
            {category.selected && (
              <ul className="item-list">
                {category.items.map((item, index) => (
                  <li key={item.id} className="menu-item">
                    <div className="container-item-details">
                      <div className="item-details">
                        {state.editedItem && state.editedItem.id === item.id ? (
                          <>
                            {Object.entries(state.form).map(([key, value]) => (
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
                                    type={key.includes('precio') || key === 'list Order' ? 'number' : 'text'}
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
                                <button title="Subir" className="delete-button" onClick={() => moveItem(category.id, index, index - 1)}>⬆️</button>
                                <button title="Bajar" className="delete-button" onClick={() => moveItem(category.id, index, index + 1)}>⬇️</button>
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
                  {Object.entries(state.form).map(([key, value]) => (
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
                          type={key.includes('precio') || key === 'list Order' ? 'number' : 'text'}
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