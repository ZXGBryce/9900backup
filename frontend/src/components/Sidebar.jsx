import { Drawer, List, ListItem, ListItemIcon, ListItemText, Icon } from '@mui/material';
import ButtonBase from '@mui/material/ButtonBase';

const drawerWidth = 240; // Width of the sidebar

const SideBar = () => (
    <Drawer
        variant="permanent"
        style={{ width: drawerWidth }}
        PaperProps={{ style: { width: drawerWidth } }}
    >
        <List>
            {['Dashboard', 'Analysis History', 'Profile', 'Logout'].map((text, index) => (
                <ButtonBase key={text} style={{ width: '100%', justifyContent: 'flex-start' }}>
                    <ListItem>
                        <ListItemIcon>
                            <Icon>inbox</Icon>
                        </ListItemIcon>
                        <ListItemText primary={text} />
                    </ListItem>
                </ButtonBase>
            ))}
        </List>
    </Drawer>
)

export default SideBar


