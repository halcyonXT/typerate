import React from 'react'
import Word from './Word'
export default function SequentialDisplay(props) {
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
            <div style={{width: '300%', display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', backgroundColor: 'rgb(0,0,0,0.1)', border: '0.2vw solid white'}}>
                <div style={{display: 'flex', alignItems: 'center', overflowWrap: 'normal', justifyContent: 'space-evenly', overflow: 'hidden'}}>

                        <Word size='3.1239' word={props.words[0]} className="rightM"/>
                        <Word size='3.1239' word={props.words[1]} className="rightM"/>
                        <Word size='3.1239' word={props.words[2]} className="rightM"/>
                        <Word size='3.1239' word={props.words[3]} className="rightM"/>
                        <div>
                            <textarea className='--main-word' rows='1' cols={props.words[4].body.length} value={props.words[4].body} style={{fontSize: '3.1239vw'}}></textarea>{" "}
                            <textarea className='--main-input' onInput={props.settings.mode.loaded ? props.handleMainInput : () => {console.log(Loading)}} rows='1' cols={props.words[4].body.length > props.input.length ? props.words[4].body.length : props.input.length} 
                            name='input' value={props.input} style={{color:props.correct ? 'rgb(54, 54, 54)' : 'red', fontSize: '3.1239vw'}} spellCheck='false' maxLength={20} id='minput'></textarea>{" "}
                        </div>
                        <Word size='3.1239' word={props.words[5]} className="rightM"/>
                        <Word size='3.1239' word={props.words[6]} className="rightM"/>
                        <Word size='3.1239' word={props.words[7]} className="rightM"/>
                        <Word size='3.1239' word={props.words[8]}/>
                </div>
            </div>
        </React.Fragment>
)
}
/*
<React.Fragment>
            <div style={{width: '300%', display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', backgroundColor: 'rgb(0,0,0,0.1)', border: '0.2vw solid white'}}>
                <div style={{display: 'flex', alignItems: 'center', overflowWrap: 'normal', justifyContent: 'space-evenly', overflow: 'hidden'}}>

                    <textarea className='--main-word' rows='1' cols={displayValue} 
                    value={displayValue} style={{fontSize: '3.1239vw'}}></textarea>

                    <textarea className='--main-input' onInput={props.settings.mode.loaded ? props.handleMainInput : () => {console.log(Loading)}} 
                    rows='1' 
                    cols={props.words[4].body.length > props.input.length ? props.words[4].body.length : props.input.length} 
                    name='input'
                    value={props.input} 
                    style={{color:props.correct ? 'rgb(54, 54, 54)' : 'red', fontSize: '3.1239vw'}} spellCheck='false' maxLength={20} id='minput'></textarea>
                    
                </div>
            </div>
        </React.Fragment> */
/*
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
                    */