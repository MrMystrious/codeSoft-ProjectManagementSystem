import React from "react";
import ReactDOM from 'react-dom/client';
import axios from "axios";
import { IoSendSharp } from "react-icons/io5";

function Projectfrom(props){

	return(
<div className={`w-full h-fit p-2 rounded-lg  my-5 mx-1 flex flex-col `}>
		<div className={`ml-auto bg-white p-2 rounded-xl`}>
		<div id="from-title" className={`flex flex-row border-b-2 ml-auto mr-80  `}>
			<div className={`w-5 h-5 mr-4`}>
				<img alt='profile-img ' className={`w-5 h-5 rounded-2xl`} src={props.items.from.photo}></img>
			</div>
			<span className={`relative my-auto`}>{props.items.from.displayName}</span>
		</div>

		<div className={`w-full h-fit flex flex-row   `}>
		<div className={`w-80 h-fit text-wrap flex flex-row ml-auto  `}>
		<span className={`relative ml-auto w-fit h-fit `}>{props.items.message}</span>
		</div>					
		</div>
		</div>
	</div>
	)
}

function PrjectTo(props){

	return(
		<div className={`w-full h-fit p-2 rounded-lg  my-5 mx-1 flex flex-col `}>
						<div className={`bg-white w-80 p-2 rounded-xl`}>
						<div id="from-title" className={`flex flex-row border-b-2 mr-auto`}>
							<div className={`w-5 h-5 mr-4`}>
								<img alt='profile-img ' className={`w-5 h-5 rounded-2xl`} src={props.items.from.photo}></img>
							</div>
							<span className={`relative my-auto`}>{props.items.from.displayName}</span>
						</div>
	
						<div className={` h-fit flex flex-row   bg-white`}>
						<div className={`h-fit text-wrap flex flex-row  ml-auto `}>
						<span className={`relative  w-fit h-fit `}>{props.items.message}</span>
						</div>					
						</div>
						</div>
					</div>
	)
}

function PersonFrom(props){

	return(
<div className={`w-full h-fit p-2 rounded-lg  my-5 mx-1 flex flex-col `}>
					<div className={`ml-auto bg-white p-2 rounded-xl`}>
					<div id="from-title" className={`flex flex-row border-b-2 ml-auto mr-80  `}>
						<div className={`w-5 h-5 mr-4`}>
							<img alt='profile-img ' className={`w-5 h-5 rounded-2xl`} src={props.items.from.photo}></img>
						</div>
						<span className={`relative my-auto`}>{props.items.from.displayName}</span>
					</div>

					<div className={`w-full h-fit flex flex-row   `}>
					<div className={`w-80 h-fit text-wrap flex flex-row ml-auto  `}>
					<span className={`relative ml-auto w-fit h-fit `}>{props.items.message}</span>
					</div>					
					</div>
					</div>
				</div>
	)
}

function PersonTo(props){

	return(
		<div className={`w-full h-fit p-2 rounded-lg  my-5 mx-1 flex flex-col `}>
					<div className={`bg-white w-80 p-2 rounded-xl`}>
					<div id="from-title" className={`flex flex-row border-b-2 mr-auto`}>
						<div className={`w-5 h-5 mr-4`}>
							<img alt='profile-img ' className={`w-5 h-5 rounded-2xl`} src={props.items.from.photo}></img>
						</div>
						<span className={`relative my-auto`}>{props.items.from.displayName}</span>
					</div>

					<div className={` h-fit flex flex-row   bg-white`}>
					<div className={`h-fit text-wrap flex flex-row  ml-auto `}>
					<span className={`relative  w-fit h-fit `}>{props.items.message}</span>
					</div>					
					</div>
					</div>
				</div>
	)
}
function ChatBody(props) {
	const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);
	const [windowHeight, setWindowHeight] = React.useState(window.innerHeight);
	const [loading,setLoading] = React.useState(true)

	const selectedChat = React.useRef()
	/* if(props.showMessages !== null){
		document.getElementById('chatTo').value = props.showMessages
	} */
	let allprojects = props.allProjects.map(ele=>{return ele.project_name.trim()})
	const toMsg = React.useRef()
	window.addEventListener("resize", (e) => {
		setWindowWidth(e.target.innerWidth);
		setWindowHeight(e.target.innerHeight);
	});

	function getMessage(e){
		let user = JSON.parse(localStorage.getItem('userData')).email[0]
		let msg = e.target.value
		
		if(e.keyCode === 13){
			let toValue = document.getElementById('chatTo').value.trim()
		let room = toValue < user ? toValue+user  : user+toValue
		props.socket.emit('message',{
				message:msg,
				room : props.currentChat.project_name.trim() === toValue ? toValue : room,
				currentChat:props.currentChat.project_name.trim(),
				user:user,
				to:toValue,
				date:new Date()
			})

			let msgData = {
				date:new Date(),
				from:{from:user,photo:JSON.parse(localStorage.getItem('userData')).photos[0].value,displayName:JSON.parse(localStorage.getItem('userData')).displayName},
				message:msg,
				room:props.currentChat.project_name.trim() === toValue ? toValue : room,
				to:toValue
			}
			e.target.value = ''
			props.groupChats(msgData)
			
			//setRerender(prev=>!prev)
		}
			
		

	}

	async function getChats(from,to){
		let response = await axios.get(`http://localhost:3000/projects/getChat/${from}/${to}`)		
		response.data.forEach(async (chat)=>{
			let profile1 = await axios.get(`http://localhost:3000/users/getProfile/${chat.from}`)
			let profile2 = await axios.get(`http://localhost:3000/users/getProfile/${chat.to}`)		
			let from = {from:chat.from,photo:profile1.data[0].photo,displayName:profile1.data[0].displayName}
			let to = {to:chat.to,photo:profile2.data[0].photo,displayName:profile2.data[0].displayName}
			chat = {...chat,from:from,to:to}
			props.groupChats(chat)
				})
		setLoading(false)
	}

	React.useEffect(()=>{


		props.socket.on('sendMessage',async (message)=>{
			if(props.showMessages!==null){
				if(props.showMessages.trim() !== message.room.trim()){
					props.setWaitingChats(prev=>{
						let newData={...prev}
						if(!newData[message.room]){
							if(message.room === message.to){
								alert('adding to the room')
								newData[message.room] = {room:message.room,name:message.to,count:1}
							}else{
								alert('adding to the from')
								newData[message.from.from] = {room:message.room,name:message.from.from,count:1}
							}
						}else{
							if(message.room === message.to){
								newData[message.room] = {...newData[message.room],count:newData[message.room].count+1}
							}else{
								let count = newData[message.from.from].count
								newData[message.from.from] = {...newData[message.from.from],count:count+1}
							}
						
						}
						return newData
					})
				}
			}
			props.groupChats(message)
			
		})
	},[])
		
	return (
		<div
			style={{ width: windowWidth * 0.75 * 0.75 }}
			className={` rounded-2xl flex flex-col overflow-y-scroll`}>
				<div id='chat-body' style={{height:windowHeight*0.8}} className={` h-fit overflow-y-scroll`}>
					{
						
						
							(props.showMessages === null ||(!props.allMessages[props.showMessages])) ? <div>Loading a Chat </div>:props.allMessages[props.showMessages].map(chat=>{
								if(allprojects.includes(chat.to)){
									if(JSON.parse(localStorage.getItem('userData')).email[0] === chat.from.from){
										return(
											<Projectfrom
												items={chat}
											/>
										)
									}
									else{
										return(
											<PrjectTo
											items={chat}
											/>
										)
									}
									
								}
								else if(chat.from.from === JSON.parse(localStorage.getItem('userData')).email[0])
								{
									return(
										<PersonFrom
										items={chat}
										/>
									)
								}
								else{
									return(
										<PersonTo
										items={chat}
										/>
									)
								}
							})
						
					}
				</div>
			<div  className={` relative  bottom-0 h-20 flex flex-col align-middle`}>
						{
							Object.keys(props.currentChat).length < 1 ? <div></div> : <div className={`w-full flex flex-row justify-end`}>
								<div className={`mx-10 cursor-pointer  mb-10 w-fit ring-2 shadow-lg rounded-lg ${props.mode === 'light' ? 'text-black bg-white shadow-slate-950':'text-white bg-black shadow-cyan-200'}`}>
							<span htmlFor='chatTo' className={`px-1 text-lg`}> Chat To : </span>
							<select 
							onChange={async (e)=>{

								if(allprojects.includes(e.target.value.trim())){
									props.setShowMessages(e.target.value.trim())
									return
								}
								else{
									let to = e.target.value
								
									let user = JSON.parse(localStorage.getItem('userData')).email[0]
								props.socket.emit('create-room',{to:to,user:user})
								await getChats(user,to)
								let room = to < user ? to+user : user+to
								await props.setShowMessages(room)
								}
							}}
							ref={selectedChat} id="chatTo" className={`text-sm rounded-md outline-none ${props.mode === 'light' ? 'bg-white text-black':'bg-black text-white'}`}>
								<option className={``} id={props.currentChat.project_name}>{props.currentChat.project_name}</option> 
								{
									props.currentChat.members.map(ele=>{
										return <option key={ele} id={ele}>{ele}</option>
									})
								}
							</select>
							</div>
						</div>
						}
				<div
					className={`w-full flex flex-row justify-center relative bottom-0`}>
					<input
						onKeyUp={getMessage}
						type="textbox"
						style={{ width: "80%" }}
						className={` h-10 border-1 outline-none rounded-l-xl  p-2 text-left   ${
							props.mode === "light"
								? "text-black bg-slate-100 placeholder-slate-950"
								: "text-cyan-200 bg-black placeholder-slate-200"
						} place-content-start `}
						placeholder="Message"></input>
					<div
						className={`h-10 ${
							props.mode === "light" ? "bg-slate-100" : "bg-black"
						} rounded-r-xl`}>
						<IoSendSharp
							className={`ml-3 mr-2 `}
							color={`${props.mode === "light" ? "black" : "white"}`}
							size={40}
						/>
					</div>
			
					<div
						className={` px-4 rounded-lg z-20 text-sm text-nowrap absolute  bottom-20  ${
							props.mode === "light"
								? "bg-white text-black"
								: "bg-black text-white"
						} `}>
						<span>{props.showMessages}</span>
					</div>
				</div>
			</div>
		</div>
	);
}

export { ChatBody };
