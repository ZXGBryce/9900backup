import { Drawer, List, ListItem, ListItemIcon, ListItemText, Icon, ButtonBase, Box, Typography, } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import "../css/SideBar.css"


function SideBar () {
    const navigate = useNavigate()

    function logoutAction () {
        localStorage.clear();
        // localStorage.removeItem('token');
        // localStorage.removeItem('email');
        navigate('/');
    }
    

return (
    <div>Sidebar</div>
   )
}

export default SideBar