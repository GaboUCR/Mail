import {Link, useParams} from "react-router-dom";

export function MessageTumbnail(props){

  let description = <b>props.description</b>
  return(
    <div className="flex overflow-hidden p-3 space-x-4">

      <input className="self-center w-1/30" type="checkbox"/>

      <Link className="w-29/30" to={"/msg/"+props.id}>

        <div className="flex space-x-4 border rounded">
          <div className="w-1/6">{props.name}</div>

          <div className="flex w-5/6">
            <div className="truncate"><b>{props.description+" - "}</b>{props.body}</div>
            <div className="px-1 text-right ">{props.date}</div>
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
  let {msg_id} = useParams()
  let msg = getMessageById(props.messages, msg_id)

  if (msg === null){
    return <h2 className="text-center">Unexpected error, try again later</h2>

  }
  console.log(msg)
  return(
    <div className="grid justify-items-center space-y-5 my-5 mx-3 sm:mx-12 md:mx-24 lg:mx-36 xl:mx-48 2xl:mx-60">
      <div className="text-center font-oxy font-black text-lg md:text-3xl">{msg.description}</div>
      <div className="text-center font-oxy font-normal text-sm">{msg.from}</div>
      <div className="text-center font-oxy font-normal text-sm">to {msg.to}</div>
      <div className="border rounded border-bor-comm p-2 font-lato text-xs lit:text-sm litx:text-base sm:text-lg" >{msg.body}</div>
    </div>
  )
}

export function Messages(props){

  if (props.messages.length === 0){
    return <h2 className="cursor-wait text-center">Loading</h2>
  }
  else{
    return (
      <div className="grid">
        {props.messages}
      </div>
    )
  }
}
