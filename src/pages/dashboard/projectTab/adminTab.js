import React from "react";
import axios from 'axios';
import {FaArrowLeft,FaCheckDouble,FaTimes,FaStar} from 'react-icons/fa';

function TaskCard(props){
    const [rating,setRating] = React.useState(0)
    async function removeFromUser(ind){
        let userid =''
        let email = props.tasks[ind].member_name
        let module_name = props.tasks[ind].module_name
        let projectId = props.currentProject._id
       

        try{
            let response = await axios.get(`http://localhost:3000/users/email/${email}`)
            userid = response.data.id
            console.log(response.data)
        }catch(e){
            console.log('Error in getting id',e)
        }

        try{
            let response = await axios.get(`http://localhost:3000/${userid}/remove/${module_name}/${projectId}`)
            console.log(response.data)
        }catch(e){
            console.log('Error in deleting in user ',e)
        }
    }


    async function setTask(e){
        console.log(e,e.target,e.target.id)
        let ind = parseInt(e.target.id)
        if(isNaN(ind) ){
            alert('Error Occured')
            return
        }
        let newTasks = props.tasks.filter(ele=>{

            if(JSON.stringify(props.tasks[ind]) !== JSON.stringify(ele)){
                return true
            }
            else{
            return false
            }
        })
        await removeFromUser(ind)
        try{
            console.log(props.tasks[ind])
            let response = await axios.post(`http://localhost:3000/setTask/${props.currentProject._id}`,props.tasks[ind])
            await axios.get(`http://localhost:3000/removeS3Folder/${props.currentProject._id}/${props.tasks[ind].module_name}`)
            props.setTasks(newTasks)
        }catch(e){
            console.log('error in settask ',e)
        }
    }

    return(
        <div className={`p-2 flex flex-row mt-2 mx-1 h-20 rounded-md font-serif ${props.mode === 'light' ? 'bg-slate-200' : 'bg-slate-800'}`}>
            <div onMouseEnter={()=>{document.getElementById('warnModuleName').classList.remove('hidden')}}  onMouseLeave={()=>{document.getElementById('warnModuleName').classList.add('hidden')}} style={{width:(((props.windowWidth)*0.75)/5)}} className={`flex flex-row justify-center relative mr-5  ring-2 shadow-lg ${props.mode === 'light'?'text-slate-800' : 'text-slate-200 shadow-blue-400'}`}>
            <p id='warnModuleName' className="absolute hidden -translate-y-12   bg-slate-950 text-white rounded-lg p-2"> Menmber Name</p>
                <span className="relative mt-5">{props.items.member_name}</span></div>
            <div onMouseEnter={()=>{document.getElementById('warn').classList.remove('hidden')}}  onMouseLeave={()=>{document.getElementById('warn').classList.add('hidden')}} style={{width:(((props.windowWidth)*0.75)/5)}} className={`flex flex-row justify-center relative mr-5  ring-2 shadow-lg ${props.mode === 'light'?'text-slate-800' : 'text-slate-200 shadow-blue-400'}`}>
            <p id='warn' className="absolute hidden -translate-y-12   bg-slate-950 text-white rounded-lg p-2"> Module</p>
            <span className="relative mt-5">{props.items.module_name}</span>
            </div>
            <div onMouseEnter={()=>{document.getElementById('warnStartDate').classList.remove('hidden')}}  onMouseLeave={()=>{document.getElementById('warnStartDate').classList.add('hidden')}} style={{width:(((props.windowWidth)*0.75)/5)}} className={`flex flex-row justify-center relative mr-5  ring-2 shadow-lg ${props.mode === 'light'?'text-slate-800' : 'text-slate-200 shadow-blue-400'}`}>
            <p id='warnStartDate' className="absolute hidden -translate-y-12   bg-slate-950 text-white rounded-lg p-2">  Start Date</p>
            <span className="relative mt-5">{props.items.start_date}</span></div>
            <div onMouseEnter={()=>{document.getElementById('warnEndDate').classList.remove('hidden')}}  onMouseLeave={()=>{document.getElementById('warnEndDate').classList.add('hidden')}} style={{width:(((props.windowWidth)*0.75)/5)}} className={`flex flex-row justify-center relative mr-5  ring-2 shadow-lg ${props.mode === 'light'?'text-slate-800' : 'text-slate-200 shadow-blue-400'}`}> 
                       <p id='warnEndDate' className="absolute hidden -translate-y-12   bg-slate-950 text-white rounded-lg p-2">  End Date</p>
            <span className="relative mt-5">{props.items.end_date}</span></div>
            <div onMouseEnter={()=>{document.getElementById('warnprogress').classList.remove('hidden')}}  onMouseLeave={()=>{document.getElementById('warnprogress').classList.add('hidden')}} style={{width:(((props.windowWidth)*0.75)/5)}} className={`flex flex-row justify-center relative mr-5  ring-2 shadow-lg ${props.mode === 'light'?'text-slate-800' : 'text-slate-200 shadow-blue-400'}`}>            
            <p id='warnprogress' className="absolute hidden -translate-y-12   bg-slate-950 text-white rounded-lg p-2">  Progress</p>
            <div style={{width:(((props.windowWidth)*0.75)/5)}} className={` relative h-5 top-5 bg-red-200`}>
                <div style={{width: `${props.items.progress}%`}} className=" h-5  bg-green-200"></div>
            </div>
            </div>
            <div onMouseEnter={()=>{document.getElementById('warnStatus').classList.remove('hidden')}}  onMouseLeave={()=>{document.getElementById('warnStatus').classList.add('hidden')}} style={{width:(((props.windowWidth)*0.75)/5)}} className={`flex flex-row justify-center relative mr-5  ring-2 shadow-lg ${props.mode === 'light'?'text-slate-800' : 'text-slate-200 shadow-blue-400'}`}>
            <p id='warnStatus' className="absolute hidden -translate-y-12   bg-slate-950 text-white rounded-lg p-2">  Status</p>
            <span className="relative mt-5">{props.items.status}</span></div>
            <div onMouseEnter={()=>{document.getElementById('warnStatus').classList.remove('hidden')}}  onMouseLeave={()=>{document.getElementById('warnStatus').classList.add('hidden')}} style={{width:(((props.windowWidth)*0.75)/5)}} className={`flex flex-row justify-center relative mr-5  ring-2 shadow-lg ${props.mode === 'light'?'text-slate-800' : 'text-slate-200 shadow-blue-400'}`}>
            <p id='warnStatus' className="absolute hidden -translate-y-12   bg-slate-950 text-white rounded-lg p-2">Rating</p>
            <span className="relative mt-5 flex flex-row justify-evenly">
             {[1,2,3,4,5].map((id,index)=>{
                    return <div
                    onClick={async ()=>{
                        setRating(index+1)
                        let response = await axios.post('http://localhost:3000/setRating/'+props.items.member_name,{rating:index+1})
                        alert(response.data.message)
                    }}
                    id={id+'_star'} className=" cursor-pointer w-7 h-7 ">
                        <FaStar
                    className={`mx-auto relative top-1 cursor-pointer ${index < rating ? 'text-yellow-500' : 'text-black'}`}
                     key={id}
                      id={id+'_stars'}
                      
                      />
                    </div>
             })}
            </span></div>

            <div id={props.id}   className={` cursor-pointer  w-10 `} >
            <button id={props.id} onClick={setTask} type='submit' className="relative top-3 w-10 h-10 hover:bg-slate-400">
            <FaTimes
            className={` cursor-pointer relative left-3 `}
            id={props.id}
            
          color={props.mode === 'light' ?'black':'white'}
       />
            </button>
            </div>

        </div>
    )
}
function Tasks(props){
    console.log('props intasks ',props)
    const [windowWidth,setWindowWidth] = React.useState(window.innerWidth)
    const [tasks,setTasks] = React.useState([])
    const [inpData,setInpData] = React.useState({})
    const [addTask,setAddTask] = React.useState(false)
    const[click,setClick] = React.useState(0)
    const [loading,setLoading] = React.useState(true)
    const inpRef = React.useRef()
  //  const [taskId,setTaskId] = React.useState(0)
    let taskId =-1
    window.addEventListener('change',(e)=>{
        setWindowWidth(window.innerWidth)
    })

    console.log(tasks)
 
    function getData(e){
        let {id,value} = e.target
        setInpData(prev=>{return {...prev,[id]:value}})
    }

    React.useEffect( ()=>{
      async function getTasks(){
        try{
            let response = await axios.get(`http://localhost:3000/getTask/${props.currentProject._id}`)        
            console.log('tasks : ',response.data)
            setTasks(response.data) 
            setLoading(false)
        }catch(e){
            console.log('Error in getting task ',e)
            setLoading(true)
        }
      }

      getTasks()
    },[inpData])

    async function saveToDataBase(){
        setClick(prev=>prev+1)
        setInpData(prev=>{ return {...prev,status:'OnGoing',progress:'0'} })
        if(Object.keys(inpData).length < 6){
            alert('you missed some feild or you just kept the default value( Reassure it )')
            return 
        }
        else if(click>1){
            alert('stop spamming...')
            setClick(0)
            return 
        }
        else{
            try{
                let response = await axios.post(`http://localhost:3000/addTask/${props.currentProject._id}`,inpData)
                await axios.get(`http://localhost:3000/addToS3/${props.currentProject._id}/${inpData.module_name}`)
                alert(response.data)
                setClick(0)
            }catch(e){
                console.log('error in tasks...',e)
            }
        }
        
    }


    let inputDiv = (
<div>
        <div className={`p-2 flex flex-row mt-2 mx-1 h-20 rounded-md ${props.mode === 'light' ? 'bg-slate-200' : 'bg-slate-800'}`}>

        <div style={{width:((windowWidth*0.75)/5)}} className={`mr-5 flex ring-2`}>
            <select id='member_name' onClick={getData} ref={inpRef} className={` w-full h-8 my-auto ${props.mode === 'light'?'bg-slate-200 text-black font-serif':'bg-slate-800 text-white font-serif'}`}>
               {
                    props.currentProject.members.map(user=>{
                        return <option>{user}</option>
                    })
               }
            </select>
            <div className={`flex flex-col justify-between`}>
                <div className={`m-2`}>
                    <FaCheckDouble
                     color={props.mode === 'light' ?'black':'white'}
                    />
                </div>
                <div className={`m-2 `}>
                    <FaTimes
                     color={props.mode === 'light' ?'black':'white'}
                    />
                </div>
            </div>
        </div>

            <div style={{width:((windowWidth*0.75)/5)}} className={`ring-2 mr-5 flex `}>
                    <p id='warn' className="absolute hidden -translate-y-12 -translate-x-32  bg-slate-950 text-white rounded-lg p-2"> you can give gDrive Link for modules details or you can simple give module name</p>
                    <input id='module_name' onKeyUp={getData} onMouseEnter={()=>{document.getElementById('warn').classList.remove('hidden')}}  onMouseLeave={()=>{document.getElementById('warn').classList.add('hidden')}} ref={inpRef} type="textbox" className={` w-full outline-none text-center ${props.mode === 'light'?'bg-slate-200 text-black font-serif':'bg-slate-800 text-white font-serif'}`}></input>
                    <div className={`flex flex-col justify-between`}>
                        <div className={`m-2`}>
                            <FaCheckDouble
                             color={props.mode === 'light' ?'black':'white'}
                            />
                        </div>
                        <div className={`m-2 `}>
                            <FaTimes
                             color={props.mode === 'light' ?'black':'white'}
                            />
                        </div>
                    </div>
            </div>

            <div style={{width:((windowWidth*0.75)/5)}} className={`ring-2 mr-5 flex `}>
            <p id='Start_Datewarn' className="absolute -translate-y-12 translate-x-16  bg-slate-950 text-white rounded-lg p-2">Start Date</p>
                    <input id='start_date' onChange={getData} onMouseEnter={()=>{document.getElementById('Start_Datewarn').classList.remove('hidden')}}  onMouseLeave={()=>{document.getElementById('Start_Datewarn').classList.add('hidden')}}  ref={inpRef} type="date" className={` w-full outline-none text-center ${props.mode === 'light'?'bg-slate-200 text-black font-serif':'bg-slate-800 text-white font-serif'}`}></input>
                    <div className={`flex flex-col justify-between`}>
                        <div className={`m-2`}>
                            <FaCheckDouble
                             color={props.mode === 'light' ?'black':'white'}
                            />
                        </div>
                        <div className={`m-2 `}>
                            <FaTimes
                             color={props.mode === 'light' ?'black':'white'}
                            />
                        </div>
                    </div>
            </div>

            <div style={{width:((windowWidth*0.75)/5)}} className={`ring-2 mr-5 flex `}>
            <p id='End_Datewarn' className="absolute -translate-y-12 translate-x-16  bg-slate-950 text-white rounded-lg p-2">End Date</p>
                    <input id='end_date' onChange={getData} onMouseEnter={()=>{document.getElementById('End_Datewarn').classList.remove('hidden')}}  onMouseLeave={()=>{document.getElementById('End_Datewarn').classList.add('hidden')}} ref={inpRef} type="date" className={` w-full outline-none text-center ${props.mode === 'light'?'bg-slate-200 text-black font-serif':'bg-slate-800 text-white font-serif'}`}></input>
                    <div className={`flex flex-col justify-between`}>
                        <div className={`m-2`}>
                            <FaCheckDouble
                             color={props.mode === 'light' ?'black':'white'}
                            />
                        </div>
                        <div className={`m-2 `}>
                            <FaTimes
                             color={props.mode === 'light' ?'black':'white'}
                            />
                        </div>
                    </div>
            </div>

    
            
            <button type="submit" onClick={saveToDataBase} className={`ml-10 mr-5 w-16 rounded-lg m-1 h-8 my-auto bg-cyan-200 *:${props.mode === 'light'?'bg-slate-200 text-black font-serif':'bg-slate-800 text-black font-serif'}`}>Done</button>
            <FaTimes
            className={`ml-5 my-auto`}
            onClick={()=>{
                setAddTask(prev=>!prev)
            }}
          color={props.mode === 'light' ?'black':'white'}
       />
        </div>
      
</div>
    )

let elements = (
    tasks.length<1?<div></div>:tasks.map(ele=>{
        taskId =taskId+1
        return <TaskCard
            key = {taskId}
            mode = {props.mode}
            items = {ele}
            windowWidth = {windowWidth}
            id={taskId}
            tasks = {tasks}
            setTasks = {setTasks}
            currentProject = {props.currentProject}
        />
    })
)

async function markAsCompleted(e){
    let id = props.currentProject._id
    try{
        let response = await axios.get(`http://localhost:3000/projects/completed/${id}`)

        e.target.classList.add('opacity-15')
        e.target.classList.add('cursor-not-allowed')
        e.target.classList.add('pointer-events-none')
        
        alert(response.data)
    }catch(e){
        console.log('error in marking project',e)
    }
}

    return(
        <div id='taskDiv' style={{width:windowWidth*0.75}}>
                
                    {loading?<div className={`${props.mode === 'light' ? 'text-black':'text-white'}`}> Loading ... </div>:elements
                    }
                
                {addTask?inputDiv:<div className={`p-2  flex flex-row justify-evenly mt-12 mx-1 mb-10 h-10 rounded-lg bg-transparent`}>
                    {
                        props.currentProject.status === 'Completed'?<button 
                        type='submit'
                        className={`ml-20 w-28  pointer-events-none opacity-15 cursor-not-allowed rounded-lg m-1 h-8 my-auto  ${props.mode === 'light'?'bg-red-100 text-black font-serif':'bg-cyan-200  text-black font-serif'}`}>
                                Add Task
                    </button> : <button 
                        onClick={()=>{setAddTask(prev=>!prev)}}
                        type='submit'
                        className={`ml-20 w-28 rounded-lg m-1 h-8 my-auto  ${props.mode === 'light'?'bg-red-100 text-black font-serif':'bg-cyan-200  text-black font-serif'}`}>
                                Add Task
                    </button>
                    }
                    {
                        props.currentProject.status === 'Completed'?<button 
                        type='submit'
                        className={`ml-20 pointer-events-none opacity-15 cursor-not-allowed w-44 rounded-lg m-1 h-8 my-auto  ${props.mode === 'light'?'bg-red-100 text-black font-serif':'bg-cyan-200  text-black font-serif'}`}>
                                Mark As Completed
                    </button> : <button 
                        onClick={markAsCompleted}
                        type='submit'
                        className={`ml-20  w-44 rounded-lg m-1 h-8 my-auto  ${props.mode === 'light'?'bg-red-100 text-black font-serif':'bg-cyan-200  text-black font-serif'}`}>
                                Mark As Completed
                    </button>
                    }
                </div>
                
                }
        </div>
    )
}

export {Tasks}