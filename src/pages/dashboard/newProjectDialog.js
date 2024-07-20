import React from "react";
import axios from 'axios';
import { IoCloseSharp } from "react-icons/io5";
function AutoSuggesion(props){

    function removeMail(e){
        let {id} = e.target 
        props.items.setMail(prev=>{
            return prev.filter(ele=>{
                    return id === (ele) ? false : true
            })
        })
    }

    function addMember(e){
        let {id} = e.target
        document.getElementById('grp_member').value = ''
        if(id !=='' && id !== ' '){
            props.items.setMember(prev=>new Set([...prev,id]))
        }
    }

    return(
        <div  id={props.items.name}  className={`w-fit h-6 m-1 cursor-pointer rounded-md flex flex-row font-bold text-sm ${props.mode ==='light'?'bg-slate-200 text-slate-950' : 'bg-slate-950 text-slate-200'}`}>
           <div onClick={removeMail} className="h-6 w-10">
           <IoCloseSharp
                className={`my-auto mx-2`}
                id={props.items.name}
                
            />
           </div>
            <span onClick={addMember} id={props.items.name}>{props.items.name}</span>
        </div>
    )
}

function SelectedMembers(props){

    function removeMember(e){

        let {id} = e.target
            props.items.setMember(prev=>{
            let ele = new Set(prev)
            ele.delete(id)
            return ele
        })
        
    }
    return(
        <div className={` cursor-pointer w-fit h-6 m-1 rounded-md flex flex-row font-bold text-sm ${props.mode ==='light'?'bg-red-100 text-slate-950' : 'bg-cyan-100 text-slate-900'}`}>
             <div onClick={removeMember}  className=" h-6 w-10">
           <IoCloseSharp
                className={`my-auto mt-1 mx-2`}
                id={props.items.name}
                
            />
           </div>
            <span>{props.items.name}</span>
        </div>
    )
}

function Dialog(props){

   const [Project,setProject] = React.useState({'members':new Set()})
   const [emails,setEmails] = React.useState([])
   const [members,setMembers] = React.useState(new Set())


    function AddToProject(e){
        let {id,value} = e.target
       
        setProject(prev=>{
            return {...prev, [id] :value}
        })
    }

    React.useEffect(()=>{
        setEmails([])
        setProject(prev=>{return {...prev, 'members': Array.from(members)}})
    },[members])

    function SetMember(e){
        if(e.keyCode === 13){
            if(document.getElementById('grp_member').value.includes('@gmail.com')){
                setMembers(prev=>{
                    let ele = new Set(prev)
                    ele.add(e.target.value)
                    return ele
                })
                setEmails([])
                document.getElementById('grp_member').value = ''
            }
        }
    }
    async function getMembers(e){
       try{
        SetMember(e)
        if(e.keyCode === 13){
        }
        let {id,value} = e.target
        if(id === 'grp_member' && value === ''){
            setEmails([])
        }
        else{
        let response = await axios.get(`http://localhost:3000/find/${value}`)
        let data = response.data
        setEmails(data)
        } 
       
       }catch(err){
        console.log(err)
       }
    }

    async function saveToDataBase(){
       try{
        setProject(prev=>{return {...prev,'status':'Ongoing','admin':JSON.parse(localStorage.getItem('userData')).email[0]}})
       }catch(e){
        console.log(e)
        alert('error occured...try again')
       }
        if(Object.keys(Project).length<6){
            alert('Fill all the forms...')
            return
        }
        let response = await axios.post(`http://localhost:3000/update/project`,Project)
        alert(response.data.message)
       try{
        document.getElementById('end_date').value=''
        document.getElementById('grp_name').value=''
        document.getElementById('project_name').value=''
        document.getElementById('start_date').value=''
        document.getElementById('grp_member').value=''
       }catch(e){
        console.log(e)
        alert('error occured...try again')
       }
        setMembers(new Set())
        setProject({members:new Set()})
        props.render('dashBody')
    }
    return(
        <div id='new-project-dialog' className="flex flex-col p-5 ">
            <div onClick={()=>{ props.toggle(prev=>!prev)}} className={`mb-3 flex flex-row justify-end`}>
                <IoCloseSharp 
                    size={20}
                    color={`${props.mode === 'light'? 'black':'white'}`}
                />
            </div>
            <div id='project-name-con' className="flex flex-row m-5 ">
            <span className={`mr-2 text-xl my-auto font-mono  ${props.mode === 'light'? 'text-black':'text-slate-200'}`} >Project Name: </span>
                <input type="textbox" id='project_name'  onKeyUp={AddToProject} style={{'width':'40rem'}} className={`h-10 ${props.mode === 'light'? 'ring-slate-800 text-slate-950':'text-slate-200 ring-slate-200 bg-slate-950'} ring-2 rounded-2xl text-center`} placeholder="NAME"></input>
            </div>
      
        <div className={`flex flex-row justify-evenly`}>

            <div className={`flex flex-row justify-items-center`}>
            <span className={`text-xl my-5 mx-3 rounded-xl ${props.mode === 'light'? 'text-black':'text-slate-200'}`}>Start date : </span>
            <input type="date" id="start_date" onChange={AddToProject} className={`h-7 my-auto ${props.mode === 'light'? 'text-slate-950 ring-slate-800':'text-slate-200 ring-slate-200 bg-slate-600'} h-10 rounded-2xl text-center`}></input>
            </div>

            <div className={`flex flex-row justify-items-center`}>
            <span className={`text-xl my-5 mx-3 ${props.mode === 'light'? 'text-black':'text-slate-200'}`}>End date : </span>
            <input type="date" id="end_date" onChange={AddToProject} className={`h-7 my-auto ${props.mode === 'light'? 'text-slate-950 ring-slate-800':'text-slate-200 ring-slate-200 bg-slate-600'} h-10 rounded-2xl text-center`}></input>
            </div>

        </div>
        <div className="mt-5 flex flex-row">
            <span className={`text-xl my-5 mx-3 ${props.mode === 'light'? 'text-black':'text-slate-200'}`}>Group Name : </span>
            <input type="textbox" id="grp_name" onKeyUp={AddToProject} placeholder="grpName" className={`h-7 my-auto ${props.mode === 'light'? 'text-slate-950 ring-slate-800':'text-slate-200 ring-slate-200 bg-slate-950'} ring-2 w-52 rounded-2xl text-center`}></input>
        </div>

        <div className="my-5 flex flex-row ">
            <span className={`text-xl mx-3 ${props.mode === 'light'? 'text-black':'text-slate-200'}`} >Add Group Member : </span>
        
                <div className="w-56  text-center h-20  ">
                <input type="textbox" id="grp_member" onKeyUp={getMembers} placeholder="grpMemeber" className={`h-7 mt-1 ${props.mode === 'light'? 'text-slate-950 ring-slate-800':'text-slate-200 ring-slate-200 bg-slate-950'} ring-2 w-56 rounded-2xl text-center`}></input>
                <div className=" absolute z-30 -translate-y-0">
                {
                     emails.map(ele=>{
                        return   <AutoSuggesion
                                        items={
                                        {
                                            name:ele,
                                            setMail:setEmails,
                                            setMember:setMembers,
                                            members:members
                                        }
                                    }
                                        mode = {props.mode}
                                />
                    })
                    
                }
                </div>
                <div style={{width:'100%'}} className={`flex flex-col overflow-y-scroll h-16`}>
                    {
                        <div style={{width:'100%'}} className="flex flex-col justify-start mt-2">{
                        members.size <1 ? <span></span> : 
                            
                                Array.from(members).map(element=>{

                                    return <SelectedMembers
                                                items={
                                                    {
                                                        name:element,
                                                        setMember:setMembers
                                                    }
                                                }
                                                mode={props.mode}
                                                />
                                })
                            }
                          
                        </div>
                        
                    }
                </div>        
            </div>
            <div onClick={saveToDataBase} className={`relative right-16 shadow-lg top-48 text-center w-32 h-10 rounded-xl font-bold ${props.mode === 'light'? 'bg-slate-400 text-black hover:bg-slate-100' : 'bg-slate-800 text-slate-200 shadow-blue-300 hover:bg-slate-500'}`}>
                <button type="submit" className={`text-center relative flex flex-row justify-center`}>
                    <span className={`my-1  ml-12`}>Done</span>
                </button>
            </div>
        </div>

        </div>
    )
}

export {Dialog}