import Appbarone from "./components/Appbarone"
import Drawerminefixed from "./components/Drawerminefixed"
import Minipersistentdrawer from "./components/Minipersistentdrawer"
import useMediaQuery from '@mui/material/useMediaQuery';
import Adminlistpagemobile from "./pages/Adminlistpagemobile";

const Adminlistpage = () => {

  const matches = useMediaQuery('(min-width:1000px)');

  if (matches) {
    return <Minipersistentdrawer />
  }

  return (
    <>
    <Drawerminefixed />
    <Appbarone />
    <Adminlistpagemobile />
    </>
  )
}

export default Adminlistpage
