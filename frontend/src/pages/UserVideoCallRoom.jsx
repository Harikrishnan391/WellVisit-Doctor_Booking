import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

function UserVideoCallRoom() {
  const { roomId } = useParams();
  const user = useSelector((state) => state.patientAuthReducer.PatientInfo);

  const myMeeting = async (element) => {
    const appID = 1547747293;
    const serverSecret = "9cbfd805a91a9ddf5b516d9c3170be3c";
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
