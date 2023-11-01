import React, { useState } from 'react';
import { Box, Checkbox, FormControlLabel, Menu, MenuItem, Button } from '@mui/material';

const Dropdown = ({ title, options, onToggle }) => {
    const [anchorEl, setAnchorEl] = useState(null);

    function handleClick(event) {
        setAnchorEl(event.currentTarget);
    };

    function handleClose() {
        setAnchorEl(null);
    };

    return (
        <div>
            <Button onClick={handleClick}>{title}</Button>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                paper={{ 
                    style: {
                        maxHeight: '50px',
                        overflow: 'auto',
        },
    }}
>
                {options.map((option, index) => (
                    <MenuItem key={index}>
                        <FormControlLabel
                            control={
                                <Checkbox onChange={() => onToggle(option)} />
                            }
                            label={option}
                        />
                    </MenuItem>
                ))}
            </Menu>
        </div>
    );
};

export default Dropdown;
