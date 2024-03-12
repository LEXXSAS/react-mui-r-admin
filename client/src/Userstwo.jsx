import Appbarone from "./components/Appbarone"
import Drawerminefixed from "./components/Drawerminefixed"
import Minipersistentdrawer from "./components/Minipersistentdrawer"
import useMediaQuery from '@mui/material/useMediaQuery';
import Usersonemobiletwo from "./pages/Usersonemobiletwo";

const Users = () => {

  const matches = useMediaQuery('(min-width:1000px)');

  if (matches) {
    return <Minipersistentdrawer />
  }

  return (
    <>
    <Drawerminefixed />
    <Appbarone />
    <Usersonemobiletwo />
    </>
  )
}

export default Users
