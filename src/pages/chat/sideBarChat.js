import axios from "axios";
import React from "react";

function SideCard(props) {
	
	let currentEle = React.useRef()
	let previousEle = ''

	React.useEffect(()=>{
		props.socket.emit('join-room',{room:props.items.project_name.trim(),allRooms:props.allRooms})

	},[props.previousEle])


	async function getChats(name){
		if(!(props.allMessages[name.trim()])){
			let response = await axios.get(`http://localhost:3000/projects/getChat/${name.trim()}`)
		await response.data.forEach(async (chat)=>{
			let profile = await axios.get(`http://localhost:3000/users/getProfile/${chat.from}`)
			let from = {from:chat.from,photo:profile.data[0].photo,displayName:profile.data[0].displayName}
			chat = {...chat,from:from}	
			props.groupChats(chat)
				})
		}
		
	}

	return (
		<div
		ref={currentEle}
			id={props.items._id}
			onClick={async (e)=>{
				props.setCurrentChat(props.items)
				props.setAllRooms(props.items.project_name)
				await getChats(props.items.project_name)
				await props.setShowMessages(props.items.project_name.trim())
			}}
			className={`w-full mt-2 text-pretty h-fit p-1.5 ring-1 cursor-pointer rounded-xl text-center ${
				props.mode === "light"
					? "ring-slate-800 bg-slate-200 shadow-slate-800 text-black"
					: " bg-slate-800 text-white ring-slate-200 shadow-slate-200"
			}`}>
			<span id={props.items._id}  className={`font-sans`}>{props.items.project_name}</span>
		</div>
	);
}
function SideBarChat(props) {
    const [activeProject,setActiveproject] =React.useState(null)
	const [previousEle,setPreviousEle] = React.useState(null)
	const [loading,setLoading] = React.useState(true)
	

	React.useEffect(() => {

		props.socket.on('joined',message=>{
			console.log('joined ',message)
		})

		props.socket.on('left',message=>{
			console.log('left ',message)
		})


		let email = JSON.parse(localStorage.getItem("userData")).email[0];
		async function getProjects() {
			try {
				let response = await axios.get(
					`http://localhost:3000/projects/${email}`
				);
				
				props.setAllProjects(response.data.data);
				setLoading(false)
			} catch (e) {
				console.log("Error in getting chats project", e);
				alert('try again')
			}
		}
		getProjects();
	}, []);

	return (
		<div
			style={{ width: "25%" }}
			className={`h-screen overflow-y-scroll py-2 ${
				props.mode === "light"
					? "ring-slate-800 shadow-slate-800"
					: "ring-slate-200 shadow-slate-200"
			}`}>
			<div
				style={{ width: "95%" }}
				className={` font-serif sticky font-bold mx-auto rounded-lg  h-20 mb-2 flex flex-row justify-center text-3xl ${
					props.mode === "light" ? "bg-green-200" : "bg-blue-200"
				}`}>
				<span className={` my-auto`}>Chat</span>
			</div>
			<div className={`flex flex-col  `}>
				{
					loading?<div> Loading active Projects</div> : props.allProjects.map((ele) => {
						return (
							<SideCard
								setCurrentChat={props.setCurrentChat}
								key={ele._id}
								mode={props.mode}
								items={ele}
								activeProject = {activeProject}
								setActiveproject ={setActiveproject}
								previousEle={previousEle}
								setPreviousEle ={setPreviousEle}
								socket = {props.socket}
								setAllRooms = {props.setAllRooms}
								allRooms={props.allRooms}
								groupChats = {props.groupChats}
								setShowMessages={props.setShowMessages}
								allMessages={props.allMessages}
							/>
						);
					})
				}
			</div>
		</div>
	);
}

export { SideBarChat };
