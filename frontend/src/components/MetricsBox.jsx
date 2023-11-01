import { useState } from "react"
import React from 'react'
import { Card, CardContent, Typography } from '@mui/material'
import Button from '@mui/material/Button'

import Subcategory from './analysis/SubCategory'

function Category ({data, categoryName, subcategories, onUpdateValue, onAddIndicator}) {

    return (
        <div>
            {Object.entries(data).map(([categoryName, subcategories], index) => (
            <Card key={index} sx={{ margin: 2 }} style={{maxHeight: '300px', overflow: 'auto'}}>
                <CardContent>
                <Typography variant="h5" gutterBottom>
                    {categoryName}
                </Typography>
                {subcategories.map((subcategory, subIndex) => (
                    <Subcategory   key={subIndex} subcategory={subcategory} onUpdateValue={onUpdateValue} onAddIndicator={onAddIndicator} />
                ))}
                </CardContent>
            </Card>
            ))}
        </div>
        );
};

export default Category