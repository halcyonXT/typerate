import React from "react"
import shootingstar from './images/shootingstar.png'

export default function Backgrounds(props) {
    return (
        <React.Fragment>
            {
                props.theme == 'dark-zero' &&
                <div className="main-zero-wrap" style={{background: !props.backgroundEffects && '#0c0c0c'}}></div>
            }
            {
                props.theme == "dark-starry" &&
                <React.Fragment>
                <div className="black-wrap">
                    
                </div>
                <div className="main-star-wrap" id="stars-bg" style={{position: 'absolute', background: `radial-gradient(ellipse at bottom, #0d1d31 0%, #090a0d 100%)`}}>
                {
                props.backgroundEffects && //if bg effects are on display da stars
                    <React.Fragment>
                    <img src={shootingstar} className='main-star-star'/>
                    <img src={shootingstar} className='main-star-star'/>
                    <img src={shootingstar} className='main-star-star'/>
                    <img src={shootingstar} className='main-star-star'/>
                    <img src={shootingstar} className='main-star-star'/>
                    <img src={shootingstar} className='main-star-star'/>
                    <img src={shootingstar} className='main-star-star'/>
                    <img src={shootingstar} className='main-star-star'/>
                    <img src={shootingstar} className='main-star-star'/>
                    <img src={shootingstar} className='main-star-star'/>
                    <img src={shootingstar} className='main-star-star'/>
                    <img src={shootingstar} className='main-star-star'/>
                    <img src={shootingstar} className='main-star-star'/>
                    <img src={shootingstar} className='main-star-star'/>
                    <img src={shootingstar} className='main-star-star'/>
                    <img src={shootingstar} className='main-star-star'/>
                    <img src={shootingstar} className='main-star-star'/>
                    <img src={shootingstar} className='main-star-star'/>
                    <img src={shootingstar} className='main-star-star'/>
                    <img src={shootingstar} className='main-star-star'/>
                    <img src={shootingstar} className='main-star-star'/>
                    <img src={shootingstar} className='main-star-star'/>
                    <img src={shootingstar} className='main-star-star'/>
                    <img src={shootingstar} className='main-star-star'/>
                    <img src={shootingstar} className='main-star-star'/>
                    <img src={shootingstar} className='main-star-star'/>
                    <img src={shootingstar} className='main-star-star'/>
                    <img src={shootingstar} className='main-star-star'/>
                    <img src={shootingstar} className='main-star-star'/>
                    <img src={shootingstar} className='main-star-star'/>
                    <img src={shootingstar} className='main-star-star'/>
                    <img src={shootingstar} className='main-star-star'/>
                    <img src={shootingstar} className='main-star-star'/>
                    </React.Fragment>
                }
                </div>
                </React.Fragment>
            }
            {
                props.theme == "dark-symposium" && props.backgroundEffects &&
                <React.Fragment>
                    <ul className="circles">
                        <li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li>
                    </ul>
                </React.Fragment>
                
            }
        </React.Fragment>
    )
}