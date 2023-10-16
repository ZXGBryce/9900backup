import { Drawer, List, ListItem, ListItemIcon, ListItemText, Icon, ButtonBase, Box, Typography, } from '@mui/material'
import { useNavigate } from 'react-router-dom'
const drawerWidth = 240; // Width of the sidebar


const SideBar = () => {
    const navigate = useNavigate()

    const paths = {
    'Dashboard': '/dashboard',
    'Analysis History': '/analysis-history',
    'New Analysis': '/newAnalysis',
    'Profile': '/profile',
    'Logout': '/logout'
    }

    function logoutAction () {
        localStorage.clear();
        // localStorage.removeItem('token');
        // localStorage.removeItem('email');
        navigate('/');
    }
    

return (
    <Drawer
    variant="permanent"
    style={{ 
        width: drawerWidth,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        zIndex: 10,
    }}
    PaperProps={{ 
        style: { 
            width: drawerWidth,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
        }
    }}
    >
        <List>
            {['Dashboard', 'Analysis History', 'New Analysis', 'Profile', 'Logout'].map((text, index) => (
                <ButtonBase 
                    key={text} 
                    style={{ width: '100%', justifyContent: 'flex-start', marginBottom: '10px' }}
                    onClick={() => {
                        if (text === "Logout"){
                            logoutAction()
                        } else {
                            navigate(paths[text])
                        }
                    }}
                >
                    <ListItem>
                        <ListItemIcon>
                            <Icon />
                        </ListItemIcon>
                        <ListItemText primary={
                            <Typography variant="h6">{text}</Typography>
                        } />
                    </ListItem>
                </ButtonBase>
            ))}
        </List>
     </Drawer>
   )
}

export default SideBar