import Appbarone from "../components/Appbarone";
import Drawerminefixed from "../components/Drawerminefixed"
import Minipersistentdrawer from "../components/Minipersistentdrawer";
import { useMediaQuery } from "@mui/material";
import {observer} from 'mobx-react';
import Statisticsone from "./Statisticsone";

const Statistics = observer(() => {
  const matches = useMediaQuery('(min-width:1000px)');

  if (matches) {
    return <Minipersistentdrawer />
  }

  return (
    <div>
      <Drawerminefixed />
      <Appbarone />
      <Statisticsone />
    </div>
  )
})

export default Statistics
