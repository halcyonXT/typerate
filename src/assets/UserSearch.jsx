import React from 'react'
import { getAUser, searchUsers } from '../api/user'
import defaultpng from "./images/default.png"
import { UserContext } from './context/userContext';
import Badges from './Badges'

let timer = null;

export default function UserSearch(props) {
    const { user } = React.useContext(UserContext)
    const searchInput = React.useRef(null)
    const [input, setInput] = React.useState("")
    const [display, setDisplay] = React.useState({
        active: false,
        loaded: false,
        render: []
    })

    const handleInput = (e) => {
        setInput(e.target.value)
        !display.active && (() => {setDisplay({
                active: true,
                loaded: false,
                render: []
            })
            props.setShowGameplay(false)
        })()
    }

    React.useEffect(() => {
        if (input === "") {
            props.setShowGameplay(true)
            setDisplay({
                active: false,
                loaded: false,
                render: []
            })
            clearTimeout(timer)
        }
        else
        (async () => {
            if (timer === null) {
                timer = setTimeout(async () => {
                    let res = await searchUsers(input)
                    setDisplay((() => {
                        let obj = {
                            active: true,
                            loaded: true,
                            render: []
                        }
                        if (res.length > 1) {
                            obj.render = res.map(item => <UserDisp user={item}/>)
                        } else {
                            obj.render = ["No users found"]
                        }
                        return obj
                    })())
                }, 300)
            } else {
                clearTimeout(timer)
                setDisplay({
                    active: true,
                    loaded: false,
                    render: []
                })
                timer = setTimeout(async () => {
                    let res = await searchUsers(input)
                    setDisplay((() => {
                        let obj = {
                            active: true,
                            loaded: true,
                            render: []
                        }
                        if (res.length > 0) {
                            obj.render = res.map(item => item.username !== user.username && <UserDisp user={item} id={item._id} setTargetedDetails={props.setTargetedDetails} setActivePanel={props.setActivePanel}/>)
                        } else {
                            obj.render = ["No users found"]
                        }
                        return obj
                    })())
                }, 300)
            }
        })()

    }, [input])

    return (
        <fieldset className='--settings-search'>
            <legend>SEARCH USERS</legend>
            <input
                className="--credentials-input" 
                id='userSearch'
                value={input}
                onChange={handleInput}
                spellCheck="false"
                ref={searchInput}
            />
            {
                display.active && !props.showGameplay &&
                <div className='--settings-search-display'>
                    {
                        !display.loaded &&

                            <div class="loader">
                                <div class="inner one"></div>
                                <div class="inner two"></div>
                                <div class="inner three"></div>
                            </div>
                    }
                    {
                        display.render[0] === "No users found" 
                        ?
                        <div style={{width:'100%', height: '20vh', display:'grid', placeItems:'center'}}>
                            <p>
                                No users found :(
                            </p>
                        </div>
                        :
                        display.render
                    }
                </div>
            }
        </fieldset>
    )
}

const UserDisp = (props) => {
    const [selected, setSelected] = React.useState(false)

    const handleSelect = () => {
        setSelected(prev => !prev)
    }

    const handleShowDetailed = async () => {
        let doc = await getAUser(props.id)
        props.setTargetedDetails({active: true, user: doc})
        props.setActivePanel("detailedstats")
    }

    return (
        <div className='--settings-search-user' onClick={handleSelect} style={{minHeight: selected && '5.8rem'}}>
            <div style={{width: '100%', height: selected ? 'calc(100% - 2.1rem)' : '100%', display: 'flex', justifyContent: 'flex-start', alignItems: 'center'}}>
                <img 
                    src={props.user.profilePicture === "default" || !props.user.profilePicture ? defaultpng : props.user.profilePicture} 
                    className="--settings-profile-picture --settings-search-pfp"
                    style={{borderRadius: '0.3rem'}} 
                    onError={(e) => e.target.src = defaultpng}
                ></img>
                <div>
                    <p className='--settings-search-user-p'>{props.user.username}</p>
                    <Badges differentUser={true} user={props.user}/>
                </div>
            </div>
            {
                selected &&
                <button 
                    className='--settings-button showOver'
                    style={{width: '97%', height: '1.5rem', marginTop: '0.2rem', marginBottom: '0.4rem', fontSize: '0.6rem'}}
                    onClick={() => handleShowDetailed()}
                >REVEAL DETAILED INFO</button>
            }
        </div>
    )
}