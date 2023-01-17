import React from 'react'

function Header(props) {
    let [accuracy, setAccuracy] = React.useState(100)
    let [speed, setSpeed] = React.useState({wpm: 0, cpm: 0})
    let [dispTime, setDispTime] = React.useState(props.time / 1000)

    const calcCPM = () => {
        let sum = 0
        for (let word of props.words) {sum += word.body.length}
        return sum === 0 ? 0 : Math.ceil(((sum / (30 - dispTime)) * 60) * 100) / 100
    }
    React.useEffect(() => {
        let corSum = 0
        for (let item of props.words) {
            if (item.status === 'correct') {++corSum}
        }
        setAccuracy(props.words.length === 0 ? 100 : Math.ceil(((corSum * 100) / props.words.length) * 100) / 100)
        setSpeed({wpm: dispTime < 30 ? Math.ceil(((props.words.length / (30 - dispTime)) * 80 ) * 100) / 100 : 0, //I put 80 instead of 60 for some leniency towards the user, since most words are BS 
                cpm: calcCPM()}) 
    }, [dispTime])

    React.useEffect(() => { //every time controlled time changes calculate display time
        setDispTime(prev => {
            if (!props.started) {return prev}
            if (props.time <= 0) {return 0} else {return props.time / 1000}
        })
    }, [props.time])


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
                            <h2 className='--header-info cwpm' style={{margin:0, fontSize: '1.5157vw'}}>{speed.wpm}</h2>
                            <h2 className='--header-info label'>wpm</h2>
                        </div>
                        <div style={{display: 'flex', justifyContent:'space-between', alignItems: 'center'}}>
                            <h2 className='--header-info cwpm' style={{margin:0, fontSize: '1.5157vw'}}>{speed.cpm}</h2>
                            <h2 className='--header-info label'>cpm</h2>
                        </div>
                        <h6 className='--header-info-sub' style={{left:'66.2%'}}>Speed</h6>
                    </div>
                </div>
                <div className='--header-container items'>
                    <input className='--header-time' spellCheck={false} value={`${dispTime}s`}></input>
                    <h6 className='--header-info-sub'>Time</h6>
                </div>
            </div>
        </div>
    )
}

export default Header