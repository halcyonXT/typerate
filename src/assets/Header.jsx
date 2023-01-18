import React from 'react'


function Header(props) {
    let [accuracy, setAccuracy] = React.useState(100)
    let [speed, setSpeed] = React.useState({wpm: 0, cpm: 0})
    let [dispTime, setDispTime] = React.useState(props.time / 1000)
    let [timeMarkers, setTimeMarkers] = React.useState([]) //Time markers for saving chart data
    const ref = React.useRef()

    const calcCPM = () => {
        let sum = 0
        for (let word of props.words) {sum += word.body.length}
        return sum === 0 ? 0 : Math.ceil(((sum / ((props.defTime / 1000) - dispTime)) * 60) * 100) / 100
    }
    React.useEffect(() => {
        let corSum = 0
        for (let item of props.words) {
            if (item.status === 'correct') {++corSum}
        }
        setAccuracy(props.words.length === 0 ? 100 : Math.ceil(((corSum * 100) / props.words.length) * 100) / 100)
        setSpeed({wpm: dispTime < (props.defTime / 1000) ? Math.ceil(((props.words.length / ((props.defTime / 1000) - dispTime)) * 80 ) * 100) / 100 : 0, //I put 80 instead of 60 for some leniency towards the user, since most words are BS 
                cpm: calcCPM()}) 
    }, [dispTime])

    React.useEffect(() => { //every time controlled time changes calculate display time
        setDispTime(prev => {
            if (props.time <= 0) {return 0} else {return props.time / 1000}
        })
        if ((dispTime < (props.defTime / 1000) ? Math.ceil(((props.words.length / ((props.defTime / 1000) - dispTime)) * 80 ) * 100) / 100 : 0) > props.finishData.maxWPM) {
            props.tools.changeFinishData(prev => ({...prev, maxWPM: dispTime < (props.defTime / 1000) ? Math.ceil(((props.words.length / ((props.defTime / 1000) - dispTime)) * 80 ) * 100) / 100 : 0}))
        }
        if (calcCPM() > props.finishData.maxCPM) {
            props.tools.changeFinishData(prev => ({...prev, maxCPM: calcCPM()}))
        }
        if (timeMarkers.includes(props.time)) {
            props.tools.changeChartData(prev => [...prev, {
                time: props.time,
                wpm: dispTime < (props.defTime / 1000) ? Math.ceil(((props.words.length / ((props.defTime / 1000) - dispTime)) * 80 ) * 100) / 100 : 0,
                cpm: calcCPM()
            }])
        }
        if (props.time == 0) {
            props.tools.changeFinishData(prev => ({...prev, WPM: dispTime < (props.defTime / 1000) ? Math.ceil(((props.words.length / ((props.defTime / 1000) - dispTime)) * 80 ) * 100) / 100 : 0,
                CPM: calcCPM(),
                accuracy: accuracy
            }))
        }
    }, [props.time])

    React.useEffect(() => { //When the game starts, Header defines times at which it should log WPM and CPM for chart data
        if (props.started) {
            let increment = Math.ceil((props.defTime / 7) / 100) * 100
            setTimeMarkers(prev => {
                let outp = [increment]
                for (let i = 1; i < 6; i++) {
                    outp[i] = outp[i-1] + increment
                }
                return outp
            })
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

    return (
        <div className='--header'>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <h1 className='--header-logo'>Typerate</h1>
                <div className='--header-blinker'></div>
            </div>
            <div className='--header-container' style={{width: '50%'}}>
                <div className='--header-container items'>
                    <h1 className='--header-info'>{accuracy}%</h1>
                    <h6 className='--header-info-sub'>Accuracy</h6>
                </div>
                <div className='--header-container items'>
                    <div style={{width:'90%', textAlign: 'center'}}>
                        <div style={{display: 'flex', justifyContent:'space-between', alignItems: 'center'}}>
                            <h2 className='--header-info cwpm' style={{margin:0, fontSize: '1.3057vw'}}>{speed.wpm}</h2>
                            <h2 className='--header-info label'>wpm</h2>
                        </div>
                        <div style={{display: 'flex', justifyContent:'space-between', alignItems: 'center'}}>
                            <h2 className='--header-info cwpm' style={{margin:0, fontSize: '1.3057vw'}}>{speed.cpm}</h2>
                            <h2 className='--header-info label'>cpm</h2>
                        </div>
                        <h6 className='--header-info-sub' style={{left:'66.5%'}}>Speed</h6>
                    </div>
                </div>
                <div className='--header-container items'>
                    <input className='--header-time' spellCheck={false} ref={ref} onInput={handleTimeChange} 
                    value={props.started ? `${dispTime}s` : props.defTime/1000 + 's'}></input>
                    <h6 className='--header-info-sub'>Time</h6>
                </div>
            </div>
        </div>
    )
}

export default Header