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



      //This has to be changed !!!!
      // else{
      //   handleEmailChange("")
      // }
    })
  },[email]);

  if (email === ""){
    return (
      <Router>
          <Switch>

            <Redirect exact from="/" to="/logIn" />

              <Route path= "/signUp">
                <SignUp/>
              </Route>

              <Route path= "/logIn">
                <LogIn />
              </Route>

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
