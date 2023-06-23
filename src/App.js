import './App.css';
import logo from './images/tragonautasLogo.png'
import galaxyBackground from "./images/galaxyCloud.png";
import ig from "./images/ig.webp";
import whatsapp from "./images/whatsapp-logo-png-0.png";
import tragoImage from "./images/trago1.webp";
import trago2 from "./images/tragos/607224ece59b5e2e81fd.jpg";
import trago3 from "./images/tragos/a4d50f754cd2cd6cb029.jpg";

function App() {
  return (
    <div className='mainTragonautas'>
      <div className='bannerTragonautas'>
        <div className='instagram'>
          <a href='https://www.instagram.com/tragonautas4.20/' target='blank'><img src={ig} alt="ig" className='insta'></img></a>
        </div>
        <div className='containerLogoTragonautas'>
          <img src={logo} alt="logo" className='logoTragonautas'></img>
        </div>
        <div className='whatsapp'>
          <a href='https://wa.me/541123880686' target='blank'><img src={whatsapp} alt="ws" className='wsapp'></img></a>
        </div>
      </div>
      <div className='telefono'>HACE TU PEDIDO POR WHATSAPP AL 0303-456</div>
      <div className='boddyTragonautas'>
        <div className='centeringContainer'>
          <div className='tragosContainer'><img src={tragoImage} alt="trago" className='fotoTragos'></img></div>
          <div className='tragosContainer'><img src={trago2} alt="trago" className='fotoTragos'></img></div>
          <div className='tragosContainer'><img src={trago3} alt="trago" className='fotoTragos'></img></div>
          <div className='tragosContainer'><img src={tragoImage} alt="trago" className='fotoTragos'></img></div>
          <div className='tragosContainer'><img src={trago2} alt="trago" className='fotoTragos'></img></div>
          <div className='tragosContainer'><img src={trago3} alt="trago" className='fotoTragos'></img></div>
          <div className='tragosContainer'><img src={tragoImage} alt="trago" className='fotoTragos'></img></div>
          <div className='tragosContainer'><img src={trago2} alt="trago" className='fotoTragos'></img></div>
          <div className='tragosContainer'><img src={trago3} alt="trago" className='fotoTragos'></img></div>
          <div className='tragosContainer'><img src={tragoImage} alt="trago" className='fotoTragos'></img></div>
          <div className='tragosContainer'><img src={trago2} alt="trago" className='fotoTragos'></img></div>
          <div className='tragosContainer'><img src={trago3} alt="trago" className='fotoTragos'></img></div>
        </div>
      </div>
    </div>)
}

export default App;
