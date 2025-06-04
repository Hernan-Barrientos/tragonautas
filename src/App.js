import React, { useState } from 'react';

import Menucss from './Menu.css';
import HomeTragonautas from './HomeTragonautas.css';
import './App.css';
import TestApi from './TestApi.jsx';
import { TestArray } from './TestArray';
import ShowMenu from './ShowMenu';
import { TragonautasHome } from './TragonautasHome';

function App() {
  const [showMenu, setShowMenu] = useState(true);

  return (
    <div className="App">
      <button 
        onClick={() => setShowMenu(!showMenu)}
        style={{
          position: 'fixed',
          top: '10px',
          right: '10px',
          zIndex: 1000,
          padding: '8px 16px',
          backgroundColor: '#8b4513',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
        }}
      >
        {showMenu ? 'Cambiar a Test' : 'Cambiar a Menu'}
      </button>
      {showMenu ? <ShowMenu /> : <TestApi />}
    </div>
  );
}

export default App;

