import React from 'react';
import {FaTimes,FaPlus,FaCheck,FaChevronDown,FaChevronUp} from 'react-icons/fa';
import axios from 'axios';

function UserTaskCard(props){

    const [addDependency,setAddDependency] = React.useState(false)
    const [suggestedModules,setSugestedModules] = React.useState(['No Modules'])
    const [dependency,setDependency] = React.useState([])
    const [showDependency,setShowDependency] = React.useState(false)
    const [GetDependency,setGetDependency] = React.useState([])
    const [loading,setLoading] =React.useState(true)

    React.useEffect( ()=>{
        setGetDependency([])
       try{
        if(dependency.length <1){
            document.getElementById('Showdependecy'+props.items.module_name).classList.add('hidden')
        }
       }catch(e){
        console.log(e)
       
       }
        async function getModules(){
            try{
                let response = await axios.get(`http://localhost:3000/getModules/${props.currentProject._id}`)
                let modules = response.data.filter(ele=>{
                    if(props.items.module_name !== ele){
                        return true
                    }
                    return false
                })
                if(modules.length < 1){
                    setShowDependency(prev=>['No Modules'])
                }
                else{
                    setSugestedModules(prev=>[...modules])
                }
                
               
            }catch(e){
                console.log('error in getting the modules ',e)
                alert('error occured...try again')
            }   
        }
        async function getDependency(){
            let userId = JSON.parse(localStorage.getItem('userData')).id
            try{
                let response = await axios.get(`http://localhost:3000/getDependency/${userId}/${props.currentProject._id}/${props.items.module_name}`)
                setGetDependency(prev=>[...prev,response.data].flat())
            }catch(e){
                console.log('Error in getting the previous dependency',e)
                alert('error occured...try again')
            }
        }
      
        try{
            getModules()
            getDependency()
            setLoading(false)
           
        }catch(e){
            console.log(e)
           setLoading(true)
       }
    },[addDependency])

    function toggleDependency(){
        setAddDependency(prev=>!prev)
    }

    async function saveDependencyToDataBase(){
        toggleDependency()
        setAddDependency(false)
        let Dependency = dependency
        setDependency([])
        let userID = JSON.parse(localStorage.getItem('userData')).id
        
        dependency.forEach(async ele=>{
            try{
                let data = {
                    'dependency':ele,
                    module_name:props.items.module_name,
                    _id:props.currentProject._id,
                    status:props.items.status
                }
                let response = await axios.post(`http://localhost:3000/users/${userID}/addDependency`,data)
            }catch(e){
                console.log('Error in adding dependency',e)
                alert('error occured...try again')
            }
        })
    }

    function toggleShowdependency(){
        setShowDependency(prev=>!prev)
    }
    function onAdditionOfDependency(e){
        document.getElementById('moduleSugg').classList.add('hidden')
        document.getElementById('depenInp').value = ''
        if(!dependency.includes(e.target.innerText)){
            setDependency(prev=>[...prev,e.target.innerText])
        }
        
    }

    function removeDependency(e){
        let {id} = e.target
        setDependency(prev=>{
            let newELe =  prev.filter(ele=>{
                if(ele===id){
                    return false
                }else{
                    return true
                }
            })
            if(newELe.length <1){
                document.getElementById('Showdependecy'+props.items.module_name).classList.add('hidden')
                setAddDependency(false)
            }
            return newELe
        })
        document.getElementById('depenInp').value = ''
    }

    function setPositionOfSuggestion(e){
        let offsetX = e.target.offsetLeft
        let offsetTop =  e.target.offsetTop
       // document.getElementById('Showdependecy').style.left = `${offsetX}px`
      //  document.getElementById('Showdependecy').style.top = `${offsetTop}px`
    }

    async function markAsDead(e){
        let module_name = props.items.module_name
        let ProjectId = props.items._id
        let email = JSON.parse(localStorage.getItem('userData')).email[0]
        try{

            let response = await axios.post(`http://localhost:3000/markAsRead/${ProjectId}`,{module_name:module_name,member_name:email})
            alert(response.data)
        }catch(e){  
            console.log('error occured in savinng the task ')
            alert('error occured...try again')
        }
       
    }
    
    let depenElements = (
        <div style={{width:'60%'}} className={`  mx-auto`}>
    <div className={` w-full`}>
    <table border={2} className={`w-full m-5 text-center border ${props.mode==='light'?'border-slate-800 ':'border-slate-200'}`}>
        <thead>                                
            <tr className={`border ${props.mode==='light'?'border-slate-800 text-slate-800':'text-slate-200 border-slate-200'}`}>
            <th className={`border ${props.mode==='light'?'border-slate-800 text-slate-800':'text-slate-200 border-slate-200'}`}>NO.</th>
            <th className={`border ${props.mode==='light'?'border-slate-800 text-slate-800':'text-slate-200 border-slate-200'}`}>Dependent Module Name</th>
            <th className={`border ${props.mode==='light'?'border-slate-800 text-slate-800':'text-slate-200 border-slate-200'}`}>Status</th>
            </tr>
        </thead>
        <tbody className={`border ${props.mode==='light'?'border-slate-800 text-slate-800':'text-slate-200 border-slate-200'}`}>
        
        {
            GetDependency.length < 1 ? <tr key={'random'} className={`border ${props.mode==='light'?'border-slate-800 text-slate-800':'text-slate-200 border-slate-200'}`}>
                <td></td>
                <td className={`border ${props.mode==='light'?'border-slate-800 text-slate-800':'text-slate-200 border-slate-200'} text-center`}>No Dependency</td>
                <td></td>
            </tr>: GetDependency.map((ele,index)=>{
                return (<tr key={ele.dependency} className={`border ${props.mode==='light'?'border-slate-800 text-slate-800':'text-slate-200 border-slate-200'}`}>
                    <td className={`border ${props.mode==='light'?'border-slate-800 text-slate-800':'text-slate-200 border-slate-200'}`}>{index+1}</td>
                    <td className={`border ${props.mode==='light'?'border-slate-800 text-slate-800':'text-slate-200 border-slate-200'}`}>{ele.dependency}</td>
                    <td className={`border ${props.mode==='light'?'border-slate-800 text-slate-800':'text-slate-200 border-slate-200'}`}>{ele.status}</td>
                 </tr>)
                

            })
        }
        </tbody>
    </table>

    </div>
</div>



    )

    return (
        
            loading ? <div>loading...</div>:         <div className={`flex flex-col`} onClick={()=>{ 
                try{
                    document.getElementById('moduleSugg').classList.add('hidden')

                }catch(e){
                    
                }
            }}>
            <div className={`p-2 flex flex-row mt-2 mx-1 h-20 rounded-md font-serif ${props.mode === 'light' ? 'bg-slate-200' : 'bg-slate-800'}`}>
<div onMouseEnter={()=>{document.getElementById('warnModuleName').classList.remove('hidden')}}  onMouseLeave={()=>{document.getElementById('warnModuleName').classList.add('hidden')}} style={{width:(((props.windowWidth)*0.75)/5)}} className={`flex flex-row text-wrap justify-center relative mr-5  ring-2 shadow-lg ${props.mode === 'light'?'text-slate-800' : 'text-slate-200 shadow-blue-400'}`}>
<p id='warnModuleName' className="absolute hidden -translate-y-12   bg-slate-950 text-white rounded-lg p-2"> Project Name</p>
    <span className="relative mt-5 text-wrap ">{props.items.member_name}</span></div>
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

<div onMouseEnter={()=>{document.getElementById('warnprogress').classList.remove('hidden')}}  onMouseLeave={()=>{document.getElementById('warnprogress').classList.add('hidden')}} style={{width:(((props.windowWidth)*0.75)/5)}} className={`flex flex-col  justify-center relative mr-5  ring-2 shadow-lg ${props.mode === 'light'?'text-slate-800' : 'text-slate-200 shadow-blue-400'}`}>            
<p id='warnprogress' className="absolute hidden -translate-y-12 translate-x-12  bg-slate-950 text-white rounded-lg p-2">  Dependency</p>
<div id={'Showdependecy'+props.items.module_name} style={{width:``}} className={`absolute hidden z-20 bottom-12  w-32 h-20 flex flex-col overflow-y-auto ${props.mode==='light'?'bg-slate-200 text-black':'bg-slate-800 text-white'} translate-x-4  rounded-lg ring-1`}>
<div className={`text-sm w-fit  p-0.5 rounded-lg `}>
{
dependency.map(ele=>{
    return <div className={`flex felx-row align-middle   text-wrap`}>
<div id={ele} onClick={removeDependency} className={`z-20 bg-slate-400 w-5 cursor-pointer h-5`} >
        <FaTimes
    id={ele}
    className={` cursor-pointer relative top-0.5 ml-1`}
    onClick={removeDependency}
    />
</div>
    <div className={`relative bottom-0.5 p-0.5 mx-1`}>{ele}</div>
    </div>
})
}
</div>
</div>
<div className={`  `}>

{
    addDependency?
    <div>
    <div className={`my-auto flex flex-row justify-evenly`}>
    <input id = 'depenInp' onClick={setPositionOfSuggestion} onKeyUp={(e)=>{
        document.getElementById('moduleSugg').classList.remove('hidden')}}  
        onFocus={()=>{document.getElementById('Showdependecy'+props.items.module_name).classList.remove('hidden')}}
        type='textbox' className={`mx-2 h-5 ring-1 z-10 w-32 rounded-md ${props.mode === 'light' ?'bg-slate-200 text-slate-800':'bg-slate-900 text-slate-200'} `} >
   
    </input>
    <FaCheck
        className={`mx-2 cursor-pointer`}
        color={props.mode === 'light' ?'black':'white'}
        onClick={saveDependencyToDataBase}
    />

 </div> 
 <div id='moduleSugg' className={` z-20 flex flex-col text-center absolute top-12 left-5 hidden`}>
    {
        suggestedModules.map((ele,index)=>{
        return <div 
        className={`w-32  ${props.mode === 'light' ?' bg-green-200 text-slate-800':' bg-blue-300 text-slate-900'} my-0.5 cursor-pointer h-6 rounded-md overflow-hidden`}
        onClick={onAdditionOfDependency}
            >
            {ele}
        </div>
    })
}
</div>
 </div>
 : <div onClick={toggleDependency} className={`flex flex-row relative justify-evenly my-auto top-1 `}>
 <FaPlus
  color={props.mode === 'light' ?'black':'white'}
  />
    <button type='submit' className={`relative bottom-1 ${props.mode === 'light' ?'bg-slate-200 text-slate-800':'bg-slate-800 text-slate-200'}`}> <span className={`m-2`}>Add Dependency</span></button>
 </div>

}

</div>

</div>


<div onMouseEnter={()=>{document.getElementById('warnStatus').classList.remove('hidden')}}  onMouseLeave={()=>{document.getElementById('warnStatus').classList.add('hidden')}} style={{width:(((props.windowWidth)*0.75)/5)}} className={`flex flex-row justify-center relative mr-5  ring-2 shadow-lg ${props.mode === 'light'?'text-slate-800' : 'text-slate-200 shadow-blue-400'}`}>
<p id='warnStatus' className="absolute hidden -translate-y-12   bg-slate-950 text-white rounded-lg p-2">  Status</p>
<span className="relative mt-5">{props.items.status}</span></div>

<div title='Not Fully Developed' style={{width:(((props.windowWidth)*0.75)/5)}} className={`flex flex-row justify-center relative mr-5  ring-2 shadow-lg ${props.mode === 'light'?'text-slate-800' : 'text-slate-200 shadow-blue-400'}`}>
    <button className={`cursor-pointer`}   type='submit'><a href='/editor' target='_blank' onClick={async (e)=>{
        await localStorage.setItem('currentModule',JSON.stringify(props.items))
    }}>Go To Module</a></button>
</div>

<div id={props.id}  className={` cursor-pointer  w-10 `} >
<button title='mark As done' onClick={markAsDead}  id={props.id} type='submit' className="relative top-3 w-10 h-10 hover:bg-slate-400">
<FaCheck
className={` cursor-pointer relative left-3 `}
id={props.id}

color={props.mode === 'light' ?'black':'white'}
/>
</button>
</div>
</div>


<div className={`w-10 h-10 mx-auto mt-5`} onClick={toggleShowdependency}>
    {
        showDependency?<FaChevronUp
        size={20}
        color={`${props.mode === 'light'?'black':'white'}`}
        className={` cursor-pointer`}
    /> :     <FaChevronDown
    size={20}
    color={`${props.mode === 'light'?'black':'white'}`}
    className={` cursor-pointer`}
/>
    }
</div>
{
    showDependency?depenElements:<div></div>
}
</div>
        
    )
}

function TaskTab(props){

    const [windowWidth,setWindowWidth] = React.useState(window.innerWidth)
    const[tasks,setTasks] = React.useState([])
    const [loading,setLoading] = React.useState(true)
    let taskId = 0

    window.addEventListener('change',(e)=>{
        setWindowWidth(window.innerWidth)
    })
    async function getTasks(){
        let id = JSON.parse(localStorage.getItem('userData')).id
        try{
            let response = await axios.get(`http://localhost:3000/users/tasks/${id}`)
           setTasks(response.data.tasks[0])
           setLoading(false)

        }catch(e){
            console.log('Error in getting tasks of the user ',e)
            setLoading(true)
        }
    }

    React.useEffect(()=>{
        getTasks()
    },[props])

    return(
        <div style={{width:windowWidth*0.75}} className={` `}>
            {
                loading ?<div className={`${props.mode === 'light' ? 'text-slate-900' :'text-slate-200'}`}>Loading...</div>:tasks ===null?<div> No Tasks </div>: tasks.map(ele=>{
                    return <UserTaskCard
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
            }
        </div>
    )
}

export {TaskTab}