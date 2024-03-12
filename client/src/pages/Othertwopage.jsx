import { Container } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import { useEffect, useContext } from 'react';
import { Context } from '../App';
import {observer} from 'mobx-react';

const Othertwopage = observer(() => {
  const {store} = useContext(Context);

  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('token') !== null && localStorage.getItem('token') !== undefined) {
        store.checkAuth()
    }
  }, [])

  useEffect(() => {
    if (store.noAuthError) {
      store.logout()
    }
  }, [store.noAuthError])

  useEffect(() => {
    if (!store.isAuth && localStorage.getItem('token') == null || localStorage.getItem('token') == undefined) {
      navigate('/')
      store.logout()
    } 
  }, [store.isAuth])

  return (
    <Container maxWidth="xl" style={{marginTop: '40px'}}>
    <h2>Other page two</h2>
    </Container>
  )
})

export default Othertwopage
