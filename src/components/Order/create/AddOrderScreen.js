import { Button, FormGroup, Typography, styled, Grid, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axiosCrud from '../../../config/crudAxios'
import DataTable from 'react-data-table-component';
import dayjs from 'dayjs';
import AddItemDialog from './AddItemDialog';
import EditItemDialog from './EditItemDialog';
import randomId from '../../../utils/randomId';

const Container = styled(FormGroup)`
    width:50%;
    margin: 5% auto 0;
    & > div {
        margin-top: 20px;
    }
`
const newOrder = {
    orderNumber: randomId(),
    statusOrder: 'Pending',
    date: dayjs(new Date()).format('DD/MM/YYYY'),
    customer: '',
    taxesAmount: 0,
    totalTaxes: 0,
    totalAmount: 0,
    items: []
}


const AddOrder = () => {

    const [order, setOrder] = useState(newOrder);
    const [itemSelected, setItemSelected] = useState(null);
    const { id } = useParams();
    const [open, setOpen] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);

    const onValueChange = (e) => {
        setOrder({ ...order, customer: e.target.value })
        console.log(order);
    }

    let navigate = useNavigate();

    const handleEditItem = (e, row) => {
        console.log("ITEM - ROW", row)
        setOpenEdit(true);
        setItemSelected(row);
    }

    const onSubmitOrder = (async () => {
        try {
            const response = await axiosCrud.post("/orders/createOrder", order)
            console.log(response.data);
            setOrder(order);
            navigate(-1)
        }
        catch (err) {
            console.log(err)
        }
        handleClose();
    })

    const handleDeleteItem = (e, row) => {

        setOrder((prevOrder) => {
            let newItems = [...prevOrder.items]
            newItems = newItems.filter(item => item.product._id !== row.product._id)
            console.log(newItems);
            const subTotal = newItems.reduce((partialSum, item) => partialSum + (item.product.price) * (item.qty), 0)
            const totalTaxes = subTotal * (0.01 + 0.05 + 0.08 + 0.02)
            return {
                ...prevOrder,
                items: newItems,
                taxesAmount: subTotal,
                totalTaxes: totalTaxes,
                totalAmount: subTotal + totalTaxes,
            }
        })

    }

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleClickOpenEdit = () => {
        setOpenEdit(true);
    };

    const handleCloseEdit = () => {
        setOpenEdit(false);
        setItemSelected(null);
    };

    useEffect(() => {
        console.log(order)
    }, [order]);


    const columns = [
        {
            name: 'N°',
            selector: (row, i) => i + 1,
        },
        {
            name: 'Name',
            selector: row => row.product.name,
        },
        {
            name: 'Quantity',
            selector: row => row.qty,
        },
        {
            name: 'Unit Price',
            selector: row => row.product.price,
        },
        {
            name: 'Actions',
            button: true,
            cell: (row) => <div>
                <Button onClick={(e) => handleEditItem(e, row)}>Edit</Button>
                <Button onClick={(e) => handleDeleteItem(e, row)}>Delete</Button>
            </div>
        },
    ];


    return (
        order &&
        <Grid container direction="column" spacing={2} style={{ width: "80%", margin: "20px auto 0" }}>
            <Grid container justifyContent="flex-end">
                <Grid item>
                    <Button onClick={() => navigate(-1)} style={{ background: "#6c757d" }} variant="contained">Back</Button>
                </Grid>
            </Grid>
            <Grid item>
                <Typography variant='h2'>Order {order.orderNumber} </Typography>
            </Grid>
            <Grid container item direction="row" alignItems="center">
                <Grid item xs={1.5}>
                    <Typography>Customer: </Typography>
                </Grid>
                <Grid item>
                    <TextField
                        id="outlined-read-only-input"
                        value={order.customer}
                        onChange={(e) => onValueChange(e)}
                    />
                </Grid>
            </Grid>
            <Grid container item direction="row">
                <Grid item xs={1.5}>
                    <Typography>Status: </Typography>
                </Grid>
                <Grid item>
                    <Typography>{order.statusOrder} </Typography>
                </Grid>
            </Grid>
            <Grid container item direction="row">
                <Grid item xs={1.5}>
                    <Typography>Date: </Typography>
                </Grid>
                <Grid item >
                    <Typography>{dayjs(order.date).format('DD/MM/YYYY')} </Typography>
                </Grid>
            </Grid>
            <Grid item >
                <DataTable columns={columns} data={order.items} pagination />
            </Grid>
            <Grid container item justifyContent="flex-end">
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleClickOpen}
                >
                    Add Item+
                </Button>
            </Grid>
            <Grid item>
                <Grid container direction="column" spacing={1} justifyContent="flex-end">
                    <Grid container item direction="row" justifyContent="flex-end">
                        <Grid item xs={2}>
                            <Typography style={{ fontWeight: "bold" }}>Subtotal: </Typography>
                        </Grid>
                        <Grid item xs={1}>
                            <Typography>${order.taxesAmount}</Typography>
                        </Grid>
                    </Grid>
                    <Grid container item direction="row" justifyContent="flex-end">
                        <Grid item xs={3}>
                            <Typography style={{ fontWeight: "bold" }}>Taxes</Typography>
                        </Grid>
                    </Grid>
                    <Grid container item direction="row" alignItems="center" style={{ marginLeft: "10px" }} justifyContent="flex-end">
                        <Grid item xs={2}>
                            <Typography style={{ fontWeight: "bold", fontSize: "10px" }}>Total City Tax</Typography>
                        </Grid>
                        <Grid item xs={1}>
                            <Typography>${+(order.taxesAmount * 0.1).toPrecision(2)}</Typography>
                        </Grid>
                    </Grid>
                    <Grid container item direction="row" alignItems="center" style={{ marginLeft: "10px" }} justifyContent="flex-end">
                        <Grid item xs={2}>
                            <Typography style={{ fontWeight: "bold", fontSize: "10px" }}>Total County Tax</Typography>
                        </Grid>
                        <Grid item xs={1}>
                            <Typography>${+(order.taxesAmount * 0.05).toPrecision(2)}</Typography>
                        </Grid>
                    </Grid>
                    <Grid container item direction="row" alignItems="center" style={{ marginLeft: "10px" }} justifyContent="flex-end">
                        <Grid item xs={2}>
                            <Typography style={{ fontWeight: "bold", fontSize: "10px" }}>Total State Tax</Typography>
                        </Grid>
                        <Grid item xs={1}>
                            <Typography>${+(order.taxesAmount * 0.08).toPrecision(2)}</Typography>
                        </Grid>
                    </Grid>
                    <Grid container item direction="row" alignItems="center" style={{ marginLeft: "10px" }} justifyContent="flex-end">
                        <Grid item xs={2}>
                            <Typography style={{ fontWeight: "bold", fontSize: "10px" }}>Total Federal Tax</Typography>
                        </Grid>
                        <Grid item xs={1}>
                            <Typography>${+(order.taxesAmount * 0.02).toPrecision(2)}</Typography>
                        </Grid>
                    </Grid>
                    <Grid container item direction="row" justifyContent="flex-end">
                        <Grid item xs={2}>
                            <Typography style={{ fontWeight: "bold" }}>Total Taxes </Typography>
                        </Grid>
                        <Grid item xs={1}>
                            <Typography>${+(order.totalTaxes).toPrecision(2)}</Typography>
                        </Grid>
                    </Grid>
                    <Grid container item direction="row" justifyContent="flex-end">
                        <Grid item xs={2}>
                            <Typography style={{ fontWeight: "bold" }}>Total</Typography>
                        </Grid>
                        <Grid item xs={1}>
                            <Typography>${+(order.totalAmount).toPrecision(2)}</Typography>
                        </Grid>
                    </Grid>
                    <Grid container item style={{ paddingTop: "15px" }} justifyContent="center">
                    <Button
                        variant="contained"
                        color="success"
                        style={{ marginRight: "10px" }}
                        onClick={onSubmitOrder}
                    >
                        Create Order
                    </Button>
                </Grid>
                </Grid>
            </Grid>
            <AddItemDialog open={open} order={order} orderId={id} setOrder={setOrder} handleClickOpen={handleClickOpen} handleClose={handleClose} />
            {itemSelected && <EditItemDialog itemSelected={itemSelected} open={openEdit} order={order} orderId={id} setOrder={setOrder} handleClickOpen={handleClickOpenEdit} handleClose={handleCloseEdit} />}
        </Grid>
    )
}

export default AddOrder