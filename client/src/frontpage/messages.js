import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react"
import { refresh, garbageBin } from "./images"

function MsgButtons(props) {

  function refreshPage() {
    window.location.reload(false)
  }

  function deleteMessages() {
    // The change in this variable alerts the messages that they have to be deleted if they are selected
    console.log(props.del)
    props.setDel(props.del + 1)
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

export function MessageTumbnail(props) {
  const MsgType = { read: 0, unread: 1, sent: 2 }

  let color = ""
  const [selected, setSelected] = useState(false)
  let read = props.msg_type === MsgType.read

  useEffect(() => {
    setSelected(props.bulkSelection)
  }, [props.bulkSelection])
  
  useEffect(() => {
    if (selected) {
      //delete message on the server
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ msg_id: props.id })
      };
      fetch('/mail/api/user/deleteMessage', requestOptions).then(response => response.json())
        .then((data) => {
          if (!data.ok) {
            alert("Unable to delete this message, try again later")
          }
        })

      //delete message on the client
      props.delete()
    }
  }, [props.del])

  function handleCheckboxChange(e) {
    if (e.target.value === "true") {
      setSelected(false)
    }
    else {
      setSelected(true)
    }
  }

  if (read && !selected) {
    color = " bg-light-brown"
  }
  else if (selected) {
    color = " bg-blue-300"
  }
  else if (props.msg_type === MsgType.sent) {
    color = " bg-light-brown"
  }

  return (
    <div className={"flex w-full items-center border rounded hover:border-red-200 px-3 hover:shadow-md" + color}>

      <input onChange={handleCheckboxChange} value={selected} className="w-1/30" type="checkbox" checked={selected} />

      <Link className="w-29/30" to={"/msg/" + props.id}>

        <div className="flex">
          <div className="w-1/6 py-1">{props.name}</div>

          <div className="flex py-1 w-5/6">
            <div className="truncate w-11/12"><b>{props.description + " - "}</b>{props.body}</div>
            <div className="text-right w-1/12">{props.date}</div>
          </div>

        </div>

      </Link>

    </div>
  )
};

function getMessageById(messages, id) {

  for (const n of messages) {
    if (n.id === id) {
      return n;
    }
  }
  return null;
}

export function Message(props) {
  const MsgType = { read: 0, unread: 1, sent: 2 }
  let { msg_id } = useParams()
  let msg = getMessageById(props.messages, msg_id)

  useEffect(() => {
    if (msg.type === MsgType.unread) {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ msg_id: msg_id })
      };

      fetch('/mail/api/user/markMsgAsRead', requestOptions).then(response => response.json())
        .then((r) => {
          if (!r.ok) {
            alert("unable to mark this message as read due to an unknown error")
          }
        })

      return function cleanup() {
        let newList = []
        let changed = false
        for (const n of props.messages) {
          if (MsgType.sent === n.type) {
            continue
          }
          if (n.id === msg_id && n.type === MsgType.unread) {
            var m = n
            m.type = MsgType.read

            newList.push(m)
            changed = true
            continue
          }
          newList.push(n)
        }
        if (changed) {
          props.changeInbox(newList)
        }
      }
    }
  })

  if (msg === null) {
    return <h2 className="text-center font-oxy font-black text-lg md:text-3xl">Unexpected error, try again later</h2>
  }
  return (
    <div className="grid justify-items-start my-5 mx-3 sm:mx-12 md:mx-24 lg:mx-36 xl:mx-48 2xl:mx-60">
      <div className="text-lg px-2 bg-light-brown py-5 border w-full font-thin md:text-3xl">{msg.description}</div>
      <div className="font-semibold px-2 border w-full text-base">{msg.from}</div>
      <div className="font-semibold px-2 border w-full text-base">to {msg.to}</div>
      <div className="text-xs px-2 lit:text-sm py-4 border w-full litx:text-base sm:text-lg" >{msg.body}</div>
    </div>
  )
}

export function Inbox_messages(props) {
  const [inbox, setInbox] = useState([])
  const [del, setDel] = useState(0)
  const [pressed, setPressed] = useState(false)
  const [garbage, setGarbage] = useState([])

  function handle_delete(id) {
   setInbox(inbox.filter(m => m.id !== id))
  }

  useEffect(() => {
    const requestOptions = { method: 'GET' };

    fetch('/mail/api/user/inbox', requestOptions).then(response => response.json())
      .then((r) => {
        setInbox(r.messages)
      },
        (error) => { console.log(error) }
      )
  }, [])


  if (inbox.length === 0) {

    return (
      <div>
        <MsgButtons />
        <h2 className="cursor-wait text-center">Reload to check for new messages</h2>
      </div>

    )
  }
  else {
    return (
      <div>
        <MsgButtons setPressed={setPressed} pressed={pressed} setDel={setDel} del={del} />
        {inbox.map((m, index) => (<MessageTumbnail delete={() => handle_delete(m.id)} del={del} bulkSelection={pressed} key={m.id} msg_type={m.type} id={m.id} name={m.from} description={m.description} body={m.body} date={m.date} />))}
      </div>
    )
  }
}

export function Messages(props) {

  if (props.messages.length === 0) {

    return <h2 className="cursor-wait text-center">Reload to check for new messages</h2>
  }
  else {
    return (props.messages)
  }
}
