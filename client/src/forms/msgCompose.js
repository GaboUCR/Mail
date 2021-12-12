import {useState} from "react";

function MsgCompose(props){
  const[to, setto] = useState("")
  const[body, setbody] = useState("")
  const[description, setdescription] = useState("")

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

    fetch('/api/user/sendMessage', requestOptions).then(response => response.json())
    .then((data) => {
        alert(data);

    });
  };

  return(
    <div className="grid justify-items-center">
      <div className = "my-10">
        <form onSubmit={handleSubmit} className = "space-y-4 m-6">

        <label className ="font-oxy font-normal text-lg" htmlFor="to">to</label>
          <div>
            <input type="text" className="border w-72" id="to" placeholder="to" value={to} onChange={toChange} />
          </div>

        <label htmlFor="description">Subject</label>
          <div>
            <input type="text" className="border w-72" id="description" value={description} onChange={descriptionChange}/>
          </div>

        <label className ="font-oxy font-normal text-lg" htmlFor="body">body</label>
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
