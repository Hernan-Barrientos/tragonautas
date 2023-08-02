import React, { useEffect, useState } from 'react';
import logotr from './images/tragonautasLogo.png';
import bike from './images/delivery.png'
import wslogo from './images/whatsapp-logo-png-0.png';
import mapslogo from './images/Google_Maps_Icon.webp';
import iglogo from './images/ig.webp';
import SimpleImageSlider from "react-simple-image-slider";

const images = [
  { url: require('./images/galeria420/galeria420_1.jpg') },
  { url: require('./images/galeria420/galeria420_2.jpg') },
  { url: require('./images/galeria420/galeria420_3.jpg') },
  { url: require('./images/galeria420/galeria420_4.jpg') },
  { url: require('./images/galeria420/galeria420_5.jpg') },];



export const TragonautasHome = () => {
  const screenWidth = window.innerWidth;

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    // Function to update the window width state
    const updateWindowWidth = () => {
      setWindowWidth(window.innerWidth);
    };

    // Add event listener for window resize
    window.addEventListener('resize', updateWindowWidth);

    // Clean up the event listener when component unmounts
    return () => {
      window.removeEventListener('resize', updateWindowWidth);
    };
  }, []);


  return (
    <div className='App-home'>
      <header className="header-home">
        <img src={logotr} className="tragonautas-logo-home" alt="logo" />
      </header>
      <div className='informacion'>
        <div className='fondo-info'>
          {/**<div className='quilmes-home'>BERAZATEGUI<a href='https://www.google.com/maps/' target='blank'>
            <img src={mapslogo} alt="maps logo"  style={{width:'30px', height:'30px', margin:'5px 0px 0px 5px'}} className='wsapplogo brishito'></img></a></div>
        <div className='telefono-home'><img src={bike} className='moto'></img> 11 0303-456 <a href='https://wa.me/541111111111' target='blank'><img src={wslogo} alt="wsapp logo" className='wsapplogo' style={{width:'30px', height:'30px', margin:'5px 0px 0px 5px'}}></img></a>
        </div> */}
          <div className='telefono-home' >SEGUINOS EN INSTAGRAM <a href='https://www.instagram.com/tragonautas4.20/' target='blank'><img src={iglogo} style={{ width: '35px', height: '35px', margin: '5px 0px 0px 5px' }} alt="ig logo" className='wsapplogo'></img></a></div>
          <div className='telefono-home' >PEDIDOS POR WHATSAPP 👉 11 3099 - 7258 <a href='https://wa.me/+541130997258' target='blank'><img src={wslogo} style={{ width: '35px', height: '35px', margin: '5px 0px 0px 5px' }} alt="ig logo" className='wsapplogo'></img></a></div>
          <div className='dire telefono-home' >CALLE 30 1909 esq. 119 - Berazategui <a href='https://www.google.com.ar/maps/place/C.+30+1909,+Berazategui+Oeste,+Provincia+de+Buenos+Aires/@-34.792317,-58.2289264,17.5z/data=!4m6!3m5!1s0x95a328e77b391ee1:0xcb194ee2557f2c8f!8m2!3d-34.7919809!4d-58.2269779!16s%2Fg%2F11qn63wshr?entry=ttu' target='blank'><img src={mapslogo} style={{ width: '35px', height: '35px', margin: '5px 0px 0px 5px' }} alt="ig logo" className='wsapplogo'></img></a></div>

       
        {<a href="https://menu.tragonautas420.com.ar" target="_blank">
          <button className='menurg'>NUESTRA CARTA</button>
        </a>}
        </div>


        <div className='testbg'>
          {/* Conditionally render the SimpleImageSlider based on screen width */}
        {screenWidth < 500 && (
          <SimpleImageSlider
            width={"100%"}
            height={"500px"}
            images={images}
            showNavs={true}
            navStyle={2}
            autoPlay={true}
          />
        )}
            {screenWidth > 501 && (
          <SimpleImageSlider
            width={"500px"}
            height={"600px"}
            images={images}
            showNavs={true}
            navStyle={2}
            autoPlay={true}

          />
        )}
</div>
        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3276.5549966825415!2d-58.22955282343632!3d-34.7919764674663!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95a328e77b391ee1%3A0xcb194ee2557f2c8f!2sC.%2030%201909%2C%20Berazategui%20Oeste%2C%20Provincia%20de%20Buenos%20Aires!5e0!3m2!1ses-419!2sar!4v1689891844455!5m2!1ses-419!2sar" width="100%" height="400" style={{ border: 0, margin: '10px 0px 10px 0px' }} allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>





      </div>

    </div>
  )
}
