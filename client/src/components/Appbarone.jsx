import { IconButton, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import AppBar from '@mui/material/AppBar';
import Stack from '@mui/material/Stack';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useAppStore } from '../appStore';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Link, useLocation } from 'react-router-dom';
import { Context } from '../App';
import { useContext } from 'react';
import {observer} from 'mobx-react';
import { useState } from 'react';

const Appbarone = observer(() => {
  const {store} = useContext(Context);
  const updateOpen = useAppStore((state) => state.updateOpen);

  const {pathname} = useLocation();

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    updateOpen(open);
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);


  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const userSignOut = () => {
    store.logout()
  }

  return (
    <Stack spacing={2} sx={{ flexGrow: 1 }}>
    <AppBar position="static" color="primary">
    <Toolbar>
    <IconButton
        edge="start"
        color="inherit"
        size="large"
        aria-label="menu"
        sx={{ mr: 2 }}
        onClick={toggleDrawer(true)}
      >
        <MenuIcon />
      </IconButton>
      <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            MUI R-admin
      </Typography>
      <IconButton
        size="large"
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        color="inherit"
        onClick={handleClick}
      >
        <AccountCircle />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {store.isCount >= 3 || pathname === '/otherpage' ?
        <MenuItem disabled>Добавить пользователя</MenuItem> :
        <Link to="/create" className="btn btn-primary"><MenuItem onClick={handleClose}>Добавить пользователя</MenuItem></Link>}
        <MenuItem onClick={() => {handleClose,  userSignOut()}}>Выйти</MenuItem>
      </Menu>
      </Toolbar>
      </AppBar>
      </Stack>
  )
});

export default Appbarone;
