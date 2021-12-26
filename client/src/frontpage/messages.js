export function Inbox(){
  const[messages, getMessages] = useState([]);

  const title = <div className="text-center font-lato text-xl">Click any community to read their posts</div>

  useEffect(()=>{
    const requestOptions = {method: 'GET'};

    fetch('http://127.0.0.1:5000/get-communities-names', requestOptions).then(response => response.json())
    .then((data) => {

      getComms(data.comms.map(c => (<CommunityTumbnail comm_name={c.comm_name}
                description={c.comm_description} author={c.username} />)))

    },
    (error) =>{console.log(error)}
  )

},[]);

  if (comm.length === 0){
    return <h2 className="cursor-wait text-center">Loading</h2>
  }
  else{
    return <div className="grid justify-items-center space-y-5">{title}{comm}</div>
  }
}
