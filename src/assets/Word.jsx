import React from 'react'

function Word(props){
    let styles = {}
    styles.fontSize = `${props.size}vw`
    styles.color = 'rgb(0,0,0,0.3)'
    props.word.status === 'incorrect' ? styles.color = 'rgb(255, 0, 0, 0.6)' : props.word.status === 'correct' ? styles.color = 'rgb(0,0,0,0.5)' : true
    props.word.status === 'incorrect' ? styles.textDecoration = 'line-through' : styles.textDecoration = 'none'
    props.word.status === 'filler' ? styles.color = 'rgb(0,0,0,0)' :  true
    return (
        <React.Fragment>
            <h1 className='--main-subword' style={styles}>{props.word.body}</h1>
        </React.Fragment>
    )
}

export default React.memo(Word)