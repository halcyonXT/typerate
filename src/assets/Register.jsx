import React from "react"
import logoicon from './images/icon.png'
import { Link, Navigate } from 'react-router-dom'
import wrongpng from './images/wrong.png'
import { UserContext } from "./context/userContext"
//api
import { register } from '../api/user'


export default function Register(props) {
    const { user } = React.useContext(UserContext)
    const setOption = (option, value) => setCredentials(prev => ({...prev, [`${option}`]: value}))

    const [registered, setRegistered] = React.useState(false)
    const [error, setError] = React.useState({error: false, message: "", causedBy: []})

    const [credentials, setCredentials] = React.useState({
        username: '',
        email: '',
        password: '',
        passwordConfirmation: ''
    })

    //************************************* */
    //   REDIRECT TO TYPERATE IF USER LOGGED IN
    //************************************* */

    const handleRegister = async (e) => {
        e.preventDefault()
        try {
            if (!(document.getElementById('cookies-accept').checked)) {
                setError({error: true, message: "Registering requires enabling cookies", causedBy: ["cookies"]})
                return
            }
            if (credentials.password !== credentials.passwordConfirmation) {
                setError({error: true, message: "Passwords do not match", causedBy: ["password", "passwordConfirmation"]})
                return
            }
            const res = await register({
                username: credentials.username,
                email: credentials.email,
                password: credentials.password
            })
            if (res.error) {
                setError({error: true, message: res.error, causedBy: res.hasOwnProperty("causedBy") ? res.causedBy : []})
                return
            } else {
                setError({error: false, message: "", causedBy: []})
                setRegistered(true)
                return
                
            }
        } catch (err) {}
    } 

    return (
        <div style={{height: '100vh', width: '100%', display: 'grid', placeItems: 'center'}}>
            {
                user.loggedin
                &&
                <Navigate to="/typerate"/>
            }
            {
                registered
                &&
                <Navigate to="/typerate/login"/>
            }
            <div className="--credentials-form --register-form">
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: '0.6', marginBottom: '2vh'}}>
                    <img src={logoicon} style={{height: '1.4rem', marginRight: '0.5rem', pointerEvents: 'none', marginTop: '0.3rem'}} />
                    <Link to="/typerate" style={{textDecoration: 'none'}}>
                        <h1 className='--credentials-logo' style={{margin:'0'}}>typerate</h1>
                    </Link>
                </div>
                <form className="--register-redirect">
                    <div style={{marginBottom: '1.5vh'}}>
                        <div style={{display:'flex'}}>
                            <p className="--credentials-info">Username:</p>
                        </div>
                        <input 
                            className="--credentials-input" 
                            spellCheck="false"
                            value={credentials.username}
                            onChange={(e) => {setOption("username", e.target.value)}}
                            style={{outline: error.causedBy.includes("username") && '2px solid rgba(255,255,255,0.2)'}}
                        ></input>
                    </div>
                    <div style={{marginBottom: '1.5vh'}}>
                        <div style={{display:'flex'}}>
                            <p className="--credentials-info">Email:</p>
                        </div>
                        <input 
                            id="email" 
                            type="email" 
                            className="--credentials-input" 
                            spellCheck="false" 
                            placeholder="johndoe@example.com" 
                            value={credentials.email}
                            onChange={(e) => {setOption("email", e.target.value)}}
                            style={{outline: error.causedBy.includes("email") && '2px solid rgba(255,255,255,0.2)'}}
                        ></input>
                    </div>
                    <div style={{marginBottom: '1.5vh'}}>
                        <div style={{display:'flex'}}>
                            <p className="--credentials-info">Password:</p>
                        </div>
                        <input 
                            type="password" 
                            className="--credentials-input" 
                            spellCheck="false"
                            value={credentials.password}
                            onChange={(e) => {setOption("password", e.target.value)}}
                            style={{outline: error.causedBy.includes("password") && '2px solid rgba(255,255,255,0.2)'}}
                        ></input>
                    </div>
                    <div style={{marginBottom: '2vh'}}>
                        <div style={{display:'flex'}}>
                            <p className="--credentials-info">Confirm password:</p>
                        </div>
                        <input 
                            type="password" 
                            className="--credentials-input" 
                            spellCheck="false"
                            value={credentials.passwordConfirmation}
                            onChange={(e) => {setOption("passwordConfirmation", e.target.value)}}
                            style={{outline: error.causedBy.includes("passwordConfirmation") && '2px solid rgba(255,255,255,0.2)'}}
                        ></input>
                    </div>
                    <div style={{width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity:'0.8',marginTop:'3vh'}}>
                        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between', color: 'white', width: '50%', fontWeight:'200'}}>
                            Accept cookies:
                            <div class="checkbox-wrapper-14">
                                <input type="checkbox" class="switch" id='cookies-accept' style={{outline: error.causedBy.includes("cookies") && '2px solid rgba(255,255,255,0.2)'}}/>
                            </div>
                        </div>
                        <button 
                            className="--settings-button"
                            onClick={handleRegister}
                            style={{width: '40%', margin: '0'}}
                        >REGISTER</button>
                    </div>
                </form>
                <div className="--credentials-error" style={{display: error.error ? 'flex' : 'none'}}>
                    {error.message}
                </div>
            </div>
        </div>
    )
}