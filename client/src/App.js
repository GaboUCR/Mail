import {SignUp, MsgCompose, LogIn} from "./forms"
import {useEffect, useState} from "react"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

function App() {
  const [email, setEmail] = useState("")

  useEffect( () => {
    fetch('http://localhost:5000/api/user/check', {method:"GET"}).then(response => response.json())
    .then((data) => {
      if (data.logged){
        setEmail(data.email)
      }
    })
  },[email]);

  let handleLogout = () =>{
    fetch("http://localhost:5000/api/user/inbox", {method:"GET"})
    setEmail("")
  }

  if (email === ""){
    return (
      <LogIn setEmail={setEmail}/>
    )
  }
  else{
    return (
      <nav className = "flex bg-top-nav">
          <a href = "/" className ="p-4 hover:bg-nav-link text-nav-link-text">Mail</a>

          <nav className="flex absolute right-0">

            <a className="p-4 inline hover:bg-nav-link text-nav-link-text">{email}</a>
            <button onClick={handleLogout} className="p-4 inline hover:bg-nav-link text-nav-link-text">log out</button>
          </nav>
        </nav>
      )
    }
}

export default App;
