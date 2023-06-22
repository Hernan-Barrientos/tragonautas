import './App.css';
import logo from './images/tragonautasLogo.png'
import galaxyBackground from "./images/galaxyCloud.png";
import ig from "./images/ig.webp";
import whatsapp from "./images/whatsapp-logo-png-0.png";
import tragoImage from "./images/trago1.webp";

function App() {
  return (
    <div className='mainTragonautas'>
      <div className='bannerTragonautas'>
        <div className='instagram'>
        <img src={ig} alt="ig" className='insta'></img>
        </div>
        <div className='containerLogoTragonautas'>
          <img src={logo} alt="logo" className='logoTragonautas'></img>
        </div>
        <div className='whatsapp'>
        <img src={whatsapp} alt="ws" className='wsapp'></img>
        </div>
      </div>
      <div className='boddyTragonautas'>
        <div className='tragosContainer'>Nombre del trago</div>
        <div className='tragosContainer'>Nombre del trago</div>
        <div className='tragosContainer'>Nombre del trago</div>
        <div className='tragosContainer'>Nombre del trago</div>
        <div className='tragosContainer'>Nombre del trago</div>
        <div className='tragosContainer'>Nombre del trago</div>
        <div className='tragosContainer'>Nombre del trago</div>
        <div className='tragosContainer'>Nombre del trago</div>
        <div className='tragosContainer'>Nombre del trago</div>
      </div>
    </div>)
}

export default App;
