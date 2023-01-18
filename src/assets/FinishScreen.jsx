import React from 'react'
import restarticon from './restarticon.png'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
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

function DataDisp({left, right}) {
    return (
        <div style={{display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1c1c1c', marginTop: '0.4vw'}}>
            <h3 className="--finish-results-text">{left}</h3>
            <h3 className="--finish-results-text --frtr">{right}</h3>
        </div>
    )
}
  
function FinishScreen(props) {
    const [labels, setLabels] = React.useState()
    const [wpm, setWpm] = React.useState()
    const [cpm, setCpm] = React.useState()
    const [chartWPM, setChartWPM] = React.useState(null)
    const [chartCPM, setChartCPM] = React.useState(null)
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
            datasets: [
                {
                label: 'WPM',
                data: wpm,
                backgroundColor: 'rgba(67, 67, 67, 0.8)',
                },
            ],
        };

        let dataCPM = {
            labels,
            datasets: [
                {
                label: 'CPM',
                data: cpm,
                backgroundColor: 'rgba(220, 98, 98, 0.8)'
                },
            ],
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
        setChartWPM(<Bar options={optionsWPM} data={dataWPM} className='--finish-chart'/>)
        setChartCPM(<Bar options={optionsCPM} data={dataCPM} className='--finish-chart'/>)
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

    return (
        <div className='--finish-wrapper showOver' id='finishwr'>
            <div className='--finish-container showBox' id='finish'>
                <div style={{display: 'flex', width: '100%', justifyContent: 'space-between'}}>
                    <div style={{display: 'flex', flexDirection: 'column', width: '46%', height: '100%', justifyContent: 'space-between'}}>
                        <h1 className='--finish-title'>Final results</h1>
                        <div className='--finish-results'>
                            <DataDisp left={props.finishData.WPM} right="WPM"/>
                            <DataDisp left={props.finishData.CPM} right="CPM"/>
                            <DataDisp left={props.finishData.accuracy} right="Accuracy"/>
                            <DataDisp left={total.totalChars} right="Total characters"/>
                            <DataDisp left={total.totalWords} right="Total words"/>
                            <DataDisp left={total.totalMissed} right="Total missed"/>
                            <details style={{display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1c1c1c', marginTop: '0.4vw'}}>
                                <summary className="--finish-results-text">All words</summary>
                                <p className='--summary-txt'>{all.words.join(', ')}</p>
                            </details>
                            <details style={{display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1c1c1c', marginTop: '0.4vw'}}>
                                <summary className="--finish-results-text">All missed words</summary>
                                <p className='--summary-txt'>{all.missed.join(', ')}</p>
                            </details>
                        </div>
                    </div>
                    <div style={{display: 'flex', flexDirection: 'column', width: '50%',height: '100%'}}>
                        <div style={{width:'100%'}}>
                            {chartWPM != null && chartWPM}
                        </div>
                        <div style={{width:'100%'}}>
                            {chartCPM != null && chartCPM}
                        </div>
                        <button id='rst' className='--restart-btn' onClick={handleRestart}><img className='--restart-img' src={restarticon}/></button>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default React.memo(FinishScreen)