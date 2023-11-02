import React, { useState } from 'react';
import { Modal, TextField, Button } from '@mui/material';

const AddIndicatorModal = ({ open, onClose, onAdd }) => {
    const [indicator, setIndicator] = useState({
        name: '',
        value: '',
        environment: '',
        social: '',
        governance: ''
    })

    const handleChange = (field) => (event) => {
        setIndicator({
        ...indicator,
        [field]: event.target.value
        })
    }

    const handleAdd = () => {
        onAdd(indicator);
        onClose();
    }

    return (
        <Modal open={open} onClose={onClose}>
        <div style={{ padding: '20px', backgroundColor: 'white', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '300px' }}>
            <h2>Add New Indicator</h2>
            <TextField label="Name" value={indicator.name} onChange={handleChange('name')} fullWidth />
            <TextField label="Value" value={indicator.value} onChange={handleChange('value')} fullWidth />
            <TextField label="Environment" value={indicator.environment} onChange={handleChange('environment')} fullWidth />
            <TextField label="Social" value={indicator.social} onChange={handleChange('social')} fullWidth />
            <TextField label="Governance" value={indicator.governance} onChange={handleChange('governance')} fullWidth />
            <Button onClick={handleAdd} variant="contained" color="primary" style={{ marginTop: '10px' }}>Add</Button>
        </div>
        </Modal>
    )
}

export default AddIndicatorModal
