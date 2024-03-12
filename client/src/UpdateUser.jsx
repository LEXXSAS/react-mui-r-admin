// @ts-nocheck
import { useEffect, useState, useContext } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import TextField from '@mui/material/TextField'
import { Button, Container } from '@mui/material';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import { AppContext } from './components/context';
import UserService from './services/user-service';
import {observer} from 'mobx-react';
import { Context } from './App';

const UpdateUser = observer(() => {
const {updata, setUpdata} = useContext(AppContext);

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
        setINP((prev) => {return {...prev,[name]: value}
        })
    }
    
    const {id} = useParams("");
    console.log(id);

    const getdata = async() => {
      UserService.fetchSingleUser(id)
      .then((res) => {
        const data = res.data;
        console.log(data);
        if (res.status === 422 || !data) {
            console.log("error ");
        } else {
            setINP(data)
            console.log("get data");
        }
      })
    }

    useEffect(() => {
        getdata();
    }, []);

    const Submit = async(e)=>{
        e.preventDefault();
        try {
          const { name, email, age, desc } = inpval;
          await UserService.updateSingleUser(id, name, email, age, desc)
          .then((res2) => {
            const data2 = res2.data;
            console.log("data2", data2);
    
            if(res2.status === 422 || !data2){
                alert("fill the data");
            }else{
                navigate("/users")
                setUpdata(data2);
            }
          })
        } catch (error) {
          alert(error.response.data)
          console.log(error)
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
<Stack direction="row" spacing={1}>
<Link to='/users'><Button variant="contained"><HomeIcon /></Button></Link>
<Link to={`/view/${id}`}><Button variant="contained"><PersonIcon /></Button></Link>
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
    <TextField label="Enter age" variant='outlined' type="text" value={inpval.age} onChange={setdata} name="age" id="exampleInputPassword1" required />
    <TextField multiline rows={4} label="Enter description" variant='outlined' name="desc" value={inpval.desc} onChange={setdata} required/>
    <Button variant="contained" type="submit" className="btn btn-primary">Применить</Button>
</Box>
</form>
</Container>
  )
})

export default UpdateUser
