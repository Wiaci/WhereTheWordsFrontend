import {observer} from "mobx-react";
import Select from "react-select";
import authData from "../store/authData";
import {useEffect, useState} from "react";
import {$api} from "../http";
import {toJS} from "mobx";

export const ProfilePage = observer(() => {

    const [options, setOptions] = useState([])
    const [pos, setPos] = useState('NOUN')
    const [word, setWord] = useState('')

    useEffect(() => {
        $api.get("/topics")
            .then(resp => {
                setOptions(optionsByTopics(resp.data))
            }).catch(e => console.log(e))
    }, [])

    const optionsByTopics = (topics) => {
        let options = []
        topics.forEach(l => options.push({
            label: l, value: l}))
        return options;
    }

    const updateTopics = () => {
        console.log("updateTopics", authData)
        $api.post("/updateTopics?id=" + authData.id, toJS(authData.topics))
            .catch(e => console.log(e))
    }

    const setWordStatus = (word, status) => {
        if (status === 'DELETE') authData.deleteWord(word)
        else authData.setWordStatus(word, status)
        word.wordStatus = status
        console.log(word, authData)
        $api.post("/changeWordStatus?id=" + authData.id, word)
            .then(() => console.log("setWordStatus success"))
            .catch(e => console.log(e))
    }

    const addWord = () => {
        let newWord = {
            baseForm: word,
            level: 'C2',
            partOfSpeech: pos,
            wordStatus: "LEARNING"
        }
        $api.post("/addWord?id=" + authData.id, newWord)
            .then(resp => {
                authData.words.push(resp.data)
            })
            .catch(e => console.log(e))
    }

    return (
        <div>
            <Select isMulti options={options} defaultValue={optionsByTopics(authData.topics)}
                    onChange={values => authData.setTopics(values.map(v => v.value))}/>
            <span>{authData.topics.length === 0 ? "Выберите хотя бы один элемент из списка" : ""}</span><br/>
            <button disabled={authData.topics.length === 0} onClick={() => {
                updateTopics()
            }}>Обновить</button> <br/>

            <input type="text" onChange={e => setWord(e.target.value)}
                   onKeyDown={e => {if (e.key === "Enter") addWord()}}/>

            <input type="radio" id="noun" name="pos" onChange={e => setPos(e.target.value)}
                   checked={pos === 'NOUN'} value="NOUN"/>
            <label htmlFor="noun">noun</label>
            <input type="radio" id="verb" name="pos" onChange={e => setPos(e.target.value)}
                   checked={pos === 'VERB'} value="VERB"/>
            <label htmlFor="verb">verb</label>
            <input type="radio" id="adj" name="pos" onChange={e => setPos(e.target.value)}
                   checked={pos === 'ADJECTIVE'} value="ADJECTIVE"/>
            <label htmlFor="adj">adj</label>
            <input type="radio" id="adv" name="pos" onChange={e => setPos(e.target.value)}
                   checked={pos === 'ADVERB'} value="ADVERB"/>
            <label htmlFor="adv">adv</label> <br/>

            <table border="1px">
                <tr>
                    <th>Word</th>
                    <th>Part of speech</th>
                    <th>Status</th>
                    <th>Learn</th>
                    <th>Learned</th>
                    <th>Hide</th>
                    <th>Delete</th>
                </tr>
                <tbody>
                {authData.words.map((word, i) => {
                    return <tr key={i}>
                        <td>{word.baseForm}</td>
                        <td>{word.partOfSpeech}</td>
                        <td>{word.wordStatus}</td>
                        <td><button disabled={word.wordStatus === 'LEARNING'} onClick={() => setWordStatus(word, "LEARNING")}>Learn</button></td>
                        <td><button disabled={word.wordStatus === 'LEARNED'} onClick={() => setWordStatus(word, "LEARNED")}>Learned</button></td>
                        <td><button disabled={word.wordStatus === 'HIDDEN'} onClick={() => setWordStatus(word, "HIDDEN")}>Hide</button></td>
                        <td><button onClick={() => setWordStatus(word, 'DELETE')}>X</button></td>
                    </tr>
                })}
                </tbody>
            </table>
        </div>
    )
})