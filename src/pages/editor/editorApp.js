import React, { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import { EditorSideBar } from "./editorSideBar";
import axios from "axios";

function EditorApp(props) {
	const [width, setWidth] = React.useState(window.innerWidth);
	const [currentFile, setCurrentFile] = React.useState(null);
	const [editorValue,setEditorValue] = React.useState('')
	const [activeCode,setActiveCode] = React.useState('')
	const [output,setOutput] = React.useState('')

	let currentModule = JSON.parse(localStorage.getItem("currentModule"));
	let user = JSON.parse(localStorage.getItem("userData"));
	let language = ''
	let language_id = null

	window.addEventListener("resize", (e) => {
		setWidth(e.target.innerWidth);
	});
	window.addEventListener("beforeunload", (e) => {
		localStorage.removeItem("currentProject");
	});

	React.useEffect(()=>{
		
		async function getData(){
			try{
				let key = `${currentModule._id}/${currentModule.module_name}/${currentFile}`
				let response = await axios.post('http://localhost:3000/getS3Object',{key:key})
				setEditorValue(response.data.data)
				setActiveCode(response.data.data)
			}catch(e){
				console.log(e)
				alert('error in gettting the data')
			}
		}
		if(currentFile!==''){
			
			getData()
		}
},[currentFile])

if(currentFile !== null && currentFile!==''){
	switch(currentFile.split('.')[1]){
		case 'py':
			language='python'
			language_id = 71
			break
		case 'js':
			language='javascript'
			language_id = 63
			break
		case 'cpp':
			language='c++'
			language_id = 54
			break
		case 'c':
			language='c'
			language_id = 50
			break
		case 'java':
			language='java'
			language_id = 62
			break
		default:
			language='pthon'
			language_id = 71
	}
}

function getValueFromEditor(value,e){
	try{
		let key = `${currentModule._id}/${currentModule.module_name}/${currentFile}`
		let content = value
		let response = axios.post('http://localhost:3000/updateS3Object',{content:content,key:key})
	}catch(e){
		console.log('error in updatig the file',e)
		alert('error in updatig the file')
	}
	setActiveCode(value)
}

async function handleRun(){
	if(activeCode === '' || language_id === null){
		alert('Please select the file')
		return 
	}
	let stdin = document.getElementById('stdin').value
	document.getElementById('output').classList.remove('bg-slate-200')
	document.getElementById('output').classList.add('bg-slate-500')
	document.getElementById('output').style.opacity = 0.2
	try{
		let response = await axios.post('http://localhost:3000/compile',{source_code:activeCode,language_id:language_id,stdin:stdin})
		setOutput(response.data.decodedOutput)
		document.getElementById('output').style.opacity = 1
		document.getElementById('output').classList.remove('bg-slate-500')
		document.getElementById('output').classList.add(`${props.mode === 'light' ? 'bg-slate-200' : 'bg-slate-950'}`)
	}catch(e){
		console.log('Eroor in sending the code ',e)
		alert('error occured')
	}
}
	return (
		<div className={`flex flex-row`}>
             <EditorSideBar
                    mode={props.mode}
					setCurrentFile={setCurrentFile}
					currentFile={currentFile}
					setActiveCode={setActiveCode}
                />
			<div
				style={{ width: width * 0.9 }}
				className={`h-screen rounded-2xl flex flex-col  border-2  ${
					props.mode === "light" ? "bg-white" : "bg-grey-800"
				} `}>
               <div className={`w-full h-10 relative flex flex-row justify-center`}>
				<button onClick={handleRun} className={`mx-auto mb-2 w-fit h-fit p-2 px-10 rounded-lg ${props.mode === 'light' ? 'bg-green-200 text-black' : 'bg-cyan-900 text-white'}`}>Run</button>
			   </div>
				<Editor
					height={"50vh"}
					width={"100%"}
					theme={`${props.mode === "light" ? "vs-light" : "vs-dark"}`}
					defaultLanguage={language}
					value={editorValue}
					onChange={getValueFromEditor}
				/>
				<div style={{width:width}} className={` h-96 flex flex-row `}>
					<div >
						<input id='stdin' placeholder="Input" type="text" className={`w-96 h-96 outline-none p-0 text-center ${props.mode === 'light' ? 'bg-white text-black ':'bg-black text-white'}`}/>
					</div>
					<div id='output' style={{width}} className={` h-96 p-2 px-5 overflow-y-auto border-2 ${props.mode ==='light' ? 'border-black bg-slate-200 text-black' : ' text-white border-white bg-slate-950'} `}>
						<span>{output?output:'output...'}</span>
					</div>
				</div>
			</div>
		</div>
	);
}

export { EditorApp };
