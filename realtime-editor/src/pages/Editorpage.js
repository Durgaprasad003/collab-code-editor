import React, { useEffect, useRef, useState } from 'react';
import logo from './images.png';
import Client from '../Component/Client';
import Editor from '../Component/Editor';
import { initsocket } from '../socket';
import { useLocation, useNavigate, Navigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import Actions from '../Actions.js';

const Editorpage = () => {
  
  const socketref = useRef(null);
  const location = useLocation();
  const { roomid } = useParams();
  const codeRef = useRef(null);

  const reactNavigator = useNavigate();
  const [clients, setclients] = useState([]);
  
  useEffect(() => {
    console.log("Editorpage useEffect running");
    const init = async () => {
      socketref.current = await initsocket();
      socketref.current.on('connect_error', (err) => handleError(err));
      socketref.current.on('connect_failed', (err) => handleError(err));

      function handleError(err) {
        console.log('Socket connection error', err);
        toast.error('Socket connection failed, try again later.');
        reactNavigator('/');
      }

      socketref.current.emit(Actions.JOIN, {
        roomid,
        username: location.state?.username || 'Anonymous',
      });

      socketref.current.on(Actions.JOINED, ({ clients, username, socketId }) => {
        if (username !== location.state?.username) {
          toast.success(`${username} joined the room.`);
          console.log(`${username} joined`);
        }
        setclients(clients);
        socketref.current.emit(Actions.SYNC_CODE, {
          code: codeRef.current,
          socketId,
        });
      });



socketref.current.on(Actions.DISCONNECTED, ({ socketId, username }) => {
        toast.success(`${username} has left the room.`);
        
        setclients((prev) => {
          return prev.filter((client) => client.socketId !== socketId);
        });
      })

    };
    init();
    return () => {
      if (socketref.current) {
        socketref.current.disconnect();
        socketref.current.off(Actions.JOINED);
        socketref.current.off(Actions.DISCONNECTED);
      }
    }

   
  }, []);

  async function copyroomid() {
    try {
         await navigator.clipboard.writeText(roomid);
      toast.success('Room ID copied to clipboard');
    } catch (error) {
        toast.error('Failed to copy Room ID');
      console.error('Failed to copy Room ID:', error);
    }
  }


  function leaveroom() {
    socketref.current.emit(Actions.LEAVE, { roomid });
    reactNavigator('/');
  }

  if (!location.state) {
    return <Navigate to="/" replace={true} />;
  }

  return (
    <div className="mainwrap">
      <div className="aside">
        <div className="asideinner">
          <div className="logo">
            <img className="logoimage" src={logo} alt="My Logo" />
          </div>
          <h3>connected</h3>
          <div className="clientlist">
            {clients.map((client) => (
              <Client key={client.socketId} username={client.username} />
            ))}
          </div>
        </div>
        <button className="btn copybtn" onClick={copyroomid}>Copy ROOM ID</button>
        <button className="btn leavebtn" onClick={leaveroom}>Leave</button>
      </div>

      <div className="editorwrap">
        <Editor  socketref={socketref}
  roomid={roomid}
   onCodeChange={(code) => {
    codeRef.current = code;
    console.log("Code changed:", code);
  }}
  
  />
      </div>
    </div>
  );
};

export default Editorpage;
