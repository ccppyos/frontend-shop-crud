import { Table, TableBody, TableCell, TableHead, TableRow, styled, Button, Grid } from '@mui/material'
import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import axiosCrud from '../config/crudAxios'
import dayjs from 'dayjs';
import DataTable from 'react-data-table-component';
import { FilterComponent } from './FilterComponent';

const StyledTable = styled(Table)`
    
    margin: 50px auto 0 auto;
`

const Thead = styled(TableRow)`
    background: #000;
    & > th {
        color: #fff;
        size: 20px;
    }
`

const Orders = () => {

    const [orders, setOrders] = useState([]);
    const [filterText, setFilterText] = useState('');
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

    const getOrders = (async () => {
        try {
            const response = await axiosCrud.get("/orders");
            setOrders(response.data)
            console.log(orders)

        } catch (err) {
            console.error(err);
        }
    })

    useEffect(() => {
        getOrders();
    }, []);

    const columns = [
        {
            name: 'N°',
            selector: (row) => row.orderNumber,
            sortable: true,
        },
        {
            name: 'Consumer',
            selector: row => row.customer,
            sortable: true,
        },
        {
            name: 'Status',
            selector: row => row.statusOrder,
            sortable: true,
        },
        {
            name: 'Date',
            selector: row => dayjs(row.date).format('DD/MM/YYYY'),
            sortable: true,
        },
        {
            name: 'Total',
            selector: row => `$${+(row.totalAmount).toPrecision(2)}`,
            sortable: true,
        },
        {
            name: 'Actions',
            button: true,
            cell: (row) => <div>
                <Button
                    variant="contained"
                    style={{ marginRight: "10px" }}
                    component={Link}
                    to={`/orders/${row._id}`}
                >
                    Edit
                </Button>
            </div>
        },
    ];

    const filteredItems = orders.filter(
        item => item.customer && item.customer.toLowerCase().includes(filterText.toLowerCase()),
    );
    const subHeaderComponentMemo = useMemo(() => {
        const handleClear = () => {
            if (filterText) {
                setResetPaginationToggle(!resetPaginationToggle);
                setFilterText('');
            }
        };
        return (
            <FilterComponent onFilter={e => setFilterText(e.target.value)} onClear={handleClear} filterText={filterText} />
        );
    }, [filterText, resetPaginationToggle]);

    return (
        <Grid container style={{ width: "80%", margin: "50px auto 0 auto" }} >

            <Grid container justifyContent="flex-end">
                <Grid item>
                    <Button
                        variant="contained"
                        component={Link}
                        to={`/orders/addOrder`}
                    >
                        Create Order</Button>
                </Grid>
            </Grid>
            <DataTable
                columns={columns}
                data={filteredItems}
                pagination
                paginationResetDefaultPage={resetPaginationToggle} // optionally, a hook to reset pagination to page 1
                subHeader
                subHeaderComponent={subHeaderComponentMemo}
                selectableRows
                persistTableHead
            />
        </Grid>

    )
}

export default Orders