import React from "react";
import {Tasks} from './adminTab';
import { TaskTab } from "./taskTab";
import {FaArrowCircleLeft} from 'react-icons/fa'

function MainTasks(props){
     

    const[windowSize,setWindowSize] = React.useState(window.innerWidth)
    const [toRender,setToRender] = React.useState('Task Tab')
    let tabs = ['Admin Tab' , 'Task Tab']
    window.addEventListener('change',(e)=>{
        setWindowSize(window.innerWidth)
    })

    function changeTab(e){
        let {id} = e.target

        setToRender(id)
    }

    React.useEffect(()=>{
        document.getElementById(toRender).style.opacity = 1
        tabs.forEach(ele=>{
            if(toRender !== ele){
                document.getElementById(ele).style.opacity = 0.5
            }
        })
    },[toRender])

    let isAdminTab = (
            JSON.parse(localStorage.getItem('userData')).email.includes(props.currentProject.admin)?<Tasks mode ={props.mode} render={props.render} setpreviousComp={props.setpreviousComp} previousComp = {props.previousComp} currentProject = {props.currentProject}/>:<div>There are no projects</div>
        
    )
    function navBack(){
        document.getElementById('NavBack').classList.add('opacity-10')
        let prev = props.previousComp
        let las = prev.pop()
        las = prev.pop()
        props.setpreviousComp(prev)
        props.render(las)
    }
    return(
        <div className={`${props.mode==='light'?'bg-slate-200':'bg-slate-800'}`}>
            <div id='NavBack'  className={`h-7 p-1.5 ${props.mode === 'light' ?'bg-slate-200':'bg-slate-800'}`}>
                <div onClick={navBack}  id='NavBack-con' className={`w-10 ml-5`}>
                    <FaArrowCircleLeft
                    color={props.mode === 'light' ?'black':'white'}
                    size={20}
                    />
                </div>
            </div>
            <div style={{width:windowSize*0.75}} className={`h-10 ${props.mode==='light'?'bg-slate-200':'bg-slate-800'}  `}>
                <div style={{width:windowSize*0.60}} className={`flex flex-row justify-around h-8 mx-auto relative top-1 rounded-lg ${props.mode==='light'?'bg-slate-200':'bg-slate-800'}`}>
                    {
                        tabs.map(name=>{
                            return <div id={name} onClick={changeTab} className={` cursor-pointer font-mono text-center mx-5 w-52 border-black shadow-md border-t border-l border-r rounded-md ${props.mode==='light'?' bg-gradient-to-b from-slate-100 to-slate-300':' shadow-blue-300 bg-gradient-to-b from-blue-300 to-slate-300'} `}>
                                        <span id={name} className={`relative top-1`}>{name}</span>
                                    </div> 
                        })
                    }
                </div>
            </div>
               { toRender==='Admin Tab'?isAdminTab
                                    :<TaskTab mode ={props.mode} render={props.render} setpreviousComp={props.setpreviousComp} previousComp = {props.previousComp} currentProject = {props.currentProject}/>
                }
        </div>
    )
}

export {MainTasks}