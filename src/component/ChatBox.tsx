import { useEffect, useRef, useState } from 'react'

import ScrollToBottom from 'react-scroll-to-bottom'

type props = {
    socket: any,
    userName: string,
    roomId: any
}

type messageListType = {
    roomId: string,
    author:string,
    message: string,
    time: string
}




function ChatBox({socket,userName,roomId}:props) {

    const [messageList , setMessageList] = useState<messageListType[]>([])
    const [message , setMessage] = useState('')

    const messageEndRef = useRef<HTMLDivElement>(null);


    useEffect(()=>{
        socket.on('rc_message',(data:any)=>{
            console.log(data)
          setMessageList((prev) => [...prev , data])
        })
    
        return () => {
          socket.off('rc_message')
        };
        
      },[socket])


      useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, [messageList]);



      const sendMessage = async() => {

        if(message.trim() !== ''){

          const data = {
            roomId: roomId,
            author: userName,
            message : message,
            time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes()
          }  
          await socket.emit('message', data)
          setMessageList((prev) => [...prev , data])
          setMessage('')
        }
      }

      const handleEnterKeyPress = (e:React.KeyboardEvent<HTMLInputElement>) => {
        if(e.key === "Enter"){
            sendMessage();
        }
      }
    
  return (
    <>  
    
        <div className='w-[60%] max-w-96  border-[2px] border-gray-400'>
            <div className=' bg-slate-700 w-full text-center text-white py-1'>
                LiveChat
            </div>
            <div className='w-full h-96 overflow-y-scroll custom-scrollbar '>
                {messageList.length > 0 && 
                messageList.map((data:any) => (
                    <div className={`w-full flex ${data.author === userName ? ' justify-end' : ' justify-start'}`}>
                        <div className={` w-fit pb-1 h-fit text-white flex flex-col m-1 rounded-md pl-2 pr-1 overflow-x-scroll
                            ${data.author === userName ? ' bg-green-400 ' : ' bg-blue-400'}`} >
                                
                            <span className='text-xs text-gray-700 -ml-1 font-semibold'>~{data.author}</span>

                            <div className=' flex gap-2'>
                                <span className={` max-w-44 `}>{data.message}</span>
                                <div className=' w-fit h-1em font-semibold flex gap-1 text-gray-700 text-xs items-end '>
                                    <span>{data.time}</span>
                                </div>
                            </div>
                            
                        </div>
                        
                    </div>
                 
                ))
                }

                <div ref={messageEndRef} />
            </div>

            <div  className='w-full h-fit flex  gap-2 p-1 '>
     
                <textarea value={message} placeholder='type...' className=' w-[85%] h-8 rounded-sm px-3 py-1 outline-none ' onChange={e => setMessage(e.target.value)} onKeyDown={(e:any) => handleEnterKeyPress(e)}/>
                <button className=' bg-green-400 py-1 px-2 rounded-sm text-white' onClick={sendMessage}>send</button>
            </div>

       </div>
    
    </>
  )
}

export default ChatBox
