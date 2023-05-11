import {observer} from "mobx-react-lite";
import {useState} from "react";
import {$api} from "../http";
import {Link} from "react-router-dom";
import authData from "../store/authData";

export const LoginForm = observer(() => {

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const login = () => {
        console.log(username, password)
        console.log("authData", authData)
        $api.post("/login", {
            username: username,
            password: password
        }).then(resp => {
            authData.setUserData(resp.data.id, resp.data.username, resp.data.role,
                resp.data.words, resp.data.topics, resp.data.authToken)
        })
            .catch(e => console.log(e))
    }

    return (
        <div>
            <input type="text" placeholder="username" onChange={e => setUsername(e.target.value)}/><br/>
            <input type="password"
                   placeholder="password"
                   onChange={e => setPassword(e.target.value)}/><br/>
            <button onClick={() => login()}>Login</button> <br/>
            <Link to="/newuser">Новый пользователь</Link>
        </div>
    )
})