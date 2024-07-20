import React from "react";
import {FaBars,FaPlus,FaMinus} from 'react-icons/fa'
function DashTitle(props){
    const [barRotate,setBarRotate] = React.useState('rotate-0')
    const [windowWidth,setWindowWidth] = React.useState(window.innerWidth)
    const {plus,setPlus} = React.useState(true)

    let data = JSON.parse(localStorage.getItem('userData'))


    window.addEventListener('resize',(e)=>{
         setWindowWidth(window.innerWidth)
    })

    function rotateIcon(){
        setBarRotate(prev=>prev==='rotate-0'?'rotate-90':'rotate-0')

        props.showNav(prev=>!prev)
    }

    function toggle(e){
        props.items.toggle(prev=>!prev)
    }
    return(
        <div id='dashTitle' className={`flex flex-row  ${props.mode === 'light'?'bg-slate-200 ring-slate-800':'bg-slate-800 ring-slate-200'} ring-2 rounded-lg m-1 w-screen h-20`}>
            <div id='bar-icon' className="relative my-auto mx-5 ">
                <FaBars 
                    id='bar'
                    size={30}
                    className={`${barRotate}`}
                    onClick={rotateIcon}
                    color={`${props.mode === 'light' ? 'black':'white'}`}
                />
            </div>

            <div onClick={toggle} style={{width:'10rem'}} className={` cursor-pointer ${props.mode==='light' ? 'bg-white ring-black':'bg-cyan-300 ring-white'} ring-2 relative left-52 my-auto rounded-3xl pt-1 h-12 text-center`}>
                <div className="flex flex-row relative m-1.5">
                <FaPlus
                    size={20}
                    className="mx-2 my-auto"
                /> 
                <span className=" text-center font-mono font-extrabold"> New Project</span>
                </div>
            </div>

            <div id='profile-con' style={{'left':`${(windowWidth-350)}px`}} className={`${props.mode === 'light' ? ' ring-black':'ring-white'} ring-2 relative w-16  rounded-2xl m-2 mr-20 `}>
                <img src={data.photos[0].value?data.photos[0].value :'./images/profile.png'} referrerPolicy="no-referrer" className={` ring-2 rounded-2xl`}></img>
            </div>
            
        </div>
    )
}

export {DashTitle}