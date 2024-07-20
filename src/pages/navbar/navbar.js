import React from "react";
import {FaHome} from 'react-icons/fa';
import { BsCardList } from "react-icons/bs";
import { CiChat1 } from "react-icons/ci";

function NavBar(props){

    const [windowWidth,setWindowWidth] = React.useState(window.innerWidth)
    const [currentActiveTab,setCurrentActiveTab] = React.useState(null)
    function makeActive(e){
        let target = document.getElementById(e.target.id)
        try{
            if(currentActiveTab === null){
                target.style.opacity = 0.5
                setCurrentActiveTab(target)
                
            }
            else{
                currentActiveTab.style.opacity = 1
                setCurrentActiveTab(target)
                target.style.opacity = 0.5

            }
        }catch(e){
            alert('error occured...try again')
            console.log('error in nav chaging opacity',e)
        }
    }

    window.addEventListener('resize',(e)=>{
        setWindowWidth(window.innerWidth)
    })

    return (
        <div style={{width:windowWidth*0.1}} className={`h-full ${props.mode === 'light' ? 'ring-slate-900 text-black':'ring-slate-200 text-white'} `}>
            <div  className={`flex flex-col w-full`}>
                <div onClick={(e)=>{
                    props.render('home')
                    makeActive(e)
                }} id='homeNav' className={`flex cursor-pointer flex-row justify-evenly font-serif h-10 mt-3 ring-2 mx-2 rounded-lg shadow-lg ${props.mode === 'light' ? 'ring-slate-900':'ring-slate-200'}`}>
                <FaHome
                        id='homeNav'
                            color={`${props.mode==='light'?'black':'white'}`}
                            className={`my-auto`}
                        />
                    <span id='homeNav' className={`relative top-2 text-wrap`}>
                        Profile
                    </span>
                </div>
                <div id='chatNav' onClick={(e)=>{
                    props.render('chat')
                    makeActive(e)
                    }} className={`flex flex-row cursor-pointer justify-evenly font-serif h-10 mt-3 ring-2 mx-2 rounded-lg shadow-lg ${props.mode === 'light' ? 'ring-slate-900':'ring-slate-200'}`}>
                <CiChat1
                id='chatNav'
                         color={`${props.mode==='light'?'black':'white'}`}
                         className={`my-auto`}
                        />
                    <span id='chatNav' className={`relative top-2 text-wrap`}>

                        Chat
                    </span>
                </div>
                <div id='dashNav' onClick={(e)=>{
                    props.render('dashBody')
                    makeActive(e)
                    }} className={`flex flex-row cursor-pointer  justify-evenly font-serif h-10 mt-3 ring-2 mx-2 rounded-lg shadow-lg ${props.mode === 'light' ? 'ring-slate-900':'ring-slate-200'}`}>
                <BsCardList
                id='dashNav'
                             color={`${props.mode==='light'?'black':'white'}`}
                             className={`my-auto`}
                        />
                    <span id='dashNav' className={`relative top-2 text-wrap`}>

                        Projects</span>
                </div>
            </div>
        </div>
    )
}

export {NavBar}