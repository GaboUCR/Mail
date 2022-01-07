import {Link, useParams} from "react-router-dom";
import {useState, useEffect} from "react"

export function MessageTumbnail(props){
  const MsgType = {read:0, unread:1, sent:2}

  let color = ""

  const [selected, setSelected] = useState(false)
  let read = props.msg_type === MsgType.read

  useEffect(() => {
    setSelected(props.bulkSelection)
  }, [props.bulkSelection])

  useEffect(() => {
    if (selected){
      const requestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({msg_id:props.id})};
      fetch('http://localhost:5000/api/user/deleteMessage', requestOptions).then(response => response.json())
      .then((data) => {
        if (!data.ok){
          alert("Unable to delete this message, try again later")
        }
      })
    }
  }, [props.del])

  function handleCheckboxChange(e){
    if (e.target.value === "true"){
      setSelected(false)
    }
    else{
      setSelected(true)
    }
  }

  if (read && !selected){
    color = " bg-light-brown"
  }
  else if (selected){
    color = " bg-blue-300"
  }
  else if(props.msg_type === MsgType.sent){
    color = " bg-light-brown"
  }

  return(
    <div className={"flex w-full items-center border rounded hover:border-red-200 px-3 hover:shadow-md"+color}>

      <input onChange={handleCheckboxChange} value={selected} className="w-1/30" type="checkbox" checked={selected}/>

      <Link className="w-29/30" to={"/msg/"+props.id}>

        <div className="flex">
          <div className="w-1/6 py-1">{props.name}</div>

          <div className="flex py-1 w-5/6">
            <div className="truncate w-11/12"><b>{props.description+" - "}</b>{props.body}</div>
            <div className="text-right w-1/12">{props.date}</div>
          </div>

        </div>

      </Link>

    </div>
  )
};

function getMessageById(messages, id){

  for (const n of messages){
    if(n.id === id){
      return n;
    }
  }
  return null;
}

export function Message(props){
  const MsgType = {read:0, unread:1, sent:2}
  let {msg_id} = useParams()
  let msg = getMessageById(props.messages, msg_id)

  useEffect(() => {
    const requestOptions = {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({msg_id:msg_id})};

    fetch('http://localhost:5000/api/user/markMsgAsRead', requestOptions).then(response => response.json())
    .then((r) => {
      if (!r.ok){
        alert("unable to mark this message as read due to an unknown error")
      }
    })

    return function cleanup(){
      let newList = []
      let changed = false
      for(const n of props.messages){
        if(MsgType.sent === n.type){
          continue
        }
        if (n.id === msg_id && n.type === MsgType.unread){
          var m = n
          m.type = MsgType.read

          newList.push(m)
          changed = true
          continue
        }
        newList.push(n)
      }
      if (changed){
        props.changeInbox(newList)
      }
    }
  })

  if (msg === null){
    return <h2 className="text-center font-oxy font-black text-lg md:text-3xl">Unexpected error, try again later</h2>
  }
  return(
    <div className="grid justify-items-start my-5 mx-3 sm:mx-12 md:mx-24 lg:mx-36 xl:mx-48 2xl:mx-60">
      <div className="text-lg px-2 bg-light-brown py-5 border w-full font-thin md:text-3xl">{msg.description}</div>
      <div className="font-semibold px-2 border w-full text-base">{msg.from}</div>
      <div className="font-semibold px-2 border w-full text-base">to {msg.to}</div>
      <div className="text-xs px-2 lit:text-sm py-4 border w-full litx:text-base sm:text-lg" >{msg.body}</div>
    </div>
  )
}

export function Messages(props){

  if (props.messages.length === 0){
    return <h2 className="cursor-wait text-center">Reload to check for new messages</h2>
  }
  else{
    return (props.messages)
  }
}
