// @ts-nocheck
import { useEffect, useContext } from 'react';
import Button from '@mui/material/Button';
import { CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Stack from '@mui/material/Stack';
import { Box, Paper } from '@mui/material';
import Container from '@mui/material/Container';
import { useNavigate } from 'react-router-dom';
import UserService from '../services/user-service'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import { AppContext } from '../components/context';
import {observer} from 'mobx-react';
import { Context } from '../App';
import { useAppStore } from '../appStore';
import { useQuery} from 'react-query'
import {Pagination, TextField} from '@mui/material'
import FakeTable from '../components/FakeTable';
import Muiselect from '../components/Muiselect';

const Adminone = observer(() => {
  const setSelectedIndex = useAppStore((state) => state.setSelectedIndex);
  const {udata, setUdata, updata, setUpdata, udelete, setUDelete} = useContext(AppContext);
  const {store} = useContext(Context);

  const navigate = useNavigate();

  useEffect(() => {
    setSelectedIndex(3)
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
    ['usersone', store.query, store.currentPage, store.pageQty, udelete],
    () => usersAll(), 
    {
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    }
    )

  const usersAll = async() => {
    try {
      store.setSearchLoading(true)
      const res = await UserService.fetchUsersforadmin(store.query, store.currentPage, store.pageQty);
      store.setNoAdmin(true)
      store.settertUsersforadmin(res.data.all.paginationalldata)
      store.setTotalPage(res.data.all.alltotalpage)
      store.setAllDocs(res.data.all.alldocs)
      store.setAllSearchDocs(res.data.all.allsearchdocs)
      store.setAllSearchDocsNo(res.data.all.allsearchdocsno)
      return res.data.all
    } catch (e) {
      console.log(e)
      console.log((e).response.data?.message)
      if ((e).response.status === 403) {
        store.setNoAdmin(false)
      }
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
    store.setCurrentPage(1)
    store.getUserCount()
  }, [store])

  const handleDelete = async(id) => {
    try {
      await UserService.deleteSingleUserfromusers(id)
      .then(res => {console.log(res)
        console.log("data deleted");
        setUDelete(res)
        store.getUserCount()
      })
    } catch (error) {
      console.log(error)
      alert(error.response.data)
      store.getUserCount()
    }
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

  const userSignOut = () => {
    store.logout()
  }

  if (store.searchLoading) {
    return <>
    <Box sx={{p: 2, textAlign: 'center', marginTop: '2rem'}}>
    <CircularProgress />
    </Box>
    </>
  }

  if (!store.noadmin) {
    return <h4>У вас нет доступа</h4>
  }

  return (
    <>
<Container maxWidth="xl" style={{marginTop: '40px'}}>

<Box sx={{p: 0, pb: 4}} style={{textAlign: 'left'}}>
<Stack direction="column" spacing={1} style={{justifyContent: 'start !important'}}>
<p style={{fontSize: '24px'}}>Добро пожаловать <b>{store.user.username}</b></p>
<br></br>
<div style={{gap: '10px'}}>
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
        value={store.query || ''}
        onChange={(event) => {store.setQuery(event.target.value), store.setCurrentPage(1)}}
        />
</Stack>
</Box>
<Box sx={{p: 0, pb: 0}} style={{textAlign: 'right'}}>
<Stack direction="row" spacing={1} style={{justifyContent: 'end !important'}}>
    <Button variant='contained' size='small' onClick={() => userSignOut()}>Выйти</Button>
    <ToastContainer style={{textAlign: 'center'}} />
</Stack>
</Box>
</Box>

{!store.allsearchdocsno ? <FakeTable /> : null}

<Box sx={{p: 2, width: '360'}}>
{store.usersDatafor.length > 0 ? 
<TableContainer component={Paper}>
<Table sx={{ minWidth: 325 }} size="small" aria-label="a dense table">
    <TableHead>
    <TableRow>
        <TableCell align="left" style={{fontWeight: 'bold'}}>id</TableCell>
        <TableCell align="left" style={{fontWeight: 'bold'}}>Username</TableCell>
        <TableCell align="left" style={{fontWeight: 'bold'}}>Password</TableCell>
        <TableCell></TableCell>
    </TableRow>
    </TableHead>
    <TableBody>
    {store.usersDatafor.map((user, id) => (
        <TableRow key={user._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
        <TableCell component="th" scope="row"> <b>{id + 1}</b></TableCell>
        <TableCell component="th" scope="row"> {user.username}</TableCell>
        <TableCell component="th" scope="row"> {user.password}</TableCell>
        <TableCell align='right'>
          {store.isCount >= 3 ?
          <Button variant='contained' color="error" size='small' disabled><DeleteOutlineIcon /></Button> :
          <Button variant='contained' color="error" size='small' onClick={() => handleDelete(user._id)}><DeleteOutlineIcon /></Button>
          }
        </TableCell>
        </TableRow>
    ))}
    </TableBody>
</Table>
<div className='selectbox'>
<Pagination
    count={Number(store.totalPage) || 0}
    page={store.currentPage}
    onChange={(_, num) => store.setCurrentPage(num)}
    showFirstButton
    showLastButton
    sx={{marginY: 3, marginX: 'auto'}}
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

export default Adminone;
