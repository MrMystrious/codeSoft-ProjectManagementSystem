import React from "react";
import { DashBodyMain } from "./projectTab/dashBodyMain";
import { FaMandalorian } from "react-icons/fa";
import { MainTasks } from "./projectTab/Task";

function DashBody(props){
    const [render,setRender] = React.useState('dashBodyMain')
    const [previousComponents,setpreviousComponents] = React.useState([])
    const [currentProject,setCurrentProject] = React.useState(null)


        React.useEffect(()=>{
            setpreviousComponents(prev=>{
                return [...prev,render]
            })
        },[render])

    function RenderComponent(){
        switch (render){
            case 'dashBodyMain':
                return <DashBodyMain mode = {props.mode} render={setRender}  setCurrentProject={setCurrentProject}/>
            case 'Tasks':
                return <MainTasks mode ={props.mode} render={setRender} setpreviousComp={setpreviousComponents} previousComp = {previousComponents} currentProject = {currentProject} />
            default:
                return <div></div>
        }
    }


    return(
        <div id="dash-body-main" className="flex flex-row justify-start" >
            
            {
                RenderComponent()
            }
           
        </div>
    )
}

export{DashBody}