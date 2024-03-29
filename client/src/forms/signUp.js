import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import Welcome from "./welcome"
import { EmailContext } from "../email.context"

function SignUp() {
  const { email, handleEmailChange } = useContext(EmailContext)
  const [emailForm, setemailForm] = useState("")
  const [password, setPassword] = useState("")
  const [password1, setPassword1] = useState("")

  const MsgForm = { ok: 0, user_taken: 1, unknown_error: 2 }

  function passwordChange(event) {
    setPassword(event.target.value);
  }

  function password1Change(event) {
    setPassword1(event.target.value);
  }

  function emailChange(event) {
    setemailForm(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    console.log(emailForm)
    if (password1 === password) {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailForm, password: password })
      };

      fetch('/mail/api/user/signUp', requestOptions).then(response => response.json())
        .then((data) => {
          switch (data.error) {
            case MsgForm.ok:
              handleEmailChange(emailForm)
              alert("Success");
              break;

            case MsgForm.user_taken:
              alert("That name is already taken")
              break;

            default:
              alert("Unknown error, try again later")
          }
        })
    }
    else {
      alert("Password confirmation does not match!")
    }
  };

  return (
    <div className="grid grid-cols-2 py-40">
      <Welcome />

      <form onSubmit={handleSubmit} className="place-self-center p-6 space-y-4 rounded-lg bg-white">

        <div>
          <input type="text" className="border text-lg px-2 h-10 w-72" id="email" placeholder="Enter your email" value={emailForm} onChange={emailChange} />
        </div>

        <div>
          <input type="password" className="border text-lg px-2 h-10 w-72" id="password" placeholder="Password" value={password} onChange={passwordChange} />
        </div>

        <div>
          <input type="password" className="border text-lg px-2 h-10 w-72" id="password1" placeholder="Confirm your password" value={password1} onChange={password1Change} />
        </div>

        <input className="w-72 h-10 bg-light-brown" type="submit" value="Sign Up" />

        <div className="grid w-72 h-10">
          <Link className="place-self-center" to="/logIn">Log In</Link>
        </div>

      </form>

    </div>
  )

}

export default SignUp;
