import {useState} from "react";
import {useParams, useHistory} from "react-router-dom";


function MsgCompose(props){
  let defaultTo = useParams()
  let history = useHistory();

  if (!props.isTo){
    defaultTo = ""
  }
  const[to, setto] = useState(defaultTo.defaultTo)
  const[body, setbody] = useState("")
  const[description, setdescription] = useState("")

  const MsgForm = {ok:0, user_not_found:1, unknown_error:2}

  function descriptionChange(event){
    setdescription(event.target.value);
  }

  function toChange(event){
    setto(event.target.value);
  }

  function bodyChange(event){
    setbody(event.target.value);
  }

  function handleSubmit(event){
    event.preventDefault();
    const requestOptions = {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({to:to, body:body, description:description})};

    fetch('http://localhost:5000/api/user/sendMessage', requestOptions).then(response => response.json())
    .then((data) => {
      switch (data.error) {
        case MsgForm.ok:
          alert("Message sent");
          history.push("/sent")
          props.update(Math.floor(Math.random() * 100000))
          break;

        case MsgForm.user_not_found:
          alert("user "+to+" not found")
          break;

        default:
          alert("Unknown error, try again later")
    }});
  };

  return(
        <form onSubmit={handleSubmit} className = "p-3 space-y-1">

          <input type="text" className="border p-2 w-full" id="to" placeholder="to" value={to} onChange={toChange} />

          <input type="text" className="border p-2 w-full" id="description" placeholder="Subject" value={description} onChange={descriptionChange}/>

          <textarea className="border p-2 h-72 w-full" id="body" value={body} onChange={bodyChange}> </textarea>

          <input className="bg-light-brown p-3" type="submit" value="Send Message"/>
        </form>


  )

}

export default MsgCompose;
