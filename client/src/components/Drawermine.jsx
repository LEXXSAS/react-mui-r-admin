import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import GroupIcon from '@mui/icons-material/Group';
import DownloadingIcon from '@mui/icons-material/Downloading';
import { useAppStore } from '../appStore';
import { Link } from 'react-router-dom';
import {observer} from 'mobx-react';

const Drawermine = observer(() => {

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
      </List>
      <Divider />
      <List component="nav" aria-label="secondary mailbox folder" disablePadding>
        <ListItemButton
          selected={selectedIndex === 2}
          onClick={(event) => handleListItemClick(event, 2)}
        >
          <ListItemIcon>
            <DownloadingIcon />
          </ListItemIcon>
          <ListItemText primary="Admin list" />
        </ListItemButton>
        <ListItemButton
          selected={selectedIndex === 3}
          onClick={(event) => handleListItemClick(event, 3)}
        >
          <ListItemIcon>
            <DownloadingIcon />
          </ListItemIcon>
          <ListItemText primary="Statistics" />
        </ListItemButton>
      </List>
    </Box>
  );

  return (
    <div>
        <>
          <Button onClick={toggleDrawer(true)}>{'menu'}</Button>
          <Drawer
          anchor={'left'}
          open={open}
          onClose={toggleDrawer(false)}
          >
            {list()}
          </Drawer>
        </>
    </div>
  );
});

export default Drawermine;
