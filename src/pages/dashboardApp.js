import React from "react";
import {io} from 'socket.io-client';
import {DashTitle} from './dashboard/dashTitle';
import { DashBody } from "./dashboard/dashBody";
import {Dialog} from'./dashboard/newProjectDialog';
import { NavBar } from "./navbar/navbar";
import { HomeApp } from "./home/homeApp";
import { ChatApp } from "./chat/chatApp";

const RenderDash = React.createContext({})


function DashBoard(props){
    const [newProject,setNewProject] = React.useState(false)
    const [RenderDashNav,setRenderDashNav] =  React.useState(false)
    const [RenderDashVoice,setRenderDashVoice] = React.useState(false)
    const [render,setRender] = React.useState(null)
    const  socketRef = React.useRef()

    React.useEffect(()=>{
        socketRef.current = io.connect('http://localhost:3000') 
        let email = JSON.parse(localStorage.getItem('userData')).email[0]
        
        socketRef.current.emit('join-room',{room:email})

        socketRef.current.on('join-request',roomData=>{
           if(roomData.to === email){
            socketRef.current.emit('join-room',{room:roomData.room})
           }
        })

    },[RenderDashNav])

    React.useEffect(()=>{
        if(render === null){
            setRender('dashBody')
        }
    },[render])

    function getComponent(){
        switch(render){
            case 'dashBody':
                return  <DashBody
                mode={props.mode}
                render = {setRender}
                />
            case 'home':
                return <HomeApp
                mode={props.mode}
                auth={props.auth}
                render = {setRender}
                />
            case 'chat':
                return <ChatApp
                mode={props.mode}
                render = {setRender}
                socket={socketRef.current}
                />
            default:
                <div></div>
        }
    }
    function toggleNewProject(){
    setNewProject(prev=>!prev)
}

    return(
        <div id='dashboard'>
                <DashTitle mode={props.mode}
                                        items={
                                        {
                                            toggle:setNewProject
                                        }
                                        }
                                        showNav = {setRenderDashNav}
                                />
                                    <div id='dialog-new-project-con' className={`w-screen flex flex-row justify-center absolute z-20 ${newProject?'block':'hidden'}`}>
                                        <div id="dialog-new-project" style={{width:'55rem',height:'45rem'}} className={`relative rounded-2xl mt-5 ${props.mode==='light'?'bg-slate-100 ring-slate-700' : ' shadow-lg shadow-blue-400 bg-slate-800 ring-blue-400'}`}>
                                            <Dialog
                                                mode ={props.mode}
                                                render = {setRender}
                                                toggle={setNewProject}
                                            />
                                        </div>
                                    </div>

                                    <div className={`flex flex-row`}>
                                    { /* NavBar */}
                                {
                                    RenderDashNav?<div className={` h-screen ring-2 mr-1 ring-slate-200 ${props.mode === 'light' ? 'bg-slate-200':'bg-slate-800'}`}>
                                    <NavBar
                                    mode ={props.mode}
                                    render = {setRender}
                                    />
                                </div>:<div></div>
                                }
                                {/* bodyMain */}
                                <div>
                                    {
                                        getComponent()
                                    }
                                </div>
                                    </div>
        </div>
    )
}

export {DashBoard}