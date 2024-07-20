import React from "react"
import {json, useNavigate} from 'react-router-dom'
import {FaWindowClose,FaLinkedin,FaInstagram,FaMailBulk,FaPlus,FaGoogle} from 'react-icons/fa'
import axios from 'axios'


function Titlebar(props){
  
     return(
        <div className={` grid-cols-1 flex flex-row relative w-screen h-20 ${props.mode ==='light' ? "ring-slate-800 shadow-slate-800 bg-slate-200 text-slate-800": "ring-slate-200 shadow-slate-200 bg-slate-800 text-slate-200"} ml-4 mr-4 mb-4 ring 4 ring-slate-800 ring-opacity-10 rounded-xl  shadow-md`}>
            <div id='logo-con' className="relative left-5 w-16 h-16 m-2">
            <img src={props.mode === 'light' ? './images/logoBl.png' : './images/logoWh.png'}></img>
            </div>
            <span className="m-5 pl-10 font-mono text-justify text-3xl ">Project Management System</span>
           
            <div className={`mx-auto h-5 relative right-32 top-8 ring-2 rounded-full ${props.mode === 'light'?'ring-black bg-black':'ring-white bg-white'}`}>
           {
            props.showLogin ?  <FaWindowClose
            className="my-auto"
            size={20}
            color={props.mode === 'light'?'white':'black'}
            onClick={props.plusIconClick}
            /> :  <FaPlus
                    className="my-auto"
                    size={20}
                    color={props.mode === 'light'?'white':'black'}
                    onClick={props.plusIconClick}
                />
           }
            </div>

        </div>
     )
}

function LoginDiv(props){
    const routeTo = useNavigate()

    function routeToRedirect(){
        const oauthUrl = "http://localhost:3000/auth/google";
        new Promise((resolve,reject)=>{
            try{
                if(!localStorage.getItem('userData')){
                    let newWindow = window.open(oauthUrl, "_blank", "width=600,height=600");
                    resolve(0)
                }
                else{
                    /* let userData = JSON.parse(localStorage.getItem('userData'))
                    let rating = axios.get(`http://localhost:3000/getRating/${userData.email[0]}`)
                    resolve(rating) */
                    props.auth(true)
                }
                resolve()
            

            }catch(e){
                reject(e)
            }

            })
    }
    
    window.addEventListener("message",(event)=>{
        if(event.origin !== 'http://localhost:3000'){
            return
        }
        let Authenticated = event.data.Authenticated
        localStorage.setItem('userData',JSON.stringify({...event.data.userData}))
        if(Authenticated){
            props.auth(Authenticated)
        }
        else{
            routeTo('/')
        }
    })

    return(
        <div>
            <button type='button' onClick={routeToRedirect} className={`${props.mode==='light'?'bg-white':'bg-black'} flex w-48 h-10 font-sans relative rounded-xl left-1/3 top-48 ring-2 `}>
            <FaGoogle
            className="relative m-2 mt-3"
            color={props.mode === 'light'?'black':'white'}
            /> 
            <span className={props.mode==='light'?'text-black mt-1.5':'text-white mt-1.5'}>SignUp with Google</span></button>
            <button type="button" onClick={routeToRedirect} className={` ${props.mode==='light'?'bg-white':'bg-black'} flex w-48 h-10 font-sans relative rounded-xl left-1/3 top-72 ring-2 `}>
            <FaGoogle
             className="relative m-2 mt-3"
             color={props.mode === 'light'?'black':'white'}
             />
            <span className={props.mode==='light'?'text-black mt-1.5':'text-white mt-1.5'} >SignIn with Google</span></button>
        </div>
    )
}

function Body(props){
    let features=[{
        name:'Improved Productivity',
        text:' By centralizing your project management, your team can focus more on getting things done and less on managing tasks.',
        img:'impProductivity.jpg'
    },
    {
        name:'Enhanced Collaboration',
        text:'Break down silos and foster a collaborative work environment with seamless communication tools.',
        img:'EnCollab.jpg'
    }, 
    {
        name:'Better Time Management',
        text:' With time tracking and detailed analytics, you can ensure that every minute is accounted for and utilized effectively.',
        img:'BeTimeManagement.jpg'
    }, 
    {
        name:'Increased Transparency',
        text:' Keep everyone in the loop with real-time updates and progress tracking, ensuring accountability and transparency.',
        img:'IncreTrans.jpg'
    },
    {
        name:'Scalability',
        text:'Whether you’re a small team or a large enterprise, our system scales with your needs, offering the flexibility to grow.',
          img:'Scalable.jpg'
    },
    {
        name:'Dashboard Overview',
        text:'Get a bird’s-eye view of all your projects, tasks, and team activities in one place.',
          img:'Dash.jpg'
    }
]
    return(
        <div className={` relative  ml-4 mr-4 ${props.mode==='light'? " bg-gradient-to-br from-slate-300 to-green-200 ring-slate-800 shadow-slate-800 bg-slate-200 text-slate-800" : "bg-gradient-to-br from-slate-900 to-slate-600 ring-slate-200 shadow-slate-200 bg-slate-800 text-slate-200"} w-screen h-fit ring-opacity-10 rounded-xl shadow-sm `}>
          <div id='loginDiv' style={{width:'500px',height:'700px'}} className={`${props.showLogin===true?'block':'hidden'} ${props.mode ==='light'?'bg-slate-200':'bg-black'} ml-52 mt-4 left-1/3 rounded-2xl   h-96 absolute z-10`}>
            <LoginDiv
                mode={props.mode}
                auth={props.auth}
            />
          </div>
          <div className=" flex flex-rows h-auto flex-wrap">
            <div id='girl-img-con' className=" w-96 m-4 ml-20">
                <img src = './images/girlWorking.jpg' className="rounded-2xl"></img>
            </div>
            

            <div id='text-con' className="w-3/4 flex flex-row justify-between ">
                <div className='flex flex-col align-middle w-auto'>
                    <div id='task-img-con1' className="w-44  relative m-20">
                        <img src='./images/icons/task-progress.png' className=" rounded-xl"></img>
                    </div>
                    <div id='task-img-con2' className="w-44  relative m-20">
                        <img src='./images/icons/project-status.png' className=" rounded-xl"></img>
                    </div>
                </div>
                <p
                 className={`p-4 ${ props.mode === 'light'?' bg-gradient-to-br from-slate-300 to-green-100 shadow-lg shadow-slate-800 ring-green-800':'bg-slate-600 ring-slate-200 shadow-lg shadow-blue-200' } ring-4 rounded-2xl w-96 ring-opacity-30 h-fit text-center relative top-24 text-wrap text-xl font-serif`}>
                we are excited to introduce you to our new Project Management System, designed to streamline your workflows, enhance collaboration, and boost overall productivity."
                In today’s fast-paced work environment, managing projects efficiently can be challenging. Our Project Management System is here to simplify that process. It offers a comprehensive suite of tools to help you plan, execute, and track your projects seamlessly
                </p>
                
             <div className='flex flex-col align-middle w-auto'>
             <div id='task-img-con3' className="w-44  relative m-20">
                    <img src='./images/icons/projects-ui.png' className=" rounded-xl"></img>
                </div>
                <div id='task-img-con4' className="w-44  relative m-20">
                    <img src='./images/icons/chat.png' className=" rounded-xl"></img>
                </div>
             </div>
            </div>



            <div className={`flex flex-col relative `}>
           
            <div className={`relative top-24 rounded-2xl ${props.mode === 'light' ? ' ring-green-200 shadow-2xl shadow-green-800' :' ring-blue-900 shadow-xl shadow-blue-800'}flex flex-col w-screen ring-4 m-4 ring-opacity-10 `}>

                 <span className="font-sans font-bold align-middle relative text-5xl left-1/2">Features</span>
                 <div className=" justify-center  relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 justify-items-center">
                {
                    features.map(ele=>{
                        return <div className={` ${props.mode === 'light' ? 'bg-slate-200 ring-green-800 shadow-xl shadow-green-800' :'bg-slate-600 ring-blue-800 shadow-xl shadow-blue-800'} ring-opacity-10 flex flex-col justify-stretch font-serif m-5 w-96 text-center ring-4 rounded-2xl`}>
                                    <div className="">
                                        <img src={`./images/${ele.img}`} className="rounded-2xl h-96 w-96"></img>
                                    </div>
                                    <span className="p-2 mt-2 text-xl font-bold">{ele.name}</span> 
                                    <span className=" p-3 text-lg font-thin text-wrap">{ele.text}</span>
                                </div>
                    })
                }
                </div>
            </div>
            </div>

            <div className="relative w-screen h-52 top-16">
                <div className="flex flex-row h-52 justify-center ">
                    <FaLinkedin
                    className="relative m-20 hover:cursor-pointer"
                    size={50}
                    onClick={(e)=>{
                        window.open('https://linkedin.com/in/balaji-sai-theja-s-b6a4a7260', '_blank');
                    }}
                    />
                    <FaInstagram
                    className="relative m-20 hover:cursor-pointer"
                    size={50}
                    onClick={(e)=>{
                        window.open('https://www.instagram.com/mr_._mysterious_._/', '_blank');
                    }}
                    />
                    <FaMailBulk
                    className="relative m-20 hover:cursor-pointer "
                    size={50}
                    color={props.mode === 'light'? 'black':'white'}
                    onClick={()=>{
                        const mailtoLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent('basath0711@gmail.com')}&su=${encodeURIComponent('')}&body=${encodeURIComponent('')}`;
                        window.open(mailtoLink, '_blank');
                    }}
                    />
                </div>
            </div>
          </div>
        </div>
    )
}
export {Titlebar,Body}