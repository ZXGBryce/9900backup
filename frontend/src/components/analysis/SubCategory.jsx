import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Button } from '@mui/material';
import AddIndicatorModal from './AddIndicatorModal';

function Subcategory ({ categoryName, subcategory, onUpdateValue, onAddIndicator }) {
    const [open, setOpen] = useState(false)
    const [editableValue, setEditableValue] = useState(null)
    const [editIndex, setEditIndex] = useState(null)

    function handleToggle () {
        setOpen(prevOpen => !prevOpen)
    }

    function handleValueClick (value, index) {
        setEditableValue(value);
        setEditIndex(index);
        };
        
        function handleValueChange (event) {
            setEditableValue(event.target.value);
        };
        
        function handleValueUpdate () {
            onUpdateValue(categoryName, subcategory.name, editIndex, editableValue)
            setEditIndex(null);
        };

    // Add Modal 
    const [modalOpen, setModalOpen] = useState(false);

    const handleOpenModal = () => {
    setModalOpen(true);
    }

    const handleCloseModal = () => {
    setModalOpen(false);
    }

    const handleAddIndicator = (indicator) => {
    onAddIndicator(subcategory.name, indicator);
    }

    return (
    <div>
    <Button style={{marginTop:'10px'}} onClick={handleToggle} variant="outlined">
        {subcategory.name}
    </Button>
    {open && (
        <Table size="small">
        <TableHead>
            <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Value</TableCell>
            <TableCell>Environment</TableCell>
            <TableCell>Social</TableCell>
            <TableCell>Governance</TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {subcategory.indicators.map((indicator, index) => (
                <TableRow key={index}>
                    <TableCell>{indicator.name}</TableCell>
                    <TableCell>
                    {editIndex === index ? (
                        <input
                        type="text"
                        value={editableValue}
                        onChange={handleValueChange}
                        onBlur={handleValueUpdate}
                        />
                    ) : (
                        <span onClick={() => handleValueClick(indicator.value, index)}>
                        {indicator.value}
                        </span>
                    )}
                    </TableCell>
                    <TableCell>{indicator.environment}</TableCell>
                    <TableCell>{indicator.social}</TableCell>
                    <TableCell>{indicator.governance}</TableCell>
                </TableRow>
            ))}
        </TableBody>
        <Button onClick={handleOpenModal} variant="contained" color="primary" style={{ marginTop: '10px' }}>
            Add New Indicator
        </Button>
        <AddIndicatorModal open={modalOpen} onClose={handleCloseModal} onAdd={handleAddIndicator} />
        </Table>
    )}
    </div>
);
};

export default Subcategory;