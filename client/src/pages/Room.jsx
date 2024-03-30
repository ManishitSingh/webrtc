import { useCallback, useEffect, useState } from "react";
import { useSocket } from "../context/SocketProvider";
import { usePeer } from "../context/Peer";
import ReactPlayer from "react-player";

const Room = () => {
  const { socket } = useSocket();
  const [mystream, setMyStream] = useState(null); //my video here
  const [remoteEmailId, setRemoteEmailId] = useState();
  // eslint-disable-next-line no-unused-vars
  const [streamSent, setStreamSent] = useState(false);
  const {
    peer,
    createOffer,
    createAnswer,
    setRemoteAnswer,
    sendStream,
    remoteStream,
  } = usePeer();
  const getUserMediaStream = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    setMyStream(stream);
  }, []);

  const handleJoin = useCallback(
    async (data) => {
      console.log("User joined", data.email);
      const offer = await createOffer();
      console.log("Offer created", offer);
      socket.emit("offer", { email: data.email, offer });
      setRemoteEmailId(data.email);
    },
    [createOffer, socket]
  );

  const userJoined = useCallback(
    async ({ fromEmail, offer }) => {
      console.log("Incoming offer", fromEmail, offer);
      const answer = await createAnswer(offer);
      socket.emit("offer-accepted", { email: fromEmail, answer });
      setRemoteEmailId(fromEmail);
    },
    [createAnswer, socket]
  );

  const handleOfferAccepted = useCallback(async ({ answer }) => {
    console.log("Offer accepted", answer);
    await setRemoteAnswer(answer);
  }, [setRemoteAnswer]);

  useEffect(() => {
    socket.on("user-joined", handleJoin);

    socket.on("incoming-offer", userJoined);
    socket.on("offer-accepted", handleOfferAccepted);
    return () => {
      socket.off("user-joined", handleJoin);
      socket.off("incoming-offer", userJoined);
      socket.off("offer-accepted", handleOfferAccepted);
    };
  }, [socket, handleJoin, userJoined, handleOfferAccepted]);

  const handleNegotiationNeeded = useCallback(async () => {
    const localoffer = peer.localDescription;

    socket.emit("offer", { email: remoteEmailId, offer: localoffer });
  }, [peer, socket, remoteEmailId]);

  // useEffect(() => {
  //   getUserMediaStream();
  // }, [getUserMediaStream]);

  useEffect(() => {
    peer.addEventListener("negotiationneeded", handleNegotiationNeeded);
    return () => {
      peer.removeEventListener("negotiationneeded", handleNegotiationNeeded);
    };
  }, [peer, handleNegotiationNeeded]);

  return (
    <div>
      <h1>Room Page</h1>
      <button
        onClick={() => {
          sendStream(mystream);
          console.log("stream sent");
        }}
      >
        Send My video
      </button>
      <h4>{remoteEmailId}</h4>
      <ReactPlayer url={mystream} playing muted />
      <ReactPlayer url={remoteStream} playing />
    </div>
  );
};

export default Room;
