import React from "react";
import axios from "axios";
import { FaStar } from "react-icons/fa";

function HomeProfile(props) {
	let pic = JSON.parse(localStorage.getItem("userData")).photos[0].value;
	let user = JSON.parse(localStorage.getItem("userData"));
	async function getRating() {
		let userData = JSON.parse(localStorage.getItem("userData"));
		let response = await axios.get(
			`http://localhost:3000/getRating/${userData.email[0]}`
		);
		let rating = (await response).data.rating;
		let newData = { ...userData, rating: rating };
		localStorage.setItem("userData", JSON.stringify(newData));
	}
	getRating();
	user = JSON.parse(localStorage.getItem("userData"));
	return (
		<div>
			<div
				className={`${
					props.mode === "light" ? "shadow-slate-900" : "shadow-blue-300"
				} w-full relative h-96 flex flex-row border-t-2 border p-3 shadow-xl rounded-xl top-5`}>
				<div
					style={{ width: "20rem", height: "20rem" }}
					className={`m-5  flex flex-row bg-red-200 w-96 h-96 rounded-full`}>
					<img alt="profile-pic" src={pic} className={`rounded-full`}></img>
				</div>
				<div
					className={`my-auto mx-5 ${
						props.mode === "light" ? "text-slate-950" : "text-slate-200 "
					}`}>
					<div className={`flex flex-col`}>
						<span className={`text-2xl font-bold`}>{user.displayName}</span>
						<span className={`my-5 text-md font-thin`}>{user.email[0]}</span>
						<div className={`flex flex-row mx-auto`}>
							<span className={` text-md font-bold`}>{user.rating}</span>
							<FaStar
								color={`${props.mode === "light" ? "black" : "white"}`}
								className={`relative mt-0.5 mx-1`}
							/>
						</div>
						<button 
                        type="submit" 
                        className={`w-44 relative top-10 h-10 rounded-xl font-extrabold text-center cursor-pointer ${props.mode === 'light' ? 'bg-blue-400 text-white':'bg-cyan-200 text-green-900'}`}
                        onClick={(e)=>{
                            localStorage.removeItem('userData')
                            props.auth(false)
                        }}
                        >
							LogOut
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export { HomeProfile };
