import React from "react";
import { useParams } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useSelector } from "react-redux";

function DoctorVideoCallRoom() {
  const { roomId } = useParams();
  const user = useSelector((state) => state.doctorAuthReducer.doctorInfo);
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
          url: `https://wellvisit.online/users/room/${roomId}`,
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

export default DoctorVideoCallRoom;
