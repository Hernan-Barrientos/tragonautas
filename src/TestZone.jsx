import React, { useReducer, useEffect, useCallback } from 'react';
const ServerUrl = "http://localhost:3001";

const initialState = {
  claveAdmin: sessionStorage.getItem('claveAdmin') || undefined,
  categories: [],
  form: {
    categoryName: '',
    itemName: '',
    itemConAlcohol: false,
    disponibleChico: true,
    disponibleGrande: true,
    preciotamañoChico: 0,
    preciotamañoGrande: 0,
    sinAlcohol: false,
    preciotamañoChicoSinAlcohol: 0,
    preciotamañoGrandeSinAlcohol: 0,
    precioUnico: 0,
    listOrder: 0,
  },
  editedItem: null,
  error: null,
  propiedadDePrueba: ''
};

const reducer = (state, action) => {

  switch (action.type) {
    case 'SET_CLAVE_ADMIN':
      console.log("...state", ...state);
      return { ...state, claveAdmin: action.payload };
    case 'SET_CATEGORIES':
      console.log("...state propagado", {...state});
      return { ...state, categories: action.payload };
    case 'UPDATE_FORM':
      console.log("...state", ...state);
      return { ...state, form: { ...state.form, ...action.payload } };
    case 'SET_EDITED_ITEM':
      console.log("...state", ...state);
      return { ...state, editedItem: action.payload };
    case 'SET_ERROR':
      console.log("...state", ...state);
      return { ...state, error: action.payload };
    case 'RESET_FORM':
      console.log("...state", ...state);
      return { ...state, form: initialState.form };
    case 'PROPIEDAD_DE_PRUEBA':
      return { ...state, propiedadDePrueba: action.payload };

    default:
      return state;
  }
};

const TestZone = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
        console.log("state es: ",state);

  const testCode = useCallback(() => {console.log("initialState", initialState)}, []);


  
    const fetchCategories = useCallback(async () => {
      try {
        const response = await fetch(`${ServerUrl}/categories`);
        const data = await response.json();
        dispatch({ type: 'SET_CATEGORIES', payload: data });
      } catch {
        dispatch({ type: 'SET_ERROR', payload: 'No se pudo conectar al servidor' });
      }
    }, []);

    const modificarState = useCallback(() => {
      dispatch({ type: 'PROPIEDAD_DE_PRUEBA', payload: prompt("a ver si funca") });
    }, []);


  return (
    <div className="menu tragonautas-menu-body">
        <button onClick={testCode}>console</button>
        <button onClick={fetchCategories}>test</button>
        <button onClick={modificarState}>modificar estado</button>

    </div>
    );
};

export default TestZone;

