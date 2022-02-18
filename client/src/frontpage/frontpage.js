import Navbar from "./navbar"
import { useState, useEffect, useContext } from "react"
import { refresh, send, garbageBin, user, bigUser } from "./images"
import { MsgCompose } from "../forms"
import { MessageTumbnail, Messages, Message } from "./messages"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useParams
} from "react-router-dom";


function Frontpage() {
  const [pressed, setPressed] = useState(false)
  const [update, setUpdate] = useState(0)
  const [inbox, setInbox] = useState([])
  const [sent, setSent] = useState([])
  const MsgType = { read: 0, unread: 1, sent: 2 }

  //When the update state is changed we call the api again 
  //The update state changes when a message is deleted, and when 
  //a message is written. This is not a good practice, the client should update
  //without the need to call the api again.
  useEffect(() => {
    const requestOptions = { method: 'GET' };

    fetch('/mail/api/user/inbox', requestOptions).then(response => response.json())
      .then((r) => {
        setInbox(r.messages)
      },
        (error) => { console.log(error) }
      )

    fetch('/mail/api/user/sent', requestOptions).then(response => response.json())
      .then((r) => {
        setSent(r.messages)
      })
  }, [update]);

  return (
    <Router basename="/mail">
      <div>
        <Navbar />
        <MsgButtons handleDelete={setUpdate} pressed={pressed} setPressed={setPressed} />
      </div>

      <Switch>

        <Route exact path="/inbox">
          <Messages messages={inbox.map((m, index) => (<MessageTumbnail del={update} bulkSelection={pressed} key={m.id} msg_type={m.type} id={m.id} name={m.from} description={m.description} body={m.body} date={m.date} />))} />
        </Route>

        <Route exact path="/sent">
          <Messages messages={sent.map((m, index) => {
            return <MessageTumbnail del={update} bulkSelection={pressed} key={m.id} msg_type={m.type} id={m.id} name={m.from} description={m.description} body={m.body} date={m.date} />
          })} />
        </Route>

        <Route exact path="/msg/:msg_id">
          <Message changeInbox={setInbox} messages={inbox.concat(sent)} />
        </Route>

        <Route exact path="/user/:email">
          <User />
        </Route>

        <Route exact path="/compose/:defaultTo">
          <MsgCompose update={setUpdate} isTo={true} />
        </Route>

        <Route exact path="/compose">
          <MsgCompose update={setUpdate} isTo={false} />
        </Route>

        <Redirect from="/" to="/inbox" />

      </Switch>
    </Router>
  )
}

function MsgButtons(props) {

  function refreshPage() {
    window.location.reload(false)
  }

  function deleteMessages() {
    props.handleDelete(Math.floor(Math.random() * 100000))
  }

  function setBulk(e) {
    if (e.target.value === "true") {
      props.setPressed(false)
    }
    else {
      props.setPressed(true)
    }
  }

  return (
    <div className="">

      <div className="flex p-3 space-x-5">
        <input onChange={setBulk} className="self-center h-4 w-4" type="checkbox" value={props.pressed} checked={props.pressed} />
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

function User() {
  let { email } = useParams()

  return (
    <Link to={"/compose/" + email}>
      <div className="grid justify-content-center">

        <div className="flex place-content-center">
          <img className="float-left" src={bigUser} />
          <div className="font-bold mx-5 text-lg">{email}</div>
        </div>

        <button className="rounded place-self-center my-2 px-2 border text-lg font-medium">Start a conversation</button>
      </div>
    </Link>
  )
}

export default Frontpage;
