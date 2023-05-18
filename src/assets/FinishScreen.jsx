import React from 'react'
import restarticon from './images/restarticon.png'
import detailspng from  './images/details.png'
import logoicon from './images/icon.png'
import { updateStats } from '../api/user'
import { UserContext } from './context/userContext'

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    PointElement,
  } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);
ChartJS.defaults.font.family = 'Roboto Mono'
ChartJS.defaults.color = 'rgb(255,255,255,0.9)'
ChartJS.defaults.borderColor = 'rgb(0,0,0,0)'
ChartJS.defaults.borderRadius = '10px';

ChartJS.register(PointElement)
function DataDisp({left, right}) {
    return (
        <div style={{display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center'}} className='--finish-elements'>
            <h3 className="--finish-results-text">{left}</h3>
            <h3 className="--finish-results-text --frtr">{right}</h3>
        </div>
    )
}
  


function FinishScreen(props) {
    const { user, updateUser, updateGames } = React.useContext(UserContext) 
    const [labels, setLabels] = React.useState()
    const [wpm, setWpm] = React.useState([0])
    const [cpm, setCpm] = React.useState([0])
    const [chartWPM, setChartWPM] = React.useState(null)
    const [chartCPM, setChartCPM] = React.useState(null)
    const [avg, setAvg] = React.useState({wpm: 0, cpm: 0})
    const [total, setTotal] = React.useState({
        totalChars: 0,
        totalWords: 0,
        totalMissed: 0
    })
    const [all, setAll] = React.useState({
        words: [],
        missed: []
    })

    React.useEffect(() => {
        if (props.chartData != []) {
            setLabels(prev => {
                let labelData = props.chartData.map(item => {
                return `${item.time / 1000}s`})
                let outp = []
                for (let item of labelData) {outp.unshift(item)}
                return outp
            })
            setWpm(props.chartData.map(item => item.wpm))
            setCpm(props.chartData.map(item => item.cpm))
        }
    }, [props.chartData])
      
//backgroundColor: 'rgba(53, 162, 235, 0.5)',
    const handleRestart = () => {
        document.getElementById('finish').classList.remove('showBox')
        document.getElementById('finish').classList.add('closeBox')
        document.getElementById('finishwr').classList.remove('showOver')
        document.getElementById('finishwr').classList.add('closeOver')
        setTimeout(() => {
            props.restart()
        }, 500)
    }

    React.useEffect(() => {

        let optionsWPM = {
            responsive: true,
            plugins: {
            title: {
                display: true,
                text: 'WPM timeline',
            },
            legend: { display: false }
            },
        };
    
    
        let dataWPM = {
            labels,
            datasets:[
                {
                label: 'WPM',
                data: wpm,
                backgroundColor: 'rgba(230, 220, 220, 0.8)',
                borderRadius: '10px',
                },
            ]
        };

        let dataCPM = {
            labels,
            datasets: [
                {
                label: 'CPM',
                data: cpm,
                backgroundColor: 'rgba(230, 220, 220, 0.8)',
                border: '1px solid white',
                }
            ]
        } 
        let optionsCPM = {
            responsive: true,
            plugins: {
            title: {
                display: true,
                text: 'CPM timeline',
            },
            legend: { display: false }
            },
        };
        setChartWPM(<Bar options={optionsWPM} data={dataWPM} className='--finish-chart bott'/>)
        setChartCPM(<Bar options={optionsCPM} data={dataCPM} className='--finish-chart '/>)
        setTotal(prev => {
            let sumC = 0, sumM = 0
            for (let item of props.wordStorage) {
                sumC += item.body.length
                item.status === 'incorrect' ? ++sumM : true
            }
            return ({
                totalChars: sumC,
                totalWords: props.wordStorage.length,
                totalMissed: sumM
            })
        })
        setAll(prev => {
            let outpW = [], outpM = []
            for (let item of props.wordStorage) {
                if (item.status === 'incorrect') {
                    outpM.push(item.original)
                }
                outpW.push(item.original)
            }
            return ({
                words: outpW,
                missed: outpM
            })
        })
    }, [labels])
    //<DataDisp left={((wpm.reduce(sum)) / wpm.length).toFixed(2)} right="Average WPM"/>
    //<DataDisp left={((cpm.reduce(sum)) / cpm.length).toFixed(2)} right="Average CPM"/>
    const sumOfAll = (arr) => {
        let outp = 0
        if (arr===null || arr==="" || arr===undefined) {return}
        if (arr.length == 0) {return}
        for (let item of arr) {outp += Number(item)}
        return outp
    }

    React.useEffect(() => {
        if (wpm.length > 0 && cpm.length > 0) {
            setAvg(({
                wpm: (sumOfAll(wpm) / wpm.length).toFixed(2),
                cpm: (sumOfAll(cpm) / cpm.length).toFixed(2)
            }))
        }
    }, [wpm, cpm])

    React.useEffect(() => {
        try{
            document.querySelector('.--main-input').blur() 
        } catch (ex) {}
    },[])

    React.useEffect(() => {
        if (props.finishData.WPM > 0) {
            if (!props.settings.practiceMode) {
                const currentDate = new Date();
                const dateString = `${(currentDate.getMonth() + 1).toString().padStart(2, '0')}/${currentDate.getDate().toString().padStart(2, '0')}/${currentDate.getFullYear().toString()} ${currentDate.getHours().toString().padStart(2, '0')}:00`;
                (async () => {
                    await updateStats(props.finishData.WPM,props.finishData.CPM,props.finishData.accuracy,dateString,props.finishData.missedCharacters,props.finishData.missedCombinations)
                    updateUser()
                })()
                //updateStats(props.finishData.WPM,props.finishData.CPM,props.finishData.accuracy,dateString,alphabet.map(item => ({key: item, instances: ~~(Math.random() * 120)})))
                /*setTimeout(() => {
                    updateUser()
                }, 500)*/

                updateGames(
                    {
                        wpm: props.finishData.WPM,
                        cpm: props.finishData.CPM,
                        accuracy: props.finishData.accuracy,
                        timestamp: dateString
                    }
                )
            }
        }
    }, [props.finishData.WPM])

    return (
        <React.Fragment>
            <div className='--finish-wrapper showOver' id='finishwr'></div>
                <div className='--finish-container showBox' id='finish'>
                <div className='--finish-header'>
                    <h1 className='--finish-title'>
                        <img src={logoicon} style={{height: '3.8vh', marginBottom: '-0.5vh', marginRight:'1rem'}}/>
                        Final results
                    </h1>
                    <div style={{display: 'flex', justifyContent: 'space-between', width: '7rem'}}>
                        <button className='--restart-btn'>
                            <img className='--restart-img' src={detailspng}/>
                        </button>
                        <button id='rst' className='--restart-btn'>
                            <img className='--restart-img' src={restarticon}  onClick={handleRestart}/>
                        </button>
                    </div>
                </div>
                <div style={{width: '100%', height: '7vh'}}>
                </div>
                    <div style={{display: 'flex', width: '100%', justifyContent: 'space-between',height: '100%', marginTop: '-1vh',paddingBottom: '10vh'}} >
                        <div className='--finish-stats-wrap'>
                            {//<h1 className='--finish-title'>Final results</h1>
                            }
                            <div className='--finish-results'>
                                <DataDisp left={props.finishData.WPM} right="WPM"/>
                                <DataDisp left={props.finishData.CPM} right="CPM"/>
                                <DataDisp left={props.finishData.maxWPM} right="Max WPM"/>
                                <DataDisp left={props.finishData.maxCPM} right="Max CPM"/>
                                <DataDisp left={avg.wpm} right="Average WPM"/>
                                <DataDisp left={avg.cpm} right="Average CPM"/>
                                <DataDisp left={props.finishData.autocompletion ? "On" : "Off"} right="Autocompletion"/>
                                <DataDisp left={props.finishData.leisure ? "On" : "Off"} right="Leisure"/>
                                <DataDisp left={props.finishData.accuracy} right="Accuracy"/>
                                <DataDisp left={props.defTime / 1000} right="Time (s)"/>
                                <DataDisp left={props.settings.mode.dispName} right="Mode"/>
                                <DataDisp left={total.totalChars} right="Total characters"/>
                                <DataDisp left={total.totalWords} right="Total words"/>
                                <DataDisp left={total.totalMissed} right="Total missed"/>
                                <details style={{display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgb(0,0,0,0.6)'}}>
                                    <summary className="--finish-results-text --finish-elements">All words</summary>
                                    <p className='--summary-txt'>{all.words.join(', ')}</p>
                                </details>
                                <details style={{display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgb(0,0,0,0.3)'}}>
                                    <summary className="--finish-results-text --finish-elements">All missed words</summary>
                                    <p className='--summary-txt'>{all.missed.join(', ')}</p>
                                </details>
                            </div>
                        </div>
                        <div className='--chart-wrapper'>
                            <div style={{width:'100%'}} className='--chart'>
                                {chartWPM != null && chartWPM}
                            </div>
                            <div style={{width:'100%'}} className='--chart'>
                                {chartCPM != null && chartCPM}
                            </div>
                        </div>
                    </div>
                </div>
        </React.Fragment>
    )
}


export default React.memo(FinishScreen)