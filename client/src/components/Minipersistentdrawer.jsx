import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AccountCircle from '@mui/icons-material/AccountCircle';
import GroupIcon from '@mui/icons-material/Group';
import DownloadingIcon from '@mui/icons-material/Downloading';
import Usersone from '../pages/Usersone';
import Othertwopage from '../pages/Othertwopage';
import { Link, useLocation } from 'react-router-dom';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Context } from '../App';
import { useContext } from 'react';
import { useAppStore } from '../appStore';
import {observer} from 'mobx-react';
import Otherone from '../pages/Otherone';
import { useState } from 'react';
import Adminone from '../pages/Adminone';
import Statisticsone from '../pages/Statisticsone';

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

const Minipersistentdrawer = observer(() => {
  const {store} = useContext(Context);

  const updateOpenfscrn = useAppStore((state) => state.updateOpenfscrn);
  const open = useAppStore((state) => state.dopenfscrn);

  const setSelectedIndex = useAppStore((state) => state.setSelectedIndex);
  const selectedIndex = useAppStore((state) => state.selectedIndex);

  const {pathname} = useLocation();

  console.log('selectedIndex', selectedIndex)

    const handleListItemClick = (index) => {
    setSelectedIndex(index);
  };

  const theme = useTheme();

  const handleDrawerOpen = () => {
    updateOpenfscrn(true);
  };

  const handleDrawerClose = () => {
    updateOpenfscrn(false);
  };
// small menu
  const [anchorEl, setAnchorEl] = useState(null);
  const opentwo = Boolean(anchorEl);

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
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: 'none' }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
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
        open={opentwo}
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
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
            <ListItem disablePadding sx={{ display: 'block' }}>
            <Link to={`/users`}>
            <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              onClick={() => handleListItemClick(0)}
            >
              <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
              >
                <GroupIcon />
              </ListItemIcon>
              <ListItemText primary={'Users'} sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
            </Link>
            </ListItem>
            <ListItem disablePadding sx={{ display: 'block' }}>
            <Link to={`/otherpage`}>
            <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              onClick={() => handleListItemClick(1)}
            >
              <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
              >
                <GroupIcon />
              </ListItemIcon>
              <ListItemText primary={'Users two'} sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
            </Link>
            </ListItem>
            <ListItem disablePadding sx={{ display: 'block' }}>
            <Link to={`/othertwo`}>
            <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              onClick={() => handleListItemClick(2)}
            >
              <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
              >
                <GroupIcon />
              </ListItemIcon>
              <ListItemText primary={'Othertwo'} sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
            </Link>
            </ListItem>
        </List>
        <Divider />
        <List>
            <ListItem disablePadding sx={{ display: 'block' }}>
            <Link to={`/adminlistpage`}>
            <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              onClick={() => handleListItemClick(3)}
            >
              <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
              >
                <DownloadingIcon />
              </ListItemIcon>
              <ListItemText primary={'Admin list'} sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
            </Link>
            </ListItem>
            <ListItem disablePadding sx={{ display: 'block' }}>
            <Link to={`/statistics`}>
            <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
                onClick={() => handleListItemClick(4)}
            >
              <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
              >
                <DownloadingIcon />
              </ListItemIcon>
              <ListItemText primary={'Statistics'} sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
            </Link>
            </ListItem>
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        {selectedIndex === 0 && <Usersone />} 
        {selectedIndex === 1 && <Otherone />} 
        {selectedIndex === 2 && <Othertwopage />}
        {selectedIndex === 3 && <Adminone />}
        {selectedIndex === 4 && <Statisticsone />}
      </Box>
    </Box>
  );
})

export default Minipersistentdrawer;
