// @ts-nocheck
import { useState, useEffect, useContext } from 'react'
import TextField from '@mui/material/TextField'
import { Button, Container, Stack } from '@mui/material';
import Box from '@mui/material/Box';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate, Link } from 'react-router-dom'
import { AppContext } from './components/context';
import UserService from './services/user-service';
import {observer} from 'mobx-react';
import { Context } from './App';

const CreateUser = observer(() => {
  const {udata, setUdata} = useContext(AppContext);

  const {store} = useContext(Context);

  const navigate = useNavigate();
  
  const [inpval, setINP] = useState({
      name: "",
      email: "",
      desc: "",
      age: "",
  })
  
  const setdata = (e) => {
      const { name, value } = e.target;
      setINP((prev) => {return {...prev, [name]: value}})
  }
  
  const Submit = async (e) => {
      e.preventDefault();

      const regexp = /^[0-9]+$/g;
  
      const { name, email, age, desc } = inpval;
      
      if (name === "") {
          alert("name is required")
      } else if (email === "") {
          alert("email is required")
      } else if (!email.includes("@")) {
          alert("enter valid email")
      }
      else if(desc === "") {
          alert("desc is required")
      }
       else if (age === "") {
          alert("age is required")
       }
       else if (!regexp.test(age)) {
          alert("Возраст должен быть числом")
       }
       else if (name.length < 2) {
          alert("Имя должно содержать минимум 2 символа")
       }
      else {
        try {
            await UserService.createUser(name, email, age, desc)
            .then((res) => {
            const data = res.data;
            console.log(data);
    
            if (res.status === 422 || !data) {
                console.log("error");
                alert("error");
            } else {
                navigate("/users")
                setUdata(data)
                console.log("data added");
            }
          })
        } catch (error) {
            console.log(error)
        }
      }
  }
  
  useEffect(() => {
    if (!store.isAuth && localStorage.getItem('token') == null || localStorage.getItem('token') == undefined) {
      navigate('/')
    }
  }, [store.isAuth])

  return (

<Container maxWidth="xl" style={{padding: 0}}>
<Box sx={{p: 2, width: '360px', margin: '0 auto'}}>
<Stack direction="row" spacing={2}>
<Link to='/users'><Button variant="contained"><HomeIcon /></Button></Link>
</Stack>
</Box>
<form style={{marginTop: '1rem'}} onSubmit={Submit}>
<Box 
    sx={{
        display: 'grid',
        gap: 2,
        maxWidth: '26em'
    }}
    >
    <TextField variant='outlined' label="Enter name" type="text" value={inpval.name} onChange={setdata} name="name"  id="exampleInputEmail1" aria-describedby="emailHelp" required/>
    <TextField variant='outlined' label="Enter email" type="email" value={inpval.email} onChange={setdata} name="email"  id="exampleInputPassword1" required/>
    <TextField label="Enter age" variant='outlined' type="text" value={inpval.age} onChange={setdata} name="age" id="exampleInputText1" required/>
    <TextField multiline rows={4} label="Enter description" variant='outlined' name="desc" value={inpval.desc} onChange={setdata} required/>
    <Button variant="contained" type="submit" className="btn btn-primary">Добавить</Button>
</Box>
</form>
</Container>

  )
})

export default CreateUser
