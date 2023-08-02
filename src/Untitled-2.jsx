import React, { useRef, useState, useEffect } from 'react';

export const RalentiMenuAdmin = () => {
  const formRef = useRef(null);
  const [updateTrigger, setUpdateTrigger] = useState(0);

  const deleteRef = useRef(null);
  const uptadeRef = useRef(null);
  const uptadeRefMenu = useRef(null);

  const [showMenu, setShowMenu] = useState([]);
  const [menu, setMenu] = useState([]);
  const [subMenu, setSubMenu] = useState([]);

  const fetchMenu = async () => {
    try {

      const response = await fetch('http://localhost:3000/categories');
      const data = await response.json();
      setShowMenu(data);
    } catch (error) {
      console.log(error);
    }
  };


  useEffect(() => {
    fetchMenu();
  }, [updateTrigger]);



  useEffect(() => {
    setMenu(showMenu.map((element, index) => (

      <div key={index}>
        {element.name}
        {console.log(element.name)}
        <button ref={deleteRef} type="submit" onClick={() => { deleteElement(element.id) }}>Eliminar categoria</button>
        <button ref={uptadeRef} type="submit" onClick={() => { updateo(formRef.current.menu.value, element.id); }}>Modificar categoria</button>
    </div>
    )))
    
  }, [showMenu, updateTrigger])

  
  useEffect(() => {
    setSubMenu(menu.map((element, index) => (
        <div key={index}>#{element.name}</div>
    )))
    
  }, [showMenu, updateTrigger])




  const posteo = async (newData) => {
    await fetch('http://localhost:3000/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: '',
        name: newData,
        items: [
          {
            id: 1,
            name: "Café Latte",
            price: "$1000",
            description: "café con leche",
            image: "cafecitooo.jpg"          }
        ]
      })
    })
  }

  const updateo = async (newData, id) => {
    await fetch(`http://localhost:3000/categories/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: '',
        name: newData,
        items: [
          {
            id: 1,
            name: "Café Latte",
            price: "$1000",
            description: "café con leche",
            image: "cafecitooo.jpg"          }
        ]
      })
    }
    ); setUpdateTrigger(updateTrigger + 1);

  }

  const updateoElement = async (newData, id) => {
    await fetch(`http://localhost:3000/categories/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: '',
        name: newData,
        items: [
          {
            id: 1,
            name: "Café Latte",
            price: "$1000",
            description: "café con leche",
            image: "cafecitooo.jpg"          }
        ]
      })
    }
    ); setUpdateTrigger(updateTrigger + 1);

  }

  const deleteElement = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/categories/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        console.log('Element deleted successfully');
        setUpdateTrigger(updateTrigger + 1);
      } else {
        console.error('Error:', response.status);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(formRef.current.menu.value);
    formRef.current.menu.value !== "" && posteo(formRef.current.menu.value)
    setUpdateTrigger(updateTrigger + 1);
  };

  return (
    <>
      <form ref={formRef} onSubmit={handleSubmit}>
        <input type="text" name="menu" placeholder="agregar" />
        <button type="submit">Agregar categoria</button>
      </form>
      <div className='tasks'>
        {menu}
        submenu {subMenu}
      </div>
    </>
  );
};

export default RalentiMenuAdmin;