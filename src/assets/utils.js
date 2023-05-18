import purplekeyboard from './images/purplekeyboard.png'
import goldkeyboard from "./images/goldkeyboard.png"
import silverkeyboard from "./images/silverkeyboard.png"
import bronzekeyboard from "./images/bronzekeyboard.png"
import whitekeyboard from "./images/whitekeyboard.png"

export const forceKeyboardLayout = (layout, key) => {
    //event.nativeKey.data
    let isUppercase = key === key.toUpperCase() ? true : false;
    let target = key.toLowerCase()
    switch(layout) {
        case 'DEFAULT':
        case 'QWERTY':
            return key;
        case 'QWERTZ':
            if (target === 'y') {
                return isUppercase ? 'Z' : 'z'
            } else
            if (target === 'z') {
                return isUppercase ? 'Y' : 'y'
            }
            break
        case 'AZERTY':
            if (target === 'q') {
                return isUppercase ? 'A' : 'a'
            } else
            if (target === 'w') {
                return isUppercase ? 'Z' : 'z'
            } else
            if (target === 'a') {
                return isUppercase ? 'Q' : 'q'
            } else
            if (target === 'z') {
                return isUppercase ? 'W' : 'w'
            } else
            if (target === ';') {
                return 'm'
            } else
            if (target === 'm') {
                return '?'
            } else
            break
        case 'DVORAK':
            if (target === `q`) {
                return `'`
            } else
            if (target === 'w') {
                return ','
            } else
            if (target === 'e') {
                return '.'
            } else
            if (target === 'r') {
                return isUppercase ? 'P' : 'p'
            } else
            if (target === 't') {
                return isUppercase ? 'Y' : 'y'
            } else
            if (target === 'y') {
                return isUppercase ? 'F' : 'f'
            } else
            if (target === 'u') {
                return isUppercase ? 'G' : 'g'
            } else
            if (target === 'i') {
                return isUppercase ? 'C' : 'c'
            } else
            if (target === 'o') {
                return isUppercase ? 'R' : 'r'
            } else
            if (target === 'p') {
                return isUppercase ? 'L' : 'l'
            } else
            if (target === 's') {
                return isUppercase ? 'O' : 'o'
            } else
            if (target === 'd') {
                return isUppercase ? 'E' : 'e'
            } else
            if (target === 'f') {
                return isUppercase ? 'U' : 'u'
            } else
            if (target === 'g') {
                return isUppercase ? 'I' : 'i'
            } else
            if (target === 'h') {
                return isUppercase ? 'D' : 'd'
            } else
            if (target === 'j') {
                return isUppercase ? 'H' : 'h'
            } else
            if (target === 'k') {
                return isUppercase ? 'T' : 't'
            } else
            if (target === 'l') {
                return isUppercase ? 'N' : 'n'
            } else
            if (target === ';') {
                return 's'
            } else
            if (target === 'z') {
                return isUppercase ? ':' : ';'
            } else
            if (target === 'x') {
                return isUppercase ? 'Q' : 'q'
            } else
            if (target === 'c') {
                return isUppercase ? 'J' : 'j'
            } else
            if (target === 'v') {
                return isUppercase ? 'K' : 'k'
            } else
            if (target === 'b') {
                return isUppercase ? 'X' : 'x'
            } else
            if (target === 'n') {
                return isUppercase ? 'B' : 'b'
            } else
            if (target === ',') {
                return 'w'
            } else
            if (target === '.') {
                return 'v'
            } else
            if (target === '/') {
                return 'z'
            } else
            break
        case 'COLEMAK':
            if (target === 'e') {
                return isUppercase ? "F" : 'f'
            } else
            if (target === 'r') {
                return isUppercase ? "P" : 'p'
            } else
            if (target === 't') {
                return isUppercase ? "G" : 'g'
            } else
            if (target === 'y') {
                return isUppercase ? "J" : 'j'
            } else
            if (target === 'u') {
                return isUppercase ? "L" : 'l'
            } else
            if (target === 'i') {
                return isUppercase ? "U" : 'u'
            } else
            if (target === 'o') {
                return isUppercase ? "Y" : 'y'
            } else
            if (target === 'p') {
                return isUppercase ? ":" : ";"
            } else
            if (target === 's') {
                return isUppercase ? "R" : 'r'
            } else
            if (target === 'd') {
                return isUppercase ? "S" : 's'
            } else
            if (target === 'f') {
                return isUppercase ? "T" : 't'
            } else
            if (target === 'g') {
                return isUppercase ? "D" : 'd'
            } else
            if (target === 'j') {
                return isUppercase ? "N" : 'n'
            } else
            if (target === 'k') {
                return isUppercase ? "E" : 'e'
            } else
            if (target === 'l') {
                return isUppercase ? "I" : 'i'
            } else
            if (target === ';') {
                return 'o'
            } else
            if (target === 'n') {
                return isUppercase ? "K" : 'k'
            } else
            break
    }
    return key
}

export const checkForNewBadges = (user) => {
    let newbadges = [], hasNew = false, picture = "", body = ""
    if (user.gamesPlayed.length >= 5 && !(user.badges.includes("whitekeyboard"))) {
        newbadges.push("whitekeyboard")
        picture = whitekeyboard
        body = "5 games played"
        hasNew = true
    }
    if (user.gamesPlayed.length >= 50  && !(user.badges.includes("bronzekeyboard"))) {
        newbadges.push("bronzekeyboard")
        picture = bronzekeyboard
        body = "50 games played"
        hasNew = true
    }
    if (user.gamesPlayed.length >= 250  && !(user.badges.includes("silverkeyboard"))) {
        newbadges.push("silverkeyboard")
        picture = silverkeyboard
        body = "250 games played"
        hasNew = true
    }
    if (user.gamesPlayed.length >= 500 && !(user.badges.includes("goldkeyboard"))) {
        newbadges.push("goldkeyboard")
        picture = goldkeyboard
        body = "500 games played"
        hasNew = true
    }
    if (user.gamesPlayed.length >= 1000 && !(user.badges.includes("purplekeyboard"))) {
        newbadges.push("purplekeyboard")
        picture = purplekeyboard
        body = "1000 games played"
        hasNew = true
    }
    return [hasNew, newbadges, picture, body]
}