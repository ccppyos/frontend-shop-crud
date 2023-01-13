import { Button, Dialog, Select, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, TextField, MenuItem } from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import axiosCrud from '../config/crudAxios'


const newItem = {
    _id: '',
    qty: 0,
    cost: 0,
    product: {},
}

const newProduct = {
    _id: '',
    name: '',
    price: 0,
}

const categories = [
    "Cookies", "Candies", "Cakes", "Desserts", "Drinks"
]

const AddItemDialog = ({ orderId, open, order, handleClose, setOrder }) => {

    const [products, setProducts] = useState([])
    const [productSelected, setProductSelected] = useState(newProduct);
    const [item, setItem] = useState(newItem);

    const getProducts = (async () => {
        try {
            const response = await axiosCrud.get("/products");
            const availableProducts = response.data.filter(item => order.items.every(oi => oi.product._id !== item._id))
            setProducts(availableProducts)

        } catch (err) {
            console.error(err);
        }
    })

    const onItemChange = (e) => {
        setProductSelected(e.target.value)
    }

    const onValueChange = (e) => {
        setItem({ ...newItem, qty: e.target.value })
    }

    useEffect(() => {
        getProducts();
    }, [])

    useEffect(() => {
        console.log(item);
    }, [item])

    useEffect(() => {
        console.log(productSelected);
    }, [productSelected])

    const onSubmitProduct = async () => {
        try {
            const newItem2 = {
                qty: +(item.qty),
                cost: item.qty * productSelected.price,
                product: {
                    _id: productSelected._id,
                    name: productSelected.name,
                    price: productSelected.price
                },
            }
            const response = await axiosCrud.put(`/orders/addItem/${orderId}`, {
                qty: item.qty,
                cost: item.qty * productSelected.price,
                price: productSelected.price,
                _productId: productSelected._id
            })
            setOrder((prevOrder) => {
                let updatedItems = [...prevOrder.items]
                updatedItems.push(newItem2)
                console.log(updatedItems);
                const subTotal = updatedItems.reduce((partialSum, item) => partialSum + (item.product.price) * (item.qty), 0)
                const totalTaxes = subTotal * (0.01 + 0.05 + 0.08 + 0.02)
                return {
                    ...prevOrder,
                    items: updatedItems,
                    taxesAmount: subTotal,
                    totalTaxes: totalTaxes,
                    totalAmount: subTotal + totalTaxes,
                }
            }
            )
        }
        catch (err) {
            console.log(err)
        }
        handleClose();
    }

    return (
        <div>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Add Items</DialogTitle>
                <DialogContent>
                    <FormControl fullWidth sx={{ marginTop: 5 }}>
                        <InputLabel id='products'>Products</InputLabel>
                        <Select
                            labelId='products'
                            id='products'
                            name='product'
                            // value={product?.category}
                            label="Category"
                            onChange={onItemChange}
                        >
                            {products.map((item, i) => (
                                <MenuItem key={i} value={item}>{item.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        style={{ marginTop: "20px" }}
                        id="outlined-read-only-input"
                        label="Unit Price"
                        value={productSelected.price}
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                    <TextField
                        style={{ marginTop: "20px" }}
                        id="outlined-read-only-input"
                        label="Qty"
                        value={item.qty}
                        onChange={(e) => onValueChange(e)}

                    />
                    <TextField
                        style={{ marginTop: "20px" }}
                        id="outlined-read-only-input"
                        label="Cost"
                        name="cost"
                        value={`${item.qty * productSelected.price}`}
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={onSubmitProduct}>Add</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default AddItemDialog