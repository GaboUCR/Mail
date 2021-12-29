import Navbar from "./navbar"
import {useState, useEffect} from "react"
import {refresh} from "./images"
import {MsgCompose} from "../forms"
import {MessageTumbnail, Messages, Message} from "./messages"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";

function MsgButtons(){

  function refreshPage (){
    window.location.reload(false)
  }

  return(
    <div>

      <div className="flex p-3 space-x-5">
        <input className="self-center h-4 w-4" type="checkbox"/>
        <button onClick={refreshPage}> <img src={refresh} /> </button>
      </div>

      <div className="flex p-3 space-x-5">
        <Link to="/compose">Compose</Link>
        <Link to="/inbox">Inbox</Link>
        <Link to="/sent">Sent</Link>
      </div>

    </div>

  )
}

function Frontpage(){
  const [pressed, setPressed] = useState(false)
  const [inbox, setInbox] = useState([])
  const [sent, setSent] = useState([])

  useEffect(()=>{
    const requestOptions = {method: 'GET'};

    fetch('http://localhost:5000/api/user/inbox', requestOptions).then(response => response.json())
    .then((r) => {
      console.log(r)
      setInbox(r.messages)
    },
    (error) =>{console.log(error)}
    )

    fetch('http://localhost:5000/api/user/sent', requestOptions).then(response => response.json())
    .then((r) => {
      console.log(r)
      setSent(r.messages)
    })
  },[]);


  return(
    <Router>
      <div>
        <Navbar />
        <MsgButtons />
      </div>

      <Switch>
        <Route path= "/compose">
          <MsgCompose/>
        </Route>

        <Route path= "/inbox">
          <Messages messages={inbox.map(m => (<MessageTumbnail id={m.id} name={m.from} description={m.description} body={m.body} date={m.date}/>))}/>
        </Route>

        <Route path= "/sent">
          <Messages messages={sent.map(m => (<MessageTumbnail id={m.id} name={m.to} description={m.description} body={m.body} date={m.date}/>))}/>
        </Route>

        <Route exact path="/msg/:msg_id">
          <Message messages={inbox.concat(sent)}/>
        </Route>

      </Switch>
    </Router>
  )
}

export default Frontpage;
