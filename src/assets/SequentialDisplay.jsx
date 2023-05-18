import React from 'react'
import Word from './Word'
//cols={props.words[4].body && props.words[4].body.length > props.input.length ? props.words[4].body.length : props.input.length}


export default function SequentialDisplay(props) {
    const [last12, setLast12] = React.useState({list: [], elements: [], set: false})
    const [currentIndex, setCurrentIndex] = React.useState(4)
    
    let displayWords = 
    last12.set 
    ?
    (() => {
        let arr = last12.elements
        arr[currentIndex] = (
            <React.Fragment>
                <div>
                    <label class="--seq-placeholder" for="input-seq">{props.words[4].body}</label>
                    <textarea 
                        className='--seq-main-input' 
                        onInput={props.settings.mode.loaded ? props.handleMainInput : () => {}} 
                        rows='1' 
                        cols={props.words[4].body && props.words[4].body.length > props.input.length ? props.words[4].body.length : props.input.length}
                        name='input-seq' 
                        value={props.input.trim()} 
                        style={{color:props.correct ? 'rgba(255, 255, 255, 1)' : 'rgb(170, 20, 20, 0.8)', transitionDuration: '0.09s'}}
                        spellCheck='false' maxLength={20} id='minput' autoFocus></textarea>
                </div>
            </React.Fragment>
        )
        return arr
    })()
    : 
    props.words.map((item, index) => {
        if (item.status === "filler") {return} 
        if (index === 4) {
            return (
                <React.Fragment>
                    <div>
                        <label class="--seq-placeholder" for="input-seq">{props.words[4].body}</label>
                        <textarea 
                            className='--seq-main-input' 
                            onInput={props.settings.mode.loaded ? props.handleMainInput : () => {}} 
                            rows='1' 
                            cols={props.words[4].body && props.words[4].body.length > props.input.length ? props.words[4].body.length : props.input.length}
                            name='input-seq' 
                            value={props.input.trim()} 
                            style={{color:props.correct ? 'rgba(255, 255, 255, 1)' : 'rgb(170, 20, 20, 0.8)', transitionDuration: '0.09s'}}
                            spellCheck='false' maxLength={20} id='minput'
                            autoFocus></textarea>
                    </div>
                </React.Fragment>
                )
        } else 
        return <Word size='2' word={props.words[index]} seq={true} style={{margin:0}}/>
    })

    React.useEffect(() => {
        if (props.words[4].body !== 'loading' && !props.started) {
            let setter = []
            for (let i = 0; i < 25; i++) {
                setter.push(props.words[i])
            }
            setLast12({
                list: setter, 
                elements: props.words.map((item, index) => {if (index < 4) {return} else return <Word seq={true} size='2' word={props.words[index]} style={{margin:0}}/>}),
                set: true
            })
        }
        if (props.started) {
            setCurrentIndex(prev => prev + 1)
        }
    }, [props.words])

    React.useEffect(() => {
        if (!props.started) {
            let setter = []
                for (let i = 0; i < 25; i++) {
                    setter.push(props.words[i])
                }
            setLast12({
                list: setter, 
                elements: setter.map((item, index) => {if (index < 4) {return} else return <Word seq={true} size='2' word={props.words[index]} style={{margin:0}}/>}),
                set: true
            })
            setCurrentIndex(4)
        }
    }, [props.started])

    React.useEffect(() => {
        if (props.started) {
            if (currentIndex < 18) {
                setLast12(prev => {
                    let obj = {list: prev.list, elements: prev.elements, set: true} //CHANGE SET TO TRUE
                    obj.elements[currentIndex - 1] = <Word size='2' seq={true} word={prev.list[currentIndex - 1]}/>
                    return obj
                })
            } else {
                let setter = []
                for (let i = 0; i < 25; i++) {
                    setter.push(props.words[i])
                }
                setLast12({
                    list: setter, 
                    elements: setter.map((item, index) => {if (index < 4) {return} else return <Word seq={true} size='2' word={props.words[index]} style={{margin:0}}/>}),
                    set: true
                })
                setCurrentIndex(4)
            }
        }
    }, [currentIndex])

    React.useEffect(() => {
        if (props.time <= 0) {
            let setter = []
                for (let i = 0; i < 25; i++) {
                    setter.push(props.words[i])
                }
            setLast12({
                list: setter, 
                elements: setter.map((item, index) => {if (index < 4) {return} else return <Word seq={true} size='2' word={props.words[index]} style={{margin:0}}/>}),
                set: true
            })
            setCurrentIndex(4)
        }
    }, [props.time])
    
    return (
        <React.Fragment>
                <div className='--seq-wrap'>
                    {displayWords}
                </div>
        </React.Fragment>
    )
}

/**
 * const [sequence, setSequence] = React.useState("")
    const [input, setInput] = React.useState("")
    const [target, setTarget] = React.useState("")

    React.useEffect(() => {
        if (!props.started) {
            setSequence((() => {
                let raw = props.words.map(item => item.status === "filler" ? "" : item.body).join(" ")
                setTarget(props.words[0].body)
                return raw
            })())
        }
    }, [props.words])

    const processInput = (e) => {
        setInput(e.target.value)
        
    }

    return (
        <React.Fragment>
                <div 
                    className='--seq-pseudomain' 
                    spellCheck="false" 
                    readOnly>{sequence}</div>
                <textarea 
                    className='--seq-main' 
                    spellCheck="false" 
                    id="seqminput"
                    contentEditable="true"
                    rows="3"
                    onInput={processInput}>{input}</textarea>
        </React.Fragment>
    )
 */

/**
 * import React from 'react'

export default function SequentialDisplay(props) {


    const [seq, setSeq] = React.useState("")
    const [seqinput, setSeqinput] = React.useState("")

    const sequenceMaker = () => {
        let sequence = []
        for (let i in props.words) {
            sequence.push(props.words[i].body)
        }
        sequence = sequence.join(" ")
        return sequence.slice(document.getElementById("seqminput").value.length)
        //.slice(seqinput.length, seqinput.length + 47)
    }

    const handleSeqinput = (e) => {
        setSeqinput(e.target.value)
        setSeq(sequenceMaker())
    } 

    React.useEffect(() => {
        if (!props.started) {
            setSeq(sequenceMaker())
        }
    }, [props.words])


    return (
        <React.Fragment>
            <div className='--seq-pseudomain' spellCheck="false" readOnly>{seq}</div>
            <textarea 
                className='--seq-main' 
                spellCheck="false" 
                onChange={handleSeqinput} 
                rows="1" columns="6"
                value={seqinput}
                id="seqminput"></textarea>
        </React.Fragment>
    )
}
 */

/**
 * 
 * export default function SequentialDisplay(props) {
    const [displayValue, setDisplayValue] = React.useState("")
    React.useEffect(() => {
        setDisplayValue(prev => {
            let outp = `${props.words[0].body} ${props.words[1].body} ${props.words[2].body} ${props.words[3].body} 0${props.words[4].body}9 ${props.words[5].body} ${props.words[6].body} ${props.words[7].body} ${props.words[8].body}`.split("")
            let indexes = [outp.indexOf(el => el == 0), outp.indexOf(el => el == 9)]
            let rotp = `${props.words[4].body}`.split(''), i = 1, j = 1
            console.log(outp)
            for (let x=indexes[0]; x >= 0; x--) {
                rotp.unshift(outp[indexes[0] - i])
                --i
                if (rotp.length == 56) {
                    break
                }
                for (let y=indexes[1]; y < outp.length; y++) {
                    rotp.push(outp[indexes[1] + j])
                    ++j
                }
                if (rotp.length == 56) {
                    break
                }
            }
            return rotp.join('')
        })
    }, [props.input, props.words])
    return (
        <React.Fragment>
            <div style={{width: '350%', display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', backgroundColor: 'rgb(0,0,0,0.1)', border: '0.2rem solid white'}}>
                <div style={{display: 'flex', alignItems: 'center', overflowWrap: 'normal', justifyContent: 'center', overflow: 'hidden', width: '100%'}}>

                        <Word size='3.1239' word={props.words[0]} className="rightM"/>
                        <div style={{width:'0.2rem'}}></div>
                        <Word size='3.1239' word={props.words[1]} className="rightM"/>
                        <div style={{width:'0.2rem'}}></div>
                        <Word size='3.1239' word={props.words[2]} className="rightM"/>
                        <div style={{width:'0.2rem'}}></div>
                        <Word size='3.1239' word={props.words[3]} className="rightM"/>
                        <div style={{width:'0.2rem'}}></div>
                        <div>
                            <textarea className='--main-input' rows='1' 
                            name='input' style={{fontSize: "3.1239rem"}}></textarea>{" "}
                            <textarea className='--main-word' rows='1' cols={props.words[4].body.length} value={props.words[4].body} style={{fontSize: '3.1239rem'}}></textarea>{" "}
                            <textarea className='--main-input' onInput={props.settings.mode.loaded ? props.handleMainInput : () => {console.log(Loading)}} rows='1' cols={props.words[4].body.length > props.input.length ? props.words[4].body.length : props.input.length} 
                            name='input' value={props.input} style={{color:props.correct ? 'rgb(54, 54, 54)' : 'red', fontSize: '3.1239rem'}} spellCheck='false' maxLength={20} id='minput'></textarea>{" "}
                        </div>
                        <div style={{width:'0.2rem'}}></div>
                        <Word size='3.1239' word={props.words[5]} className="rightM"/>
                        <div style={{width:'0.2rem'}}></div>
                        <Word size='3.1239' word={props.words[6]} className="rightM"/>
                        <div style={{width:'0.2rem'}}></div>
                        <Word size='3.1239' word={props.words[7]} className="rightM"/>
                        <div style={{width:'0.2rem'}}></div>
                        <Word size='3.1239' word={props.words[8]}/>
                </div>
            </div>
        </React.Fragment>
)
}
 * 
 */

/*
<React.Fragment>
            <div style={{width: '300%', display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', backgroundColor: 'rgb(0,0,0,0.1)', border: '0.2rem solid white'}}>
                <div style={{display: 'flex', alignItems: 'center', overflowWrap: 'normal', justifyContent: 'space-evenly', overflow: 'hidden'}}>

                    <textarea className='--main-word' rows='1' cols={displayValue} 
                    value={displayValue} style={{fontSize: '3.1239rem'}}></textarea>

                    <textarea className='--main-input' onInput={props.settings.mode.loaded ? props.handleMainInput : () => {console.log(Loading)}} 
                    rows='1' 
                    cols={props.words[4].body.length > props.input.length ? props.words[4].body.length : props.input.length} 
                    name='input'
                    value={props.input} 
                    style={{color:props.correct ? 'rgb(54, 54, 54)' : 'red', fontSize: '3.1239rem'}} spellCheck='false' maxLength={20} id='minput'></textarea>
                    
                </div>
            </div>
        </React.Fragment> */
/*
<React.Fragment>
                        <div style={{width: '300%', display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', backgroundColor: 'rgb(0,0,0,0.1)', border: '0.2rem solid white'}}>
                            <div style={{display: 'flex', alignItems: 'center', overflowWrap: 'normal', justifyContent: 'space-evenly', overflow: 'hidden'}}>
                                <Word size='3.1239' word={words[0]} className="rightM"/>
                                <Word size='3.1239' word={words[1]} className="rightM"/>
                                <Word size='3.1239' word={words[2]} className="rightM"/>
                                <Word size='3.1239' word={words[3]} className="rightM"/>
                                <div>
                                    <textarea className='--main-word' rows='1' cols={words[4].body.length} value={words[4].body} style={{fontSize: '3.1239rem'}}></textarea>{" "}
                                    <textarea className='--main-input' onInput={settings.mode.loaded ? handleMainInput : () => {console.log(Loading)}} rows='1' cols={words[4].body.length > input.length ? words[4].body.length : input.length} 
                                    name='input' value={input} style={{color:correct ? 'rgb(54, 54, 54)' : 'red', fontSize: '3.1239rem'}} spellCheck='false' maxLength={20} id='minput'></textarea>{" "}
                                </div>
                                <Word size='3.1239' word={words[5]} className="rightM"/>
                                <Word size='3.1239' word={words[6]} className="rightM"/>
                                <Word size='3.1239' word={words[7]} className="rightM"/>
                                <Word size='3.1239' word={words[8]}/>
                            </div>
                        </div>
                    </React.Fragment>
                    */