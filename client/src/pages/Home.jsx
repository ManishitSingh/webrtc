import { useEffect, useState } from "react";
import { useSocket } from "../context/SocketProvider.jsx";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const {socket} = useSocket();
    const navigate = useNavigate();
    const [details, setDetails] = useState({
        email: "",
        roomId: "",
    });
    const handleSubmit =()=>{
        console.log("Joining room",details);
        socket.emit('join-room', details);
        setDetails({email:'', roomId:''});
    };

    useEffect(()=>{
        socket.on('room-joined',(data)=>{
            console.log("room joined",data);
            navigate(`/room/${data.roomId}`);
        
        })
        return()=>{
            socket.off('room-joined');
        }

    },[socket,navigate])

  return (
    <div className="flex justify-center items-center  h-screen w-screen">
      <div className="  flex flex-col w-[300px] gap-2">
        <input
          type="text"
          placeholder="Enter your email here"
          className="border-2 p-2 border-black"
          onChange={(e) => {
            setDetails({ ...details, email: e.target.value });
          }}
          value={details.email}
        />
        <input
          type="text"
          placeholder="Enter Room Code"
          className="border-2 border-black p-2"
            onChange={(e) => {
                setDetails({ ...details, roomId: e.target.value });
            }}
            value={details.roomId}
        />
       <button onClick={handleSubmit} className="border-2 font-bold w-1/2 mx-auto border-black">Join Room</button>
      </div>
    </div>
  );
};

export default Home;
