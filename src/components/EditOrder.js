import { Button, FormControl, FormGroup, Input, InputLabel, Typography, styled, Grid, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useParams, useHistory, useNavigate } from 'react-router-dom'
import axiosCrud from '../config/crudAxios'
import DataTable from 'react-data-table-component';
import AddItemDialog from './AddItemDialog';
import dayjs from 'dayjs';
import EditItemDialog from './EditItemDialog';

const Container = styled(FormGroup)`
    width:50%;
    margin: 5% auto 0;
    & > div {
        margin-top: 20px;
    }
`

const initialValues = {
    name: '',
    username: '',
    email: '',
    phone: '',
}

const taxes = {
    subTotal: 0,
    cityTax: 0,
    countyTax: 0,
    stateTax: 0,
    federalTax: 0,
    totalTaxes: 0,
    totalAmount: 0,
}



const EditOrder = () => {

    const [order, setOrder] = useState(null);
    const [itemSelected, setItemSelected] = useState(null);
    const { id } = useParams();
    const [open, setOpen] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);

    let navigate = useNavigate();


    // const onValueChange = (e) => {
    //     setOrder({ ...order, customer: e.target.value })
    //     console.log(order);
    // }

    const getOrder = (async () => {
        try {
            const response = await axiosCrud.get(`/orders/${id}`);
            setOrder(response.data)

        } catch (err) {
            console.error(err);
        }
    })

    const handleCompleteRejectOrder = (async (complete) => {
        try {
            const response = await axiosCrud.put(`/orders/completeRejectOrder/${id}`, {
                statusOrder: complete
            });
            setOrder(response.data)
        } catch (err) {
            console.error(err);
        }
    })

    const handleEditItem = (e, row) => {
        setOpenEdit(true);
        setItemSelected(row);
    }

    const handleDeleteItem = async (e, row) => {
        try {
            const response = await axiosCrud.put(`/orders/deleteItem/${id}`, {
                item: row
            });
            setOrder(response.data)
        } catch (err) {
            console.error(err);
        }
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
        getOrder();
    }, []);

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
                    <Typography>{order.customer} </Typography>
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
                </Grid>
                <Grid container item style={{ paddingTop: "15px" }} justifyContent="flex-end">
                    <Button
                        variant="contained"
                        color="success"
                        onClick={() => handleCompleteRejectOrder(true)}
                        style={{ marginRight: "10px" }}
                    >
                        Complete Order
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleCompleteRejectOrder(false)}
                    >
                        Reject Order
                    </Button>
                </Grid>
            </Grid>
            <AddItemDialog open={open} order={order} orderId={id} setOrder={setOrder} handleClickOpen={handleClickOpen} handleClose={handleClose} />
            {itemSelected && <EditItemDialog itemSelected={itemSelected} open={openEdit} order={order} orderId={id} setOrder={setOrder} handleClickOpen={handleClickOpenEdit} handleClose={handleCloseEdit} />}
        </Grid>
    )
}

export default EditOrder