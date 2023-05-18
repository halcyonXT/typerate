import React from "react"
import { getUser } from "../../api/user"

const UserContext = React.createContext()

function UserContextProvider(props) {
    const [user, setUser] = React.useState(
        {
            username: "Guest", 
            loggedin: false, 
            gamesPlayed: [], 
            profilePicture: "default", 
            badges: [],
            frequentlyMissed: [],
            missedCombinations: []}
    )
    const [protectedUser, setProtectedUser] = React.useState({
        email: ""
    })
    const updateUser = async() => {
        const res = await getUser()
        if (res.message === "User is still logged in") {
            try {
                setProtectedUser(prev => ({...prev, email: res.email}))
            } catch (ex) {}
            setUser({
                username: res.username, 
                loggedin: true, 
                gamesPlayed: res.gamesPlayed, 
                profilePicture: res.profilePicture || "default",
                badges: res.badges || [],
                frequentlyMissed: res.frequentlyMissed || [],
                missedCombinations: res.missedCombinations || []
        })
        } else {
            setUser({
            username: "Guest", 
            loggedin: false, 
            gamesPlayed: [], 
            profilePicture: "default",
            badges: [],
            frequentlyMissed: [],
            missedCombinations: []
            })
        }    
    } 

    const updateGames = (game) => {
        setUser(
            prev => ({...prev, gamesPlayed: [...prev.gamesPlayed, game]})
        )
    }

    React.useEffect(() => {
        updateUser()  
    }, [])
    return (
        <UserContext.Provider value={{user, updateUser, updateGames, protectedUser}}>
            {props.children}
        </UserContext.Provider>
    )
}

export {UserContextProvider, UserContext}