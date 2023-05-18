import React from "react"
import { UserContext } from "./context/userContext"
import purplekeyboard from './images/purplekeyboard.png'
import goldkeyboard from "./images/goldkeyboard.png"
import silverkeyboard from "./images/silverkeyboard.png"
import bronzekeyboard from "./images/bronzekeyboard.png"
import whitekeyboard from "./images/whitekeyboard.png"

let subject

export default function Badges(props) {
    if (props.differentUser) {
        subject = props.user;
    } else {
        const { user } = React.useContext(UserContext)
        subject = user;
    }
    const handleHover = async (e, action) => {
        const target = e.target.nextSibling
        let animation
        switch (action) {
            case "enter":
                target.style.display = 'flex';
                animation = target.animate([
                    {opacity: '0', transform: 'translateX(0.5rem)'},
                    {opacity: '1', transform: 'translateX(0rem)'},
                ],{
                    duration: 200,
                })
                await animation.finished
                target.style.opacity = 1;
                break
            case "leave":
                animation = target.animate([
                    {opacity: '1', transform: 'translateX(0rem)'},
                    {opacity: '0', transform: 'translateX(0.5rem)'},
                ],{
                    duration: 200,
                })
                await animation.finished
                target.style.display = 'none';
                break
        }
    }

    function DisplayBadge({background, title, description, customTheme = null}) {
        let styles = {}
        let styleshr = {}
        let stylesbox = {}
        /*stylesbox.backgroundImage = `url(.${background})`
        stylesbox.backgroundSize = 'contain'
        stylesbox.backgroundPosition = 'center'
        stylesbox.backgroundRepeat = 'no-repeat'
        stylesbox.backgroundBlend*/
        stylesbox.zIndex = "2"
        if (customTheme) {
            switch(customTheme) {
                case "gold":
                    styles.color = 'transparent'
                    styles.backgroundImage = 'linear-gradient(30deg, #FFD700, #aa9100)'
                    styles.backgroundClip = 'text'
                    styles.WebkitBackgroundClip = 'text'
                    styles.fontWeight = 'bold'
                    styleshr.backgroundImage = 'linear-gradient(90deg, transparent, #aa9100, #FFD700, #aa9100, transparent)'
                    stylesbox.boxShadow = '#FFD70080 0px 0px 0.5rem'
                    break
                case "silver"://rgb(150, 150, 150)
                    styles.color = 'transparent'
                    styles.backgroundImage = 'linear-gradient(80deg, white, silver, rgb(150, 150, 150), silver)'
                    styles.backgroundClip = 'text'
                    styles.WebkitBackgroundClip = 'text'
                    styles.fontWeight = 'bold'
                    break
                case 'purple':
                    styles.color = 'transparent'
                    styles.backgroundImage = 'linear-gradient(30deg, #B03ADD, #6B019B)'
                    styles.backgroundClip = 'text'
                    styles.WebkitBackgroundClip = 'text'
                    styles.fontWeight = 'bold'
                    styleshr.backgroundImage = 'linear-gradient(90deg, transparent, #B03ADD, #6B019B, #B03ADD, transparent)'
                    stylesbox.boxShadow = '#B03ADD80 0px 0px 0.5rem'
                    break
            }
        }

        return (
            <div>
                <img src={background} className="--settings-user-badges" 
                style={{marginTop:'30%'}}
                onMouseEnter={(e) => handleHover(e, "enter")} 
                onMouseLeave={(e) => handleHover(e, "leave")}/>
                <div className="--settings-user-badges-info" style={stylesbox}>
                    <span className="--settings-user-badges-info-title" style={styles}>{title}</span>
                    <hr className='--settings-horizontal-line' style={styleshr}/>
                    <span className="--settings-user-badges-info-body" style={styles}>{description}</span>
                </div>
            </div>
        )
    }
    return (
        <div style={{display: 'flex', justifyContent: props.differentUser ? 'flex-start' : 'center', alignItems: 'center', gap: '-2.6rem'}}>
            {/* The component is formatted like this so the badges have a specific order */}
            {
                subject.badges.includes("whitekeyboard")
                &&
                <DisplayBadge background={whitekeyboard} title="5 games played" description={`Every new beginning comes from another beginning's end`} />
            }
            {
                subject.badges.includes("bronzekeyboard")
                &&
                <DisplayBadge background={bronzekeyboard} title="50 games played" description={`There's no stopping you now`} />
            }
            {
                subject.badges.includes("silverkeyboard")
                &&
                <DisplayBadge background={silverkeyboard} title="250 games played" description={`With great power comes great responsibility`} customTheme="silver"/>
            }
            {
                subject.badges.includes("goldkeyboard")
                &&
                <DisplayBadge background={goldkeyboard} title="500 games played" description={`We bow to your majesty, sir ${subject.username[0].toUpperCase() + subject.username.slice(1)}`} customTheme="gold"/>
            }
            {
                subject.badges.includes("purplekeyboard")
                &&
                <DisplayBadge background={purplekeyboard} title="1000 games played" description={`Why be a king, when you can be a God`} customTheme="purple"/>
            }
            {/* Why be a king when you can be a god */}
        </div>
    )
}