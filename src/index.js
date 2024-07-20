import React from 'react';
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import {FaSun,FaMoon} from 'react-icons/fa'
import ReactDOM from 'react-dom/client';
import './index.css';
import { EditorApp } from './pages/editor/editorApp';
import App from './pages/login/App';
import { DashBoard } from './pages/dashboardApp';

const root = ReactDOM.createRoot(document.getElementById('root'));

function Root(){

  const[mode,setMode] = React.useState('light')
  const [auth,setAuth] = React.useState(false)
  document.childNodes[1].childNodes[2].style.backgroundColor = mode === 'light'?'rgb(192,192,192)': 'rgb(31,31,31)'
  function changeMode(e){
    setMode(mode==='light'?'dark':'light')
  }

  return(
    <Router>
      <div id='container' className='flex flex-col'>
        <div id='icon-container' className=' w-auto h-10'>
        {
          mode==='light'?<FaSun className=' relative left-3/4 m-2' onClick={changeMode}/> : <FaMoon color='white' className=' relative left-3/4 m-2' onClick={changeMode}/>
        }
        </div>
        <Routes>
          <Route path='/' element=
          { 
            auth ? <DashBoard mode={mode} auth={setAuth}/> 
            :  <App  authenticate={setAuth} mode={mode}/>
          }
           
            /> 
          <Route path='/editor' element={ <EditorApp mode={mode}/>}/>
        </Routes>
     </div>
      
    </Router>
  )

}
root.render(
  <Root/>

);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

