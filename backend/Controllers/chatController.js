import ChatRoom from "../model/chatRoom.js";
import ChatMessage from "../model/chatMessage.js";

export const getRoomMessages = async (req, res) => {
  const { roomId } = req.params;
  try {
    const messages = await ChatMessage.find({ room: roomId }).sort({
      createdAt: 1,
    });

    if (messages) {
      res.status(200).json(messages);
    } else {
      res.status(404).json({ message: "No message found for the given room " });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server Error" });
  }
};

export const getRoom = async (req, res) => {
  try {
    const { doctorId, userId } = req.params;
    console.log("doctorId", doctorId);

    const room = await ChatRoom.find({
      user: userId,
      doctor: doctorId,
    }).populate({
      path: "doctor",
      select: "_id name specialization ",
    });

    if (room) {
      res.status(200).json({ message: "roomm  found", data: room });
    } else {
      res.status(400).json({ messafe: "errorFailed to fetch rooms" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating or getting chat room" });
  }
};

///// create Room ////

export const createRoom = async (req, res) => {
  try {
    const { doctorId, userId } = req.params;

    let chatRoom = await ChatRoom.findOne({
      user: userId,
      doctor: doctorId,
    });

    if (!chatRoom) {
      chatRoom = new ChatRoom({
        user: userId,
        doctor: doctorId,
        message: [],
      });
      await chatRoom.save();
    }

    const roomDetails = await ChatRoom.findOne({ _id: chatRoom._id }).populate({
      path: "doctor",
      select: "_id name specialization",
    });

    res
      .status(200)
      .json({ message: "Chat room found or created", data: roomDetails });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating or getting  chat room" });
  }
};

//// sendINg chat /////

export const sendChat = async (req, res) => {
  const { content, read } = req.body;
  console.log(read, "readddd");

  const { sender, roomId, type, Id, senderName } = req.params;
  console.log(req.params, "params");

  const newMessage = new ChatMessage({
    room: roomId,
    sender: sender,
    senderType: type,
    receiver: Id,
    content: content,
    senderName: senderName,
    read: read,
  });

  await newMessage.save();

  let chatRoom = await ChatRoom.findOne({ _id: roomId });

  if (chatRoom) {
    chatRoom.messages.push(newMessage._id);

    // Update the latestMessageTimestamp to the current time
    chatRoom.latestMessageTimestamp = newMessage.createdAt; // Assuming createdAt is the timestamp of the new message

    // Save the updated chat room

    await chatRoom.save();
  }

  await newMessage.populate([
    { path: "sender", select: "_id name email" },
    {
      path: "room",
      populate: [
        { path: "user", select: "_id name email" },
        { path: "doctor", select: "_id name email" },
      ],
    },
  ]);

  res.json(newMessage);
};

////  Get Doctor Rooms /////

export const getDoctorRooms = async (req, res) => {
  try {
    const docId = req.params.id;

    const rooms = await ChatRoom.find({ doctor: docId }).populate({
      path: "user",
      select: "_id name email",
    });

    console.log(rooms);

    if (rooms.length > 0) {
      res.status(200).json(rooms);
    } else {
      res
        .status(404)
        .json({ message: "No rooms found for the specified doctor" });
    }
  } catch (error) {
    console.error("Error fetching doctor rooms:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getNotification = async (req, res) => {
  const userId = req.userId;

  console.log(userId, "userId");

  try {
    const notification = await ChatMessage.find({
      receiver: userId,
      notificationSeen: false,
    }).sort({
      createdAt: -1,
    });

    if (notification) {
      res.status(200).json(notification);
    } else {
      res.status(404).json({ message: "No message found for the  given room" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const clearNotification = async (req, res) => {
  const userId = req.userId;
  try {
    const notificationSeen = await ChatMessage.updateMany(
      { receiver: userId },
      { $set: { notificationSeen: true } }
    );
    if (notificationSeen) {
      res.status(200).json(notificationSeen);
    } else {
      res
        .status(404)
        .json({ message: "No messages found for the given room." });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
