import React from "react";
import axios from "axios";

function ProfileProject(props){

    const [Project,setProject] = React.useState([])
    const[loading,setLoading] = React.useState(true)
    const [temp,setTemp]= React.useState(true)

    React.useEffect( ()=>{
        async function getProjects(){
            let userData = JSON.parse(localStorage.getItem('userData'))
            let Projects = await axios.get(`http://localhost:3000/projects/${userData.email[0]}`);
            setProject(Projects.data.data)
            setLoading(false)
        }
        try{
            getProjects()
        } catch(e){
            console.log(e)
            setLoading(true)
        }
    },[temp])

    let allProjects = (
        <tbody>
            {
                Project.map(project=>{
                    return <tr className={`p-2`}>
                        <td className={`border-2 border-gray-800 p-1 ${props.mode === 'light'? 'text-slate-950 border-gray-800': 'text-slate-200 border-gray-100'}`}>{project.project_name}</td>
                        <td className={`border-2 border-gray-800 p-1 ${props.mode === 'light'? 'text-slate-950 border-gray-800': 'text-slate-200 border-gray-100'}`}>{project.grp_name}</td>
                        <td className={`border-2 border-gray-800 p-1 ${props.mode === 'light'? 'text-slate-950 border-gray-800': 'text-slate-200 border-gray-100'}`}>{project.start_date}</td>
                        <td className={`border-2 border-gray-800 p-1 ${props.mode === 'light'? 'text-slate-950 border-gray-800': 'text-slate-200 border-gray-100'}`}>{project.end_date}</td>
                        <td className={`border-2 border-gray-800 p-1 ${props.mode === 'light'? 'text-slate-950 border-gray-800': 'text-slate-200 border-gray-100'}`}>{project.status}</td>
                    </tr>
                })
            }
        </tbody>
    )
    return(
        <div>
            <div className={`mt-10 ring-1  border-b-2 shadow-lg rounded-xl border-t-2 ${props.mode === 'light' ? 'shadow-slate-900' : 'shadow-blue-300'}`}>
                <table  className={`mx-auto   relative mt-10 mb-3 border-2 text-center  rounded-lg p-2 ${props.mode === 'light'? 'text-slate-950 border-gray-800': 'text-slate-200 border-gray-100'}`}>
                    <thead>
                        <th className={`border-2 border-gray-800 p-2 ${props.mode === 'light'? 'text-slate-950 border-gray-800': 'text-slate-200 border-gray-100'}`}> Project Name</th>
                        <th className={`border-2 border-gray-800 p-2 ${props.mode === 'light'? 'text-slate-950 border-gray-800': 'text-slate-200 border-gray-100'}`}>Group Name</th>
                        <th className={`border-2 border-gray-800 p-2 ${props.mode === 'light'? 'text-slate-950 border-gray-800': 'text-slate-200 border-gray-100'}`}>Start Date</th>
                        <th className={`border-2 border-gray-800 p-2 ${props.mode === 'light'? 'text-slate-950 border-gray-800': 'text-slate-200 border-gray-100'}`}>End Date</th>
                        <th className={`border-2 border-gray-800 p-2 ${props.mode === 'light'? 'text-slate-950 border-gray-800': 'text-slate-200 border-gray-100'}`}>Status</th>
                    </thead>
                    {
                        Project.length > 0 ? allProjects : <tr>No Project Found</tr>
                    }
                </table>
            </div>
        </div>
    )
}

export  {ProfileProject}