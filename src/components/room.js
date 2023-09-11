import React, { useEffect } from 'react'
import { useState } from 'react'
import { Navigate, json, useNavigate } from 'react-router-dom'
const Room=()=>{
    const navigate=useNavigate()
    const openDialer = (phoneNumber) => {
        window.open(`tel:${phoneNumber}`);
      };
 
    const [block,setBlock]=useState(sessionStorage.getItem('blockName'))
    const [room,setRoom]=useState(sessionStorage.getItem('room'))
    const [data,setData]=useState(JSON.parse(localStorage.getItem('blocks')))
    const [tenants,setTenants]=useState(data[block][room])
    function editTenant(tenant,i){
        
        sessionStorage.setItem("tenant",JSON.stringify([tenant,i]))
        navigate('/editTenant')
    }
    const openWhatsApp = (phoneNumber,name) => {
        const encodedMessage = encodeURIComponent(`Hi ${name}, welcome to Himalaya Boys Hostel.`);
        window.open(`https://wa.me/+91${phoneNumber}?text=${encodedMessage}`);
      };
    // console.log(tenants)

    return(
        <div>
            <div><h1>{room}</h1>
            <button onClick={()=>navigate('/addtenant')}>Add Tenant</button>
            <button onClick={()=>navigate(`/block/${block}`)}>Go Back</button>
            </div>
            
            <h2>Tenants</h2>
            {
                tenants.map((tenant,i)=>{
                    return(
                    <div className='tenn'>
                        <div>{i+1}</div>
                        <b>{tenant.name}</b>
                        <div onClick={()=>{openDialer(tenant.phone)}}>📞</div>
                        <div onClick={()=>{editTenant(tenant,i)}}>📝</div>
                        <button onClick={()=>openWhatsApp(tenant.phone,tenant.name)}>Send WhatsApp Message</button>
                    </div>
                    )
                })
            }
        </div>
    )
}
export default Room