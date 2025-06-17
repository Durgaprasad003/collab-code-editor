import React, { useState } from 'react'
import { v4 as uuid } from 'uuid'
import toast from "react-hot-toast"
import img from './images.png'
import { useNavigate } from 'react-router-dom'  
const Homes = () => {
const [roomid, setRoomid] = useState('')
const [username, setUsername] = useState('')

const navigate = useNavigate()
// Function to create a new room and navigate to the editor page
const createnewroom = (e) => {
  e.preventDefault();   

const id =uuid()
setRoomid(id)
toast.success("New Room Created")

}
const joinroom = (e) => {
 
  if(!roomid || !username) {
    toast.error("RoomId and Username is required")
    return;
  }
  navigate(`/editor/${roomid}`, {
    state: {
      username,
    },
  }); 
}
const handleinputenter = (e) => {
  if(e.code === "Enter") {
   joinroom();
    
  }  
}






  return <div className='homePageWrapper'>

   
      <div className='formwrapper'>
        <div className='homepagelogoWrapper'>
  <img src={img} alt="logo" className='homepagelogo' />
</div>

       <h4 className='mainlabel'>Paste Invitation RoomId</h4>
       <div className='inputgroup'>
        <input type="text" className='inputbox' placeholder='Roomid:' value={roomid}   onChange={(e) => setRoomid(e.target.value)}
        onKeyUp={handleinputenter}/>


         <input type="text" className='inputbox' placeholder='Username'value={username}   onChange={(e) => setUsername(e.target.value)}  onKeyUp={handleinputenter}/>
        
         <button className='btn joinbtn' onClick={joinroom}>Join</button>
         <span className='createinfo'>
    if you dont have an invite then create &nbsp;
    <a onClick={createnewroom} href='#'className='createnewbtn'title='wanna come to new room'>New room</a>
         </span>
       </div>
      </div>
     <footer>
        <h4>
            Built with 💓by <a href="https://github.com/Durgaprasad003">prashu</a>
        </h4>
     </footer>
  </div>
}

export default Homes