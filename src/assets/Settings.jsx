import React from 'react'
import defaultpng from "./default.png"

function Settings(props) {

    const handleSelect = (event) => {
        const value = event.target.value
        props.changeMode(value)
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

    return (
        <React.Fragment>
            <div className={`--settings ${props.settings.activated ? `animSettings` : `closeSettings`}`} id='settings' 
            style={{backdropFilter: props.settings.theme == "dark-zero" && 'brightness(1.1)'}}>
                <div className='--settings-panel'>
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
                                <fieldset className='--settings-fieldset' style={{marginRight: '1vw', marginTop:"0", display: 'flex', flexDirection: 'column'}}>
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
                                <fieldset className='--settings-fieldset' style={{ display: 'flex', marginTop: "0", flexDirection: 'column'}}>
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

                    </fieldset>
                    <fieldset>
                        <legend>GAMEPLAY</legend>
                        <div className='--settings-panel-option-div'>
                            <label for="displayselecttitle" className="--settings-panel-option-info settingshideinfo">Choose your preferred language/difficulty</label>
                            <label for="modeselect" className='--settings-panel-option' 
                            onMouseEnter={revealOptionInfo} onMouseLeave={revealOptionInfo} opacity="0">Mode:</label>
                            <select name="modeselect" id="modeselect" className='select-type' onChange={handleSelect} value={props.settings.mode.name}>
                        <option value="enghard">English (hard)</option>
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
                    </fieldset>
                </div>
                <div className='--settings-panel'>
                    <fieldset style={{padding: '0'}}>
                        <legend>ACCOUNT</legend>
                        <div style={{height:'14vh', width: '100%'}}>
                            <img src={defaultpng} className="--settings-profile-picture" />
                        </div>
                    </fieldset>
                </div>
            </div>
        </React.Fragment>
    )
}

export default React.memo(Settings)

/*
            <div className={`--settings ${props.settings.activated ? `animSettings` : `closeSettings`}`} id='settings'>
                <div className='--settings-items'>
                    <h1 className='--header-info --settings-info' style={{marginTop: '-2vh'}}>Mode</h1>
                    <select name="modeselect" id="modeselect" className='select-type' onChange={handleSelect} value={props.settings.mode.name}>
                        <option value="enghard">English (hard)</option>
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
                <div className='--settings-items'>
                    <h1 className='--header-info --settings-info' style={{marginTop: '-2vh'}}>Display</h1>
                    <select name="displayselect" id="displayselect" className='select-type' onChange={handleDisplay} value={props.settings.displayType}>
                        <option value="stacked">Stacked</option>
                        <option value="sequential">Sequential</option>
                        <option value="singular">Two word</option>
                    </select>
                </div>
                <div>
                    <div style={{display: 'flex', justifyContent: 'space-around',alignItems:'center', width: '22vw', backgroundColor: 'rgba(255,255,255,0.2)', border: '0.1vw solid white', borderLeft: '0', borderRight: '0', borderBottom: '0'}}>
                        <h1 className='--header-info --settings-info' style={{fontSize: '1vw'}}>Chart elements</h1>
                        <div className="slidecontainer">
                            <input type="range" min="4" max="25" value={props.chartElements} className="slider" id="myRange" onChange={props.handleChartElements}/>
                        </div>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'space-around',alignItems:'center', width: '22vw', backgroundColor: 'rgba(255,255,255,0.2)', border: '0.1vw solid white', borderLeft: '0', borderRight: '0', borderTop: '0'}}>
                        <h1 className='--header-info --settings-info' style={{fontSize: '1vw'}}>Chart type&nbsp;&nbsp;&nbsp;&nbsp;</h1>
                        <select style={{width:"33%"}} name="modeselect" id="modeselect" className='select-type' onChange={(event) => props.setChartType(event.target.value)} value={props.chartType}>
                            <option value="bar">Bar</option>
                            <option value="line">Line</option>
                        </select>
                    </div>
                </div></div>
                */