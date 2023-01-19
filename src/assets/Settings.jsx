import React from 'react'

function Settings(props) {

    const [selected, setSelected] = React.useState('enghard')

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

    return (
        <React.Fragment>
            <div className='--settings-underlay showOver' id='underlay' onClick={handleClose}>
            </div>
            <div className='--settings animSettings' id='settings' onChange={handleSelect}>
                <h1 className='--header-info' style={{color: '#3c3c3c'}}>Mode</h1>
                <select name="modeselect" id="modeselect">
                    <option value="enghard">English (hard)</option>
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
        </React.Fragment>
    )
}

export default React.memo(Settings)