import { useEffect, useState, useContext } from 'react'
import CreateIcon from '@mui/icons-material/Create';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import HomeIcon from '@mui/icons-material/Home';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import profile_image from './image/profile.png'
import { Box, Button, CircularProgress } from '@mui/material';
import { AppContext } from './components/context';
import UserService from './services/user-service';
import {observer} from 'mobx-react';
import { Context } from './App';

const DetailsUser = observer(() => {

    const [getuserdata, setUserdata] = useState([]);
    const [loading, setLoading] = useState(false);

    const {store} = useContext(Context);
    const {udelete, setUDelete} = useContext(AppContext);

    const {id} = useParams("");
    console.log(id);

    const navigate = useNavigate();

    const getdata = async () => {
        try {
            setLoading(true)
            await UserService.fetchSingleUser(id)
            .then((res) => {
                const data = res.data;
                console.log(data);

                if (res.status === 422 || !data) {
                    console.log("error ");
        
                } else {
                    setUserdata(data)
                }
            })
        } catch (error) {
            console.log(error)
        } finally {
                setTimeout(() => {
                    setLoading(false)
                }, 200);
        }
    }

    useEffect(() => {
        store.getUserCount()
        getdata();
    }, [])

    const deleteuser = async(id) => {
      try {
          await UserService.deleteSingleUser(id)
          .then((res2) => {
              const deletedata = res2.data;
              console.log(deletedata);
      
              if (res2.status === 422 || !deletedata) {
                  console.log("error");
              } else {
                  navigate("/users");
                  console.log("data deleted");
                  setUDelete(deletedata)
              }
          })
      } catch (error) {
          console.log(error)
          alert(error.response.data)
      }
    }

    useEffect(() => {
        if (!store.isAuth && localStorage.getItem('token') == null || localStorage.getItem('token') == undefined) {
          navigate('/')
        }
      }, [store.isAuth])

    if (loading) {
        return (
            <Box sx={{p: 2, textAlign: 'center', marginTop: '2rem'}}>
            <CircularProgress />
            </Box>
        )
    }

    return (
        <Box
        sx={{display: 'grid', justifyContent: 'center'}}
        >
            <h1 style={{ fontWeight: 400 }}>Card {getuserdata.name}</h1>
            <Card sx={{ maxWidth: 600 }}>
                <CardContent>
                    <div className="add_btn">
                        <Link to='/users'><Button className="btn btn-primary mx-2"><HomeIcon /></Button></Link>
                        {store.isCount >= 3 ? 
                        <Button className="btn btn-primary mx-2" disabled><CreateIcon /></Button> :
                        <Link to={`/update/${getuserdata._id}`}><Button className="btn btn-primary mx-2"><CreateIcon /></Button></Link>
                        }
                        {store.isCount >= 3 ?
                        <Button className="btn btn-danger" disabled><DeleteOutlineIcon /></Button> :
                        <Button className="btn btn-danger" onClick={() => deleteuser(getuserdata._id)}><DeleteOutlineIcon /></Button>
                        }
                    </div>
                    <div className="row">
                        <div className="left_view col-lg-6 col-md-6 col-12">
                            <img src={profile_image} style={{ width: 100 }} alt="profile" />
                            <h3>Name: <span >{getuserdata.name}</span></h3>
                            <h3>Age: <span >{getuserdata.age}</span></h3>
                            <p style={{display: 'flex', alignItems: 'center'}}><MailOutlineIcon />Email:<span style={{marginLeft: '0.3rem'}}> {getuserdata.email}</span></p>
                        </div>
                            <Typography variant='body2' color='text.secondary' className="mt-3"><b></b> <span>{getuserdata.desc}</span></Typography>
                    </div>

                </CardContent>
            </Card>
        </Box>
    )
})

export default DetailsUser
