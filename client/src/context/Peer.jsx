//webrtc
import PropTypes from "prop-types";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const PeerContext = createContext();

export const usePeer = () => {
  return useContext(PeerContext);
};

export const PeerProvider = ({ children }) => {
  const [remoteStream, setRemoteStream] = useState(null); //remote other person video video here
  const peer = useMemo(() => {
    return new RTCPeerConnection({
      iceServers: [
        {
          urls: [
            "stun:stun.l.google.com:19302",
            "stun:global.stun.twilio.com:3478",
          ],
        },
      ],
    });
  }, []);
  const createOffer = async () => {
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    return offer;
  };
  const createAnswer = async (offer) => {
    await peer.setRemoteDescription(offer);
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);
    return answer;
  };
  const setRemoteAnswer = async (answer) => {
    
    await peer.setRemoteDescription(answer);
  };
  // const setRemoteAnswer = async (answer) => {
  //   if (peer.signalingState === "have-local-offer") {
  //     await peer.setRemoteDescription(answer);
  //   } else {
  //     console.error('Cannot set remote answer in current state:', peer.signalingState);
  //   }
  // };
  const sendStream = async (stream) => {
    const tracks = stream.getTracks(); //retrieves all the tracks (audio, video, or both) from the given stream and stores them in the tracks array.
    for (const track of tracks) {
      peer.addTrack(track, stream);
    }
  };
  const handleRemoteStream = useCallback((ev) => {
    const stream = ev.streams[0];
    setRemoteStream(stream);
  }, []);

  

  useEffect(() => {
    peer.addEventListener("track", handleRemoteStream);
    peer.addEventListener("icecandidate", (ev) => {
      if (ev.candidate) {
        console.log("New candidate", ev.candidate);
      }
    });
   
    return () => {
      peer.removeEventListener("track", handleRemoteStream);
    };
  }, [peer, handleRemoteStream]);

  return (
    <PeerContext.Provider
      value={{ peer, createOffer, createAnswer, setRemoteAnswer, sendStream,remoteStream }}
    >
      {children}
    </PeerContext.Provider>
  );
};

PeerProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
