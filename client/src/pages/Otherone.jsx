// @ts-nocheck
import { useEffect, useContext} from 'react';
import { Link as Navlink } from 'react-router-dom';
import Button from '@mui/material/Button';
import { PaginationItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import CreateIcon from '@mui/icons-material/Create';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Stack from '@mui/material/Stack';
import { Box, Paper } from '@mui/material';
import Container from '@mui/material/Container';
import { useNavigate } from 'react-router-dom';
import UserService from '../services/user-service'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import { AppContext } from '../components/context';
import {observer} from 'mobx-react';
import { Context } from '../App';
import { useQuery} from 'react-query'
import {Pagination, TextField} from '@mui/material'
import FakeTable from '../components/FakeTable';
import Muiselect from '../components/Muiselect'

const Otherone = observer(() => {
  const {udata, setUdata, updata, setUpdata, udelete, setUDelete} = useContext(AppContext);
  const {store} = useContext(Context);

  const navigate = useNavigate();

  useEffect(() => {
    store.setCurrentPage(1)
    navigate('/otherpage')
    return (() => {
      store.setCurrentPage(1)
      store.setQuerytwo('')
    })
  }, [])

  const notify = () => toast(`данные добавлены: ${udata.name} ${udata.email} ${udata.desc} ${udata.age}`, {
    position: "top-center",
    autoClose: 2500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "light",
    });
  
    const notifytwo = () => toast.error(`данные удалены`, {
    position: "top-center",
    autoClose: 2500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "light",
    });
  
    const notifythree = () => toast.info(`данные обновлены`, {
    position: "top-center",
    autoClose: 2500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "light",
    });
    
  const {data: all} = useQuery(
    ['userstwo', store.querytwo, store.currentPagetwo, store.pageQtyTwo, udelete],
    () => usersAll(), 
    {
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    }
    )

  const usersAll = async() => {
    try {
      store.setSearchLoading(true)
      const res = await UserService.fetchUserstwo(store.querytwo, store.currentPagetwo, store.pageQtyTwo);
      store.settertUserstwo(res.data.all.paginationalldata)
      store.setTotalPagetwo(res.data.all.alltotalpage)
      store.setAllDocstwo(res.data.all.alldocs)
      store.setAllSearchDocstwo(res.data.all.allsearchdocs)
      store.setAllSearchDocsNotwo(res.data.all.allsearchdocsno)
      console.log('data from query ', res.data.all.paginationalldata)
      return res.data.all
    } catch (e) {
      console.log(e)
    } finally {
      store.setSearchLoading(false)
    }
  }

  useEffect(() => {
    if (localStorage.getItem('token') !== null && localStorage.getItem('token') !== undefined) {
        store.checkAuth()
    }
  }, [])

  useEffect(() => {
    if (store.noAuthError) {
      console.log('store.noAuthError ', store.noAuthError)
      store.logout()
      navigate('/')
    }
  }, [store.noAuthError])

  useEffect(() => {
    if (!store.isAuth && localStorage.getItem('token') == null || localStorage.getItem('token') == undefined) {
      store.logout()
      navigate('/')
    } 
  }, [store.isAuth])

  useEffect(() => {
    console.log('store.isAuth users', store.isAuth)
    store.getUserCount()
  }, [store])


  const userSignOut = () => {
    store.logout()
  }

  useEffect(() => {
    if (udata) {
        console.log(`this is new udata: ${udata.name} ${udata.email} ${udata.desc} ${udata.age}`)
        notify()
    }
    return () => {
        setUdata('')
    }
}, [udata])

useEffect(() => {
    if (udelete) {
        notifytwo()
    }
    return () => {
        setUDelete('')
    }
}, [udelete])

useEffect(() => {
    if (updata) {
        notifythree()
    }
    return () => {
        setUpdata('')
    }
}, [updata])

  return (
    <>
<Container maxWidth="xl" style={{marginTop: '40px'}}>

<Box sx={{p: 0, pb: 4}} style={{textAlign: 'left'}}>
<Stack direction="column" spacing={1} style={{justifyContent: 'start !important'}}>
<p style={{fontSize: '24px'}}>Добро пожаловать <b>{store.user.username}</b></p>
<br></br>
<div className='selectbox' style={{gap: '10px'}}>
  <p>Произведено действий: {store.isCount} </p>
  <p>Осталось действий: {3 - store.isCount} </p>
</div>
<div>
  {all !== undefined ? <p>Всего данных: {all.alldocs}</p> : <p>Всего данных: </p>}
</div>
</Stack>
</Box>

<Box>
<Box sx={{p: 0, pb: 2}}>
<Stack direction="row" spacing={1} style={{justifyContent: 'end !important'}}>
<TextField
        fullWidth
        label="Введите текст..."
        size='small'
        value={store.querytwo || ''}
        onChange={(event) => {store.setQuerytwo(event.target.value), store.setCurrentPageTwo(1)}}
        />
</Stack>
</Box>
<Box sx={{p: 0, pb: 0}} style={{textAlign: 'right'}}>
<Stack direction="row" spacing={1} style={{justifyContent: 'end !important'}}>
    <Button variant='contained' size='small' onClick={() => userSignOut()}>Выйти</Button>
</Stack>
</Box>
</Box>

{!store.allsearchdocsnotwo ? <FakeTable /> : null}

<Box sx={{p: 2, width: '360'}}>
{store.usersDataTwo.length > 0 ? 
<TableContainer component={Paper}>
<Table sx={{ minWidth: 325 }} size="small" aria-label="a dense table">
    <TableHead>
    <TableRow>
        <TableCell align="left" style={{fontWeight: 'bold'}}>id</TableCell>
        <TableCell align="left" style={{fontWeight: 'bold'}}>Name</TableCell>
        <TableCell align="left" style={{fontWeight: 'bold'}}>Email</TableCell>
        <TableCell align="left" style={{fontWeight: 'bold'}}>Description</TableCell>
        <TableCell align="left" style={{fontWeight: 'bold'}}></TableCell>
        <TableCell align="left" style={{fontWeight: 'bold'}}></TableCell>
        <TableCell></TableCell>
    </TableRow>
    </TableHead>
    <TableBody>
    {store.usersDataTwo.map((user, id) => (
        <TableRow key={user._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
        <TableCell component="th" scope="row"> <b>{id + 1}</b></TableCell>
        <TableCell component="th" scope="row"> {user.name}</TableCell>
        <TableCell component="th" scope="row"> {user.email}</TableCell>
        <TableCell component="th" scope="row"> <p className='p'>{user.desc.substr(0, 8)} ...</p></TableCell>
        <TableCell align='right'>
          <Navlink to={`/viewtwo/${user._id}`}><Button variant='contained' size='small'><RemoveRedEyeIcon /></Button></Navlink>
        </TableCell>
        <TableCell align='right'>
          <Button variant='contained' color="success" size='small' disabled><CreateIcon /></Button>
        </TableCell>
        <TableCell align='right'>
          <Button variant='contained' color="error" size='small' disabled><DeleteOutlineIcon /></Button>
        </TableCell>
        </TableRow>
    ))}
    </TableBody>
</Table>
<div className='selectbox'>
<Pagination
    count={Number(store.totalPagetwo) || 0}
    page={store.currentPage}
    onChange={(_, num) => store.setCurrentPagetwo(num)}
    showFirstButton
    showLastButton
    sx={{marginY: 3, marginX: 'auto'}}
    renderItem={(item) => (
      <PaginationItem 
      component={Navlink}
      to={`/otherpage/p=${item.page}`}
      {...item}
      />
    )}
    />
  <Muiselect />
</div>
</TableContainer>
: null}
</Box>
</Container>
</>
  )
})

export default Otherone;
