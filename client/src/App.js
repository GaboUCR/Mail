import {SignUp, MsgCompose, LogIn} from "./forms"
import {useEffect, useState, useContext} from "react"
import {EmailContext, EmailProvider} from "./email.context"
import Frontpage from "./frontpage"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";

function App() {
  const {email, handleEmailChange} = useContext(EmailContext)

  useEffect( () => {
    fetch('http://localhost:5000/api/user/check', {method:"GET"}).then(response => response.json())
    .then((data) => {
      if (data.logged){
        handleEmailChange(data.email)
      }
      else{
        handleEmailChange("")
      }
    })
  },[email]);

  if (email === ""){
    return (
      <Router>
        <Switch>

          <Route exact path= "/signUp">
            <SignUp/>
          </Route>

          <Route exact path= "/logIn">
            <LogIn />
          </Route>

          <Redirect from="/" to="/logIn" />

        </Switch>
      </Router>
    )
  }
  else{
    return (
            <Frontpage />
       )
    }
}

export default App;
