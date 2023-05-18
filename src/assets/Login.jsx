import React from "react"
import { Link, Navigate } from 'react-router-dom'
import logoicon from './images/icon.png'
import { login } from '../api/user'
import { UserContext } from "./context/userContext"

export default function Login() {
    const { user, updateUser } = React.useContext(UserContext)
    const setOption = (option, value) => setCredentials(prev => ({...prev, [`${option}`]: value}))
    const [credentials, setCredentials] = React.useState({
        email: '',
        password: '',
    })
    const [error, setError] = React.useState({error:false, message: "", causedBy: []})

    const handleLogin = async (e) => {
        e.preventDefault()
        if (!credentials.email) {
            setError({error:true, message: "Enter a valid email", causedBy: ["email"]})
            return
        }
        if (!credentials.password) {
            setError({error:true, message: "Enter a valid password", causedBy: ["password"]})
            return
        }
        try {
            const res = await login({
                email: credentials.email,
                password: credentials.password
            })
            if (res.error) {
                setError({error:true, message: res.error, causedBy: res.error.hasOwnProperty("causedBy") ? res.error.causedBy : []})
                return
            } else {
                setError({error: false, message: "", causedBy: []})
                updateUser()
                return
            }
        } catch(err) {}
    }

    return (
        <div style={{height: '100vh', width: '100%', display: 'grid', placeItems: 'center'}}>
            {
                user.loggedin
                &&
                <Navigate to="/typerate"/>
            }
            <div className="--credentials-form --register-form">
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: '0.6', marginBottom: '2vh'}}>
                    <img src={logoicon} style={{height: '1.4rem', marginRight: '0.5rem', pointerEvents: 'none', marginTop: '0.3rem'}} />
                    <Link to="/typerate" style={{textDecoration: 'none'}}>
                        <h1 className='--credentials-logo' style={{margin:'0'}}>typerate</h1>
                    </Link>
                </div>
                <form className="--login-redirect">
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
                    <div style={{width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center',marginTop:'4vh'}}>
                        <button 
                            className="--settings-button"
                            onClick={handleLogin}
                            style={{width: '40%', margin: '0'}}
                        >LOGIN</button>
                    </div>
                </form>
                <div className="--credentials-error" style={{display: error.error ? 'flex' : 'none'}}>
                        {error.message}
                </div>
            </div>
        </div>
    )
}