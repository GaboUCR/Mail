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
      console.log(data)
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
    <div className="grid justify-items-center">
      <div className = "">
        <form onSubmit={handleSubmit} className = "space-y-4 m-6">

          <div>
            <input type="text" className="border w-72" id="to" placeholder="to" value={to} onChange={toChange} />
          </div>

          <div>
            <input type="text" className="border w-72" id="description" placeholder="Subject" value={description} onChange={descriptionChange}/>
          </div>

          <div>
            <textarea className="border h-80 w-72" id="body" value={body} onChange={bodyChange}> </textarea>
          </div>

        <input type="submit" value="Submit"/>
        </form>
      </div>
    </div>
  )

}

export default MsgCompose;
