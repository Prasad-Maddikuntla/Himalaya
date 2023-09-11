import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
const Edittenant = () => {
  const [tenant,setTenant]=useState(JSON.parse(sessionStorage.getItem("tenant"))[0])
  console.log(tenant)
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    block: sessionStorage.getItem('blockName'),
    room: sessionStorage.getItem('room'),
    name: tenant.name,
    phone: tenant.phone,
    date:
      tenant.date,
    feePerMonth:tenant.feePerMonth,
    adhaar: tenant.adhaar,
    occupation: tenant.occupation,
    address: tenant.address
  });
  function editTenant(e) {
    e.preventDefault();
    if (
      formData.name === "" ||
      formData.phone === "" ||
      formData.feePerMonth === ""
    ) {
      alert("please enter all fields");
    } else {
      let data = JSON.parse(localStorage.getItem("blocks"));
      let temp=data
     console.log(formData)
      temp[formData.block][formData.room][JSON.parse(sessionStorage.getItem("tenant"))[1]]=formData
       console.log(temp)
      localStorage.setItem("blocks",JSON.stringify(temp))
      navigate(`/block/${formData.block}/${formData.room}`)
    }
  }
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };
  return (
    <div>
      <div className="head">
        <h1>Add Tenant</h1>
        <h1
          onClick={() => {
            navigate("/blocks");
          }}
        >
          ⌂
        </h1>
      </div>
      <form onSubmit={editTenant}>
        <input
          type="number"
          name="room"
          value={formData.room}
          onChange={handleInputChange}
          placeholder="room number"
        />
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Tenant Name"
        />
        <input
          type="number"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          maxLength="10"
          placeholder="Phone number"
        />
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleInputChange}
          placeholder="Date of joining"
        />
        <input
          type="number"
          name="feePerMonth"
          value={formData.feePerMonth}
          onChange={handleInputChange}
          placeholder="Fee per month"
        />
        <input
          type="number"
          name="adhaar"
          value={formData.adhaar}
          onChange={handleInputChange}
          placeholder="Adhaar number"
        />
        <div>
          <label>Occupation</label>
          <select
            name="occupation"
            value={formData.occupation}
            onChange={handleInputChange}
          >
            <option>Student</option>
            <option>Employee</option>
            <option>Business</option>
          </select>
        </div>
        <textarea
          type="text"
          name="address"
          placeholder="Address"
          onChange={handleInputChange}
          value={formData.address}
        />
        <button className="addtenant" type="submit">
          Edit Tenant
        </button>
      </form>
    </div>
  );
};
export default Edittenant;
