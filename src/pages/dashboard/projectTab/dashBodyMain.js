import React from "react";
import axios from 'axios';
import {FaHome,FaTimes} from 'react-icons/fa'
import { DashBody } from "../dashBody";
import '../dash.css';


 function Projectcard(props){

    const [image,setImage] = React.useState(props.mode==='light'?'./images/logoBl.png':'./images/logoWh.png')
    
    const fileButtonRef = React.useRef(null)
    async function getImage(){
        try{
            let response = await axios.get(`http://localhost:3000/projects/getImg/${props.items._id}`)
            setImage(response.data.image)
        }catch(e){
            console.log("errror in getting the image", e)
            alert('error in getting the image')
        }
    }
    React.useEffect(
        ()=>{
            
            getImage()
        }
    )
    async function uploadFile(e){  

        let file = e.target.files[0]
        if(!file) return 
        const formData = new FormData()
        formData.append('file',file)
        
        try{
            let response = await axios.post('http://localhost:3000/projects/upload/'+props.items._id,formData,{
                headers:{
                    'Content-Type': 'multipart/form-data',
                },
            })
            alert(response.data.message)
            await getImage()

        }catch(e){
            console.log('Error in uploading the data',e)
            alert('error')
        }

    }

    function handleDiv(e){
        fileButtonRef.current.click()
    }

    async function changeToTask(){
        let user = JSON.parse(localStorage.getItem('userData')).email[0]
        if(props.items.status === 'Completed' && props.items.admin !== user){
            return
        }
        else{
            props.setCurrentProject({...props.items})
            props.render('Tasks')
        }
    }

    async function removeProject(){
        let project_id = props.items._id
        alert(project_id)
        try{
            let response = await axios.get('http://localhost:3000/removeProject/'+project_id)
            alert('deleted')
        }catch(e){
            alert('error in deleting')
        }
    }
    
    let img = props.mode==='light'? props.items.img?props.items.img:'./images/logoBl.png':'./images/logoWh.png'
    
    return(
        <div id={props.items._id} className={`flex flex-col text-center w-48 h-fit m-4 ring-2 rounded-xl shadow-lg ${props.mode === 'light'? ' text-slate-800 ring-slate-950 shadow-slate-800 bg-slate-100':' text-slate-200 ring-cyan-100 shadow-cyan-100 bg-slate-800'}`}>

            <div onClick={handleDiv}  className={` z-20 absolute w-48 h-36 `}>
            <input onChange={uploadFile} type="file" ref={fileButtonRef} id={props.items._id+'-img'} className=" absolute hidden"></input>
            </div>
            <div  >
            <img title="Not Full Developed" src={image} alt = 'project img' className={` relative w-48 h-36 px-2  my-2 rounded-3xl`}></img>
            </div>
        <div id='name-con' onClick={changeToTask} className={` cursor-pointer my-2 flex flex-col`}>
            <span className={`font-bold my-1 `}>{props.items.project_name}</span>
            <span className="mb-3 font-thin "> {props.items.grp_name}</span>
           
        </div>

        </div>
    )
   
}

function DashBodyMain(props){
    const [RenderBodyMain,setRenderBodyMain] = React.useState(false)
    const [projectsOverview,setprojectsOverview] = React.useState([])
    const [loading,setLoading] = React.useState(true)
    const [windowWidth,setWindWidth] = React.useState(window.innerWidth)

    let userData = JSON.parse(localStorage.getItem('userData'))
    let ProjectCards = []
    let content = ''

window.addEventListener('change',()=>{
    setWindWidth(window.innerWidth)
})

    React.useEffect(() => {
        async function getProjects() {
            try {
                let Projects = await axios.get(`http://localhost:3000/projects/${userData.email[0]}`);
                let data = Projects.data;
                setprojectsOverview(data.data);
                setLoading(false);
            } catch (e) {
                setRenderBodyMain(prev => !prev);
                setLoading(true);
            }
        }

        getProjects();
    }, [props]);

    let ongoingProjects = projectsOverview.filter(ele=>{
        if(ele.status === 'Ongoing'){
            return true
        }else{
            return false
        }
    })

    let completedProjects = projectsOverview.filter(ele=>{
        if(ele.status === 'Completed'){
            return true
        }else{
            return false
        }
    })

    content = (
        <div id='dashBody' style={{width:windowWidth*0.75}} className={`flex flex-col  h-screen ${props.mode === 'light' ? 'bg-slate-200' : 'bg-slate-900'}`}>
        
        <div className={` font-sans text-2xl font-bold  w-full h-10 mt-5 underline `}><span className={`mx-10 mt-2 ${props.mode === 'light' ? 'text-black':'text-white'}`}>OnGoing</span></div>
        <div id='dashbody' className="flex flex-row justify-start m-4">
           {
              ongoingProjects.length<1?<div className={`m-4 ${props.mode === 'light' ? 'text-black':'text-white'}`}> No Projects Ongoing</div>:ongoingProjects.map(project=>{
                return <Projectcard
                    key={project._id}
                    mode={props.mode}
                    items={project} 
                    render={props.render}
                    setCurrentProject = {props.setCurrentProject}
                />
                })
           }
        </div>

        <div className={` font-sans text-2xl font-bold  w-full h-10 mt-5 underline`}><span className={`mx-10 mt-2 ${props.mode === 'light' ? 'text-black':'text-white'}`}>Completed</span></div>
        <div id='dashbody' className="flex flex-row justify-start m-4">
           {
              completedProjects.length<1?<div className={`m-4 ${props.mode === 'light' ? 'text-black':'text-white'}`}> No Projects Completed</div>:completedProjects.map(project=>{
                return <Projectcard
                    key={project._id}
                    mode={props.mode}
                    items={project} 
                    render={props.render}
                    setCurrentProject = {props.setCurrentProject}
                />
                })
           }
        </div>
        </div>
    )
    return(
       loading?<div className={`${props.mode === 'light' ? 'text-black':'text-white'}`}>Loading...</div>:content
       
    )
}

export {DashBodyMain}