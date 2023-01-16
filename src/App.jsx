import React, {useState, useEffect} from 'react'
import wordList from 'word-list-json'
import Word from './assets/Word'
import Header from './assets/Header'
import restarticon from './assets/restarticon.png'
const WORDS = wordList.slice(10000)

function App() {
    const [time, setTime] = useState(30000)
    const [words, setWords] = useState(function(){
        let outp = []
        for (let i = 0; i < 9; i++) {
            outp[i] = {
                body: i < 4 ? 'o' : WORDS[Math.ceil(Math.random() * 200000)],
                status: i < 4 ? 'filler' : 'queued'
            }
        }
        return outp
    })
    const [input, setInput] = useState('')
    const [correct, setCorrect] = useState(true)
    const [wordStorage,setWordStorage] = useState([])
    const [started, setStarted] = useState(false)
    const [timerActive,setTimerActive] = useState(false)
    useEffect(() => {
        if (started) {
            let timer = setInterval(() => {
                if (timerActive) {setTime(prev => {
                    return prev - 100
                })}
            }, 100)
        }
    }, [started])

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

    function handleInput(event) {
        const value = event.target.value
        setTimerActive(true)
        setStarted(true)
        if (value[value.length - 1] == ' ') {
            if (input === '') {return}
            if (time <= 0) {return}
            setInput('')
            let checker = checkWord(value, true)
            setWords(prev => {
                let outp = [...prev]
                outp.shift()
                outp[3].status = checker ? 'correct' : 'incorrect'
                outp[3].body = value.slice(0, -1)
                setWordStorage(prev => [...prev, outp[3]])
                outp[8] = {
                    body: WORDS[Math.ceil(Math.random() * 200000)],
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
        setTime(30000)
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
        setTimerActive(false)
        document.getElementById('rst').style.display = 'none'
        document.getElementById('minput').focus()
    }

    useEffect(() => {
        if (time <= 0) {
            document.getElementById('rst').style.display = 'block'
            setTimerActive(false)
        }
    }, [time])
    return (
        <React.Fragment>
            <Header time={time} words={wordStorage}/>
            <div className='--main-wrapper'>
                <Word size='0.8868' word={words[0]}/>
                <Word size='1.2157' word={words[1]}/>
                <Word size='2.0447' word={words[2]}/>
                <Word size='3.4239' word={words[3]}/>
                <textarea className='--main-word' rows='1' cols={words[4].body.length} value={words[4].body}></textarea>
                <textarea className='--main-input' onInput={handleInput} rows='1' cols={words[4].body.length > input.length ? words[4].body.length : input.length} 
                name='input' value={input} style={{color:correct ? 'rgb(54, 54, 54)' : 'red'}} spellCheck='false' maxLength={20} id='minput'></textarea>
                <Word size='3.4239' word={words[5]}/>
                <Word size='2.0447' word={words[6]}/>
                <Word size='1.2157' word={words[7]}/>
                <Word size='0.8868' word={words[8]}/>
                <button id='rst' className='--restart-btn'><img className='--restart-img' src={restarticon} onClick={restart}/></button>
                <ul className="circles">
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                </ul>
            </div>
        </React.Fragment>
    )
}

export default App
