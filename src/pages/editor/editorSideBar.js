import React from "react";
import axios from "axios";
import { FaFile, FaCaretDown, FaCaretRight ,FaMinus} from "react-icons/fa";

function Folder(props) {
	const [showFiles, setShowFiles] = React.useState(true);
	const [addNewFile, setAddNewFile] = React.useState(false);
	const [showMinus,setShowMinus] = React.useState(false)

	let currentModule = JSON.parse(localStorage.getItem("currentModule"));

	let name = props.items.name.split("/").filter((ele) => {
		if (ele !== " " && ele !== "") {
			return true;
		}
		return false;
	});
	let len = name.length;
	let folder = name[len - 1];
	let files = props.items.files.map((elem) => {
		let temp = elem.split("/").filter((ele) => {
			if (ele !== " " && ele !== "") {
				return true;
			}
			return false;
		});
		let len = temp.length;
		return temp[len - 1];
	});

	async function getFileName(e){
		let value = e.target.value
		let fileName = `${currentModule._id}/${currentModule.module_name}/${value}`
		if(e.keyCode === 13){
			if(!value.includes('.')){
				setAddNewFile(false)
				alert('still does not support folders')
				
			}
			else if(!['py','cpp','c','java','js'].includes(value.split('.')[1]))
			{
				alert('file format not supported...')
				e.target.value = ''
				setAddNewFile(false)
				return
			}
			else{
				let newFile = `${props.items.name}${value}`
				props.setFilesInOrder(prev=>{
					return {...prev,[props.items.name]:[...prev[props.items.name],fileName]}
				})
				setAddNewFile(false)
				let response = await axios.post(`http://localhost:3000/addS3Object`,{name:newFile})
			}
		}
	}

	return (
		<div
			className={` w-full h-auto flex flex-col mt-1 ${
				props.mode === "light" ? " ring-black" : "ring-white"
			}`}>
			<div
				className={`flex flex-row ring-1 justify-evenly rounded-md ${
					props.mode === "light" ? " ring-black" : "ring-white"
				} pb-2`}>
				<span className={`cursor-pointer`}>
					{showFiles ? (
						<FaCaretDown
							mode={props.mode}
							className={`relative top-1`}
							onClick={() => {
								setShowFiles((prev) => !prev);
								setAddNewFile(false);
							}}
						/>
					) : (
						<FaCaretRight
							mode={props.mode}
							className={`relative top-1`}
							onClick={() => {
								setShowFiles((prev) => !prev);
								setAddNewFile(false);
							}}
						/>
					)}
				</span>
				<span
					className={`font-extrabold relative text-md  ${
						props.mode === "light" ? " ring-black" : "ring-white"
					}`}>
					{folder}
				</span>
				<span className={`relative top-2 cursor-pointer`}>
					<FaFile
						size={10}
						onClick={() => {
							setAddNewFile(true);
						}}
					/>
				</span>
			</div>
			{showFiles ? (
				files.length > 0 ? (
					<div className={`flex flex-col`}>
						{files.map((file) => {
							return (
								<div id={file}
									className={`my-1  rounded-md font-sans font-medium text-sm flex flex-rows justify-between cursor-pointer ring-1 ${
										props.mode === "light" ? " ring-black" : "ring-white"
									} ${props.currentFile === file ? 'opacity-50':'opacity-100'}
									`}
									onMouseEnter={(e)=>{
										document.getElementsByName(file)[0].classList.remove('hidden')
									}}
									onMouseLeave={(e)=>{
										document.getElementsByName(file)[0].classList.add('hidden')
									}}
									>
									<span className={`ml-8`} id={file}
									
									onClick={()=>{
										props.setCurrentFile(file)
									}}>{file}</span>
									<FaMinus
										className={`mr-5 hidden mt-1`}
										name={`${file}`}
										onClick={()=>{
											props.removeFile(file)
										}}
									/>
								</div>
							);
						})}
						{addNewFile ? (
							<div className="p-1">
								<input
									type="text"
									placeholder="  File Name"
									className={`${
										props.mode === "light"
											? "bg-slate-800 text-white"
											: "text-black bg-slate-200"
									} px-2  w-full  rounded-md outline-dotted`}
									onKeyUp={getFileName}
								/>
							</div>
						) : (
							<div />
						)}
					</div>
				) : (
					<div className={`text-center`}>No Files</div>
				)
			) : (
				<div></div>
			)}
		</div>
	);
}
function EditorSideBar(props) {
	const [width, setWidth] = React.useState(window.innerWidth);
	const [allFilesInFolder, setAllFilesInFolder] = React.useState([]);
	const [filesInOrder, setFilesInOrder] = React.useState({});
	const [renderAgain,setRenderAgain] = React.useState(false)

	let tempFileInOrder = {};
	let tempAllFilesInFolder = [];

	let currentModule = JSON.parse(localStorage.getItem("currentModule"));
	let user = JSON.parse(localStorage.getItem("userData"));

	let module_name = currentModule.module_name;
	let projecId = currentModule._id;
	let folderName = `${projecId}/${module_name}/`;


	async function removeFile(file){
		let key = `${projecId}/${module_name}/${file}`
		try{
			let response = await axios.post(`http://localhost:3000/removeS3Object`,{key:key})
			alert(response.data.res)
			setFilesInOrder(prev=>{
				let temp = prev[folderName].filter(ele=>{
					if(ele !== `${folderName}${file}`){
						return true
					}
					else{
						return false
					}})
				return {...prev , [folderName]:prev[folderName].filter(ele=>{
					if(ele !== `${folderName}${file}`){
						return true
					}
					else{
						return false
					}
				})}
			})
			setRenderAgain(prev=>!prev) 
		}catch(e){
			console.log('error i n deleting the obkjec',e)
			alert('errror')
		}
	}
	function seperateFilesAndFolder(Key) {
		if (Key.endsWith("/")) {
			tempFileInOrder = { ...tempFileInOrder, [Key]: [] };
		} else {
			Object.keys(tempFileInOrder).forEach((folder) => {
				if (Key.startsWith(folderName)) {
					tempFileInOrder = {
						...tempFileInOrder,
						[folder]: [...tempFileInOrder[folder], Key],
					};
					return;
				}
			});
		}
	}

	async function getAndSeperate() {
		for (const { Key } of allFilesInFolder) {
			seperateFilesAndFolder(Key);
		}
		setFilesInOrder(tempFileInOrder);
	}

	React.useEffect(() => {
		async function getAllFiles() {
			try {
				let response = await axios.get(
					`http://localhost:3000/getS3Folder/${projecId}/${module_name}`
				);
				setAllFilesInFolder(response.data.contents);
			} catch (e) {
				console.log("Error in getting the fgiles ", e);
				alert('error occured...try again')
			}
		}

		new Promise((resolve, reject) => {
			getAllFiles();
			resolve();
		}).then(() => {}, []);
	},[projecId,module_name]);

	React.useEffect(() => {
		if (allFilesInFolder.length > 0) {
			getAndSeperate();
		} 
	}, [allFilesInFolder]);


	window.addEventListener("resize", (e) => {
		setWidth(e.target.innerWidth);
	});

	return (
		<div
			style={{ width: width * 0.1 }}
			className={`h-screen border-2 rounded-xl ${
				props.mode === "light" ? "bg-white" : "bg-grey-900"
			} `}>
			<div
				className={`flex flex-col ${
					props.mode === "light"
						? "bg-white text-black"
						: "bg-grey-900 text-white"
				}`}>
				{Object.keys(filesInOrder).map((folder) => {
					return (
						<Folder
							key={folder}
							mode={props.mode}
							items={{ name: folder, files: filesInOrder[folder] }}
							width={width * 0.1}
							setFilesInOrder={setFilesInOrder}
							setCurrentFile={props.setCurrentFile}
							removeFile={removeFile}
							currentFile={props.currentFile}
						/>
					);
				})}
			</div>
		</div>
	);
}

export { EditorSideBar };
