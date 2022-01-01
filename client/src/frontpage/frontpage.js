import Navbar from "./navbar"
import {useState, useEffect} from "react"
import {refresh, send} from "./images"
import {MsgCompose} from "../forms"
import {MessageTumbnail, Messages, Message} from "./messages"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useParams
} from "react-router-dom";

function MsgButtons(){

  function refreshPage (){
    window.location.reload(false)
  }

  return(
    <div className="">

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

function User(){
  let {email} = useParams()

  return(
    <div className="text-center font-bold text-lg"><Link to={"/compose/"+email}>{email} <p className="rounded border inline text-sm font-medium">Start a conversation</p></Link></div>
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

        <Route exact path= "/inbox">
          <Messages messages={inbox.map(m => (<MessageTumbnail read={m.type} id={m.id} name={m.from} description={m.description} body={m.body} date={m.date}/>))}/>
        </Route>

        <Route exact path= "/sent">
          <Messages messages={sent.map(m => (<MessageTumbnail id={m.id} name={m.to} description={m.description} body={m.body} date={m.date}/>))}/>
        </Route>

        <Route exact path="/msg/:msg_id">
          <Message changeInbox={setInbox} messages={inbox.concat(sent)}/>
        </Route>

        <Route exact path="/user/:email">
          <User />
        </Route>

        <Route exact path= "/compose/:defaultTo">
          <MsgCompose isTo={true}/>
        </Route>

        <Route path= "/compose">
          <MsgCompose isTo={false}/>
        </Route>


      </Switch>
    </Router>
  )
}

export default Frontpage;
