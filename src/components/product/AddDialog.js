import { Button, Dialog, Select, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, Input, InputAdornment, InputLabel, OutlinedInput, TextField, MenuItem, Checkbox, FormControlLabel, FormGroup } from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'


const newProduct = {
    _id: '',
    name: '',
    category: '',
    price: '',
    active: false,
}

const categories = [
    "Cookies", "Candies", "Cakes", "Desserts", "Drinks"
]

const AddEditDialog = ({ open, handleClose, setProducts }) => {

    const [product, setProduct] = useState(newProduct)
    const onValueChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value })
    }
    const handleCheck = (e) => {
        setProduct({ ...product, active: e.target.checked })
    }



    const onSubmitProduct = async () => {
        console.log(product);
        try {
            const response = await axios.post("http://localhost:5000/api/products/createProduct", product)
            console.log(response.data);
            product._id = response.data._id;
            setProducts((prevProducts) => [...prevProducts, product]);
        }
        catch (err) {
            console.log(err)
        }
        handleClose();
    }

    useEffect(() => {
        console.log(product);
    }, [product]);

    return (
        <div>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Add/Edit product</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Name of product"
                        name='name'
                        type="text"
                        fullWidth
                        variant="standard"
                        onChange={(e) => onValueChange(e)}
                    />
                    <FormControl fullWidth sx={{ marginTop: 5 }}>
                        <InputLabel id="categories">Category</InputLabel>
                        <Select
                            labelId="categories"
                            id="categories"
                            name='category'
                            value={product?.category}
                            label="Category"
                            onChange={onValueChange}
                        >
                            {categories.map((item, i) => (
                                <MenuItem key={i} value={item}>{item}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth sx={{ marginTop: 5 }}>
                        <InputLabel htmlFor="outlined-adornment-amount">Price</InputLabel>
                        <Input
                            id="price"
                            startAdornment={<InputAdornment position="start">$</InputAdornment>}
                            label="price"
                            onChange={(e) => onValueChange(e)}
                            name="price"
                        />
                    </FormControl>
                    <FormGroup>
                        <FormControlLabel
                            control={<Checkbox 
                                color="primary"
                                checked={product.active}
                                onChange={handleCheck}
                            />
                            } label="Active" />
                    </FormGroup>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={onSubmitProduct}>Add</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default AddEditDialog