import {Link} from 'react-router-dom'

export function MessageTumbnail(props){

  let description = <b>props.description</b>
  return(
    <div className="flex overflow-hidden p-3 space-x-4">

      <input className="self-center h-4 w-1/30" type="checkbox"/>

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
