import { Box, Container } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import { useEffect, useContext } from 'react';
import { Context } from '../App';
import {observer} from 'mobx-react';
import { useAppStore } from "../appStore";
import { useQuery} from 'react-query';

const Statisticsone = observer(() => {
  const setSelectedIndex = useAppStore((state) => state.setSelectedIndex);
  const {store} = useContext(Context);

  const navigate = useNavigate();

  useEffect(() => {
    setSelectedIndex(4)
  }, [])

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

  useQuery(
    ['systeminfo'],
    () => systemData(),
    {
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    }
  )

  const systemData = async() => {
    store.getServerDiscInfo();
  }

  return (
    <Container maxWidth="xl" style={{marginTop: '40px'}}>
    <h2>Statistics page</h2>
    <Box>
      <h4>Информация о сервере</h4>
      <p>{store.available}</p>
      <p>{store.used}</p>
      <p>{store.total}</p>
    </Box>
    </Container>
  )
})

export default Statisticsone
