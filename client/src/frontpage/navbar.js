import { useEffect, useState, useContext } from "react";
import { EmailContext } from "../email.context"
import { loupe, user } from "./images"
import { Link, useHistory } from "react-router-dom"

function Navbar() {
  const { email, handleEmailChange } = useContext(EmailContext)
  const [show_user_bar, setIsShown] = useState(" hidden")
  let history = useHistory()

  let handleLogout = () => {
    fetch("/mail/api/user/logout", { method: "GET" })
    history.push("/")
    handleEmailChange("")
  }

  return (
    <nav id="welcome" className="text-xl p-4 grid grid-cols-3 grid-rows-1 items-center">
      <div className="">
        <a href="/">Mail</a>
      </div>

      <SearchBar />

      <nav className="place-self-end" onMouseEnter={() => setIsShown("")}
        onMouseLeave={() => setIsShown(" hidden")}>

        <button className="px-6 py-2" >
          <img src={user} />
        </button>

        <div className={"absolute border rounded-lg bg-white" + show_user_bar}>
          <button onClick={handleLogout} className="px-2">Log out</button>
        </div>

      </nav>
    </nav>
  )
}

function SearchBar() {
  const [search, setSearch] = useState("")
  const [users, setUsers] = useState([])
  const [display, setDisplay] = useState(" hidden")
  let history = useHistory()

  function look(src) {
    history.push(src)
    setDisplay(" hidden")
  }

  function handleSearch(event) {
    setSearch(event.target.value)
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ search: search })
    };

    fetch("/mail/api/user/get-users", requestOptions).then(response => response.json())
      .then((r) => {
        setUsers(r.emails.map(c => (<Link className="w-full p-1 hover:bg-light-brown" to={"/user/" + c}><div className="">{c}</div></Link>)))
      }
      )
  }
  async function handleFocusOut() {
    //this promise mades the code wait so that the Link component exists 
    //when the user click on it!
    await new Promise(resolver => setTimeout(resolver, 220))
    setDisplay(" hidden")
  }

  function handleFocusIn() {
    setDisplay("")
  }

  return (
    <div onFocus={handleFocusIn} onBlur={handleFocusOut} className="">
      <input onChange={handleSearch} type="text" className="border bg-light-brown text-lg px-2 h-10 w-80" id="searchBar" placeholder="Find the people you know" value={search} />
      <div className={"grid w-80 border rounded-lg bg-white absolute" + display}>{users}</div>
    </div>
  )
}

export default Navbar;
