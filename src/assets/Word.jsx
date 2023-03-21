import React from 'react'

function Word(props){
    let styles = {}
    let word = 0
    styles.fontSize = `${props.size}vw`
    styles.color = 'rgba(255, 255, 255, 0.4)'
    if (props.word.status === 'incorrect') {
        if (props.word.hasOwnProperty('accepted') && props.word.accepted == true) {
            styles.color = 'rgba(177, 201, 92, 0.629)'
        } else {
            styles.color = 'rgb(170, 120, 120, 0.6)'
            styles.textDecoration = 'line-through'
        }
    } else if (props.word.status === 'correct') {
        styles.color = 'rgba(0, 177, 227, 0.681)'
    } else if (props.word.status === 'filler') {
        styles.color = 'rgba(0,0,0,0)'
    }
    if (props.seq) {
        word = <span className='--main-subword' style={styles}>{props.word.body}</span>
    } else {
        word = <h1 className='--main-subword' style={styles}>{props.word.body}</h1>
    }
    return (
        <React.Fragment>
            {word}
        </React.Fragment>
    )
}

export default React.memo(Word)