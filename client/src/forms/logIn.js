import {useState} from "react";


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
    <div className="grid justify-items-center">
      <div className = "my-10">
        <form onSubmit={handleSubmit} className = "space-y-4 m-6">

        <label className ="font-oxy font-normal text-lg" htmlFor="email">email</label>
          <div>
            <input type="text" className="border w-72" id="email" placeholder="email" value={email} onChange={emailChange} />
          </div>

        <label htmlFor="password">Password</label>
          <div>
            <input type="password" className="border w-72" id="password" value={password} onChange={passwordChange}/>
          </div>

        <input type="submit" value="Submit"/>
        </form>
      </div>
    </div>
  )

}

export default LogIn;
