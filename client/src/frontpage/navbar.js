import {useEffect, useState, useContext} from "react";
import {EmailContext} from "../email.context"
import {loupe} from "./images"
import {Link} from "react-router-dom"

function Navbar(){
  const {email, handleEmailChange} = useContext(EmailContext)

  let handleLogout = () =>{
    fetch("http://localhost:5000/api/user/logout", {method:"GET"})
    handleEmailChange("")
    console.log(email)
  }

  return(
    <nav id="welcome" className = "text-xl grid grid-cols-3 grid-rows-1 bg-top-nav">
      <div className ="p-4">
        <a href = "/">Mail</a>
      </div>

      <SearchBar />

      <nav className="flex place-content-end">

        <a className="p-4 inline">{email}</a>
        <button onClick={handleLogout} className="p-4 inline">log out</button>
      </nav>
    </nav>
  )
}

function SearchBar(){
  const [search, setSearch] = useState("")
  const [users, setUsers] = useState([])
  const [display, setDisplay] = useState(" hidden")

  function handleSearch (event){
    setSearch(event.target.value)
    setDisplay("")
    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({search:search})};

    fetch("http://localhost:5000/api/user/get-users", requestOptions).then(response => response.json())
    .then((r) => {
      console.log(r.emails)
      setUsers(r.emails.map( c=> (<div><Link to ={"/user/"+c}>{c}</Link></div>)))
      console.log(users)
    }
  )
}
  async function handleFocusOut(){
    //this promise mades the code wait so that the Link component exists when the user click on it!
    await new Promise(r => setTimeout(r, 200));
    setDisplay(" hidden")
  }

  function handleFocusIn(){
    setDisplay("")
  }

  return (
    <div className="p-2">
      <input onChange={handleSearch} onFocus={handleFocusIn} onBlur={handleFocusOut} type="text" className="border bg-light-brown text-lg px-2 h-10 w-72" id="searchBar" placeholder="Find the people you know" value={search} />
      <div className={"w-72 absolute"+display}>{users}</div>
    </div>
  )
}

export default Navbar;
