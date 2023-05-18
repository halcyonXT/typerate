import React, {useState, useEffect} from 'react'
import Word from './assets/Word'
import Header from './assets/Header'
import FinishScreen from './assets/FinishScreen'
import Settings from './assets/Settings'
import SeqeuntialDisplay from './assets/SequentialDisplay'
import Backgrounds from './assets/Backgrounds'
import Register from './assets/Register'
import Login from './assets/Login'
import { Link, Routes, Route, useLocation } from 'react-router-dom'
import { forceKeyboardLayout, checkForNewBadges } from './assets/utils.js'
import wrongpng from './assets/images/wrong.png'
import incorrectsound from './assets/sounds/incorrect.mp3'
import { getUser, logout, searchUsers, updateBadges, updateStats } from './api/user'
import { UserContext } from './assets/context/userContext'

let WORDS = new Array(10).fill("loading");
;(async function() {
    let process = await fetch('https://raw.githubusercontent.com/rsms/inter/master/docs/lab/words-google-10000-english-usa-no-swears.json');
    WORDS = await process.json('')
})();

let pressedKeys = []
let pressedKeysDisplay = []
let tildaDown = false, tildaTermination = false
const NUM_OF_WORDS = 25;
let restartKey = '`', changeKeyTimer;

const resetPressedKeys = () => pressedKeys = []; pressedKeysDisplay = []

const holdRestart = (practice = false) => {
    if (!tildaDown) {
        tildaDown = true
        let timePassed = 1
        let timer = setInterval(() => {
            timePassed += 20
            try {
                if (!tildaTermination) {
                    document.querySelector('.--main-hold-restart').style.backgroundImage = `conic-gradient(white 0%, white ${((timePassed / (practice ? 501 : 1001)) * 100).toFixed(1)}%, transparent ${((timePassed / 1501) * 100).toFixed(1) + 1}%)`
                }
            } catch (err) {}
            if (!pressedKeys.includes(restartKey)) {
                tildaDown = false
                document.querySelector('.--main-hold-restart').style.backgroundImage = 'conic-gradient(transparent, transparent)'
                clearInterval(timer)
            }
            if (timePassed === (practice ? 501 : 1001) && pressedKeys.includes(restartKey)) {
                tildaTermination = true
                tildaDown = false
                document.querySelector('.--main-hold-restart').style.backgroundImage = 'conic-gradient(transparent, transparent)'
                clearInterval(timer)
            }
        }, 20)
    }
}

const handleShowKeys = (event, action, validRequest, practice) => {
    const key = event.key
    switch (action) {
        case "down":
            if (key === restartKey) {
                holdRestart(practice)
            }
            if (!pressedKeys.includes(key)) {
                pressedKeys = [key, ...pressedKeys]
            }
            break
        case "up":
            let newkeys = []
            for (let k of pressedKeys) {
                if (k !== key) {
                    newkeys.push(k)
                }
            }
            pressedKeys = newkeys
            break
    }
    if (validRequest) {
        pressedKeysDisplay = pressedKeys.map(item => {
            if (item == ' ') {
                return <div className="--main-keys-key" style={{width: '10vw'}}>{item}</div>
            }
            if (item == 'Backspace') {
                return <div className="--main-keys-key" style={{width: '7vw'}}>Bcksp</div>
            }
            if (item.length > 1) {
                return <div className='--main-keys-key' style={{width: 'max-content', paddingLeft: '0.5vw', paddingRight: '0.5vw'}}>{item}</div>
            }
            return <div className="--main-keys-key">{item}</div>
        })
    }
}


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

const toBool = (str) => str === 'true' ? true : str === 'false' ? false : null

function App() {
    const { user, updateUser } = React.useContext(UserContext)

    const [words, setWords] = useState(function(){ //State for words that should be typed
        let outp = []
        for (let i = 0; i < NUM_OF_WORDS; i++) {
            outp[i] = {
                body: i < 4 ? 'o' : WORDS[Math.ceil(Math.random() * WORDS.length)],
                status: i < 4 ? 'filler' : 'queued'
            }
        }
        return outp
    })
    const [flagForTimeTesting, setFlagForTimeTesting] = React.useState({
        active: false,
        key1: "",
        key2: "",
        timeAtFlag: 0
    })
    const [stopKey, setStopKey] = React.useState(restartKey)
    const [input, setInput] = useState('') //State for controlled input
    const [correct, setCorrect] = useState(true) //State that determines wheter input is matching given word or not
    const [wordStorage,setWordStorage] = useState([]) //State that stores words to precisely calculate WPM and CPM, along with potential future uses
    const [started, setStarted] = useState(false) //State that determines whether the user has started typing or not
    const [definedTime, setDefinedTime] = useState(30000) //State that determines what the defined time is
    const [chartData, setChartData] = useState([]) //State that keeps data used for chart building
    const [time, setTime] = useState(definedTime) //State that keeps track of time rundown
    const [settings, setSettings] = useState({ //State for all the user settings
        activated: false, //whether to render settings or not
        displayType:           localStorage.getItem("displayType")            || "stacked",
        theme:                 localStorage.getItem("theme")                  || 'dark-symposium',
        keyboardLayout:        localStorage.getItem("keyboardLayout")         || 'DEFAULT',
        completionKey:         localStorage.getItem("completionKey")          || 'space', 
        leisure:               localStorage.getItem("leisure")               === undefined ? true  : toBool(localStorage.getItem("leisure")),
        backgroundEffects:     localStorage.getItem("backgroundEffects")     === undefined ? true  : toBool(localStorage.getItem("backgroundEffects")),
        stopOnIncorrect:       localStorage.getItem("stopOnIncorrect")       === undefined ? false : toBool(localStorage.getItem("stopOnIncorrect")),
        hideHeader:            localStorage.getItem("hideHeader")            === undefined ? true  : toBool(localStorage.getItem("hideHeader")),
        hideHeaderShowCounter: localStorage.getItem("hideHeaderShowCounter") === undefined ? true  : toBool(localStorage.getItem("hideHeaderShowCounter")),
        playSoundOnIncorrect:  localStorage.getItem("playSoundOnIncorrect")  === undefined ? false : toBool(localStorage.getItem("playSoundOnIncorrect")),
        showKeys:              localStorage.getItem("showKeys")              === undefined ? true : toBool(localStorage.getItem("showKeys")),
        practiceMode:          false,
        useAccountSettings:    user.loggedin ? true : true, //CHANGE THIS
        mode: {
            name: "engmed",
            loaded: true,
            dispName: "English (medium)"
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
        totalCharacters: 0,
        missedCharacters: [],
        missedCombinations: []
    }) //State that keeps data used for finish container
    const [chartElements, setChartElements] = React.useState(25)
    const handleChartElements = (event) => {
        const value = event.target.value
        setChartElements(value)
    }
    const [chartType, setChartType] = React.useState('bar')
    const [popup, setPopup] = React.useState({
        body: "",
        image: "",
        activated: false
    })

    const startedRef = React.useRef(started) //Reference to started state used for timer
    startedRef.current = started
    let location = useLocation()

    useEffect(() => {
        if (tildaTermination) {
            if ((time + 1000) < definedTime) {
                restart()
                tildaTermination = false
            } else {
                tildaTermination = false
            }
        }
    }, [tildaTermination])

    useEffect(() => {
        (async() => {
            let [hasNewBadges, newBadges, picture, body] = checkForNewBadges(user)
            if (hasNewBadges) {
                setPopup({body: body, image: picture, activated: true})
                await updateBadges(newBadges)
                updateUser()
            }
        })()
    }, [user.gamesPlayed])

    useEffect(() => {
        setInterval(() => {
            if (startedRef.current) { //If the game shas started deduct 100 else do nothing
                setTime(prev => prev - 100)
            }
        }, 100)
        changeMode('engmed')
    }, [])

    const changeStopKey = () => {
        //restartKey = newKey
        window.addEventListener("keydown", setNewStopKey)
    }

    const setNewStopKey = (e) => {
        restartKey = e.key
        setStopKey(e.key)
        window.removeEventListener("keydown", setNewStopKey)
    }

    const addHSKEventListeners = () => {
        try {
            switch (settings.displayType) {
                case "stacked":
                    document.querySelector('.--main-input').removeEventListener("keydown", (e) => handleShowKeys(e, "down", settings.showKeys, settings.practiceMode))
                    document.querySelector('.--main-input').removeEventListener("keyup", (e) => handleShowKeys(e, "up", settings.showKeys, settings.practiceMode))
                    document.querySelector('.--main-input').addEventListener("keydown", (e) => handleShowKeys(e, "down", settings.showKeys, settings.practiceMode))
                    document.querySelector('.--main-input').addEventListener("keyup", (e) => handleShowKeys(e, "up", settings.showKeys, settings.practiceMode))
                    break
                case "sequential":
                    window.removeEventListener("keydown", (e) => handleShowKeys(e, "down", settings.showKeys, settings.practiceMode))
                    window.removeEventListener("keyup", (e) => handleShowKeys(e, "up", settings.showKeys, settings.practiceMode))
                    window.addEventListener("keydown", (e) => handleShowKeys(e, "down", settings.showKeys, settings.practiceMode))
                    window.addEventListener("keyup", (e) => handleShowKeys(e, "up", settings.showKeys, settings.practiceMode))
                    break
            }
        } catch (ex) {console.error(ex)}
    }

    useEffect(() => {
        try {
            if (!settings.activated) {
                addHSKEventListeners()
                window.removeEventListener("keydown", setNewStopKey)
            }
        } catch (ex) {}
    }, [settings.activated])

    useEffect(() => {
        if (time <= 0) {
            setStarted(false)
        }
    }, [time])

    useEffect(() => {
        try {
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
        } catch (ex) {}
    }, [started])

    useEffect(() => {
        try {
            if (settings.theme == "dark-starry" && settings.backgroundEffects) {
                for (let child of document.getElementById("stars-bg").children) {
                    requestNewAnimation(child, true)
                }
            }
        } catch (ex) {}
    }, [settings.theme, settings.backgroundEffects, location])

    useEffect(() => {
        for (let setting of Object.keys(settings)) {
            localStorage.setItem(setting, settings[setting])
        }
    }, [settings])

    useEffect(() => {
        if (correct) {
            if (flagForTimeTesting.active) {
                setFinishData(prev => {
                    let raw = {...prev}
                    let index = raw.missedCombinations.findIndex(el => el.key1 === flagForTimeTesting.key1 && el.key2 === flagForTimeTesting.key2)
                    if (index > -1) {
                        let avg = raw.missedCombinations[index].impact.average
                        raw.missedCombinations[index].impact.average = Number(((avg + (flagForTimeTesting.timeAtFlag.toFixed(2) - (time / 1000).toFixed(2))) / raw.missedCombinations[index].impact.sum).toFixed(2))
                    }
                    return raw
                })
                setFlagForTimeTesting({
                    active: false,
                    key1: "",
                    key2: "",
                    timeAtFlag: 0
                })
            }
        }
    }, [correct])

    
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
                for (let i = 0; i < NUM_OF_WORDS; i++) {
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
                    outp.mode.name = 'engmed'
                    return outp
                })
                WORDS = []
                WORDS = data.filter(el => el.length >= 4)
                setWords(prev => {
                    let outp = []
                    for (let i = 0; i < NUM_OF_WORDS; i++) {
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

    ////Compares original and inputted value to determine severity of wrongness - MOVED UP FROM HEADER
    const compareStrings = (input, target) => { 
        if (!settings.leisure) {return false} //if acceptance leisure is off dont even check
        let newFIR = input.split(''), newSEC = target.split(''), res = false, sum = 0
        for (let i = 0; i < newFIR.length; i++) {
            if (newSEC.includes(newFIR[i])) {
                newSEC.splice(i, 1)
                ++sum
            } else {
                --sum
            }
        }
        if ((sum / newSEC.length) >= 0.75) {
            res = true
        }
        return res
    }


    //final arg checks if tihe entire word matches, not just the input part that is used for displaying
    const checkWord = (val, final = false) => {
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
        let value;
        if (event.nativeEvent.data == restartKey) {return} //reserved for restarting
        if (event.nativeEvent.data) {
            value = input + forceKeyboardLayout(settings.keyboardLayout, event.nativeEvent.data)
        } else {
            value = event.target.value
        }
        if (words[4].body === "loading") {
            document.querySelector('#--main-notice-text').innerText = "Stuck on loading? Try checking your internet connection"
            showAutoKeyNotice()
            return
        }
        if(settings.activated) return;
        if(event.nativeEvent.inputType === "insertLineBreak" && settings.completionKey != "enter") return; //if user pressed enter dont insert new line
        if(settings.stopOnIncorrect && !correct) {
            if (!(event.nativeEvent.inputType == "deleteContentBackward" || event.nativeEvent.inputType == "deleteContentForward")) {return}
            //if stop on incorrect is on and the input isnt deletion then return
        }
        !started && setStarted(true)
        if (settings.completionKey == 'enter' && event.nativeEvent.inputType === 'insertLineBreak') {
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
                outp[outp.length] = {
                    body: WORDS[Math.ceil(Math.random() * WORDS.length)],
                    status: 'queued'
                } 
                return outp
            })
            return
        } else
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
                    outp[outp.length] = {
                        body: WORDS[Math.ceil(Math.random() * WORDS.length)],
                        status: 'queued'
                    }
                    return outp
                })
                return
            }
        } else
        if (event.nativeEvent.data == ' ' && settings.completionKey != 'auto' && settings.completionKey != 'enter') { //Checks if user has pressed space (finished input) or if completion is auto
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
                outp[outp.length] = {
                    body: WORDS[Math.ceil(Math.random() * WORDS.length)],
                    status: 'queued'
                } 
                return outp
            })
            return
        } 
        if (time > 0) {
            if (event.nativeEvent.data === " " && settings.completionKey === "auto") {
                document.querySelector('#--main-notice-text').innerText = "Spaces aren't allowed in auto completion mode"
                showAutoKeyNotice()
            } else setInput(value.trim());
            setCorrect(checkWord(value))
            if (!checkWord(value) && correct) {
                if (settings.playSoundOnIncorrect) {
                    new Audio(incorrectsound).play()
                }
                setFinishData(prev => {
                    let target = words[4].body.slice(value.length - 1, value.length)
                    let index = prev.missedCharacters.findIndex(item => item.key == target)
                    let key1 = words[4].body.slice(value.length - 2, value.length - 1)
                    let combIndex = prev.missedCombinations.findIndex(item => item.key1 === key1 && item.key2 === target)
                    let raw = {...prev}
                    if (index === -1) {
                        raw = ({...prev, missedCharacters: [...prev.missedCharacters, {key: target, instances: 1}]})
                    } else {
                        raw.missedCharacters[index].instances += 1
                    }
                    if (combIndex === -1) {
                        raw.missedCombinations = [...raw.missedCombinations, {key1: key1, key2: target, instances: 1, impact: {average: 0, sum: 1}}]
                    } else {
                        raw.missedCombinations[combIndex].instances += 1
                        raw.missedCombinations[combIndex].impact.sum += 1
                    }/*
                    setFlaggedForImpactTesting({
                        active: true,
                        value: 0,
                        key1: key1,
                        key2: target
                    })*/
                    return raw
                })
                setFlagForTimeTesting({
                    active: true,
                    key1: words[4].body.slice(value.length - 2, value.length - 1),
                    key2: words[4].body.slice(value.length - 1, value.length),
                    timeAtFlag: time / 1000
                })
            }
        }
    }
    

    const showPopup = () => {
        document.querySelector('.--main-achievement-popup').style.opacity = '1'
        setTimeout(() => {
            document.querySelector('.--main-achievement-popup').style.opacity = '0'
            setTimeout(() => {
                setPopup({image:"", body:"", activated: false})
            }, 200)
        }, 3600)
    }

    function restart() { //function for restarting the game obvviously
        if (popup.activated) {
            showPopup()
        }
        setWordStorage([])
        setInput('')
        setTime(definedTime)
        setStarted(false)
        setCorrect(true)
        setWords(prev => {
            let outp = []
            for (let i = 0; i < NUM_OF_WORDS; i++) {
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
            totalCharacters: 0,
            missedCharacters: [],
            missedCombinations: []
        })
        setFlagForTimeTesting({
            active: false,
            key1: "",
            key2: "",
            timeAtFlag: 0
        })
        resetPressedKeys()
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

    const tester = () => {
        function generateRandomData() {
            const data = [];
            const startDate = new Date('2020-05-01');
            const endDate = new Date('2023-05-01');
          
            while (startDate < endDate) {
              const timestamp = startDate.toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' }) + ' ' + startDate.getHours() + ':00';
          
              data.push({
                wpm: Math.floor(Math.random() * (150 - 10 + 1) + 10),
                cpm: Math.floor(Math.random() * (600 - 100 + 1) + 100),
                accuracy: Math.floor(Math.random() * (100 - 50 + 1) + 50),
                timestamp: timestamp,
              });
          
              startDate.setHours(startDate.getHours() + 1);
            }
          
            return data;
        }
          
        let dataArr = generateRandomData();
        function removeEveryOther(arr) {
            return arr.filter((_, index) => index % 2 === 0);
        }
        for (let i=0; i < 7; i++) {
            dataArr = removeEveryOther(dataArr)
        }
        let s = 0
        setInterval(() => {
            if (s < dataArr.length) {
                updateStats(dataArr[s].wpm,dataArr[s].cpm,dataArr[s].accuracy,dataArr[s].timestamp)
            } else {
            }
            s++
        }, 1000)
        /*updateStats(
            Math.floor(Math.random() * 120),
            Math.floor(Math.random() * 400),
            Math.floor(Math.random() * 100),
            dateString)*/
    }

    const searcher = async () => {
        let res = await searchUsers("new")
        console.log(res)
    }

    return (
        <React.Fragment>
            <button onClick={searcher} hidden style={{position: 'absolute', zIndex:'53', top:'20%', left:'20%'}}>AGSD</button> {/*EXCLUSVELY HERE FOR DEBUGGING, REMOVE LATER*/}
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
                <FinishScreen restart={restart} chartData={chartData} finishData={finishData} wordStorage={wordStorage} settings={settings} defTime={definedTime} resetPressedKeys={resetPressedKeys}/>
            }
            <div className='--main-achievement-popup' style={{display: popup.activated ? 'flex' : 'none'}}>
                <img src={popup.image} style={{height:'4vh', marginRight: '1vw'}}/>
                <div>
                    <div style={{marginTop:'-1vh'}}><span style={{color: 'rgba(255,255,255,0.7)', fontSize: '0.7rem', fontWeight:'200'}}>New achievement unlocked</span></div>
                    <span style={{color: 'rgba(255,255,255,1)', fontSize: '1rem', fontWeight:'500'}}>{popup.body}</span>
                </div>
            </div>
                <Routes>
                    <Route path='*' element={
                        <React.Fragment>
                            <div style={{height:'100vh',width:'100%', display:'grid', placeItems:'center'}}>
                                <div style={{height:'23vh', display:'flex', flexDirection:'column', justifyContent:'space-evenly', alignItems:'center'}}>
                                    <h1 className='--header-logo' style={{margin: '0'}}>You've come to a dead end</h1>
                                    <h1 className="--header-logo" style={{margin: '0'}}>The road sign says 404</h1>
                                    <div style={{display:'flex', alignItems:'center', justifyContent:'center', height: 'max-content'}}>
                                        <h1 className='--header-logo' style={{margin: '0'}}>You can only&nbsp;
                                            <Link to="/typerate" style={{color:'white', pointerEvents:'all'}}>turn back</Link> now
                                        </h1>
                                        <div className='--header-blinker'></div>
                                    </div>
                                </div>
                            </div>
                            <Backgrounds theme={settings.theme} backgroundEffects={settings.backgroundEffects}/>
                        </React.Fragment>
                    }></Route>
                    <Route exact path="/typerate" element={
                        <React.Fragment>
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
                                {/*that tools obj has got to be the dumbest piece of code ive ever written, cant change it now (no pun intended)*/}
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
                                        <textarea className='--main-word' 
                                            id="pseudomain" 
                                            rows='1' 
                                            cols={words[4].body && words[4].body.length} 
                                            value={words[4] && words[4].body} 
                                            readOnly></textarea>
                                        <textarea 
                                            className='--main-input' 
                                            onInput={settings.mode.loaded ? handleMainInput : () => {console.log("-")}} 
                                            rows='1' 
                                            cols={words[4].body && words[4].body.length > input.length ? words[4].body.length : input.length} 
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
                                    <SeqeuntialDisplay 
                                        addHSKEventListeners={addHSKEventListeners} 
                                        words={words} 
                                        input={input} 
                                        settings={settings} 
                                        started={started} 
                                        time={time} 
                                        handleMainInput={handleMainInput} 
                                        correct={correct} 
                                    />
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
                                    setChartType={setChartType}
                                    settings={settings}
                                    changeStopKey={changeStopKey}
                                    stopKey={stopKey}
                                />
                            }
                            <Backgrounds theme={settings.theme} backgroundEffects={settings.backgroundEffects}/>
                                <div className='--main-keys-container' style={{opacity: !started && '0', justifyContent: settings.hideHeader && 'center'}}>
                                    {pressedKeysDisplay}
                                </div>
                                <div className='--main-hold-restart' style={{opacity: !started && '0', marginTop: settings.hideHeader && '-8vh'}}>○</div>
                                <div className="--main-auto-key-notice">
                                    <img src={wrongpng} style={{height: '16px', marginRight: '0.5vw'}}/>
                                    <span id="--main-notice-text">Spaces aren't allowed in auto completion mode</span>
                                </div>
                            </div>
                        </React.Fragment>}>
                    </Route>
                    <Route exact path="/typerate/signup" element={
                        <React.Fragment>
                            <Register />
                            <Backgrounds theme={settings.theme} backgroundEffects={settings.backgroundEffects}/>
                        </React.Fragment>
                    }>
                    </Route>
                    <Route exact path="/typerate/login" element={
                        <React.Fragment>
                            <Login/>
                            <Backgrounds theme={settings.theme} backgroundEffects={settings.backgroundEffects}/>
                        </React.Fragment>
                    }>
                    </Route>
                </Routes>
        </React.Fragment>
    )
}

export default App
