import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, TextField, MenuItem } from '@mui/material'
import React, { useEffect, useState } from 'react'
import axiosCrud from '../../../config/crudAxios'


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
            setOrder((prevOrder) => {
                let updatedItems = [...prevOrder.items]
                const indexItem =  updatedItems.findIndex((i) => (i.product._id) === item.product._id) 
                updatedItems[indexItem].qty = +(item.qty)
                const subTotal = updatedItems.reduce((partialSum, item) => partialSum + (item.product.price) * (item.qty), 0)
                const totalTaxes = subTotal * (0.01 + 0.05 + 0.08 + 0.02)
                
                return {
                    ...prevOrder,
                    items: updatedItems,
                    taxesAmount: subTotal,
                    totalTaxes: totalTaxes,
                    totalAmount: subTotal + totalTaxes,
                }
            })
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
                        value={`${+(item.qty*item.product.price).toPrecision(2)}`}
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