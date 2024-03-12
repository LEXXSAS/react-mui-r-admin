import Appbarone from "./components/Appbarone"
import Drawerminefixed from "./components/Drawerminefixed"
import Minipersistentdrawer from "./components/Minipersistentdrawer"
import useMediaQuery from '@mui/material/useMediaQuery';
import Usersonemobile from "./pages/Usersonemobile";

const Users = () => {

  const matches = useMediaQuery('(min-width:1000px)');

  if (matches) {
    return <Minipersistentdrawer />
  }

  return (
    <>
    <Drawerminefixed />
    <Appbarone />
    <Usersonemobile />
    </>
  )
}

export default Users
