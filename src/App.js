import React, { useEffect } from 'react';

import Menucss from './Menu.css';
import HomeTragonautas from './HomeTragonautas.css';
import './App.css';
import TestApi from './TestApi.jsx';
import { TestArray } from './TestArray';
import ShowMenu from './ShowMenu';
import { TragonautasHome } from './TragonautasHome';
import TestZone from './TestZone.jsx';
function App() {
  return (
    <div className="App">
      <TestApi/>
       <ShowMenu/>

    </div>
  );
}

export default App;

