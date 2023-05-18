import React from "react"
import { UserContext } from "./context/userContext"
import defaultpng from "./images/default.png"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import {ArcElement} from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { Line } from 'react-chartjs-2';
  
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Filler,
    Legend
  );

let user;

export default function DetailedStats(props) {
    if (props.differentUser) {
        user = props.user
    } else {
        const obj = React.useContext(UserContext)
        user = obj.user
    }

    const [allGames, setAllGames] = React.useState({
        sortBy: "aschron",
        pivotBy: "cpm"
    })
    const [sortedGames, setSortedGames] = React.useState([])

    const [chartData, setChartData] = React.useState({
        title: "WPM change over-time:",
        pivotBy: "wpm",
        time: "1month",
        labels: [],
        data: [],
        stats: {
            WPMchangeSincePivot: 0,
            ACCchangeSincePivot: 0,
            WPMchangeSincePivotComparedToAverage: 0,
            ACCchangeSincePivotComparedToAverage: 0,
            WPMmaxSincePivot: 0,
            CPMmaxSincePivot: 0,
        }
    })
    const [changeChart, setChangeChart] = React.useState(null)


    const [missedChart, setMissedChart] = React.useState("")

    const [combinationsSort, setCombinationsSort] = React.useState("impact")


    React.useEffect(() => {
        //if sort settings have changed - and on startup
        let tempGames = [];
        switch (allGames.sortBy) {
            case "dechron":
                tempGames = [...user.gamesPlayed]
                break
            case "aschron":
                tempGames = [...user.gamesPlayed].reverse()
                break
            case "aswpm":
                tempGames = [...user.gamesPlayed].sort((obj1, obj2) => obj1.wpm - obj2.wpm).reverse();
                break
            case "dewpm":
                tempGames = [...user.gamesPlayed].sort((obj1, obj2) => obj1.wpm - obj2.wpm)
                break
            case "ascpm":
                tempGames = [...user.gamesPlayed].sort((obj1, obj2) => obj1.cpm - obj2.cpm).reverse();
                break
            case "decpm":
                tempGames = [...user.gamesPlayed].sort((obj1, obj2) => obj1.cpm - obj2.cpm)
                break
        }
        let pivotNum = 0;
        switch (allGames.pivotBy) {
            case "wpm":
                for (let i of user.gamesPlayed) {
                    if (i.wpm > pivotNum) {
                        pivotNum = i.wpm
                    }
                }
                break
            case "cpm":
                for (let i of user.gamesPlayed) {
                    if (i.cpm > pivotNum) {
                        pivotNum = i.cpm
                    }
                }
                break
            case "accuracy":
                for (let i of user.gamesPlayed) {
                    if (i.accuracy > pivotNum) {
                        pivotNum = i.accuracy
                    }
                }
                break
        }
        setSortedGames(tempGames.map(item => {
            return <GameDisp wpm={item.wpm} cpm={item.cpm} accuracy={item.accuracy} timestamp={item.timestamp} pivot={{by: allGames.pivotBy, pivot: pivotNum}}/>
        }))
    }, [allGames])

    React.useEffect(() => {
        function filterOldObjects(arr) {
            if (chartData.time === "alltime") {return arr}
            const now = new Date();
            let oneYearAgo;

            switch (chartData.time) {
                case "1year":
                    oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
                    break
                case "6months":
                    oneYearAgo = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
                    break
                case "1month":
                    oneYearAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
                    break
                case "7days":
                    oneYearAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
                    break
                case "1day":
                    oneYearAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
                    break
            }
          
            return arr.filter(obj => {
              let timestampParts;
              if (obj.timestamp) {
                timestampParts = obj.timestamp.split('/');
              } else timestampParts = "1/1/1970".split("/")
              const timestamp = new Date(`${timestampParts[0]}/${timestampParts[1]}/${timestampParts[2]}`);
              return timestamp >= oneYearAgo;
            });
        }

        setChartData(prev => {
            let raw = filterOldObjects([...user.gamesPlayed])
            let stats= {
                WPMchangeSincePivot: 0,
                ACCchangeSincePivot: 0,
                WPMchangeSincePivotComparedToAverage: 0,
                ACCchangeSincePivotComparedToAverage: 0,
                WPMmaxSincePivot: 0,
                CPMmaxSincePivot: 0,
            }

            const AVERAGE_WPM = (() => {
                let sum = [...user.gamesPlayed].reduce(function(prev,curr) { return prev + curr.wpm }, 0)
                return sum / user.gamesPlayed.length
            })()

            const AVERAGE_ACC = (() => {
                let sum = [...user.gamesPlayed].reduce(function(prev,curr) { return prev + curr.accuracy }, 0)
                return sum / user.gamesPlayed.length
            })()

            stats.WPMmaxSincePivot = (() => {
                let m = 0
                for (let i of raw) {if (i.wpm > m) {m = i.wpm}}
                return m
            })()

            stats.CPMmaxSincePivot = (() => {
                let m = 0
                for (let i of raw) {if (i.cpm > m) {m = i.cpm}}
                return m
            })()

            if (raw.length > 3) {
                var firstSumWPM = raw.slice(0, Math.ceil(raw.length / 3)) // Get the first third of the array
                                .reduce(function(prev, curr) { return prev + curr.wpm }, 0); // Calculate the sum of the wpm values
                var firstAvgWPM = firstSumWPM / Math.ceil(raw.length / 3); // Calculate the average wpm value

                let secondArr = raw.slice(Math.ceil(raw.length - ((raw.length / 3))))
                var secondSumWPM = secondArr // Get the first third of the array
                                .reduce(function(prev, curr) { return prev + curr.wpm }, 0); // Calculate the sum of the wpm values
                var secondAvgWPM = secondSumWPM / secondArr.length; // Calculate the average wpm value

                var firstSumACC = raw.slice(0, Math.ceil(raw.length / 3)) // Get the first third of the array
                                .reduce(function(prev, curr) { return prev + curr.accuracy }, 0); // Calculate the sum of the wpm values
                var firstAvgACC = firstSumACC / Math.ceil(raw.length / 3); // Calculate the average wpm value

                let secondArrACC = raw.slice(Math.ceil(raw.length - ((raw.length / 3))))
                var secondSumACC = secondArrACC // Get the first third of the array
                                .reduce(function(prev, curr) { return prev + curr.accuracy }, 0); // Calculate the sum of the wpm values
                var secondAvgACC = secondSumACC / secondArr.length; // Calculate the average wpm value


                stats.WPMchangeSincePivot = ((secondAvgWPM - firstAvgWPM) / firstAvgWPM) * 100
                stats.ACCchangeSincePivot = ((secondAvgACC - firstAvgACC) / firstAvgACC) * 100
                stats.ACCchangeSincePivotComparedToAverage = ((secondAvgACC - AVERAGE_ACC) / AVERAGE_ACC) * 100
                stats.WPMchangeSincePivotComparedToAverage = ((secondAvgWPM - AVERAGE_WPM) / AVERAGE_WPM) * 100
                
            } else {
                try {
                    stats.WPMchangeSincePivot = ((raw[raw.length - 1].wpm - raw[0].wpm) / raw[raw.length - 1].wpm) * 100
                    stats.ACCchangeSincePivot = ((raw[raw.length - 1].accuracy - raw[0].accuracy) / raw[raw.length - 1].accuracy) * 100
                    stats.ACCchangeSincePivotComparedToAverage = ((raw[raw.length - 1].accuracy - AVERAGE_ACC) / AVERAGE_ACC) * 100
                    stats.WPMchangeSincePivotComparedToAverage = ((raw[raw.length - 1].wpm - AVERAGE_WPM) / AVERAGE_WPM) * 100
                } catch (ex) {}
            }
            return ({...prev,
                title:`${chartData.pivotBy.slice(0,1).toUpperCase() + chartData.pivotBy.slice(1)} change over-time:`,
                labels: raw.map((item, index) => {
                    if (item.timestamp) {
                        return item.timestamp.split(" ")[0]
                    } else return "1/1/1970"
                }),
                data: raw.map(item => item[chartData.pivotBy]),
                stats: {...stats}
            })
        })
    }, [chartData.pivotBy, chartData.time]) 

    React.useEffect(() => {
        const options = {
            responsive: true,
            plugins: {
              legend: {
                display: false
              },
              title: {
                display: false,
                text: chartData.title,
              },
            },
        };

        const data = {
            labels: chartData.labels,
            datasets: [
                {
                    fill: true,
                    label: chartData.pivotBy.toUpperCase(),
                    data: chartData.data,
                    borderColor: 'rgb(53, 162, 235)',
                    backgroundColor: 'rgba(53, 162, 235, 0.5)',
                },
            ],
        };

        setChangeChart(<Line options={options} data={data} />)
    }, [chartData])

    React.useEffect(() => {
        function generateRandomBrightColors(n) {
            const colors = [];
          
            for (let i = 0; i < n; i++) {
              const r = Math.floor(Math.random() * 256);
              const g = Math.floor(Math.random() * 256);
              const b = Math.floor(Math.random() * 256);
          
              const brightness = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));
          
              if (brightness > 127) {
                colors.push(`rgba(${r}, ${g}, ${b}, 0.2)`);
              } else {
                i--;
              }
            }
          
            return colors;
        }
        let sorted = [...user.frequentlyMissed].sort((a,b) => a.instances - b.instances).reverse()
        let labels = sorted.map(item => item.key)
        let colors = generateRandomBrightColors(labels.length), borders = colors.map(item => item.slice(0, -4) + "1)");
        /*for (let item of labels) {
            let random = [~~(Math.random() * 255), ~~(Math.random() * 255), ~~(Math.random() * 255)]
            colors.push(`rgba(${random[0]}, ${random[1]}, ${random[2]}, 0.5)`)
            borders.push(`rgba(${random[0]}, ${random[1]}, ${random[2]}, 1)`)
        }*/
        const data = {
            labels: labels,
            datasets: [
              {
                label: 'Instances',
                data: sorted.map(item => item.instances),
                backgroundColor: colors,
                borderColor: borders,
                borderWidth: 1,
              },
            ],
            options: {
                plugins: {
                  legend: {
                    display: false
                  }
                }
              }
          };

          const options = {
            responsive: true,
            plugins: {
              legend: {
                display: false
              },
              title: {
                display: false,
                text: chartData.title,
              },
            },
        };

        if (user.frequentlyMissed.length > 0) {
            setMissedChart(<Pie options={options} data={data} />)
        } else {
            setMissedChart(null)
        }
    }, [])

    const revertUser = () => {
        props.setTargetedDetails({active: false, user: {}})
        props.setActivePanel("general")
    }

    return (
        <React.Fragment>
            <div className="--detailed-stats">
                <div className="--detailed-stats-header">
                    <h3 style={{fontWeight:'200'}}>Detailed stats for:&nbsp;</h3>
                    <img 
                        src={user.profilePicture === "default" ? defaultpng : user.profilePicture ? user.profilePicture : defaultpng} 
                        className="--settings-profile-picture"
                        style={{width: '2rem', height: '2rem', borderRadius: '0.3rem'}} 
                    ></img>
                    &nbsp;
                    <h2 style={{fontWeight:'400'}}>{user.username}</h2>
                    <div className="--detailed-stats-header-back" onClick={() => props.differentUser ? revertUser() : props.setActivePanel("general")}>
                        <svg fill="#ffffff" width="3rem" height="3rem" viewBox="-8.5 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff">
                            <g id="SVGRepo_bgCarrier" stroke-width="0"/>
                            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>
                            <g id="SVGRepo_iconCarrier"> <title>back</title> <path d="M15.281 7.188v17.594l-15.281-8.781z"/> </g>
                        </svg>
                    </div>
                </div>
                <div className="--detailed-stats-main">
                    <fieldset className='--settings-fieldset' style={{padding: '0.7rem', width: '22%'}}>
                        <legend>ALL GAMES PLAYED</legend>
                        <div className="--detailed-stats-allgames">
                            <div className="--detailed-stats-allgames-title">
                                <div className="--detailed-stats-allgames-title-sort-real">
                                    <div className="--detailed-stats-allgames-title-sort-item">
                                        SORT BY:
                                        <select className='select-type detailed-stats-select' onChange={(e) => {setAllGames(prev => ({...prev, sortBy: e.target.value}))}} value={allGames.sortBy}>
                                            <option value="dechron">Older to newer</option>
                                            <option value="aschron">Newer to older</option>
                                            <option value="aswpm">WPM ascending</option>
                                            <option value="dewpm">WPM descending</option>
                                            <option value="ascpm">CPM ascending</option>
                                            <option value="decpm">CPM descending</option>
                                        </select>
                                    </div>
                                    <div className="--detailed-stats-allgames-title-sort-item">
                                        PIVOT BY:
                                        <select className='select-type detailed-stats-select' onChange={(e) => {setAllGames(prev => ({...prev, pivotBy: e.target.value}))}} value={allGames.pivotBy}>
                                            <option value="wpm">WPM</option>
                                            <option value="cpm">CPM</option>
                                            <option value="accuracy">ACCURACY</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="--detailed-stats-allgames-main">
                                {
                                    sortedGames
                                }
                            </div>
                        </div>
                    </fieldset>
                    <fieldset className='--settings-fieldset' style={{padding: '0.7rem', width: '30%'}}>
                        <legend>FREQUENTLY MISSED KEYS</legend>
                        <div className="--detailed-stats-charts-wrapper" style={{width: '100%', justifyContent:'flex-start'}}>
                            <div className="--detailed-stats-chronograph-wrapper" style={{height:'50%'}}>
                                <div style={{display: 'flex', justifyContent: 'space-between', alignItems:'center', height: '80%', width: '100%'}}>
                                    {
                                        missedChart === null
                                        ?
                                        <div style={{width:'100%', height:'100%',display:'grid',placeItems:'center',color:'white',textAlign:'center'}}>
                                            Looks like you haven't missed any keys yet. Good for you :)
                                        </div>
                                        :
                                        (
                                            <React.Fragment>
                                                <div className="--detailed-stats-chronograph" style={{display: 'flex', alignItems:'center', justifyContent: 'flex-start', width: '55%', height: '100%'}}>
                                                    {
                                                        missedChart
                                                    }
                                                </div>
                                                <div className="--detailed-stats-allgames-main" style={{width:'40%'}}>
                                                    {
                                                        (() => {
                                                            let pivot = 0;
                                                            for (let i of user.frequentlyMissed) {
                                                                if (i.instances > pivot) {pivot = i.instances}
                                                            }
                                                            return [...user.frequentlyMissed].sort((a,b) => a.instances - b.instances).reverse().map(item => <KeyDisp obj={item} pivot={pivot}/>)
                                                        })()
                                                    }
                                                </div>
                                            </React.Fragment>
                                        )
                                    }
                                </div>
                            </div>
                            <legend style={{textShadow:"rgba(255,255,255,0.6) 0 0 0.5rem", marginTop: '-1.5rem', letterSpacing: '0.2rem'}}
                            >FREQUENTLY MISSED KEY COMBINATIONS</legend>
                            <div className="--detailed-stats-allgames-title-sort-real" style={{marginTop: '1rem'}}>
                                <div className="--detailed-stats-allgames-title-sort-item" style={{width: '100%'}}>
                                    SORT BY:
                                    <select className='select-type detailed-stats-select' onChange={(e) => {setCombinationsSort(e.target.value)}} value={combinationsSort}>
                                        <option value="dechron">Most instances</option>
                                        <option value="impact">Highest average impact</option>
                                    </select>
                                </div>
                            </div>
                            <div className="--detailed-stats-allgames-main" style={{marginTop: '1rem'}}>
                                {
                                    user.missedCombinations.length > 0 && 
                                    combinationsSort === "impact" 
                                    ?
                                    [...user.missedCombinations].sort((a,b) => a.impact.average - b.impact.average).reverse().map(item => <CombDisp key1={item.key1} key2={item.key2} instances={item.instances} impact={item.impact.average}/>)
                                    :
                                    [...user.missedCombinations].sort((a,b) => a.instances - b.instances).reverse().map(item => <CombDisp key1={item.key1} key2={item.key2} instances={item.instances} impact={item.impact.average}/>)
                                }
                            </div>
                        </div>
                    </fieldset>
                    <fieldset className='--settings-fieldset' style={{padding: '0.7rem', width: '40%'}}>
                        <legend>{chartData.title.toUpperCase().slice(0, -1)}</legend>
                        <div className="--detailed-stats-allgames-title">
                                <div className="--detailed-stats-allgames-title-sort-real">
                                    <div className="--detailed-stats-allgames-title-sort-item">
                                            TIME:
                                            <select className='select-type detailed-stats-select' onChange={(e) => {setChartData(prev => ({...prev, time: e.target.value}))}} value={chartData.time}>
                                                <option value="alltime">All time</option>
                                                <option value="1year">Past year</option>
                                                <option value="6months">Past 6 months</option>
                                                <option value="1month">Past month</option>
                                                <option value="7days">Past week</option>
                                                <option value="1day">Today</option>
                                            </select>
                                    </div>
                                    <div className="--detailed-stats-allgames-title-sort-item">
                                        VALUE:
                                        <select className='select-type detailed-stats-select' onChange={(e) => {setChartData(prev => ({...prev, pivotBy: e.target.value}))}} value={chartData.pivotBy}>
                                            <option value="wpm">WPM</option>
                                            <option value="cpm">CPM</option>
                                            <option value="accuracy">ACCURACY</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        <div className="--detailed-stats-charts-wrapper" style={{justifyContent:'space-evenly', width: '100%'}}>
                            <div className="--detailed-stats-chronograph-wrapper">
                                <div className="--detailed-stats-chronograph">
                                    {
                                        changeChart !== null && changeChart
                                    }
                                </div>
                            </div>
                            <div className="--detailed-stats-allgames-main" style={{marginTop:'0.5rem', height:'37.5%'}}>
                                <div className="--detailed-stats-charts-stat">
                                    <div className="--detailed-stats-charts-stat-desc">
                                        CHANGE COMPARED TO START OF TIME PERIOD {chartData.time === "alltime" ? "(All time)" : ("(" + chartData.time[0] + " " + chartData.time.slice(1) + ")").toUpperCase()}
                                    </div>
                                    <div className="--detailed-stats-charts-stat-item-wrapper">
                                        <div className="--detailed-stats-charts-stat-item">
                                            <p>WPM:</p>
                                            <StatDisp num={chartData.stats.WPMchangeSincePivot}/>
                                        </div>
                                        <div className="--detailed-stats-charts-stat-item">
                                            <p>ACCURACY:</p>
                                            <StatDisp num={chartData.stats.ACCchangeSincePivot}/>
                                        </div>
                                    </div>
                                </div>
                                <div className="--detailed-stats-charts-stat">
                                    <div className="--detailed-stats-charts-stat-desc">
                                        CHANGE COMPARED TO ALL-TIME AVERAGE
                                    </div>
                                    <div className="--detailed-stats-charts-stat-item-wrapper">
                                        <div className="--detailed-stats-charts-stat-item">
                                            <p>WPM:</p>
                                            <StatDisp num={chartData.stats.WPMchangeSincePivotComparedToAverage}/>
                                        </div>
                                        <div className="--detailed-stats-charts-stat-item">
                                            <p>ACCURACY:</p>
                                            <StatDisp num={chartData.stats.ACCchangeSincePivotComparedToAverage}/>
                                        </div>
                                    </div>
                                </div>
                                <div className="--detailed-stats-charts-stat">
                                    <div className="--detailed-stats-charts-stat-desc">
                                        MAXIMUM IN TIME PERIOD
                                    </div>
                                    <div className="--detailed-stats-charts-stat-item-wrapper">
                                        <div className="--detailed-stats-charts-stat-item">
                                            <p>WPM:</p>
                                            <p style={{fontSize: '0.8rem'}}>{chartData.stats.WPMmaxSincePivot}</p>
                                        </div>
                                        <div className="--detailed-stats-charts-stat-item">
                                            <p>CPM:</p>
                                            <p style={{fontSize: '0.8rem'}}>{chartData.stats.CPMmaxSincePivot}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </fieldset>
                </div>
            </div>
        </React.Fragment>
    )
}

const GameDisp = (props) => {
    let percentage = (props[props.pivot.by] / props.pivot.pivot) * 100
    let fillcolor1 = "#55afcf"
    let fillcolor2 = "#55cf70"
    let voidcolor = "#8b8b8b"
    return (
        <div className="--detailed-stats-allgames-game">
            <div className="--detailed-stats-allgames-game-titles">
                <p>WPM</p>
                <p>CPM</p>
                <p>ACCURACY</p>
            </div>
            <div className="--detailed-stats-allgames-game-stats">
                <p>{props.wpm}</p>
                <p>{props.cpm}</p>
                <p>{props.accuracy}%</p>
            </div>
            <p className="--detailed-stats-allgames-game-timestamp">PLAYED ON:&nbsp;{props.timestamp}</p>
            <div 
                className="--detailed-stats-allgames-game-percentage"
                style={{background: `linear-gradient(90deg, ${fillcolor1} 0%, ${fillcolor2} ${percentage}%, ${voidcolor} ${percentage + 0.01}%)`}}
            ></div>
        </div>
    )
}

const KeyDisp = (props) => {
    let percentage = (props.obj.instances / props.pivot) * 100
    let fillcolor1 = "#55afcf"
    let fillcolor2 = "#55cf70"
    let voidcolor = "#8b8b8b"
    return (
        <div className="--detailed-stats-allgames-game">
            <div className="--detailed-stats-allgames-game-titles">
                <p style={{width: '50%'}}>KEY</p>
                <p style={{width: '50%'}}>INSTANCES</p>
            </div>
            <div className="--detailed-stats-allgames-game-stats">
                <p style={{width: '50%'}}>{props.obj.key}</p>
                <p style={{width: '50%'}}>{props.obj.instances}</p>
            </div>
            <div 
                className="--detailed-stats-allgames-game-percentage"
                style={{background: `linear-gradient(90deg, ${fillcolor1} 0%, ${fillcolor2} ${percentage}%, ${voidcolor} ${percentage + 0.01}%)`}}
            ></div>
        </div>
    )
}

const StatDisp = (props) => {
    let green = "#77DD76"
    let red = "#FF6962"
    if (props.num < 0) {
        return (
            <div style={{display:'flex', gap:'0.15rem', alignItems: 'center'}}>
                <p className="--detailed-stats-charts-stat-item-percentage" style={{color: `${red}`}}>
                    {props.num.toFixed(3)}%&nbsp;
                </p>
                <svg width="0.7rem" height="0.7rem" viewBox="0 -4.5 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill={`${red}`}>
                    <g id="SVGRepo_bgCarrier" stroke-width="0"/>
                    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>
                    <g id="SVGRepo_iconCarrier">  <defs> </defs> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Dribbble-Light-Preview" transform="translate(-180.000000, -6684.000000)" fill={`${red}`}> <g id="icons" transform="translate(56.000000, 160.000000)"> <path d="M144,6525.39 L142.594,6524 L133.987,6532.261 L133.069,6531.38 L133.074,6531.385 L125.427,6524.045 L124,6525.414 C126.113,6527.443 132.014,6533.107 133.987,6535 C135.453,6533.594 134.024,6534.965 144,6525.39" id="arrow_down-[#339]"> </path> </g> </g> </g> </g>
                </svg>
            </div>
        )
    } else {
        return (
            <div style={{display:'flex', gap:'0.15rem', alignItems: 'center'}}>
                <p className="--detailed-stats-charts-stat-item-percentage" style={{color: `${green}`}}>
                    +{props.num.toFixed(3)}%&nbsp;
                </p>
                <svg width="0.7rem" height="0.7rem" viewBox="0 -4.5 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000">
                    <g id="SVGRepo_bgCarrier" stroke-width="0"/>
                    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>
                    <g id="SVGRepo_iconCarrier">  <defs> </defs> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Dribbble-Light-Preview" transform="translate(-140.000000, -6683.000000)" fill={`${green}`}> <g id="icons" transform="translate(56.000000, 160.000000)"> <path d="M84,6532.61035 L85.4053672,6534 L94.0131154,6525.73862 L94.9311945,6526.61986 L94.9261501,6526.61502 L102.573446,6533.95545 L104,6532.58614 C101.8864,6530.55736 95.9854722,6524.89321 94.0131154,6523 C92.5472155,6524.40611 93.9757869,6523.03486 84,6532.61035" id="arrow_up-[#ffffff]"> </path> </g> </g> </g> </g>
                </svg>
            </div>
        )
    }
}

const CombDisp = (props) => {
    return (
        <div className="--detailed-stats-allgames-game">
            <div className="--detailed-stats-allgames-game-titles">
                <p>KEYS</p>
                <p>INSTANCES</p>
                <p>AVERAGE TIME IMPACT</p>
            </div>
            <div className="--detailed-stats-allgames-game-stats">
                <p>{props.key1} + {props.key2}</p>
                <p>{props.instances}</p>
                <p>~{props.impact}s</p>
            </div>
        </div>
    )
}

//--detailed-stats-allgames-game

/*
<div className="--detailed-stats-chronograph-title">
                                    <h3>{chartData.title}</h3>
                                    <div className="--detailed-stats-allgames-title-sort">
                                        <div className="--detailed-stats-allgames-title-sort-item">
                                            TIME:
                                            <select className='select-type detailed-stats-select' onChange={(e) => {setChartData(prev => ({...prev, time: e.target.value}))}} value={chartData.time}>
                                                <option value="alltime">All time</option>
                                                <option value="1year">Past year</option>
                                                <option value="6months">Past 6 months</option>
                                                <option value="1month">Past month</option>
                                                <option value="7days">Past week</option>
                                                <option value="1day">Today</option>
                                            </select>
                                        </div>
                                        <div className="--detailed-stats-allgames-title-sort-item">
                                            VALUE:
                                            <select className='select-type detailed-stats-select' onChange={(e) => {setChartData(prev => ({...prev, pivotBy: e.target.value}))}} value={chartData.pivotBy}>
                                                <option value="wpm">WPM</option>
                                                <option value="cpm">CPM</option>
                                                <option value="accuracy">ACCURACY</option>
                                            </select>
                                        </div>
                                    </div>
                                </div> */