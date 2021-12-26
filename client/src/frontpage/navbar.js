import {useEffect, useState, useContext} from "react";
import {EmailContext} from "../email.context"

function Navbar(){
  const {email, handleEmailChange} = useContext(EmailContext)

  let handleLogout = () =>{
    fetch("http://localhost:5000/api/user/logout", {method:"GET"})
    handleEmailChange("")
    console.log(email)
  }

  return(
    <nav className = "grid grid-cols-3 grid-rows-1 bg-top-nav">
        <a href = "/" className ="p-4 hover:bg-nav-link text-nav-link-text">Mail</a>

        <nav className="flex absolute right-0">

          <a className="p-4 inline hover:bg-nav-link text-nav-link-text">{email}</a>
          <button onClick={handleLogout} className="p-4 inline hover:bg-nav-link text-nav-link-text">log out</button>
        </nav>
      </nav>
  )
}

export default Navbar;
