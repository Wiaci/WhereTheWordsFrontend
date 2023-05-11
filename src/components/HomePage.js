import {observer} from "mobx-react";
import {$api} from "../http";
import authData from "../store/authData";
import {Text} from "./Text";
import savedTexts from "../store/savedTexts";
import {toJS} from "mobx";


export const HomePage = observer(() => {

    const getTexts = () => {
        $api.post("/getTexts?id=" + authData.id, {id: authData.id})
            .then(resp => {
                savedTexts.setTexts(resp.data)
                console.log(savedTexts)
            })
            .catch(e => console.log(e))
    }

    return (
        <div>
            <button onClick={() => getTexts()}>Get Texts!</button> <br/>
            <ul>
                {savedTexts.texts.map((text, i) => {
                    return (
                        <li key={i}>
                            <span className="wordlist" onClick={() => {
                                console.log("text", toJS(text))
                                savedTexts.setSelectedText(toJS(text))
                                console.log("selectedText", savedTexts.selectedText)
                            }}>{text.firstSentence}</span>
                            {text.topics.map((topic, j) => {
                                return (<span key={j} className="topic">{topic}</span>)
                            })}
                        </li>
                    )
                })}
            </ul>
            <div>
                {savedTexts.selectedText.words.length === 0 ? <></> : <Text/>}
            </div>
        </div>
    )
})