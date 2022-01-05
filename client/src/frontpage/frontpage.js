import Navbar from "./navbar"
import {useState, useEffect, useContext} from "react"
import {refresh, send, garbageBin} from "./images"
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

function MsgButtons(props){

  function refreshPage (){
    window.location.reload(false)
  }

  function deleteMessages(){
    props.handleDelete(Math.floor(Math.random() * 100000))
  }

  function setBulk(e){
    if (e.target.value === "true"){
      props.setPressed(false)
    }
    else{
      props.setPressed(true)
    }
  }

  return(
    <div className="">

      <div className="flex p-3 space-x-5">
        <input onChange={setBulk} className="self-center h-4 w-4" type="checkbox" value={props.pressed} checked={props.pressed}/>
        <button onClick={refreshPage}> <img src={refresh} /> </button>
        <button onClick={deleteMessages}> <img src={garbageBin} /> </button>
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
  const [del, setDel] = useState(0)
  const [inbox, setInbox] = useState([])
  const [sent, setSent] = useState([])
  const MsgType = {read:0, unread:1, sent:2}

  useEffect(()=>{
    const requestOptions = {method: 'GET'};

    fetch('http://localhost:5000/api/user/inbox', requestOptions).then(response => response.json())
    .then((r) => {
      setInbox(r.messages)
    },
    (error) =>{console.log(error)}
    )

    fetch('http://localhost:5000/api/user/sent', requestOptions).then(response => response.json())
    .then((r) => {
      setSent(r.messages)
    })
  },[del]);

  return(
    <Router>
      <div>
        <Navbar />
        <MsgButtons handleDelete={setDel} pressed={pressed} setPressed={setPressed}/>
      </div>

      <Switch>

        <Route exact path= "/inbox">
          <Messages messages={inbox.map( (m, index)=> (<MessageTumbnail del={del} bulkSelection={pressed} key={m.id} msg_type={m.type} id={m.id} name={m.from} description={m.description} body={m.body} date={m.date}/>))}/>
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

      </Switch>
    </Router>
  )
}

export default Frontpage;
