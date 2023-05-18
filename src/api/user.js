export const register = async({ username, email, password } = {}) => {
    const user = { username, email, password };

    try {
        const res = await fetch(`http://localhost:8080/register`,
            {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(user)
            }
        );
        return await res.json()
    } 
    catch (err) {
        console.log(err)
    }
}

export const login = async({ email, password } = {}) => {
    const user = { email, password };

    try {
        const res = await fetch(`http://localhost:8080/login`,
            {
                method: 'POST',
                credentials: "include",
                headers: {
                    Accept: 'application/json',
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(user)
            }
        );

        return await res.json()
    } 
    catch (err) {
        console.log(err)
    }
};

export const logout = async () => {
    try {
        const res = await fetch(`http://localhost:8080/logout`, {
            method: "GET",
            credentials: "include"
        })
        return await res.json()
    } catch (err) {
        console.log(err)
    }
}

export const getUser = async () => {
    try {
        const res = await fetch(`http://localhost:8080/user`, {
            method: "GET",
            credentials: "include",
            headers: {
                Accept: 'application/json',
            }
        })
        return await res.json()
    } catch (err) {
        console.log(err)
    }
}

export const updateStats = async (wpm, cpm, accuracy, timestamp, missed = [], combinations = []) => {
    const pusher = {wpm, cpm, accuracy, timestamp, missed, combinations}
    try {
        const res = await fetch(`http://localhost:8080/user`, {
            method: "PATCH",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(pusher)
        })
        return await res.json()
    } catch (err) {
        console.log(err)
    }
}

export const updateProfilePicture = async (value = null) => {
    if (!value) {return}
    const pusher = {profilePicture: value} 
    try {
        const res = await fetch(`http://localhost:8080/user/profilepicture`, {
            method: "PATCH",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(pusher)
        })
        return await res.json()
    } catch (err) {
        console.log(err)
    }
}

export const resetProfilePicture = async () => {
    try {
        const res = await fetch(`http://localhost:8080/user/profilepicture/reset`, {
            method: "GET",
            credentials: "include",
            headers: {
                Accept: 'application/json',
            }
        })
        return await res.json()
    } catch (err) {
        console.log(err)
    }
}

export const resetStats = async () => { 
    try {
        const res = await fetch(`http://localhost:8080/user/stats`, {
            method: "DELETE",
            credentials: "include",
        })
        return await res.json()
    } catch (err) {
        console.log(err)
    }
}

export const updateBadges = async (badges) => {
    if (!badges) {return}
    const pusher = {badges: [...badges]} 
    try {
        const res = await fetch(`http://localhost:8080/user/badges`, {
            method: "PATCH",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(pusher)
        })
        return await res.json()
    } catch (err) {
        console.log(err)
    }
}

export const deleteAccount = async () => { 
    try {
        const res = await fetch(`http://localhost:8080/user`, {
            method: "DELETE",
            credentials: "include",
        })
        return await res.json()
    } catch (err) {
        console.log(err)
    }
}

export const confirmPassword = async({ email, password } = {}) => {
    const user = { email, password };

    try {
        const res = await fetch(`http://localhost:8080/confirm`,
            {
                method: 'POST',
                credentials: "include",
                headers: {
                    Accept: 'application/json',
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(user)
            }
        );

        return await res.json()
    } 
    catch (err) {
        console.log(err)
    }
};

export const editUsername = async (username) => {
    const user = {username}

    try {
        const res = await fetch(`http://localhost:8080/edit/username`,
            {
                method: 'POST',
                credentials: "include",
                headers: {
                    Accept: 'application/json',
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(user)
            }
        );

        return await res.json()
    } 
    catch (err) {
        console.log(err)
    }

}

export const editEmail = async (email) => {
    const user = {email}

    try {
        const res = await fetch(`http://localhost:8080/edit/email`,
            {
                method: 'POST',
                credentials: "include",
                headers: {
                    Accept: 'application/json',
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(user)
            }
        );

        return await res.json()
    } 
    catch (err) {
        console.log(err)
    }

}

export const searchUsers = async (q) => {
    function convertStringToRegExp(str) {
        // Escape special characters in the input string
        const escapedStr = str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      
        // Add the delimiter and the "i" flag to the escaped string
        const regExpStr = `${escapedStr}`;
      
        return regExpStr;
      }

    try {
        let query = {query: convertStringToRegExp(q)}
        const res = await fetch(`http://localhost:8080/user/search`,
            {
                method: 'POST',
                credentials: "include",
                headers: {
                    Accept: 'application/json',
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(query)
            }
        );
        return await res.json()
    } catch (err) {
        console.log(err)
    }
}

export const getAUser = async (id) => {
    try {
        const res = await fetch(`http://localhost:8080/user/get/${id}`, {
            method: "GET",
            credentials: "include",
            headers: {
                Accept: 'application/json',
            }
        })
        return await res.json()
    } catch (err) {
        console.log(err)
    }
}