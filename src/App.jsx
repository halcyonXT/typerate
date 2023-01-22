import React, {useState, useEffect} from 'react'
import wordList from 'word-list-json'
import Word from './assets/Word'
import Header from './assets/Header'
import FinishScreen from './assets/FinishScreen'
import Settings from './assets/Settings'
let WORDS = wordList.slice(10000, 260000)

//fetch(`https://raw.githubusercontent.com/SMenigat/thousand-most-common-words/v1.0.1/words/fry.json`).then(res => res.json()).then(json => console.log(json))


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
    const [finishData, setFinishData] = useState({
        WPM: 0,
        CPM: 0,
        accuracy: 0,
        maxWPM: 0,
        maxCPM: 0,
        totalWords: 0,
        totalCharacters: 0
    }) //State that keeps data used for finish container
    const [time, setTime] = useState(definedTime) //State that keeps track of time rundown
    const [settings, setSettings] = useState({ //State for all the user settings
        activated: false, //whether to render settings or not
        displayType: 'stacked',
        mode: {
            name: "enghard",
            loaded: true,
            dispName: "English (hard)"
        }
    })

    const startedRef = React.useRef(started) //Reference to started state used for timer
    startedRef.current = started
    
    useEffect(() => {
        setInterval(() => {
            if (startedRef.current) { //If the game has started deduct 100 else do nothing
                setTime(prev => prev - 100)
            }
        }, 100)
    }, [])
    
    useEffect(() => {
        if (time <= 0) {
            setStarted(false)
        }
    }, [time])
    
    const changeMode = async (val) => {
        if (val != 'enghard' && val != 'engeasy', val != 'engmed') {
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
        } else if (val == 'engmed') {
            try {
                let process = await fetch('https://raw.githubusercontent.com/rsms/inter/master/docs/lab/words-google-10000-english-usa-no-swears.json');
                let data = await process.json('')
                setSettings(prev => {
                    let outp = {...prev}
                    outp.mode.loaded = true
                    outp.mode.dispName = "English (Medium)"
                    return outp
                })
                WORDS = []
                WORDS = data
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
        if(event.nativeEvent.inputType === "insertLineBreak") return; //if user pressed enter dont insert new line
        setStarted(true)
        if (value[value.length - 1] == ' ') { //Checks if user has pressed space (finished input)
            if (input === '') {return} //If input is empty deny finish
            if (time <= 0) {return} //If time is up deny finish
            setInput('') 
            let checker = checkWord(value, true)
            setWords(prev => {
                let outp = [...prev]
                outp.shift()
                let origVal = outp[3].body
                outp[3].status = checker ? 'correct' : 'incorrect'
                outp[3].body = value.slice(0, -1)
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
            setInput(value)
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
                    body: i < 4 ? 'o' : WORDS[Math.ceil(Math.random() * WORDS.length)],
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


    return (
        <React.Fragment>
            {settings.activated && !started && <Settings setSettings={setSettings} changeMode={changeMode} changeDisplay={changeDisplay} settings={settings}/>}
            {time <= 0 && <FinishScreen restart={restart} chartData={chartData} finishData={finishData} wordStorage={wordStorage} settings={settings} defTime={definedTime}/>}
            <Header time={time} words={wordStorage} started={started} defTime={definedTime} finishData={finishData}
            tools={{changeDef: setDefinedTime, changeTime: setTime, changeChartData: setChartData, changeFinishData: setFinishData, changeWordStorage: setWordStorage, changeSettings: setSettings}}/>
            <div className='--main-wrapper'>
                {
                    settings.displayType == 'stacked' && 
                    (
                    <React.Fragment>
                        <Word size='0.8868' word={words[0]}/>
                        <Word size='1.2157' word={words[1]}/>
                        <Word size='2.0447' word={words[2]}/>
                        <Word size='3.4239' word={words[3]}/>
                        <textarea className='--main-word' rows='1' cols={words[4].body.length} value={words[4].body}></textarea>
                        <textarea className='--main-input' onInput={settings.mode.loaded ? handleMainInput : () => {console.log(Loading)}} rows='1' cols={words[4].body.length > input.length ? words[4].body.length : input.length} 
                        name='input' value={input} style={{color:correct ? 'rgb(54, 54, 54)' : 'red'}} spellCheck='false' maxLength={20} id='minput'></textarea>
                        <Word size='3.4239' word={words[5]}/>
                        <Word size='2.0447' word={words[6]}/>
                        <Word size='1.2157' word={words[7]}/>
                        <Word size='0.8868' word={words[8]}/>
                    </React.Fragment>
                    )
                }
                {
                    settings.displayType == 'sequential' &&
                    <React.Fragment>
                        <div style={{width: '300%', display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', backgroundColor: 'rgb(0,0,0,0.1)', border: '0.2vw solid white'}}>
                            <div style={{display: 'flex', alignItems: 'center', overflowWrap: 'normal', justifyContent: 'space-evenly', overflow: 'hidden'}}>
                                <Word size='3.1239' word={words[0]} className="rightM"/>
                                <Word size='3.1239' word={words[1]} className="rightM"/>
                                <Word size='3.1239' word={words[2]} className="rightM"/>
                                <Word size='3.1239' word={words[3]} className="rightM"/>
                                <div>
                                    <textarea className='--main-word' rows='1' cols={words[4].body.length} value={words[4].body} style={{fontSize: '3.1239vw'}}></textarea>{" "}
                                    <textarea className='--main-input' onInput={settings.mode.loaded ? handleMainInput : () => {console.log(Loading)}} rows='1' cols={words[4].body.length > input.length ? words[4].body.length : input.length} 
                                    name='input' value={input} style={{color:correct ? 'rgb(54, 54, 54)' : 'red', fontSize: '3.1239vw'}} spellCheck='false' maxLength={20} id='minput'></textarea>{" "}
                                </div>
                                <Word size='3.1239' word={words[5]} className="rightM"/>
                                <Word size='3.1239' word={words[6]} className="rightM"/>
                                <Word size='3.1239' word={words[7]} className="rightM"/>
                                <Word size='3.1239' word={words[8]}/>
                            </div>
                        </div>
                    </React.Fragment>
                }
                {
                    settings.displayType == 'singular' &&
                    <React.Fragment>
                        <div>
                            <div>
                                <textarea className='--main-word' rows='1' cols={words[4].body.length} value={words[4].body} style={{fontSize: '8.1239vw'}}></textarea>
                                <textarea className='--main-input' onInput={settings.mode.loaded ? handleMainInput : () => {console.log(Loading)}} rows='1' cols={words[4].body.length > input.length ? words[4].body.length : input.length} 
                                name='input' value={input} style={{color:correct ? 'rgb(54, 54, 54)' : 'red', fontSize: '8.1239vw'}} spellCheck='false' maxLength={20} id='minput'></textarea>
                            </div>
                            <Word size='7.1239' word={words[5]}/>
                        </div>
                                
                    </React.Fragment>
                }
                <ul className="circles">
                    <li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li>
                </ul>
            </div>
        </React.Fragment>
    )
}

export default App
