import React from 'react'
import { UserContext } from './context/userContext'
import defaultpng from "./images/default.png"
import changePfp from './images/changepicture.png'
import { confirmPassword, editUsername, editEmail, updateProfilePicture, resetProfilePicture } from '../api/user'
import $ from 'jquery'

const PREMADE_PROFILE_PICTURES = [
    "https://i.ibb.co/30mGf2M/skull.png",
    "https://i.ibb.co/DL1ZpC8/abstract.png",
    "https://i.ibb.co/99TX8pg/abstract2.png",
    "https://i.ibb.co/mSKfzgh/kb1.png",
    "https://i.ibb.co/w6KDs3C/killua.png",
    "https://i.ibb.co/QHYqsHy/lion.png",
    "https://i.ibb.co/6WPMjKR/animegirl.png",
    "https://i.ibb.co/nQW59HR/eye.png",
    "https://i.ibb.co/2yRzW2Y/forest.png",
    "https://i.ibb.co/5xpgxB5/monke.png",
    "https://i.ibb.co/1ZP7Tjz/space1.png",
    "https://i.ibb.co/LzKG1Zc/space2.png",
]

let premade_profile_elements;

export default function AccountSettings(props) {
    const { user, updateUser, protectedUser } = React.useContext(UserContext) 
    const [activePanel, setActivePanel] = React.useState("general")
    const [panelData, setPanelData] = React.useState({
        password: "",
        editUsername: {
            username: ""
        },
        editEmail: {
            email: ""
        },
        editProfilePicture: {
            url: "",
            uploaded: false,
        }
    })
    const [error, setError] = React.useState({error:false, message: ""})
    const [success, setSuccess] = React.useState({success:false, message: ""})

    React.useEffect(() => {
        premade_profile_elements = (() => {
            let arr = []
            for (let i in PREMADE_PROFILE_PICTURES) {
                arr.push(<img src={PREMADE_PROFILE_PICTURES[i]} className='--account-settings-premades-premade' onClick={() => setPanelData(prev => ({...prev, editProfilePicture: {...prev.editProfilePicture, url: PREMADE_PROFILE_PICTURES[i]}}))}/>)
            }
            return arr
        })()
    }, [])

    const getEditSVG = (action) => {
        return (
            <svg className="--account-settings-edit" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#ffffff" stroke="#ffffff" onClick={action}>
                <g id="SVGRepo_bgCarrier" stroke-width="0"/>
                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>
                <g id="SVGRepo_iconCarrier"> <title/> <g> <g id="edit"> <g> <path d="M20,16v4a2,2,0,0,1-2,2H4a2,2,0,0,1-2-2V6A2,2,0,0,1,4,4H8" fill="none" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/> <polygon fill="none" points="12.5 15.8 22 6.2 17.8 2 8.3 11.5 8 16 12.5 15.8" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/> </g> </g> </g> </g>
            </svg>
        )
    }

    const changeUsername = async () => {
        if (panelData.editUsername.username.length < 4) {
            return setPassingError("Enter a valid username")
        }
        let password = await confirmPassword({email: protectedUser.email, password: panelData.password})
        if (!password.confirmed) {
            return setPassingError("Incorrect password")
        }
        let change = await editUsername(panelData.editUsername.username)
        if (change.error) {
            return setPassingError(change.error)
        } else {
            updateUser()
            setActivePanel("general")
            setPanelData(prev => ({...prev, password: "", editUsername: {...prev.editUsername, username: ""}}))
        }
        
    }

    const changeEmail = async () => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(panelData.editEmail.email)) {
            return setPassingError("Enter a valid email")
        }
        
        let password = await confirmPassword({email: protectedUser.email, password: panelData.password})
        if (!password.confirmed) {
            return setPassingError("Incorrect password")
        }
        let change = await editEmail(panelData.editEmail.email)
        if (change.error) {
            return setPassingError(change.error)
        } else {
            updateUser()
            setActivePanel("general")
            setPanelData(prev => ({...prev, password: "", editEmail: {...prev.editEmail, email: ""}}))
        }
        
    }

    const setPassingError = (message) => {
        setError({error: true, message: message})
        setTimeout(() => {
            setError({error: false, message: ""})
        }, 4000)
    }

    const setPassingSuccess = (message) => {
        setSuccess({success: true, message: message})
        setTimeout(() => {
            setSuccess({success: false, message: ""})
        }, 4000)
    }

    const changeProfilePicture = async () => {
        const regex = /((http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?)/ig;
        if (!regex.test(panelData.editProfilePicture.url)) {
            return setPassingError("Enter a valid URL")
        }
        let change = await updateProfilePicture(panelData.editProfilePicture.url)
        if (change.error) {
            return setPassingError(change.error)
        } else {
            updateUser()
            setActivePanel("general")
            setPanelData(prev => ({...prev, editProfilePicture: {...prev.editProfilePicture, url: ""}}))
        }
    }

    const deleteProfilePicture = async () => {
        let change = await resetProfilePicture()
        if (change.error) {
            return setPassingError(change.error)
        } else {
            updateUser()
            setActivePanel("general")
            setPanelData(prev => ({...prev, editProfilePicture: {...prev.editProfilePicture, url: ""}}))
        }
    }

    const fileChange = () => {
        setPanelData(prev => ({...prev, editProfilePicture:{...prev.editProfilePicture, uploaded: true}}))
    }

    const filePush = async () => {
        var file = document.getElementById('input_img');
        var form = new FormData();
        console.log(file.files[0])
        form.append("image", file.files[0])
        console.log(form)

        var settings = {
        "url": "https://api.imgbb.com/1/upload?key=451ef5313cedcfde72025d676cc5a309",
        "method": "POST",
        "timeout": 0,
        "processData": false,
        "mimeType": "multipart/form-data",
        "contentType": false,
        "data": form
        };


        $.ajax(settings).done(function (response) {
            var jx = JSON.parse(response);
            setPanelData(prev => ({...prev, editProfilePicture: {...prev.editProfilePicture, url: jx.data.url}}))
            setPassingSuccess("Upload successful. Save to apply")

        });
    }

    React.useEffect(() => {
        if (activePanel === "general") {
            setPanelData(prev => ({...prev, editProfilePicture: {...prev.editProfilePicture, uploaded: false}}))
        }
    }, [activePanel])

    return (
        <React.Fragment>
            <div className='--settings-danger-prompt' style={{display: props.profileSettings.activated ? 'grid' : 'none'}}>
                {
                    activePanel === "general" && 
                    // GENERAL ROUTE GENERAL ROUTE GENERAL ROUTE GENERAL ROUTE GENERAL ROUTE GENERAL ROUTE GENERAL ROUTE GENERAL ROUTE GENERAL ROUTE GENERAL ROUTE //
                    (
                        <fieldset className='--settings-fieldset' style={{padding: '0.7rem', width:'30vw'}}>
                            <legend>ACCOUNT</legend>
                            <div style={{display:'flex', alignItems: 'center'}}>
                                <div style={{marginLeft:'0.4rem'}} onClick={() => setActivePanel("editProfilePicture")}>
                                    <img src={changePfp} style={{position: 'absolute', width: '10vh', height: '10vh', borderRadius: '0.3rem'}} className='--settings-profile-picture --pfp-addon'/>
                                    <img 
                                        src={
                                            user.profilePicture === "default"
                                            ?
                                            defaultpng
                                            :
                                            user.profilePicture
                                        } 
                                        className="--settings-profile-picture"
                                        style={{width: '10vh', height: '10vh', borderRadius: '0.3rem', cursor: 'pointer'}} 
                                    ></img>
                                </div>
                                <div style={{marginLeft: '1rem', height: '10vh', width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly'}}>
                                    <p className="--account-settings-p">
                                        <span style={{fontWeight: '200'}}>Email:</span> {protectedUser.email}&nbsp;{getEditSVG(() => {setActivePanel("editEmail")})}
                                    </p>
                                    <p className="--account-settings-p">
                                        <span style={{fontWeight: '200'}}>Username:</span> {user.username}&nbsp;{getEditSVG(() => {setActivePanel("editUsername")})}
                                    </p>
                                </div>
                            </div>
                            <div className='--settings-panel-option-div'>
                                <label for="displayselecttitle" className="--settings-panel-option-info settingshideinfo">Enable options being saved to your account instead of locally</label>
                                <label for="modeselect" className='--settings-panel-option' 
                                onMouseEnter={props.revealOptionInfo} onMouseLeave={props.revealOptionInfo} opacity="0">Enable saving options to account:</label>
                                <div class="checkbox-wrapper-14">
                                    <input type="checkbox" class="switch" checked={false} onClick={() => {}}/>
                                </div>
                            </div>
                            <div style={{display: 'flex'}}>
                                <button className='--settings-button' style={{width: '100%'}} onClick={() => props.setProfileSettings(prev => ({...prev, activated: false}))}>BACK</button>
                            </div>
                        </fieldset>
                    )
                }
                {
                    activePanel === "editUsername"
                    &&
                    // EDIT USERNAME ROUTE EDIT USERNAME ROUTE EDIT USERNAME ROUTE EDIT USERNAME ROUTE EDIT USERNAME ROUTE EDIT USERNAME ROUTE EDIT USERNAME ROUTE //
                    (
                        <fieldset className='--settings-fieldset' style={{padding: '0.7rem'}}>
                            <legend>CHANGE USERNAME</legend>
                            <div>
                                <p className="--credentials-info" style={{textAlign:'left'}}>New username:</p>
                                <input 
                                    className="--credentials-input" 
                                    spellCheck="false"
                                    value={panelData.editUsername.username}
                                    onChange={(e) => setPanelData(prev => ({...prev, editUsername: {...prev.editUsername, username: e.target.value}}))}
                                ></input>
                            </div>
                            <div>
                                <p className="--credentials-info" style={{textAlign:'left'}}>Confirm your password:</p>
                                <input 
                                    className="--credentials-input" 
                                    spellCheck="false"
                                    type='password'
                                    value={panelData.password}
                                    onChange={(e) => setPanelData(prev => ({...prev, password: e.target.value}))}
                                ></input>
                            </div>
                            <div style={{display: 'flex'}}>
                                <button className='--settings-button' style={{width: '48%'}} onClick={() => changeUsername()}>SAVE</button>
                                <button className='--settings-button' style={{width: '48%'}} onClick={() => setActivePanel("general")}>BACK</button>
                            </div>
                            <div className="--settings-error" style={{display: error.error ? 'flex' : 'none'}}>
                                {error.message}
                            </div>
                        </fieldset>
                    )
                }
                {
                    activePanel === "editEmail"
                    &&
                    // EDIT USERNAME ROUTE EDIT USERNAME ROUTE EDIT USERNAME ROUTE EDIT USERNAME ROUTE EDIT USERNAME ROUTE EDIT USERNAME ROUTE EDIT USERNAME ROUTE //
                    (
                        <fieldset className='--settings-fieldset' style={{padding: '0.7rem'}}>
                            <legend>CHANGE EMAIL</legend>
                            <div>
                                <p className="--credentials-info" style={{textAlign:'left'}}>New email:</p>
                                <input 
                                    className="--credentials-input" 
                                    spellCheck="false"
                                    value={panelData.editEmail.email}
                                    onChange={(e) => setPanelData(prev => ({...prev, editEmail: {...prev.editEmail, email: e.target.value}}))}
                                ></input>
                            </div>
                            <div>
                                <p className="--credentials-info" style={{textAlign:'left'}}>Confirm your password:</p>
                                <input 
                                    className="--credentials-input" 
                                    spellCheck="false"
                                    type='password'
                                    value={panelData.password}
                                    onChange={(e) => setPanelData(prev => ({...prev, password: e.target.value}))}
                                ></input>
                            </div>
                            <div style={{display: 'flex'}}>
                                <button className='--settings-button' style={{width: '48%'}} onClick={() => changeEmail()}>SAVE</button>
                                <button className='--settings-button' style={{width: '48%'}} onClick={() => setActivePanel("general")}>BACK</button>
                            </div>
                            <div className="--settings-error" style={{display: error.error ? 'flex' : 'none'}}>
                                {error.message}
                            </div>
                        </fieldset>
                    )
                }
                {
                    activePanel === "editProfilePicture"
                    &&
                    (
                        <fieldset className='--settings-fieldset' style={{padding: '0.7rem'}}>
                            <legend>CHANGE PROFILE PICTURE</legend>
                            <div>
                                <p className="--credentials-info" style={{textAlign:'left'}}>URL of picture:</p>
                                <input 
                                    className="--credentials-input" 
                                    spellCheck="false"
                                    value={panelData.editProfilePicture.url}
                                    onChange={(e) => setPanelData(prev => ({...prev, editProfilePicture: {...prev.editProfilePicture, url: e.target.value}}))}
                                ></input>
                            </div>
                            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                <input hidden type="file" id="input_img" onChange={fileChange} accept="image/*"></input>
                                <label for="input_img" className='--settings-button' style={{width: '90%', height:'100%'}}>UPLOAD FILE</label>
                                <button 
                                    className='--settings-button' 
                                    onClick={filePush}
                                    style={{width: '7%', display:'grid', placeItems:'center', 
                                    opacity: panelData.editProfilePicture.uploaded ? "1" : "0.5", pointerEvents: panelData.editProfilePicture.uploaded ? 'all' : 'none'}}
                                    >
                                    <svg className="--account-settings-edit" style={{width:'0.8rem', height:'0.8rem'}} viewBox="0 -0.5 21 21" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000">
                                        <g id="SVGRepo_bgCarrier" stroke-width="0"/>
                                        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>
                                        <g id="SVGRepo_iconCarrier"> <title>save_item [#ffffff]</title> <desc>Created with Sketch.</desc> <defs> </defs> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Dribbble-Light-Preview" transform="translate(-99.000000, -680.000000)" fill="#ffffff"> <g id="icons" transform="translate(56.000000, 160.000000)"> <path d="M50.21875,525 L52.31875,525 L52.31875,523 L50.21875,523 L50.21875,525 Z M61.9,538 L59.8,538 L59.8,532 L58.88125,532 L57.7,532 L49.3,532 L47.5276,532 L47.2,532 L47.2,538 L45.1,538 L45.1,526.837 L47.2,524.837 L47.2,528 L48.11875,528 L49.3,528 L57.7,528 L59.47135,528 L59.8,528 L59.8,522 L61.9,522 L61.9,538 Z M49.3,538 L57.7,538 L57.7,534 L49.3,534 L49.3,538 Z M49.3,522.837 L50.17885,522 L57.7,522 L57.7,526 L49.3,526 L49.3,522.837 Z M63.9664,520 L61.8664,520 L49.3,520 L49.3,520.008 L47.2084,522 L47.2,522 L47.2,522.008 L43.0084,526 L43,526 L43,538 L43,540 L45.1,540 L61.8664,540 L63.9664,540 L64,540 L64,538 L64,522 L64,520 L63.9664,520 Z" id="save_item-[#ffffff]"> </path> </g> </g> </g> </g>
                                    </svg>
                                </button>
                            </div>
                            <details className='--account-settings-details'>
                                <summary>Premade profile pictures</summary>
                                <div className='--premades'>
                                    <div className='--account-settings-premades'>
                                        {premade_profile_elements}
                                    </div>
                                </div>
                            </details>
                            <div style={{display: 'flex'}}>
                                <button className='--settings-button' style={{width: '32%'}} onClick={() => changeProfilePicture()}>SAVE</button>
                                <button className='--settings-button' style={{width: '32%'}} onClick={() => deleteProfilePicture()}>RESET</button>
                                <button className='--settings-button' style={{width: '32%'}} onClick={() => setActivePanel("general")}>BACK</button>
                            </div>
                            <div className="--settings-error" style={{display: error.error ? 'flex' : 'none'}}>
                                {error.message}
                            </div>
                            <div className="--settings-error" style={{display: success.success ? 'flex' : 'none', backgroundColor: "#03ac13"}}>
                                {success.message}
                            </div>
                        </fieldset>
                    )
                }
            </div>
        </React.Fragment>
    )
}

/**
 * <details className='--account-settings-details'>
                                <summary>Why URLs are used</summary>
                                <p>Typerate, in its' current state, cannot store a lot of data in its' database due to a lack of funding. URLs are used to cut down on the space occupied, by storing text instead of images</p>
                            </details>
 */