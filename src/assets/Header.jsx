import React from 'react'

function Header(props) {
    let [accuracy, setAccuracy] = React.useState(100)
    let [speed, setSpeed] = React.useState({wpm: 0, cpm: 0})
    let [dispTime, setDispTime] = React.useState(30)
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
        setSpeed({wpm: dispTime < 30 ? Math.ceil(((props.words.length / (30 - dispTime)) * 60 ) * 100) / 100 : 0, 
                cpm: calcCPM()}) 
    }, [dispTime])

    React.useEffect(() => { //every time controlled time changes calculate display time
        setDispTime(props.time <= 0 ? 0 : props.time / 1000)
    }, [props.time])

    return (
        <div className='--header'>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <h1 className='--header-logo'>Typerate</h1>
                <div className='--header-blinker'></div>
            </div>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-around', width:'50%'}}>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', width: '24%'}}>
                    <h1 className='--header-info'>{accuracy}%</h1>
                    <h6 className='--header-info-sub'>Accuracy</h6>
                </div>
                <div style={{width:'24%', textAlign: 'center'}}>
                    <h2 className='--header-info' style={{margin:0, fontSize: '1.2157vw'}}>{speed.wpm}wpm</h2>
                    <h2 className='--header-info' style={{margin:0, fontSize: '1.2157vw'}}>{speed.cpm}cpm</h2>
                    <h6 className='--header-info-sub' style={{left:'72.2%'}}>Speed</h6>
                </div>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', width:'24%'}}>
                    <h1 className='--header-info'>{dispTime}s</h1>
                    <h6 className='--header-info-sub'>Time</h6>
                </div>
            </div>
        </div>
    )
}

export default React.memo(Header)