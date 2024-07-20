import './App.css';
import {Titlebar,Body} from './login'
import React from 'react';
function App(props){
 
  const [showLogin,setShowLogin] = React.useState(false)

  function showLoginDiv(){
   setShowLogin(!showLogin)
}
  return (
    <div id='page' className='flex flex-col h-auto'>
      <Titlebar
        mode = {props.mode}
        showLogin = {showLogin}
        plusIconClick = {showLoginDiv}
      />
      <Body
         mode = {props.mode}
         showLogin = {showLogin}
         auth = {props.authenticate}
      />

    </div>
  )
}

export default App;
