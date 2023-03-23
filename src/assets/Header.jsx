import React from 'react'
import menuicon from './menu.png'
import logoicon from './icon.png'
import headerpanelpng from './headerpanels.png'

function Header(props) {
    let [accuracy, setAccuracy] = React.useState(100)
    let [speed, setSpeed] = React.useState({wpm: 0, cpm: 0})
    let [dispTime, setDispTime] = React.useState(props.time / 1000)
    let [timeMarkers, setTimeMarkers] = React.useState([]) //Time markers for saving chart data
    const ref = React.useRef()


    const getTotalChars = (checkWrong = false) => { //checkWrong includes severity check
        let sum = 0
        for (let word of props.words) {
            if (checkWrong) {
                if (word.status === 'incorrect') {
                    if (word.hasOwnProperty('accepted') && word.accepted == true) {
                        sum += word.body.length
                        continue
                    } else if (word.hasOwnProperty('accepted') && word.accepted == false) {
                        continue
                    }
                } else sum += word.body.length
            } else sum += word.body.length
        }
        return sum
    }

    const calcCPM = () => {
        let sum = getTotalChars(true)
        return sum === 0 ? 0 : Math.ceil(((sum / ((props.defTime / 1000) - dispTime)) * 60) * 100) / 100
    }

    const calcWPM = () => {
        let sum = Math.ceil(getTotalChars(true) / 5)
        let outp = 0
        if (dispTime < (props.defTime / 1000)) {
            outp = Math.ceil(((sum / ((props.defTime / 1000) - dispTime)) * 60 ) * 100) / 100
        } else outp = 0
        return outp
    }

    React.useEffect(() => {
        let corSum = 0
        for (let item of props.words) {
            if (item.status === 'correct') {++corSum}
        }
        setAccuracy(props.words.length === 0 ? 100 : Math.ceil(((corSum * 100) / props.words.length) * 100) / 100)
        setSpeed({wpm: calcWPM(), 
                cpm: calcCPM()}) 
    }, [dispTime])

    React.useEffect(() => { //every time controlled time changes calculate display time 
        setDispTime(prev => {
            if (props.time <= 0) {return 0} else {return props.time / 1000}
        })
        if ((calcWPM()) > props.finishData.maxWPM) {
            if (props.time < (props.defTime - (props.defTime / 5))) {
                props.tools.changeFinishData(prev => ({...prev, maxWPM: calcWPM()}))
            }
        }
        if (calcCPM() > props.finishData.maxCPM) {
            if (props.time < (props.defTime - (props.defTime / 5))) {
                props.tools.changeFinishData(prev => ({...prev, maxCPM: calcCPM()}))
            }
        }
        if (timeMarkers.includes(props.time)) {
            props.tools.changeChartData(prev => [...prev, {
                time: props.time,
                wpm: calcWPM(),
                cpm: calcCPM()
            }])
        }
        //calcWPM()
        if (props.time == 0) {
            props.tools.changeFinishData(prev => ({...prev, WPM: calcWPM(),
                CPM: calcCPM(),
                accuracy: accuracy
            }))
        }
    }, [props.time])

    React.useEffect(() => { //When the game starts, Header defines times at which it should log WPM and CPM for chart data
        if (props.started) {
            let increment = Math.ceil((props.defTime / props.chartElements) / 100) * 100
            document.getElementById('check').disabled = true;
            setTimeMarkers(prev => {
                let outp = [increment]
                for (let i = 1; i < props.chartElements - 1; i++) {
                    outp[i] = outp[i-1] + increment
                }
                return outp
            })
            props.tools.changeFinishData(prev => ({...prev, autocompletion: props.settings.completionKey == "auto" ? true : false, leisure: props.settings.leisure ? true : false}))
        } else {
            document.getElementById('check').disabled = false;
        }
    },[props.started])

    const handleTimeChange = () => { //this function takes value from ref so as to not get the lagging behind bug in the defTime and Time states. Updates defTime and Time with new value
        if (!props.started) {
            let newVal = ref.current.value
            newVal = newVal.split('')
            for (let char in newVal) {
                if (isNaN(newVal[char])) {
                    newVal.splice(char, 1)
                }
            }
            newVal = newVal.join('')
            if (!isNaN(Number(newVal))) {
                props.tools.changeDef(prev => {
                    if (newVal * 1000 == 0) {
                        newVal = 1
                    }
                    return newVal * 1000
                })
                props.tools.changeTime(prev => {
                    if (newVal * 1000 == 0) {
                        newVal = 1
                    }
                    return newVal * 1000
                })
            }
        }
    }


    const handleClose = () => {
        document.getElementById('settings').classList.remove('animaSettings')
        document.getElementById('settings').classList.add('closeSettings')
        setTimeout(() => {
            props.tools.changeSettings(prev => ({...prev, activated: false}))
        }, 500)
    }

    React.useEffect(() => {
        if (props.settings.hideHeader && props.settings.hideHeaderShowCounter && props.started) {
            const frames = [
                {transform: 'scale(0.85)', opacity: '1'},
                {transfrom: 'scale(1)', color: '0.75'}
            ]
            const timing = {
                duration: 200,
                iterations: 1,
                fillMode: "forwards"
            }
            document.querySelector('.--header-off-wpm').animate(frames, timing)
        }
    },[props.words])

    return (
        <React.Fragment>
        <div className='--header' 
        style={{backdropFilter: props.settings.theme == "dark-zero" ? 'brightness(1.3)' : props.settings.theme == 'light-colorful' && 'blur(1vw) brightness(0.7)'}}>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <img src={logoicon} style={{height: '1.7vw', marginRight: '0.5vw', pointerEvents: 'none', marginTop: '0.3vw'}} />
                <h1 className='--header-logo'>typerate</h1>
                <div className='--header-blinker'></div>
            </div>
            <div className='--header-container' style={{width: '39%', paddingRight:'1vw'}}>
                <div className='--header-container items-main'>
                    <div className='items'>
                        <img src={headerpanelpng} className='--header-panel-image'/>
                    </div>
                    <h1 className='--header-info'>{accuracy}%</h1>
                    <h6 className='--header-info-sub --header-info-sub-acc'>ACCURACY</h6>
                </div>
                <div className='--header-container items-main'>
                    <div className='items'>
                        <img src={headerpanelpng} className='--header-panel-image'/>
                    </div>
                    <div style={{width:'100%', textAlign: 'center', marginTop: '1vh'}}>
                        <div style={{display: 'flex', justifyContent:'space-between', alignItems: 'center', fontStyle: 'italic', marginLeft: '-0.2vw'}}>
                            <h2 className='--header-info cwpm' style={{margin:0, fontSize: '1.3057vw'}}>{speed.wpm}</h2>
                            <h2 className='--header-info label' style={{paddingRight: '0.7vw'}}>wpm</h2>
                        </div>
                        <div style={{display: 'flex', justifyContent:'space-between', alignItems: 'flex-end', fontStyle: 'italic', marginLeft: '-0.4vw'}}>
                            <h2 className='--header-info cwpm' style={{margin:0, fontSize: '1.3057vw'}}>{speed.cpm}</h2>
                            <h2 className='--header-info label' style={{paddingRight: '0.9vw'}}>cpm</h2>
                        </div>
                    </div>
                    <h6 className='--header-info-sub --header-info-sub-speed'>SPEED</h6>
                </div>
                <div className='--header-container items-main'>
                    <div className='items'>
                        <img src={headerpanelpng} className='--header-panel-image'/>
                    </div>
                    <input className='--header-time' spellCheck={false} ref={ref} onInput={handleTimeChange} 
                    style={{fontWeight: '400', fontStyle: 'italic', position: 'absolute', zIndex: '5', marginLeft: '-1vw'}} maxLength='4'
                    value={props.started ? `${dispTime}s` : props.defTime/1000 + 's'}></input>
                    <h6 className='--header-info-sub --header-info-sub-time'>TIME</h6>
                </div>
                <div className='--header-container' style={{padding: '0 1vw 0 1vw'}}>
                    <button className='--settings-btn'>
                        {/*<img className='--settings-btn-icon' src={menuicon}></img>*/}
                        <label htmlFor="check" className='--settings-btn-label'
>
                            <input type="checkbox" id="check" onClick={() => {props.tools.changeSettings(prev => ({...prev, activated: !prev.activated}))}}/> 
                            <span></span>
                            <span></span>
                            <span></span>
                            
                        </label>
                    </button>
                    
                </div>
            </div>
        </div>
        {
            props.settings.hideHeader && props.settings.hideHeaderShowCounter &&
            <div style={{position: 'absolute', bottom: '0', width: '100%', zIndex: '20', display: 'flex', justifyContent: 'space-between'}}>
                <p className='--header-off-wpm headerless'>{Math.trunc(speed.wpm)}<span style={{color: 'rgba(255,255,255, 0.7)'}}>wpm</span></p>
                <p className='--header-off-accuracy headerless'>{Math.trunc(accuracy)}%</p>
            </div>

        }
        <div className='--header-off-time' style={
            props.settings.hideHeader ? ({width: `${(props.time / props.defTime) * 100}vw`, top: '0', opacity: props.started ? '1' : '0'})
            : ({width: `${(props.time / props.defTime) * 100}vw`, bottom: '0', opacity: props.started ? '1' : '0'})}>
            {
                props.settings.hideHeader &&
                <React.Fragment>
                    <h4 style={{color: 'rgba(255,255,255,0.4)', position: 'absolute', left: '0.5vw', top: '1.5vh', fontSize: '1vw'}}>typerate</h4>
                    <h4 
                    style={{position: 'absolute', left: `${(props.time / props.defTime) * 100 - 3.4}vw`, color: 'rgba(0,0,0,0.6)', fontSize: '1.2vw', top: '-2.5vh', fontWeight:'800',letterSpacing: '-0.1vw'}}
                    >{dispTime.toFixed(1)}s</h4>
                </React.Fragment>
            }
        </div>
        </React.Fragment>
    )
}

export default Header