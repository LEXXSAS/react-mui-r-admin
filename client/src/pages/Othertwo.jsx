import { useMediaQuery } from "@mui/material";
import Appbarone from "../components/Appbarone";
import Drawerminefixed from "../components/Drawerminefixed";
import Minipersistentdrawer from "../components/Minipersistentdrawer";
import Othertwopage from "./Othertwopage";
import {observer} from 'mobx-react';

const Othertwo = observer(() => {
  const matches = useMediaQuery('(min-width:1000px)');

  if (matches) {
    return <Minipersistentdrawer />
  }

  return (
    <>
      <Drawerminefixed />
      <Appbarone />
      <Othertwopage />
    </>
  )
})

export default Othertwo
