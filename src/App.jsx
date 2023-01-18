import React, {useState, useEffect} from 'react'
import wordList from 'word-list-json'
import Word from './assets/Word'
import Header from './assets/Header'
import FinishScreen from './assets/FinishScreen'
const WORDS = wordList.slice(10000)

function App() {
    const [words, setWords] = useState(function(){ //State for words that should be typed
        let outp = []
        for (let i = 0; i < 9; i++) {
            outp[i] = {
                body: i < 4 ? 'o' : WORDS[Math.ceil(Math.random() * 160000)],
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
                setWordStorage(prev => [...prev, pushObj]) //Word storage gets a new element equal to the object of the input body and whether its correct or not
                outp[8] = {
                    body: WORDS[Math.ceil(Math.random() * 160000)],
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
                    body: i < 4 ? 'o' : WORDS[Math.ceil(Math.random() * 200000)],
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
            {time <= 0 && <FinishScreen restart={restart} chartData={chartData} finishData={finishData} wordStorage={wordStorage}/>}
            <Header time={time} words={wordStorage} started={started} defTime={definedTime} finishData={finishData}
            tools={{changeDef: setDefinedTime, changeTime: setTime, changeChartData: setChartData, changeFinishData: setFinishData}}/>
            <div className='--main-wrapper'>
                <Word size='0.8868' word={words[0]}/>
                <Word size='1.2157' word={words[1]}/>
                <Word size='2.0447' word={words[2]}/>
                <Word size='3.4239' word={words[3]}/>
                <textarea className='--main-word' rows='1' cols={words[4].body.length} value={words[4].body}></textarea>
                <textarea className='--main-input' onInput={handleMainInput} rows='1' cols={words[4].body.length > input.length ? words[4].body.length : input.length} 
                name='input' value={input} style={{color:correct ? 'rgb(54, 54, 54)' : 'red'}} spellCheck='false' maxLength={20} id='minput'></textarea>
                <Word size='3.4239' word={words[5]}/>
                <Word size='2.0447' word={words[6]}/>
                <Word size='1.2157' word={words[7]}/>
                <Word size='0.8868' word={words[8]}/>
                <ul className="circles">
                    <li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li>
                </ul>
            </div>
        </React.Fragment>
    )
}

export default App
