import {useEffect, useState, useContext} from "react";
import {EmailContext} from "../email.context"
import {loupe} from "./images"


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

      <nav className="flex absolute right-0">

        <a className="p-4 inline">{email}</a>
        <button onClick={handleLogout} className="p-4 inline">log out</button>
      </nav>
    </nav>
  )
}

function SearchBar(){
  const [search, setSearch] = useState("")

  function handleSearch (event){
    setSearch(event.target.value)
  }

  return (
    <div className="p-2">
      <input type="text" className="border text-lg px-2 h-10 w-72" id="searchBar" placeholder="Find the people you know" value={search} onChange={handleSearch} />
    </div>
  )
}

export default Navbar;
