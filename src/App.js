import {Route, Routes} from "react-router";
import {observer} from "mobx-react-lite";
import {Link} from "react-router-dom";
import {AddTextForm} from "./components/AddTextForm";
import authData from "./store/authData";
import {LoginForm} from "./components/LoginForm";
import {NewUser} from "./components/NewUser";
import {HomePage} from "./components/HomePage";
import {ProfilePage} from "./components/ProfilePage";

import "./css/text.css"
import {SuggestText} from "./components/SuggestText";

const App = observer(() => {
    return (
        <div className="App">
            {!authData.loggedIn ?
                <div>
                    <Routes>
                        <Route path="/*" element={<LoginForm/>}/>
                        <Route path="/newuser" element={<NewUser/>}/>
                    </Routes>
                </div> :
                authData.role === 'USER' ?
                    <div>
                        <header>
                            <Link className="link" to="/">Home</Link>
                            <Link className="link" to="/profile">Profile</Link>
                            <Link className="link" to="/suggest">Suggest Text</Link>
                            <Link className="link" to="/" onClick={() => authData.logout()}>Logout</Link>
                        </header>
                        <Routes>
                            <Route path="/" element={<HomePage/>}/>
                            <Route path="/addtext" element={<AddTextForm/>}/>
                            <Route path="/profile" element={<ProfilePage/>}/>
                            <Route path="/suggest" element={<SuggestText/>}/>
                        </Routes>
                    </div> :
                    <div>
                        <header>
                            <Link className="link" to="/addtext">Add Text</Link>
                            <Link className="link" to="/" onClick={() => {
                                authData.logout()
                                console.log(authData)
                            }
                            }>Logout</Link>
                        </header>
                        <Routes>
                            <Route path="/addtext" element={<AddTextForm/>}/>
                        </Routes>
                    </div>
            }
        </div>
    );
})

export default App;
