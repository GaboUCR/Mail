import {useState} from "react";
import {Link} from "react-router-dom";
import Welcome from "./welcome"

function LogIn (props){
  const[email, setEmail] = useState("")
  const[password, setPassword] = useState("")

  const MsgForm = {ok:0, wrong_credentials:1, unknown_error:2}

  function passwordChange(event){
    setPassword(event.target.value);
  }

  function emailChange(event){
    setEmail(event.target.value);
  }

  function handleSubmit(event){
    event.preventDefault();
    const requestOptions = {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({email:email, password:password})};

    fetch('http://localhost:5000/api/user/logIn', requestOptions).then(response => response.json())
    .then((data) => {
      console.log(data)
      switch (data.error) {
        case MsgForm.ok:
          props.setEmail(email)
          alert("Success");
          break;

        case MsgForm.wrong_credentials:
          alert("Password or email address are incorrect")
          break;

        default:
          alert("Unknown error, try again later")
    }});
  };

  return(
      <div className="grid grid-cols-2 py-40">
        <Welcome />

        <form onSubmit={handleSubmit} className = "place-self-center p-6 space-y-4 rounded-lg bg-white">

          <div>
            <input type="text" className="border text-lg px-2 h-10 w-72" id="email" placeholder="Enter your email" value={email} onChange={emailChange} />
          </div>

          <div>
            <input type="password" className="border text-lg px-2 h-10 w-72" id="password" placeholder="Password" value={password} onChange={passwordChange}/>
          </div>

          <input className="w-72 h-10 bg-light-brown" type="submit" value="Log In"/>

          <div className="grid w-72 h-10">
            <Link className="place-self-center" to="/signUp">Create new account</Link>
          </div>
        </form>

      </div>
  )

}

export default LogIn;
