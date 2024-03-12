import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import * as yup from "yup";
import {yupResolver} from '@hookform/resolvers/yup';
import { FormProvider, useForm } from 'react-hook-form';
import { Box, Button, Container, Stack, Typography } from '@mui/material'
import TextField from '@mui/material/TextField';
import LoginIcon from '@mui/icons-material/Login';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import {observer} from 'mobx-react';
import { Context } from '../App';
import Alert from '@mui/material/Alert';

const schema = yup.object().shape({
  username: yup.string().min(2, 'Логин должен содержать минимум 2 символа').required('Укажите логин'),
  password: yup.string().min(8, 'Пароль должен содержать минимум 8 символов').max(32).required('Это обязательное поле')
});

const Loginpage = observer(() => {
  const {store} = useContext(Context);
  const [error, setError] = useState(null);

  const {
    handleSubmit,
    register,
    formState
  } = useForm({
    resolver: yupResolver(schema),
  });

  const navigate = useNavigate();

  const [loading] = useState(false);
  const [form, setForm] = useState({
    defaultValues: {
      username: '',
      password: '',
    }
  })

  const onSubmit = async() => {
    store.login(form.username, form.password)
  }

  useEffect(() => {
    if (localStorage.getItem('token') !== null && localStorage.getItem('token') !== undefined) {
      store.checkAuth()
    }
  }, [])
  
  useEffect(() => {
    if (store.isAuth) {
      navigate('/users')
    }
  }, [store.isAuth])

  useEffect(() => {
    console.log('store.isAuth login', store.isAuth)
    return (() => {
      console.log('store.isAuth login unmount', store.isAuth)
    })
  }, [])

  function handleSignup() {
    navigate('/register')
  }

  useEffect(() => {
    if (store.isError) {
      setError(store.errors)
    }
  }, [store.errors])

  const handleKeyPress = (event) => {
    if(event.key === 'Enter'){
      onSubmit();
    }
  }

  return (
  <FormProvider>
  <Container maxWidth="xs" style={{marginTop: '50px'}} onKeyPress={handleKeyPress}>
  <Box sx={{p: 2, width: 360}}>
  <Stack spacing={1} direction='column' className='btns'>
    <Typography sx={{pb: 1}} variant='h4' component='h4' style={{color: '#9C27B0'}}>Login <span style={{color: 'black'}}>page</span></Typography>
    <TextField {...register("username")} fullWidth variant="outlined" color='secondary' name='username' label='Логин' onChange={e => setForm({...form, username: e.target.value})} helperText={formState.errors.username && formState.errors.username.message} error={!!formState.errors.username}/>
    <TextField {...register("password")} fullWidth variant="outlined" color='secondary' name='password' label='Пароль' onChange={e => setForm({...form, password: e.target.value})} helperText={formState.errors.password && formState.errors.password.message} error={!!formState.errors.password} type='password' />
    <Button onClick={handleSubmit(onSubmit)} variant='contained' color='secondary' size='small'>Войти<LoginIcon style={{marginRight: '5px'}} /></Button>
    <Button
    onClick={handleSignup}
    disabled={loading}
    variant='outlined'
    color='secondary'
    size='small'
    >
      <AppRegistrationIcon />
      Зарегистрироваться
    </Button>
    {error && <Alert variant="filled" severity="error">
      {error}
    </Alert>}
  </Stack>
  </Box>
  </Container>
  </FormProvider>
  )
})

export default Loginpage;
