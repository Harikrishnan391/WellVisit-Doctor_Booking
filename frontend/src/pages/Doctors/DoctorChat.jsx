import React, { useState, useEffect, useCallback } from "react";
import io from "socket.io-client";
import { BASE_URL, docToken } from "../../config";
import { toast } from "react-toastify";
import Error from "../../components/About/Error";
import { IoCheckmark } from "react-icons/io5";
import { RiCheckDoubleFill } from "react-icons/ri";

const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;
const DoctorChat = () => {
  const [error, setError] = useState("");
  const [rooms, setRooms] = useState("");
  const [chats, setChats] = useState([]);
  const [chatId, setChatId] = useState("");
  const [patient, setPatient] = useState("");
  const [content, setContent] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [messageSent, setMessageSent] = useState(false);
  const [readStatus, setReadStatus] = useState({});

  const doctorInfo = JSON.parse(localStorage.getItem("doctorInfo"));

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", doctorInfo);
    socket.on("connection", () => setSocketConnected(true));
  }, []);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/doctors/get-doctor-rooms/${doctorInfo._id}`,
          {
            method: "get",
            headers: {
              Authorization: `Bearer ${docToken}`,
            },
          }
        );

        let result = await res.json();

        if (!res.ok) {
          throw new Error(result.message);
        }

        // Sort the rooms based on the latestMessageTimestamp
        const sortedRooms = result.sort((a, b) => {
          return (
            new Date(b.latestMessageTimestamp) -
            new Date(a.latestMessageTimestamp)
          );
        });

        setRooms(sortedRooms);
      } catch (error) {
        setError(error);
        console.log("error", error);
      }
    };
    fetchRoom();
  }, [doctorInfo._id]);

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/doctors/get-rooms-messages/${chatId}`,
          {
            method: "get",
            headers: {
              Authorization: `Bearer ${docToken}`,
            },
          }
        );

        let result = await res.json();

        if (!res.ok) {
          throw new Error(result.message);
        }
        setChats(result);
        setMessageSent(false);
        selectedChatCompare = chats;
        socket.emit("join_chat", chatId);
      } catch (error) {
        console.log("error", error);
      }
    };
    fetchMessage();
  }, [chatId, messageSent]);

  ////senHandler ////

  const sendHandler = async () => {
    if (content === "") {
      toast.error("Message cannot be empty");
    }

    const sendMessage = async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/doctors/sendChat/${chatId}/${doctorInfo._id}/Doctor/${patient._id}/${doctorInfo.name}`,
          {
            method: "post",
            headers: {
              Authorization: `Bearer ${docToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ content: content }),
          }
        );

        let result = await res.json();
        console.log(result);
        if (!res.ok) {
          throw new Error(result.message);
        }
        setContent("");
        setMessageSent(true);
        socket.emit("new Message", result);
      } catch (error) {
        console.log("error", error);
      }
    };
    sendMessage();
  };

  useEffect(() => {
    socket.on("message recevied", (newMessageReceived) => {
      console.log("newMessageReceived", newMessageReceived);

      if (!selectedChatCompare || chatId !== newMessageReceived.room._id) {
        //empty
      } else {
        setChats([...chats, newMessageReceived]);
      }
    });
  }, [chatId, selectedChatCompare, chats]);

  const formatChatTime = (createdAt) => {
    const date = new Date(createdAt);
    const options = { hour: "numeric", minute: "numeric", hour12: true };
    return date.toLocaleDateString("en-US", options);
  };

  //reading messages

  const markMessageAsRead = async (roomId) => {
    console.log(roomId, "rooomId");
    try {
      const res = await fetch(
        `${BASE_URL}/doctors/mark-room-message-read/${roomId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${docToken}`,
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {}
  };

  return (
    <div>
      {error && <Error errorMessage={error.message} />}
      {!error && (
        <div className="flex h-screen antialiased text-gray-800">
          <div className="flex flex-row h-full w-full overflow-x-hidden">
            <div className="flex flex-col py-8 pl-6 pr-2 w-64 bg-white flex-shrink-0">
              <div className="flex flex-row items-center justify-center h-12 w-full">
                <div className="flex items-center justify-center rounded-2xl text-indigo-700 bg-indigo-100 h-10 w-10">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    ></path>
                  </svg>
                </div>
                <div className="ml-2 font-bold text-2xl">Well-Chat</div>
              </div>

              <div className="flex flex-col mt-8">
                <div className="flex flex-row items-center justify-between text-xs">
                  <span className="font-bold">Active Conversations</span>
                </div>

                {rooms.length > 0 ? (
                  rooms.map((chat, index) => (
                    <div
                      key={index}
                      className="flex flex-col space-y-1 mt-4 -mx-2  overflow-y-auto"
                      onClick={() => {
                        setChatId((prevChatId) => chat._id);
                        setPatient((prevPatient) => chat.user);
                        markMessageAsRead(chat._id);
                      }}
                    >
                      <button className="flex flex-row items-center hover:bg-gray-100 rounded-xl p-2">
                        <div className="flex items-center justify-center h-8 w-8 bg-gray-200 rounded-full">
                          Q
                        </div>
                        <div className="ml-2 text-sm font-semibold">
                          {chat?.user?.name}
                        </div>
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col space-y-1 mt-4 -mx-2  overflow-y-auto">
                    <button className="flex flex-row items-center hover:bg-gray-100 rounded-xl p-2">
                      <div className="flex items-center justify-center h-8 w-8 bg-gray-200 rounded-full">
                        U
                      </div>
                      <div className="ml-2 text-sm font-semibold">No chats</div>
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col flex-auto h-full p-6">
              <div className="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-gray-100 h-full p-4">
                <div className="flex flex-col h-full overflow-x-auto mb-4">
                  {chatId ? (
                    chats && chats.length > 0 ? (
                      chats.map((chat, index) => (
                        <div key={index} className="flex flex-col h-full">
                          <div className="grid grid-cols-12 gap-y-2">
                            {chat.senderType === "User" ? (
                              <div className="col-start-1 col-end-8 p-3 rounded-lg">
                                <div className="flex flex-row items-center">
                                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
                                    U
                                  </div>
                                  {/* <div className="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl"> */}
                                  <div
                                    className={`relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl ${
                                      readStatus[chat._id] ? "bg-blue-100" : ""
                                    }`}
                                  >
                                    <div> {chat.content}</div>
                                    <div className="text-xs text-gray-500 mt-1">
                                      {formatChatTime(chat.createdAt)}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="col-start-6 col-end-13 p-3 rounded-lg">
                                <div className="flex items-center justify-start flex-row-reverse">
                                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
                                    Me
                                  </div>
                                  <div className="relative mr-3 text-sm bg-indigo-100 py-2 px-4 shadow rounded-xl">
                                    <div> {chat.content}</div>
                                    {chat.read ? (
                                      <RiCheckDoubleFill className="absolute ml-10 top-1 right-1 text-sm text-black-500" />
                                    ) : (
                                      <IoCheckmark className="absolute ml-10 top-1 right-1 text-lg text-black-500" />
                                    )}
                                    <div className="text-xs text-gray-500 mt-1">
                                      {formatChatTime(chat.createdAt)}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <h1>No Chats available!!</h1>
                    )
                  ) : null}
                </div>
                <div className="flex flex-row items-center h-16 rounded-xl bg-white w-full px-4">
                  <div>
                    <button className="flex items-center justify-center text-gray-400 hover:text-gray-600">
                      {/* <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                      ></path>
                    </svg> */}
                    </button>
                  </div>
                  <div className="flex-grow ml-4">
                    <div className="relative w-full">
                      <input
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        type="text"
                        className="flex w-full border rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10"
                      />
                      <button
                        // onClick={() => sendHandler()}
                        className="absolute flex items-center justify-center h-full w-12 right-0 top-0 text-gray-400 hover:text-gray-600"
                      ></button>
                    </div>
                  </div>
                  <div className="ml-4">
                    <button
                      onClick={() => sendHandler()}
                      className="flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 rounded-xl text-white px-4 py-1 flex-shrink-0"
                    >
                      <span>Send</span>
                      <span className="ml-2">
                        <svg
                          className="w-4 h-4 transform rotate-45 -mt-px"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                          ></path>
                        </svg>
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorChat;

// .sort((a, b) =>
//   a._id === chatId ? -1 : b._id === chatId ? 1 : 0
// )
