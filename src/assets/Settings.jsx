import React from 'react'
import Badges from './Badges'
import AccountSettings from './AccountSettings'
import defaultpng from "./images/default.png"
import {Link, Routes} from "react-router-dom"
import { getUser, logout, updateStats, updateProfilePicture, resetStats, deleteAccount } from '../api/user'
import { UserContext } from './context/userContext'
import DetailedStats from './DetailedStats'
import UserSearch from './UserSearch'

let timer;


function Settings(props) {
    const { user, updateUser } = React.useContext(UserContext) 

    const [userData, setUserData] = React.useState({wpm: 0, cpm: 0, accuracy: 0})
    const [dangerPrompt, setDangerPrompt] = React.useState({activated: false, action: ''})
    const [profileSettings, setProfileSettings] = React.useState({activated: false})
    const [activePanel, setActivePanel] = React.useState("general")
    const [targetedDetails, setTargetedDetails] = React.useState({active: false, user: {}})
    const [showGameplay, setShowGameplay] = React.useState(true)
    const [keyChanging, setKeyChanging] = React.useState(false)

    const deleteAndLogout = async () => {
        await deleteAccount()
        logout()
        updateUser()
        setDangerPrompt({activated: false, action: ''})
    }

    const handleSelect = (event) => {
        const value = event.target.value
        props.changeMode(value)
    }

    const resetUserStats = async () => {
        changeDangerPrompt(true, dangerPrompt.action)
        await resetStats()
        updateUser()
    }
    const handleDisplay = (event) => props.changeDisplay(event.target.value)


    const revealOptionInfo = (e) => {
        if (!e.target.previousSibling.classList[0] == "--settings-panel-option-info") {return}
        if (!e.target.previousSibling.classList[1] || e.target.previousSibling.classList[1] == "settingsrevealinfo") {
            e.target.previousSibling.classList.remove("settingsrevealinfo")
            e.target.previousSibling.classList.add("settingshideinfo")
            setTimeout(() => {
                e.target.previousSibling.display = "none"
            }, 150)
        } else {
            e.target.previousSibling.display = "block"
            e.target.previousSibling.classList.remove("settingshideinfo")
            e.target.previousSibling.classList.add("settingsrevealinfo")
        }
    }

    const toggleSwitch = (option) => props.setSettings(prev => ({...prev, [`${option}`]: !prev[`${option}`]}))

    const setOption = (option, value) => props.setSettings(prev => ({...prev, [`${option}`]: value}))

    const changeDangerPrompt = (hide, action) => setDangerPrompt({activated: hide ? false : true, action: action})

    const userLogout = async () => {
        await logout()
        updateUser()
        setUserData({wpm: 0, cpm: 0, accuracy: 0})
    }

    React.useEffect(() => {
        if (user.loggedin) {
            let wpm = 0, cpm = 0, accuracy = 0
            user.gamesPlayed.forEach(item => {
                if (item instanceof Object) {
                    if (isNaN(item.wpm) || isNaN(item.cpm) || isNaN(item.accuracy)) {} else {
                        wpm += item.wpm
                        cpm += item.cpm
                        accuracy += item.accuracy
                    }
                } 
            })
            wpm = wpm / user.gamesPlayed.length
            cpm = cpm / user.gamesPlayed.length
            accuracy = accuracy / user.gamesPlayed.length
            if (wpm === Infinity) {wpm = 0}
            if (cpm === Infinity) {cpm = 0}
            if (accuracy === Infinity) {accuracy = 0}
            if (user.gamesPlayed.length === 0) {
                wpm = 0;
                cpm = 0;
                accuracy = 0;
            }
            setUserData({wpm: wpm.toFixed(2), cpm: cpm.toFixed(2), accuracy: accuracy.toFixed(2)})
        }
    }, [user.gamesPlayed])

    const handleChangeRestartKey = (e) => {
        setKeyChanging(true)
        props.changeStopKey()
    }

    React.useEffect(() => {
        setKeyChanging(false)
    }, [props.stopKey])


    return (
        <React.Fragment>
            {
                activePanel === "detailedstats" &&
                (
                    <div className="--settings">
                        {
                            targetedDetails.active ?
                            <DetailedStats setActivePanel={setActivePanel} differentUser={true} user={targetedDetails.user} setTargetedDetails={setTargetedDetails}/>
                            :
                            <DetailedStats setActivePanel={setActivePanel}/>
                        }
                    </div>
                )
            }
            {
            activePanel === "general" &&
            (
                <React.Fragment>
                <AccountSettings profileSettings={profileSettings} setProfileSettings={setProfileSettings} revealOptionInfo={revealOptionInfo}/>
                <div className='--settings-danger-prompt' style={{display: dangerPrompt.activated ? 'grid' : 'none'}}>
                    <fieldset className='--settings-fieldset' style={{padding: '0.7rem'}}>
                        <legend>Are you sure?</legend>
                        <p style={{color: 'white'}}>You won't be able to undo this action later</p>
                        <div style={{display: 'flex'}}>
                            <button className='--settings-button' style={{width: '48%', color: 'rgb(255, 123, 123)', borderColor: 'rgb(255, 123, 123)'}} onClick={dangerPrompt.action}>PROCEED</button>
                            <button className='--settings-button' style={{width: '48%'}} onClick={() => changeDangerPrompt(true, dangerPrompt.action)}>CANCEL</button>
                        </div>
                    </fieldset>
                </div>
                <div className={`--settings animSettings`} id='settings' 
                style={{backdropFilter: props.settings.theme == "dark-zero" && 'brightness(1.1)'}}>
                    <div className='--settings-panel'>
                        <fieldset style={{padding: '0'}}>
                                <legend>ACCOUNT</legend>
                                <div style={{height:'14vh', width: '100%', display: 'flex'}}>
                                    <img 
                                        src={
                                            user.profilePicture === "default"
                                            ?
                                            defaultpng
                                            :
                                            user.profilePicture
                                        } 
                                        className="--settings-profile-picture --pfp" 
                                        style={{borderRadius: '0.3rem'}}
                                        onError={(e) => e.target.src = defaultpng}
                                    />
                                    <div style={{marginTop:'1%', width: '100%', position: 'relative'}}>
                                        <div style={{width: '90%', padding: '0 5% 0 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                            <div style={{display: 'flex', alignItems: 'center', justifyContent:'flex-start', width:'70%'}}>
                                                <h2 
                                                    style={{
                                                        color: 'white', 
                                                        margin: '0', 
                                                        textAlign: 'center', 
                                                        display: 'flex', 
                                                        alignItems: 'center', 
                                                        justifyContent:'space-between', 
                                                        width: 'max-content',
                                                        maxWidth: '55%',
                                                        textOverflow: 'ellipsis',
                                                        overflow: 'hidden',
                                                        whiteSpace: 'nowrap',
                                                        fontSize: '1.3rem'
                                                    }}>
                                                    {user.username}
                                                </h2>
                                                {
                                                    user.loggedin
                                                    &&
                                                    <div style={{display:'flex', 
                                                    alignItems: 'center', 
                                                    justifyContent: 'flex-end', 
                                                    width: 'max-content',
                                                    maxWidth: '45%', 
                                                    textOverflow: 'ellipsis', 
                                                    fontStyle: 'italic',
                                                    paddingRight:'1%',
                                                    overflow: 'hidden', 
                                                    whiteSpace: 'nowrap'}}>
                                                        <span style={{fontWeight:'200',fontSize:'0.8rem', height: 'max-content', margin:0}}>
                                                            <span style={{fontWeight:'400'}}>
                                                                &nbsp;-&nbsp;{user.gamesPlayed.length}&nbsp;
                                                            </span> 
                                                            games played
                                                        </span>
                                                    </div>
                                                }
                                            </div>
                                            {
                                                !user.loggedin
                                                &&
                                                <p style={{color: 'white', margin:'0', fontSize: '0.55rem', opacity: '0.7', 
                                                    width: '100%',
                                                    maxWidth: '100%', 
                                                    textOverflow: 'ellipsis', 
                                                    overflow: 'hidden', 
                                                    textAlign: 'right',
                                                    whiteSpace: 'nowrap'}}>
                                                        Stats and options aren't saved unless you log in
                                                    </p>
                                            }
                                            <Badges/>
                                        </div>
                                        <div style={{display: 'flex', width: '90%', justifyContent: 'space-between', padding: '0 5% 0 5%'}}>
                                            <div style={{display: 'flex', flexDirection: 'column', alignItems:'center', marginTop: '2.5vh', gap: '0.5vh'}}>
                                                <p style={{color: 'white', margin: '0',fontWeight:'200'}}>Average WPM:</p>
                                                <p style={{color: 'white', margin: '0'}}>{userData.wpm} wpm</p>
                                            </div>
                                            <div style={{display: 'flex', flexDirection: 'column', alignItems:'center', marginTop: '2.5vh', gap: '0.5vh'}}>
                                                <p style={{color: 'white', margin: '0',fontWeight:'200'}}>Average CPM:</p>
                                                <p style={{color: 'white', margin: '0'}}>{userData.cpm} cpm</p>
                                            </div>
                                            <div style={{display: 'flex', flexDirection: 'column', alignItems:'center', marginTop: '2.5vh', gap: '0.5vh'}}>
                                                <p style={{color: 'white', margin: '0',fontWeight:'200'}}>Average acc:</p>
                                                <p style={{color: 'white', margin: '0'}}>{userData.accuracy}%</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='--settings-panel-option-div'>
                                    {
                                        user.loggedin 
                                        ?
                                        <button className='--settings-button' style={{width: '100%'}} onClick={userLogout}>LOG OUT</button>
                                        :
                                        <React.Fragment>
                                            <Link to="/typerate/login" className='--settings-button --settings-link' style={{width: '48%', fontSize: '0.7rem'}}>LOG IN</Link>
                                            <Link to="/typerate/signup" className='--settings-button --settings-link' style={{width: '48%', fontSize: '0.7rem'}}>REGISTER</Link>
                                        </React.Fragment>
                                    }
                                </div>
                                <div className='--settings-panel-option-div'>
                                    <button 
                                        className='--settings-button' 
                                        style={{opacity: user.loggedin ? "1" : "0.5", pointerEvents: user.loggedin ? "all" : "none", width: '100%'}}
                                        onClick={() => setActivePanel("detailedstats")}
                                        >DETAILED STATS</button>
                                </div>
                                <div className='--settings-panel-option-div'>
                                    <button 
                                        className='--settings-button' 
                                        style={{opacity: user.loggedin ? "1" : "0.5", pointerEvents: user.loggedin ? "all" : "none", width: '100%'}}
                                        onClick={() => setProfileSettings(prev => ({...prev, activated: true}))}>ACCOUNT SETTINGS</button>
                                </div>
                                <div className='--settings-panel-option-div' style={{opacity: user.loggedin ? "1" : "0.5", pointerEvents: user.loggedin ? "all" : "none"}}>
                                    <button className='--settings-button' style={{width: '48%', color: 'rgb(255, 123, 123)', borderColor: 'rgb(255, 123, 123)'}} 
                                    onClick={() => changeDangerPrompt(false, resetUserStats)}>RESET STATS</button>
                                    <button className='--settings-button' style={{width: '48%', color: 'rgb(255, 123, 123)', borderColor: 'rgb(255, 123, 123)'}} 
                                    onClick={() => changeDangerPrompt(false, deleteAndLogout)}>DELETE ACCOUNT</button>
                                </div>
                            </fieldset>
                            <fieldset>
                            <legend>DISPLAY</legend>
                            <div className='--settings-panel-option-div'>
                                <label for="displayselecttitle" className="--settings-panel-option-info settingshideinfo">Choose how you want words displayed on your screen</label>
                                <label for="displayselect" name="displayselecttitle" className='--settings-panel-option'
                                onMouseEnter={revealOptionInfo} onMouseLeave={revealOptionInfo}>{//onClick={this.previousSibling.style.display = "none"}
                                }
                                    Display&nbsp;type:
                                </label>
                                <select name="displayselect" id="displayselect" className='select-type' onChange={handleDisplay} value={props.settings.displayType}>
                                    <option value="stacked">Stacked</option>
                                    <option value="sequential">Sequential</option>
                                    <option value="singular">Two word</option>
                                </select>
                            </div>
                            <div className='--settings-panel-option-div'>
                                <label for="displayselecttitle" className="--settings-panel-option-info settingshideinfo">Choose the look of the site</label>
                                <label for="themeselect" className='--settings-panel-option'
                                onMouseEnter={revealOptionInfo} onMouseLeave={revealOptionInfo}>Theme:</label>
                                <div name="themeselect" style={{display: 'flex'}}>
                                    <fieldset className='--settings-fieldset' style={{marginRight: '1rem', marginTop:"0", display: 'flex', flexDirection: 'column', gap: '0'}}>
                                        <legend>light</legend>
                                        <button className='--settings-button'
                                        style={{background: props.settings.theme == "light-colorful" ? `linear-gradient(45deg, rgba(0,240,240,0.5), rgba(255,0,255,0.5))` : "none"}}
                                        onClick={() => setOption("theme", "light-colorful")}>COLORFUL</button>
                                        <button className='--settings-button' 
                                        style={{background: props.settings.theme == "light-elegant" ? `linear-gradient(45deg, rgba(180,180,180,0.5), rgba(0,0,0,0.5))` : "none"}}
                                        onClick={() => setOption("theme", "light-elegant")}>ELEGANT</button>
                                        <button className='--settings-button'
                                        style={{background: props.settings.theme == "light-simple" ? `rgba(0,0,0,0.5)` : "none"}}
                                        onClick={() => setOption("theme", "light-simple")}>SIMPLE</button>
                                    </fieldset>
                                    <fieldset className='--settings-fieldset' style={{ display: 'flex', marginTop: "0", flexDirection: 'column', gap: '0'}}>
                                        <legend>dark</legend>
                                        <button className='--settings-button' 
                                        style={{background: props.settings.theme == "dark-symposium" ? `linear-gradient(45deg, rgba(0,240,240,0.5), rgba(255,0,255,0.5))` : "none"}}
                                        onClick={() => setOption("theme", "dark-symposium")}>SYMPOSIUM</button>
                                        <button className='--settings-button'
                                        style={{background: props.settings.theme == "dark-zero" ? `rgba(0,0,0,0.5)` : "none"}}
                                        onClick={() => setOption("theme", "dark-zero")}>ZERO</button>
                                        <button className='--settings-button'
                                        style={{background: props.settings.theme == "dark-starry" ? `linear-gradient(45deg, rgba(101,8,135,0.5), rgba(0,25,125,0.5))` : "none"}}
                                        onClick={() => setOption("theme", "dark-starry")}>STARRY</button>
                                    </fieldset>
                                </div>
                            </div>
                            <div className='--settings-panel-option-div'>
                                <label for="displayselecttitle" className="--settings-panel-option-info settingshideinfo">Disabling effects can boost performance</label>
                                <label for="modeselect" className='--settings-panel-option' 
                                onMouseEnter={revealOptionInfo} onMouseLeave={revealOptionInfo} opacity="0">Background&nbsp;effects:</label>
                                <div class="checkbox-wrapper-14">
                                    <input type="checkbox" class="switch" checked={props.settings.backgroundEffects} onClick={() => toggleSwitch("backgroundEffects")}/>
                                </div>
                            </div>
                            <div className='--settings-panel-option-div'>
                                <label for="displayselecttitle" className="--settings-panel-option-info settingshideinfo">Display the currently pressed keys during gameplay</label>
                                <label for="modeselect" className='--settings-panel-option' 
                                onMouseEnter={revealOptionInfo} onMouseLeave={revealOptionInfo} opacity="0">Show&nbsp;pressed&nbsp;keys:</label>
                                <div class="checkbox-wrapper-14">
                                    <input type="checkbox" class="switch" checked={props.settings.showKeys} onClick={() => toggleSwitch("showKeys")}/>
                                </div>
                            </div>
                        </fieldset>
                    </div>
                    <div className='--settings-panel'>
                    <UserSearch setShowGameplay={setShowGameplay} setTargetedDetails={setTargetedDetails} setActivePanel={setActivePanel} showGameplay={showGameplay}/>
                    <fieldset style={{opacity: !showGameplay && '0', pointerEvents: !showGameplay && 'none'}}>
                            <legend>GAMEPLAY</legend>
                            <div className='--settings-panel-option-div'>
                                <label for="displayselecttitle" className="--settings-panel-option-info settingshideinfo">Choose your preferred language/difficulty</label>
                                <label for="modeselect" className='--settings-panel-option' 
                                onMouseEnter={revealOptionInfo} onMouseLeave={revealOptionInfo} opacity="0">Mode:</label>
                                <select name="modeselect" id="modeselect" className='select-type' onChange={handleSelect} value={props.settings.mode.name}>
                            <option value="engmed">English (medium)</option>
                            <option value="en">English (easy)</option>
                            <option value="af">Afrikaans</option>
                            <option value="ar">Arabic</option>
                            <option value="az">Azerbaijani</option>
                            <option value="be">Belarusian</option>
                            <option value="bg">Bulgarian</option>
                            <option value="bn">Bengali</option>
                            <option value="bs">Bosnian</option>
                            <option value="ca">Catalan</option>
                            <option value="ceb">Cebuano</option>
                            <option value="co">Corsican</option>
                            <option value="cs">Czech</option>
                            <option value="cy">Welsh</option>
                            <option value="da">Danish</option>
                            <option value="de">German</option>
                            <option value="el">Greek</option>
                            <option value="eo">Esperanto</option>
                            <option value="es">Spanish</option>
                            <option value="et">Estonian</option>
                            <option value="fa">Persian</option>
                            <option value="fi">Finnish</option>
                            <option value="fr">French</option>
                            <option value="ga">Irish</option>
                            <option value="he">Hebrew</option>
                            <option value="hi">Hindi</option>
                            <option value="hr">Croatian</option>
                            <option value="hu">Hungarian</option>
                            <option value="hy">Armenian</option>
                            <option value="id">Indonesian</option>
                            <option value="it">Italian</option>
                            <option value="ja">Japanese</option>
                            <option value="ka">Georgian</option>
                            <option value="ko">Korean</option>
                            <option value="lt">Lithuanian</option>
                            <option value="lv">Latvian</option>
                            <option value="nl">Dutch</option>
                            <option value="no">Norwegian</option>
                            <option value="pt">Portugese</option>
                            <option value="ro">Romanian</option>
                            <option value="ru">Russian</option>
                            <option value="sr">Serbian</option>
                            <option value="sv">Swedish</option>
                            <option value="tr">Turkish</option>
                            <option value="uk">Ukranian</option>
                            <option value="zh">Chinese</option>
                                </select>
                            </div>
                            <div className='--settings-panel-option-div'>
                                <label for="displayselecttitle" className="--settings-panel-option-info settingshideinfo">Choose whether words with small typos are accepted or not</label>
                                <label for="displayselect" name="displayselecttitle" className='--settings-panel-option'
                                onMouseEnter={revealOptionInfo} onMouseLeave={revealOptionInfo}>
                                    Acceptance&nbsp;leisure:
                                </label>
                                <div class="checkbox-wrapper-14">
                                    <input type="checkbox" class="switch" checked={props.settings.leisure} onClick={() => toggleSwitch("leisure")}/>
                                </div>
                            </div>
                            <div className='--settings-panel-option-div'>
                                <label for="displayselecttitle" className="--settings-panel-option-info settingshideinfo">Choose which key to end a word with</label>
                                <label for="modeselect" className='--settings-panel-option' 
                                onMouseEnter={revealOptionInfo} onMouseLeave={revealOptionInfo} opacity="0">Word&nbsp;completion:</label>
                                <div style={{display: 'flex', flexDirection: 'row'}}>
                                    <button className='--settings-button' style={props.settings.completionKey == "space" ? ({color: 'black', backgroundColor: 'white'}) : ({color: 'white'})}
                                    onClick={() => setOption("completionKey", "space")}>SPACE</button>
                                    <button className='--settings-button' style={props.settings.completionKey == "enter" ? ({color: 'black', backgroundColor: 'white'}) : ({color: 'white'})}
                                    onClick={() => setOption("completionKey", "enter")}>ENTER</button>
                                    <button className='--settings-button' style={props.settings.completionKey == "auto" ? ({color: 'black', backgroundColor: 'white'}) : ({color: 'white'})}
                                    onClick={() => setOption("completionKey", "auto")}>AUTO</button>
                                </div>
                            </div>
                            <div className='--settings-panel-option-div'>
                                <label for="displayselecttitle" className="--settings-panel-option-info settingshideinfo">Option to force stop input on incorrect</label>
                                <label for="displayselect" name="displayselecttitle" className='--settings-panel-option'
                                onMouseEnter={revealOptionInfo} onMouseLeave={revealOptionInfo}>
                                    Stop&nbsp;on&nbsp;incorrect:
                                </label>
                                <div class="checkbox-wrapper-14">
                                    <input type="checkbox" class="switch" checked={props.settings.stopOnIncorrect} onClick={() => {props.setSettings(prev => ({...prev, stopOnIncorrect: !prev.stopOnIncorrect}))}}/>
                                </div>
                            </div>
                            <div className='--settings-panel-option-div'>
                                <label for="displayselecttitle" className="--settings-panel-option-info settingshideinfo">Choose if you want the header during the gameplay</label>
                                <label for="modeselect" className='--settings-panel-option' 
                                onMouseEnter={revealOptionInfo} onMouseLeave={revealOptionInfo} opacity="0">Hide&nbsp;header&nbsp;during&nbsp;gameplay:</label>
                                <div class="checkbox-wrapper-14">
                                    <input type="checkbox" class="switch" checked={props.settings.hideHeader} onClick={() => toggleSwitch("hideHeader")}/>
                                </div>
                            </div>
                            <div className='--settings-panel-option-div' style={{opacity: !props.settings.hideHeader && '0.4', pointerEvents: !props.settings.hideHeader && 'none'}}>
                                <label for="displayselecttitle" className="--settings-panel-option-info settingshideinfo">Choose if you want counters displaying during gameplay</label>
                                <label for="modeselect" className='--settings-panel-option' 
                                onMouseEnter={revealOptionInfo} onMouseLeave={revealOptionInfo} opacity="0">Show&nbsp;counters&nbsp;during&nbsp;gameplay:</label>
                                <div class="checkbox-wrapper-14">
                                    <input type="checkbox" class="switch" checked={props.settings.hideHeaderShowCounter} onClick={() => toggleSwitch("hideHeaderShowCounter")}/>
                                </div>
                            </div>
                            <div className='--settings-panel-option-div'>
                                <label 
                                    for="displayselecttitle" 
                                    className="--settings-panel-option-info settingshideinfo"
                                    style={{marginTop:'-1.5vh', pointerEvents: 'none'}}
                                >Choose the key layout of your keyboard you want to use<br/>This option assumes you have a QWERTY keyboard</label>
                                <label for="modeselect" className='--settings-panel-option' 
                                onMouseEnter={revealOptionInfo} onMouseLeave={revealOptionInfo} opacity="0">Keyboard&nbsp;layout:</label>
                                <div style={{display: 'flex'}}>
                                    <div style={{width: '7.5rem'}}>
                                        <button 
                                            className='--settings-button'
                                            style={props.settings.keyboardLayout == "QWERTY" ? ({color: 'black', backgroundColor: 'white'}) : ({color: 'white'})}
                                            onClick={() => setOption("keyboardLayout", "QWERTY")}
                                        >QWERTY</button>
                                        <button 
                                            className='--settings-button'
                                            style={props.settings.keyboardLayout == "QWERTZ" ? ({color: 'black', backgroundColor: 'white'}) : ({color: 'white'})}
                                            onClick={() => setOption("keyboardLayout", "QWERTZ")}
                                        >QWERTZ</button>
                                    </div>
                                    <div style={{width: '7.5rem'}}>
                                        <button 
                                            className='--settings-button'
                                            style={props.settings.keyboardLayout == "AZERTY" ? ({color: 'black', backgroundColor: 'white'}) : ({color: 'white'})}
                                            onClick={() => setOption("keyboardLayout", "AZERTY")}
                                        >AZERTY</button>
                                        <button 
                                            className='--settings-button'
                                            style={props.settings.keyboardLayout == "DVORAK" ? ({color: 'black', backgroundColor: 'white'}) : ({color: 'white'})}
                                            onClick={() => setOption("keyboardLayout", "DVORAK")}
                                        >DVORAK</button>
                                    </div>
                                    <div style={{width: '7.5rem'}}>
                                        <button 
                                            className='--settings-button'
                                            style={props.settings.keyboardLayout == "COLEMAK" ? ({color: 'black', backgroundColor: 'white'}) : ({color: 'white'})}
                                            onClick={() => setOption("keyboardLayout", "COLEMAK")}
                                        >COLEMAK</button>
                                        <label 
                                            for="displayselecttitle" 
                                            className="--settings-panel-option-info settingshideinfo"
                                            style={{left:'87%', marginTop:'-1vh'}}
                                        >Unchanged keyboard layout</label>
                                        <button
                                            onMouseEnter={revealOptionInfo} 
                                            onMouseLeave={revealOptionInfo}
                                            onClick={() => setOption("keyboardLayout", "DEFAULT")}
                                            className='--settings-button'
                                            style={
                                                props.settings.keyboardLayout == "DEFAULT" ? ({color: 'black', backgroundColor: 'white'}) : ({color: 'white'})
                                            }
                                        >DEFAULT</button>
                                    </div>
                                </div>
                            </div>
                            <div className='--settings-panel-option-div'>
                                <label for="displayselecttitle" className="--settings-panel-option-info settingshideinfo">Plays a sound if word is entered incorrectly</label>
                                <label for="modeselect" className='--settings-panel-option' 
                                onMouseEnter={revealOptionInfo} onMouseLeave={revealOptionInfo}>Play&nbsp;sound&nbsp;on&nbsp;incorrect:</label>
                                <div class="checkbox-wrapper-14">
                                    <input type="checkbox" class="switch" checked={props.settings.playSoundOnIncorrect} onClick={() => toggleSwitch("playSoundOnIncorrect")}/>
                                </div>
                            </div>
                            <div className='--settings-panel-option-div' style={{opacity: !user.loggedin && '0.4', pointerEvents: !user.loggedin && 'none'}}>
                                <label for="displayselecttitle" className="--settings-panel-option-info settingshideinfo">Requires login. Option to exclude games from account score and makes restart faster</label>
                                <label for="modeselect" className='--settings-panel-option' 
                                onMouseEnter={revealOptionInfo} onMouseLeave={revealOptionInfo}>Practice&nbsp;mode:</label>
                                <div class="checkbox-wrapper-14">
                                    <input type="checkbox" class="switch" checked={user.loggedin ? props.settings.practiceMode : false} onClick={() => toggleSwitch("practiceMode")}/>
                                </div>
                            </div>
                            <div className='--settings-panel-option-div' style={{paddingTop: '0.42rem', paddingBottom: '0.42rem'}}>
                                <label for="displayselecttitle" className="--settings-panel-option-info settingshideinfo">Hold this key to stop the test after starting it</label>
                                <label for="modeselect" className='--settings-panel-option' 
                                onMouseEnter={revealOptionInfo} onMouseLeave={revealOptionInfo}>Stop&nbsp;key:</label>
                                <div className="--main-keys-key" style={{display:'flex', alignItems: 'flex-start', justifyContent: 'center', width: 'max-content', minWidth: '2.6rem', height: '2.6rem', color: 'black', cursor: 'pointer', fontSize: keyChanging ? '0.8rem' : '1.4rem'}} 
                                    onClick={handleChangeRestartKey}>{keyChanging ? "Press any key" : props.stopKey}
                                </div>
                            </div>
                        </fieldset>
                    </div>
                </div>
                </React.Fragment>
                )
            }
        </React.Fragment>
    )
}

export default React.memo(Settings)
