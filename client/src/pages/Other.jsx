import Appbarone from "../components/Appbarone";
import Drawerminefixed from "../components/Drawerminefixed"
import Minipersistentdrawer from "../components/Minipersistentdrawer";
import { useMediaQuery } from "@mui/material";
import Otheronemobile from "./Otheronemobile";
import {observer} from 'mobx-react';

const Other = observer(() => {
  const matches = useMediaQuery('(min-width:1000px)');

  if (matches) {
    return <Minipersistentdrawer />
  }

  return (
    <div>
      <Drawerminefixed />
      <Appbarone />
      <Otheronemobile />
    </div>
  )
})

export default Other
