import React, {useState, useEffect} from 'react'
import wordList from 'word-list-json'
import Word from './assets/Word'
import Header from './assets/Header'
import FinishScreen from './assets/FinishScreen'
import Settings from './assets/Settings'
import SeqeuntialDisplay from './assets/SequentialDisplay'
import Backgrounds from './assets/Backgrounds'
import BackgroundEffects from './assets/BackgroundEffects'
import wrongpng from './assets/wrong.png'

let WORDS = new Array(10).fill("loading");
(async function() {
    let process = await fetch('https://raw.githubusercontent.com/rsms/inter/master/docs/lab/words-google-10000-english-usa-no-swears.json');
    WORDS = await process.json('')
})();

//fetch(`https://raw.githubusercontent.com/SMenigat/thousand-most-common-words/v1.0.1/words/fry.json`).then(res => res.json()).then(json => console.log(json))
const toBool = (str) => str === 'true' ? true : str === 'false' ? false : null

function App() {
    const [words, setWords] = useState(function(){ //State for words that should be typed
        let outp = []
        for (let i = 0; i < 9; i++) {
            outp[i] = {
                body: i < 4 ? 'o' : WORDS[Math.ceil(Math.random() * WORDS.length)],
                status: i < 4 ? 'filler' : 'queued'
            }
        }
        return outp
    })
    const [input, setInput] = useState('') //State for controlled input
    const [correct, setCorrect] = useState(true) //State that determines wheter input is matching given word or not
    const [wordStorage,setWordStorage] = useState([]) //State that stores words to precisely calculate WPM and CPM, along with potential future uses
    const [started, setStarted] = useState(false) //State that determines whether the user has started typing or not
    const [definedTime, setDefinedTime] = useState(30000) //State that determines what the defined time is
    const [chartData, setChartData] = useState([]) //State that keeps data used for chart building
    const [time, setTime] = useState(definedTime) //State that keeps track of time rundown
    const [settings, setSettings] = useState({ //State for all the user settings
        activated: false, //whether to render settings or not
        displayType:           localStorage.getItem("displayType") || "stacked",
        theme:                 localStorage.getItem("theme") || 'dark-symposium',
        leisure:               toBool(localStorage.getItem("leisure")) ?? true,
        completionKey:         localStorage.getItem("completionKey") || 'space',
        backgroundEffects:     toBool(localStorage.getItem("backgroundEffects")) ?? true,
        stopOnIncorrect:       toBool(localStorage.getItem("stopOnIncorrect")) ?? false,
        hideHeader:            toBool(localStorage.getItem("hideHeader")) ?? false,
        hideHeaderShowCounter: toBool(localStorage.getItem("hideHeaderShowCounter")) ?? true,
        mode: {
            name: "enghard",
            loaded: true,
            dispName: "English (hard)"
        }
    })
    const [finishData, setFinishData] = useState({
        autocompletion: settings.completionKey == "auto" ? true : false,
        leisure: settings.leisure ? true : false,
        WPM: 0,
        CPM: 0,
        accuracy: 0,
        maxWPM: 0,
        maxCPM: 0,
        totalWords: 0,
        totalCharacters: 0
    }) //State that keeps data used for finish container
    const [chartElements, setChartElements] = React.useState(25)
    const handleChartElements = (event) => {
        const value = event.target.value
        setChartElements(value)
    }
    const [chartType, setChartType] = React.useState('bar')

    const startedRef = React.useRef(started) //Reference to started state used for timer
    startedRef.current = started

    useEffect(() => {
        setInterval(() => {
            if (startedRef.current) { //If the game has started deduct 100 else do nothing
                setTime(prev => prev - 100)
            }
        }, 100)
        changeMode("engmed")
    }, [])
    
    useEffect(() => {
        if (time <= 0) {
            setStarted(false)
        }
    }, [time])

    useEffect(() => {
        if (settings.hideHeader && started) {
            document.querySelector('.--header').style.opacity = '0'
            document.querySelector('.--header').style.pointerEvents = 'none'
            document.querySelector('.--main-wrapper').style.marginTop = '-12vh'
            document.querySelector('.--main-wrapper').style.height = '100vh'
            document.querySelector('.--header-off-time').style.opacity = '1'
            for (let el of document.querySelectorAll('.headerless')) {
                el.style.opacity = 0.4;
            }
        } else if (settings.hideHeader && !started) {
            document.querySelector('.--header').style.opacity = '1'
            document.querySelector('.--header').style.pointerEvents = 'all'
            document.querySelector('.--main-wrapper').style.marginTop = '0'
            document.querySelector('.--main-wrapper').style.height = '88vh'
            document.querySelector('.--header-off-time').style.opacity = '0'
            for (let el of document.querySelectorAll('.headerless')) {
                el.style.opacity = 0;
            }
        } 
    }, [started])

    useEffect(() => {
        const requestNewAnimation = async (target, first = false) => {
            let randomLeft = 0;
            let size = 6;
            while (size > 4.5 || size < 2) {
                size = Math.random() * 5
            }
            target.style.height = `${size}vw`
            target.style.filter = `blur(${((2.5 / (size - 2)) * 0.1).toFixed(1)}px)`
            target.style.top = '-35vh'

            while (randomLeft < 50) {
                randomLeft = Math.random() * 135
            }
            target.style.left = `${randomLeft}vw`
            const frames = [
                {transform: 'translate(0)', opacity: '1'},
                {transform: 'translate(-40vw, 80vh)', opacity: '0.8'},
                {transform: 'translate(-80vw, 160vh)', opacity: '0'},
            ]
            let randomTime = 0;
            while (randomTime < 2500) {
                randomTime = Math.random() * 8000;
            }
            const timing = {
                duration: randomTime,
                iterations: 1,
                delay: Math.random() * (first ? 8000 : 200)
              };
            const animation = target.animate(frames, timing)
            await animation.finished;
            requestNewAnimation(target)
        }
        if (settings.theme == "dark-starry" && settings.backgroundEffects) {
            for (let child of document.getElementById("stars-bg").children) {
                requestNewAnimation(child, true)
            }
        }
    }, [settings.theme, settings.backgroundEffects])

    useEffect(() => {
        for (let setting of Object.keys(settings)) {
            localStorage.setItem(setting, settings[setting])
        }
    }, [settings])

    
    const changeMode = async (val) => {
        if (val != 'enghard' && val != 'engeasy' && val != 'engmed') {
            WORDS = new Array(10).fill('Loading...')
            setSettings(prev => {
                let outp = {...prev}
                outp.mode.loaded = false
                outp.mode.name = val
                return outp
            })
            let data = await fetch(`https://raw.githubusercontent.com/SMenigat/thousand-most-common-words/v1.0.1/words/${val}.json`)
            let newData = await data.json()
            let mapData = newData.words
            WORDS = []
            WORDS = mapData.map(item => val == 'en' ? item.englishWord.toLowerCase() : item.targetWord.toLowerCase())
            setSettings(prev => {
                let outp = {...prev}
                outp.mode.loaded = true
                outp.mode.dispName = val == 'en' ? "English (easy)" : newData.languageName

                return outp
            })
            setWords(prev => {
                let outp = []
                for (let i = 0; i < 9; i++) {
                    outp[i] = {
                        body: i < 4 ? 'o' : WORDS[Math.ceil(Math.random() * WORDS.length)],
                        status: i < 4 ? 'filler' : 'queued'
                    }
                }
                return outp
            })
        } else if (val == 'enghard') {
            WORDS = []
            WORDS = wordList.slice(10000, 260000)
            setWords(prev => {
                let outp = []
                for (let i = 0; i < 9; i++) {
                    outp[i] = {
                        body: i < 4 ? 'o' : WORDS[Math.ceil(Math.random() * WORDS.length)],
                        status: i < 4 ? 'filler' : 'queued'
                    }
                }
                return outp
            })
            setSettings(prev => {
                let outp = {...prev}
                outp.mode.loaded = true
                outp.mode.dispName = "English (Hard)"
                outp.mode.name = 'enghard'
                return outp
            })
        } else if (val == 'engmed') {
            try {
                let process = await fetch('https://raw.githubusercontent.com/rsms/inter/master/docs/lab/words-google-10000-english-usa-no-swears.json');
                let data = await process.json('')
                setSettings(prev => {
                    let outp = {...prev}
                    outp.mode.loaded = true
                    outp.mode.dispName = "English (Medium)"
                    outp.mode.name = 'engmed'
                    return outp
                })
                WORDS = []
                WORDS = data.filter(el => el.length >= 4)
                setWords(prev => {
                    let outp = []
                    for (let i = 0; i < 9; i++) {
                        outp[i] = {
                            body: i < 4 ? 'o' : WORDS[Math.ceil(Math.random() * WORDS.length)],
                            status: i < 4 ? 'filler' : 'queued'
                        }
                    }
                    return outp
                })
            } catch (error) {
                console.error(error)
            }
        }
    }
    const changeDisplay = (val) => {
        setSettings(prev => ({...prev, displayType: val}))
    }

    const compareStrings = (first, second) => { //Compares original and inputted value to determine severity of wrongness - MOVED UP FROM HEADER
        if (!settings.leisure) {return false} //if acceptance leisure is off dont even check
        let newFIR = first.split(''), newSEC = second.split(''), res = false, sum = 0
        for (let char in newFIR) {
            if (newFIR[char] == newSEC[char]) {
                ++sum
            }
        }
        if ((sum / newSEC.length) >= 0.75) {
            res = true
        }
        return res
    }

    const checkWord = (val, final = false) => { //final arg checks if the entire word matches, not just the input part that is used for displaying
        let correct = true
        if (final) {
            if (input == words[4].body) {return true} else {return false}
        }
        for (let char in val) {
            if (val[char] == ' ') {continue}
            if (val[char] == words[4].body[char]) {
                continue
            } else {
                correct = false
            }
        }
        return correct
    }
    function handleMainInput(event) { //Used for controlled input
        const value = event.target.value
        if(settings.activated) return;
        if(event.nativeEvent.inputType === "insertLineBreak") return; //if user pressed enter dont insert new line
        if(settings.stopOnIncorrect && !correct) {
            if (!(event.nativeEvent.inputType == "deleteContentBackward" || event.nativeEvent.inputType == "deleteContentForward")) {return}
            //if stop in incorrect is on and the input isnt deletion then return
        }
        !started && setStarted(true)
        if (settings.completionKey == 'auto') {//the order of the auto and the space completion is important
            if (value == words[4].body) {
                setWords(prev => {
                    let outp = [...prev]
                    setInput('')
                    outp.shift()
                    outp[3].status = 'correct'
                    outp[3].body = value
                    let pushObj = outp[3]
                    pushObj.original = value
                    setWordStorage(prev => [...prev, pushObj])
                    outp[8] = {
                        body: WORDS[Math.ceil(Math.random() * WORDS.length)],
                        status: 'queued'
                    }
                    return outp
                })
                return
            }
        }
        if (value[value.length - 1] == ' ' && settings.completionKey != 'auto') { //Checks if user has pressed space (finished input) or if completion is auto
            if (input === '') {return} //If input is empty deny finish
            if (time <= 0) {return} //If time is up deny finish
            setInput('') 
            let checker = checkWord(value, true)
            setWords(prev => {
                let outp = [...prev]
                outp.shift()
                let origVal = outp[3].body
                outp[3].status = checker ? 'correct' : 'incorrect'
                outp[3].body = settings.completionKey == 'space' ? value.slice(0, -1) : value
                let pushObj = outp[3]
                pushObj.original = origVal
                if (pushObj.status == 'incorrect') { //Determines how severe the error is, less severe typos will be counted into WPM and CPM
                    pushObj.accepted = compareStrings(pushObj.body, pushObj.original)
                }
                setWordStorage(prev => [...prev, pushObj]) //Word storage gets a new element equal to the object of the input body and whether its correct or not
                outp[8] = {
                    body: WORDS[Math.ceil(Math.random() * WORDS.length)],
                    status: 'queued'
                } 
                return outp
            })
            return
        } 
        if (time > 0) {
            if (event.nativeEvent.data === " " && settings.completionKey === "auto") {
                showAutoKeyNotice()
            } else setInput(value);
            setCorrect(checkWord(value))
        }
    }

    function restart() { //function for restarting the game obvviously
        setWordStorage([])
        setInput('')
        setTime(definedTime)
        setStarted(false)
        setCorrect(true)
        setWords(prev => {
            let outp = []
            for (let i = 0; i < 9; i++) {
                outp[i] = {
                    body: i < 4 ? 'loading' : WORDS[Math.ceil(Math.random() * WORDS.length)],
                    status: i < 4 ? 'filler' : 'queued'
                }
            }
            return outp
        })
        setChartData([])
        setFinishData({
            WPM: 0,
            CPM: 0,
            accuracy: 0,
            maxWPM: 0,
            maxCPM: 0,
            totalWords: 0,
            totalCharacters: 0
        })
        document.getElementById('minput').focus()
    }

    const showAutoKeyNotice = () => {
        const target = document.querySelector('.--main-auto-key-notice')
        const frames = [
            {top: '100%'},
            {top: '92%'},
            {top: '92%'},
            {top: '92%'},
            {top: '100%'},
        ]
        const timing = {
            duration: 1500,
            iterations: 1,
        };
        target.animate(frames, timing)
    }

    return (
        <React.Fragment>
            {
                settings.theme == "dark-symposium" && //unfortunately this has to be here
                <React.Fragment>
                    <div className="black-wrap" style={{filter: settings.theme[0] == 'l' && 'invert(1)'}}></div>
                    <div className="main-grad-wrap">
                        <div className="main-grad-magenta"></div>
                        <div className="main-grad-blue"></div>
                    </div>
                </React.Fragment>
            }
            {
                time <= 0 
                && 
                <FinishScreen restart={restart} chartData={chartData} finishData={finishData} wordStorage={wordStorage} settings={settings} defTime={definedTime}/>
            }
            <Header 
                chartElements={chartElements} 
                time={time} 
                words={wordStorage} 
                started={started} 
                defTime={definedTime} 
                finishData={finishData} 
                settings={settings}
                tools={{changeDef: setDefinedTime, changeTime: setTime, changeChartData: setChartData, changeFinishData: setFinishData, changeWordStorage: setWordStorage, changeSettings: setSettings}}
            />
            <div className='--main-wrapper'>
                {
                    !settings.activated ?
                    <React.Fragment>
                    {
                        settings.displayType == 'stacked' && 
                        (
                        <React.Fragment>
                        <div style={{display:'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', filter: settings.theme[0] == 'l' && 'invert(1)'}}>
                            <Word size='0.8868' word={words[0]}/>
                            <Word size='1.2157' word={words[1]}/>
                            <Word size='2.0447' word={words[2]}/>
                            <Word size='3.4239' word={words[3]}/>
                            <textarea className='--main-word' id="pseudomain" rows='1' cols={words[4].body.length} value={words[4].body} readOnly></textarea>
                            <textarea className='--main-input' 
                            onInput={settings.mode.loaded ? handleMainInput : () => {console.log(Loading)}} 
                            rows='1' cols={words[4].body.length > input.length ? words[4].body.length : input.length} 
                            name='input' 
                            value={input} 
                            style={{color:correct ? 'rgba(255, 255, 255, 1)' : 'rgb(170, 20, 20, 0.8)', transitionDuration: '0.09s'}} 
                            spellCheck='false' maxLength={20} id='minput'></textarea>
                            <Word size='3.4239' word={words[5]}/>
                            <Word size='2.0447' word={words[6]}/>
                            <Word size='1.2157' word={words[7]}/>
                            <Word size='0.8868' word={words[8]}/>
                        </div>
                        </React.Fragment>
                        )
                    }
                    {
                        settings.displayType == 'sequential' &&
                        <SeqeuntialDisplay words={words} input={input} settings={settings} handleMainInput={handleMainInput} correct={correct}/>
                    }
                    {
                        settings.displayType == 'singular' &&
                        <React.Fragment>
                            <div>
                                <div>
                                    <textarea className='--main-word' rows='1' cols={words[4].body.length} value={words[4].body} style={{fontSize: '8.1239vw'}}></textarea>
                                    <textarea className='--main-input' onInput={settings.mode.loaded ? handleMainInput : () => {console.log(Loading)}} rows='1' cols={words[4].body.length > input.length ? words[4].body.length : input.length} 
                                    name='input' value={input} style={{color:correct ? 'rgb(54, 54, 54)' : 'rgb(170, 120, 120, 0.6)', fontSize: '8.1239vw'}} spellCheck='false' maxLength={20} id='minput'></textarea>
                                </div>
                                <Word size='7.1239' word={words[5]}/>
                            </div>
                                    
                        </React.Fragment>
                    }
                    </React.Fragment>

                    :

                    settings.activated && !started && 
                    <Settings 
                        handleChartElements={handleChartElements} 
                        setChartElements={setChartElements} 
                        chartElements={chartElements} 
                        setSettings={setSettings} 
                        changeMode={changeMode} 
                        changeDisplay={changeDisplay} 
                        chartType={chartType} 
                        setChartType={setChartType}
                        settings={settings}
                    />
                }
                <Backgrounds theme={settings.theme} backgroundEffects={settings.backgroundEffects}/>
                <div className="--main-auto-key-notice">
                    <img src={wrongpng} style={{height: '16px', marginRight: '0.5vw'}}/>
                    Spaces aren't allowed in auto completion mode
                </div>
            </div>
        </React.Fragment>
    )
}

export default App
