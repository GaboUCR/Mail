import Navbar from "./navbar"
import {useState, useEffect, useContext} from "react"
import {refresh, send, garbageBin, user, bigUser} from "./images"
import {MsgCompose} from "../forms"
import {MessageTumbnail, Messages, Message, Inbox_messages} from "./messages"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useParams
} from "react-router-dom";


function User(){
  let {email} = useParams()

  return(
    <Link to={"/compose/"+email}>
      <div className="grid justify-content-center">

        <div className="flex place-content-center">
          <img className="float-left" src={bigUser}/>
          <div className="font-bold mx-5 text-lg">{email}</div>
        </div>

        <button className="rounded place-self-center my-2 px-2 border text-lg font-medium">Start a conversation</button>
      </div>
    </Link>
  )
}

function Frontpage(){
  const [pressed, setPressed] = useState(false)
  const [del, setDel] = useState(0)
  // Transform messages into a contextd
  const [inbox, setInbox] = useState([])
  const [sent, setSent] = useState([])
  const MsgType = {read:0, unread:1, sent:2}

  useEffect(()=>{
    const requestOptions = {method: 'GET'};

    fetch('/mail/api/user/inbox', requestOptions).then(response => response.json())
    .then((r) => {
      setInbox(r.messages)
    },
    (error) =>{console.log(error)}
    )

    fetch('/mail/api/user/sent', requestOptions).then(response => response.json())
    .then((r) => {
      setSent(r.messages)
    })
  },[del]);

  return(
    <Router basename="/mail">
  
        <Navbar />

      <Switch>

        <Route exact path= "/inbox">
          <Inbox_messages />
        </Route>

        <Route exact path= "/sent">
          <Messages messages={sent.map( (m, index) => {
                                return <MessageTumbnail del={del} bulkSelection={pressed} key={m.id} msg_type={m.type} id={m.id} name={m.from} description={m.description} body={m.body} date={m.date}/>}  )}/>
        </Route>

        <Route exact path="/msg/:msg_id">
          <Message changeInbox={setInbox} messages={inbox.concat(sent)}/>
        </Route>

        <Route exact path="/user/:email">
          <User />
        </Route>

        <Route exact path= "/compose/:defaultTo">
          <MsgCompose update={setDel} isTo={true}/>
        </Route>

        <Route exact path= "/compose">
          <MsgCompose update={setDel} isTo={false}/>
        </Route>

        <Redirect from="/" to="/inbox" />

      </Switch>
    </Router>
  )
}

export default Frontpage;
