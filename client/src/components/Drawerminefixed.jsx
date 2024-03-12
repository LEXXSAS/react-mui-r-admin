import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import GroupIcon from '@mui/icons-material/Group';
import DownloadingIcon from '@mui/icons-material/Downloading';
import { useAppStore } from '../appStore';
import { Link } from 'react-router-dom';
import Container from '@mui/material/Container';
import {observer} from 'mobx-react';

const Drawerminefixed = observer(() => {
  const updateOpen = useAppStore((state) => state.updateOpen);
  const open = useAppStore((state) => state.dopen);
  const setSelectedIndex = useAppStore((state) => state.setSelectedIndex);
  const selectedIndex = useAppStore((state) => state.selectedIndex);
  const handleListItemClick = (event, index) => {
  setSelectedIndex(index);
  };

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    updateOpen(open);
  };

  const list = () => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer()}
      onKeyDown={toggleDrawer()}
    >
      <List component="nav" aria-label="main mailbox folders" disablePadding>
      <Link to={`/users`}>
        <ListItemButton
          selected={selectedIndex === 0}
          onClick={(event) => handleListItemClick(event, 0)}
        >
          <ListItemIcon>
            <GroupIcon />
          </ListItemIcon>
          <ListItemText primary="Users" />
        </ListItemButton>
        </Link>
        <Link to={`/otherpage`}>
        <ListItemButton
          selected={selectedIndex === 1}
          onClick={(event) => handleListItemClick(event, 1)}
        >
          <ListItemIcon>
            <GroupIcon />
          </ListItemIcon>
          <ListItemText primary="Users two" />
        </ListItemButton>
        </Link>
        <Link to={`/othertwo`}>
        <ListItemButton
          selected={selectedIndex === 2}
          onClick={(event) => handleListItemClick(event, 2)}
        >
          <ListItemIcon>
            <GroupIcon />
          </ListItemIcon>
          <ListItemText primary="Othertwo" />
        </ListItemButton>
        </Link>
      </List>
      <Divider />
      <List component="nav" aria-label="secondary mailbox folder" disablePadding>
        <Link to={`/adminlistpage`}>
        <ListItemButton
          selected={selectedIndex === 3}
          onClick={(event) => handleListItemClick(event, 3)}
        >
          <ListItemIcon>
            <DownloadingIcon />
          </ListItemIcon>
          <ListItemText primary="Admin list" />
        </ListItemButton>
        </Link>
        <Link to={`/statistics`}>
        <ListItemButton
          selected={selectedIndex === 4}
          onClick={(event) => handleListItemClick(event, 4)}
        >
          <ListItemIcon>
            <DownloadingIcon />
          </ListItemIcon>
          <ListItemText primary="Statistics" />
        </ListItemButton>
        </Link>
      </List>
    </Box>
  );

  return (
    <div>
        <Container maxWidth="xl" >
          <Drawer
          anchor={'left'}
          open={open}
          onClose={toggleDrawer(false)}
          >
            {list()}
          </Drawer>
        </Container>
    </div>
  );
});

export default Drawerminefixed;
