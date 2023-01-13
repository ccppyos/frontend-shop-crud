import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, TextField, MenuItem } from '@mui/material'
import React, { useEffect, useState } from 'react'
import axiosCrud from '../config/crudAxios'


const categories = [
    "Cookies", "Candies", "Cakes", "Desserts", "Drinks"
]

const EditItemDialog = ({ orderId, itemSelected, open, order, handleClose, setOrder }) => {

    console.log("Ingrese al dialogo ", itemSelected)

    const [item, setItem] = useState(itemSelected);

    const onValueChange = (e) => {
        setItem({ ...item, qty: e.target.value })
    }
   
    useEffect(() => {
        console.log(item);
    }, [item])


    const onSubmitProduct = async () => {
        try {
            const newItem2 = {
                qty: +(item.qty),
                cost: item.qty * item.product.price,
                product: {
                    _id: item.product._id,
                    name: item.product.name,
                    price: item.product.price
                },
            }
            const response = await axiosCrud.put(`/orders/updateItem/${orderId}`, {
                item: item,
            })
            setOrder(response.data)
        }
        catch (err) {
            console.log(err)
        }
        handleClose();
    }

    return (
        <div>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Edit item</DialogTitle>
                <DialogContent>
                    <TextField
                        style={{ marginTop: "20px" }}
                        id="outlined-read-only-input"
                        label="Product"
                        value={item.product.name}
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                    <TextField
                        style={{ marginTop: "20px" }}
                        id="outlined-read-only-input"
                        label="Unit Price"
                        value={item.product.price}
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
                        value={`${item.qty*item.product.price}`}
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={onSubmitProduct}>Save</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default EditItemDialog