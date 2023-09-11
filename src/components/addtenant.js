import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Autocomplete,TextField,Button, Typography, Box, AppBar, IconButton, Toolbar } from '@mui/material'
import SvgIcon from '@mui/material/SvgIcon'
import MenuIcon from '@mui/icons-material/Menu';
import DatePicker from '@mui/lab/DatePicker';
import { Label } from "@mui/icons-material";
function HomeIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    </SvgIcon>
  );
}
const Addtenant = () => {
  const [menu,setMenu]=useState(false)
  const navigate = useNavigate();
  const toggleDrawer = () => (event) => {
    if (
      event &&
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }

    setMenu(true);
  };
// const list=()=>{
//   <Box 
//   sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
//       role="presentation"
//       onClick={toggleDrawer(anchor, false)}
//       onKeyDown={toggleDrawer(anchor, false)}
//   >

//   </Box>
// }
  const [formData, setFormData] = useState({
    block: sessionStorage.getItem('blockName'),
    room: sessionStorage.getItem('room'),
    name: "",
    phone: "",
    date:
      new Date().getFullYear() +
      "-0" +
      new Date().getMonth() +
      "-" +
      new Date().getDate(),
    feePerMonth: 4000,
    adhaar: "",
    occupation: "student",
    address: ""
  });
  function addTenant(e) {
    e.preventDefault();
    if (
      formData.name === "" ||
      formData.phone === "" ||
      formData.feePerMonth === ""
    ) {
      alert("please enter all fields");
    } else {
      let data = JSON.parse(localStorage.getItem("blocks"));
      let temp = data

      temp[formData.block][formData.room] = [...temp[formData.block][formData.room], formData]
      console.log(temp)
      localStorage.setItem("blocks", JSON.stringify(temp))
      navigate(`/block/${formData.block}/${formData.room}`)
    }
  }
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };
  return (
    <Box sx={{backgroundColor:"white",height:"100vh"}}>
      <AppBar position="static">
        <Toolbar >
          <React.Fragment key={"left"}>

          </React.Fragment>
        <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
      <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1 }}
            // sx={{ display: { xs: 'none', sm: 'block' } }}
          >
            ADD TENENT
          </Typography>
          <IconButton size="large"
              edge="end"
             
              aria-controls={'primary-search-account-menu'}
              aria-haspopup="true"
              onClick={() => {
                navigate("/blocks");
              }}
              color="inherit">
          <HomeIcon  color="white" />
          </IconButton>
          </Toolbar>
      </AppBar>
      <form onSubmit={addTenant}>
        <TextField type="number"
          name="room"
          value={formData.room}
          onChange={handleInputChange}
          sx={{backgroundColor:"white" }}
          label="Room Number"/>
          <TextField type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          sx={{backgroundColor:"white" }}
          label="Tenant Name"/>
          
        <TextField
          type="number"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          sx={{backgroundColor:"white" }}
          maxLength="10"
          label="Phone number"
        />
        <DatePicker
       value={new Date()}
       renderInput={(props) => (
         <TextField {...props} helperText="valid mask" />
       )}
        onChange={handleInputChange}
        label="Date of joining" />
        {/* <TextField
          type="date"
          name="date"
          value={formData.date}
          sx={{backgroundColor:"white" }}
          onChange={handleInputChange}
          label="Date of joining"
        /> */}
        <TextField
          type="number"
          name="feePerMonth"
          value={formData.feePerMonth}
          sx={{backgroundColor:"white" }}
          onChange={handleInputChange}
          label="Fee per month"
        />
        
        <TextField
          type="number"
          name="adhaar"
          value={formData.adhaar}
          sx={{backgroundColor:"white" }}
          onChange={handleInputChange}
          label="Adhaar number"
        />
        <div>  
          <Autocomplete
  disablePortal
  name="occupation"
  value={formData.occupation}
  onChange={handleInputChange}
  id="combo-box-demo"
  options={["Student","Employee","Business"]}
  sx={{ width: 365,backgroundColor:"white" }}
  renderInput={(params) => <TextField {...params} label="Occupation" />}
/>
   
        </div>
        <TextField
          type="text"
          name="address"
          label="Address"
          onChange={handleInputChange}
          value={formData.address}
        />
        <Button type="submit" className="addtenant" variant="contained">Add Tenant</Button>
        {/* <button className="addtenant" type="submit">
          
        </button> */}
      </form>
    </Box>
  );
};
export default Addtenant;
