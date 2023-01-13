import { Button, Dialog, Select, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, Input, InputAdornment, InputLabel, OutlinedInput, TextField, MenuItem, Checkbox, FormControlLabel, FormGroup } from '@mui/material'
import React, { useEffect, useState } from 'react'
import axiosCrud from '../../config/crudAxios'


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

const EditDialog = ({ open, productSelected, handleCloseEdit, setProducts }) => {

    const [product, setProduct] = useState(productSelected)
    const onValueChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value })
    }
    const handleCheck = (e) => {
        setProduct({ ...product, active: e.target.checked })
    }

    const onSubmitProduct = async () => {
        console.log(product);
        try {
            const response = await axiosCrud.put(`/products/${product._id}`, product)
            setProducts((prevProducts) => {
                let updatedProducts = [...prevProducts]
                const indexItem =  updatedProducts.findIndex((i) => (i._id) === product._id) 
                updatedProducts[indexItem] = response.data
                return [...updatedProducts]
            });
        }
        catch (err) {
            console.log(err)
        }
        handleCloseEdit();
    }

    useEffect(() => {
        console.log(product);
    }, [product]);

    return (
        <div>
            <Dialog open={open} onClose={handleCloseEdit}>
                <DialogTitle>Add/Edit product</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        id="name"
                        label="Name of product"
                        name='name'
                        type="text"
                        fullWidth
                        variant="standard"  
                        value={product?.name}
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
                            value={product?.price}
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
                    <Button onClick={handleCloseEdit}>Cancel</Button>
                    <Button onClick={onSubmitProduct}>Add</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default EditDialog