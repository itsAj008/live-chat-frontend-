import { useState } from 'react'
import io from 'socket.io-client'

import ChatBox from './component/ChatBox'

const socket = io("http://localhost:3000")

function App() {

  const [userName , setUserName] = useState('')
  const [roomId , setRoomId] = useState('')
  const [entered , setentered] = useState(false)


 

  const joinRoom = () => {
      if(userName.trim() !== '' && roomId.trim() !== ''){
        socket.emit("join_room",roomId)
        setentered(true)
      }

  }


  
  const handleEnterKeyPress = (e:React.KeyboardEvent<HTMLInputElement>) => {
    if(e.key === "Enter"){
      joinRoom();
    }
  }

  

  return (
    <>
    <div className=' w-full h-screen bg-slate-200 flex flex-col items-center justify-center '>
      {!entered ? (
        <div className='w-[60%] max-w-96 h-fit  flex flex-col gap-2 p-4 rounded-md '>
            <input type="text" value={userName}  placeholder='John...'
            className='  rounded-md p-1 px-2 outline-none shadow-md' onChange={e => setUserName(e.target.value)}/>
            <input type="text" name="" value={roomId} placeholder='Room Id...'  className=' rounded-md p-1 px-2 outline-none shadow-md' 
              onChange={e => setRoomId(e.target.value)} onKeyDown={(e) => handleEnterKeyPress(e)}/>
            <button className= " bg-blue-500 rounded-lg px-2 py-1 shadow-md text-white" onClick={joinRoom}>Join room</button>
        </div>
        )
      :
      (<ChatBox socket={socket} userName={userName} roomId={roomId} />)}

    </div>
 
    </>
  )
}

export default App
