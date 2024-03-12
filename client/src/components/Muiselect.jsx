import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Context } from '../App';
import {observer} from 'mobx-react';
import { useContext, useEffect } from 'react';

const Muiselect = observer(() => {
  const {store} = useContext(Context);

  useEffect(() => {
    store.setPageQty(5)
  }, [])

  const handleChange = (event) => {
    store.setPageQty(event.target.value);
    store.setCurrentPage(1);
  };

  return (
    <FormControl sx={{ m: 1, minWidth: 85 }} size="small">
      <InputLabel id="demo-select-small-label">PageQty</InputLabel>
      <Select
        labelId="demo-select-small-label"
        id="demo-select-small"
        value={store.pageQty}
        label="PageQty"
        onChange={handleChange}
      >
        <MenuItem value={5}>5</MenuItem>
        <MenuItem value={15}>15</MenuItem>
        <MenuItem value={25}>25</MenuItem>
        <MenuItem value={0}>All</MenuItem>
      </Select>
    </FormControl>
  )
})

export default Muiselect
