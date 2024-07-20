import React from "react";
import { HomeProfile } from "./profile";
import { ProfileProject } from "./profileProject";

function HomeApp(props){
    const[windowSize,setWindowSize] = React.useState(window.innerWidth)

    window.addEventListener('change',(e)=>{
        setWindowSize(window.innerWidth)
    })

    return(
       <div className={`h-screen ${props.mode === 'light'?'bg-slate-200':'bg-slate-800'}`}>
         <div style={{width:windowSize*0.75}} className={`flex flex-col justify-items-start align-top  ${props.mode === 'light'?'bg-slate-200':'bg-slate-800'}`}>
            <HomeProfile
                mode = {props.mode}
                render = {props.render}
                auth={props.auth}
            />
            <ProfileProject
                mode = {props.mode}
                render = {props.render}
                
            />
        </div>
       </div>
    )
}

export {HomeApp}