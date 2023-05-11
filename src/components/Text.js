import {useState} from "react";
import authData from "../store/authData";
import savedTexts from "../store/savedTexts";
import {observer} from "mobx-react";
import {$api} from "../http";

export const Text = observer(() => {

    const [selectedWord, setSelectedWord] = useState('')

    const getClass = (word) => {
        let c = "word"
        if (word.wordInfo.partOfSpeech !== 'ignore') c += " subst"
        if (authData.containsWord(word)) {
            c += " userword"
        }
        return c
    }

    const addWord = (word) => {
        $api.post("/addWord?id=" + authData.id, word.wordInfo)
            .then(resp => {
                authData.words.push(resp.data)
            })
            .catch(e => console.log(e))
    }

    return (
        <div className="textcontainer">
            {savedTexts.selectedText.text !== {} ? savedTexts.selectedText.words.map((word, i) => {
                return (
                    <span key={i} className={getClass(word)}
                          onMouseEnter={() => setSelectedWord(word)}
                          onMouseLeave={() => setSelectedWord('')}
                          onClick={() => addWord(word)}
                    >{word.original}</span>
                )
            }) : <></>} <br/>
            {selectedWord === '' || selectedWord.wordInfo.partOfSpeech === 'ignore' ? <div className="wordinfo"/> :
                <div className="wordinfo">
                    <span>Base form: {selectedWord.wordInfo.baseForm}</span><br/>
                    <span>Part of speech: {selectedWord.wordInfo.partOfSpeech}</span><br/>
                    <span>Level: {selectedWord.wordInfo.level}</span>
                </div>
            }
        </div>
    )
})