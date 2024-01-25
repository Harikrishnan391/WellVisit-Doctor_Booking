import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

function UserVideoCallRoom() {
  const { roomId } = useParams();
  const user = useSelector((state) => state.patientAuthReducer.PatientInfo);
  
  const myMeeting = async (element) => {
    const appID = 1114462933;
    const serverSecret = "a24df36c34f6f5e1a0800e5d95b5fa0d";
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      roomId,
      Date.now().toString(),
      user.name
    );

    const zc = ZegoUIKitPrebuilt.create(kitToken);
    zc.joinRoom({
      container: element,
      sharedLinks: [
        {
          name: "Copy Link",
          url: `http://localhost:5173/doctors/room/${roomId}`,
        },
      ],
      scenario: {
        mode: ZegoUIKitPrebuilt.OneONoneCall,
      },
      showScreenSharingButton: false,
    });
  };
  return (
    <div>
      <div className="myCallContainer" ref={myMeeting} />
    </div>
  );
}

export default UserVideoCallRoom;
