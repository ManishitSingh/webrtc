import { createContext, useContext, useMemo } from "react";
import { io } from "socket.io-client";
import PropTypes from "prop-types";

const SocketContext = createContext();

export const useSocket = () =>{
    return useContext(SocketContext);
}

export const SocketProvider = ({children}) =>{
    const socket = useMemo(()=>{
         return io('http://localhost:3001');
    },[]);
    // console.log(socket);
    return(
    <SocketContext.Provider value={{socket}}>
        {children}
    </SocketContext.Provider>
)
}
SocketProvider.propTypes = {
    children: PropTypes.node.isRequired
};
