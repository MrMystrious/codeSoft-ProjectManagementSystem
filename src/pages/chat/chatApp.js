import React from "react";
import axios from "axios";
import "./chat.css";
import { SideBarChat } from "./sideBarChat";
import { ChatBody } from "./chatBody";

function ChatApp(props) {
	const [windowSize, setWindowSize] = React.useState(window.innerWidth);
	const [currentChat, setCurrentChat] = React.useState({});
	const [allRooms,setAllRooms] =React.useState(null)
	const [allProjects, setAllProjects] = React.useState([]);
	const [allMessages,setAllMessages] = React.useState({})
	const [showMessages,setShowMessages] = React.useState(null)
	const [waitingChats,setWaitingChats] = React.useState({})

	let photo = JSON.parse(localStorage.getItem("userData")).photos[0].value;
	window.addEventListener("resize", (e) => {
		setWindowSize(window.innerWidth);
	});

	function groupChats(chat){
		setAllMessages(prev=>{
			const newMessages = { ...prev };
			if (!newMessages[chat.room]) {
				newMessages[chat.room] = [chat];
			} else {
				newMessages[chat.room] = [...newMessages[chat.room], chat].sort((a, b) => new Date(a.date) - new Date(b.date));
			}
			return newMessages;
		})
	}



	return (
		<div
			style={{
				width: windowSize * 0.75,
				backgroundImage: `url(${photo})`,
				height: window.innerHeight,
			}}
			className={` rounded-2xl   bg-image`}>
			<div
				style={{ height: window.innerHeight }}
				className={`backgroungImage relative rounded-2xl`}>
				<div className={`ml-2 flex flex-row rounded-2xl`}>
					<SideBarChat
						currentChat={currentChat}
						setCurrentChat={setCurrentChat}
						mode={props.mode}
						socket={props.socket}
						setAllRooms={setAllRooms}
						allRooms={allRooms}
						allProjects={allProjects}
						setAllProjects={setAllProjects}
						groupChats={groupChats}
						setShowMessages={setShowMessages}
						showMessages={showMessages}
						allMessages={allMessages}
					/>

					<ChatBody
						currentChat={currentChat}
						setCurrentChat={setCurrentChat}
						mode={props.mode}
                        socket={props.socket}
						allProjects={allProjects}
						setAllProjects={setAllProjects}
						groupChats={groupChats}
						allMessages={allMessages}
						showMessages={showMessages}
						setShowMessages={setShowMessages}
						setAllMessages={setAllMessages}
						setWaitingChats={setWaitingChats}
					/>
				</div>
			</div>
		</div>
	);
}

export { ChatApp };
