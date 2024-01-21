import React from 'react'
import { useParams } from 'react-router-dom'
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';

function VideoCallRoom() {
    const  {roomId}=useParams()
  const admin=localStorage.getItem('adminInfo')
     const myMeeting=async(element)=>{
      const appID=1114462933
      const serverSecret="a24df36c34f6f5e1a0800e5d95b5fa0d"
      const kitToken=ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID,
        serverSecret,
        roomId,
        Date.now().toString(),
        "WellVisit"
      )

      const zc=ZegoUIKitPrebuilt.create(kitToken)
      zc.joinRoom({
        container:element,
        sharedLinks:[{
          name:'Copy Link',
          url:`http://localhost:5173/admin/room/${roomId}`
         
        }],
        scenario:{
          mode:ZegoUIKitPrebuilt.OneONoneCall
        },
        showScreenSharingButton:false
      })
     }
  return (
    <div>
      <div className='myCallContainer'
      
      ref={myMeeting}
     
       />
    </div>
  )
}

export default VideoCallRoom