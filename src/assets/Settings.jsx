import React from 'react'

function Settings(props) {


    const handleClose = () => {
        document.getElementById('settings').classList.remove('animaSettings')
        document.getElementById('settings').classList.add('closeSettings')
        document.getElementById('underlay').classList.remove('showOver')
        document.getElementById('underlay').classList.add('closeOver')
        setTimeout(() => {
            props.setSettings(prev => ({...prev, activated: false}))
        }, 500)
    }

    const handleSelect = (event) => {
        const value = event.target.value
        props.changeMode(value)
    }

    const handleDisplay = (event) => props.changeDisplay(event.target.value)

    return (
        <React.Fragment>
            <div className='--settings-underlay showOver' id='underlay' onClick={handleClose}>
            </div>
            <div className='--settings animSettings' id='settings'>
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
                    <div style={{display: 'flex', justifyContent: 'space-around',alignItems:'center', width: '22vw', backgroundColor: '#3c3c3c', border: '0.1vw solid white', borderLeft: '0', borderRight: '0', borderBottom: '0'}}>
                        <h1 className='--header-info --settings-info' style={{fontSize: '1vw'}}>Chart elements</h1>
                        <div class="slidecontainer">
                            <input type="range" min="4" max="25" value={props.chartElements} className="slider" id="myRange" onChange={props.handleChartElements}/>
                        </div>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'space-around',alignItems:'center', width: '22vw', backgroundColor: '#3c3c3c', border: '0.1vw solid white', borderLeft: '0', borderRight: '0', borderTop: '0'}}>
                        <h1 className='--header-info --settings-info' style={{fontSize: '1vw'}}>Chart type&nbsp;&nbsp;&nbsp;&nbsp;</h1>
                        <select style={{width:"33%"}} name="modeselect" id="modeselect" className='select-type' onChange={(event) => props.setChartType(event.target.value)} value={props.chartType}>
                            <option value="bar">Bar</option>
                            <option value="line">Line</option>
                        </select>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default React.memo(Settings)