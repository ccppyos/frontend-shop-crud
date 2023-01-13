import { Table, TableBody, TableCell, TableHead, styled, TableRow, Button, Grid, TextField } from '@mui/material'
import React, { useEffect, useMemo, useState } from 'react'
import DataTable from 'react-data-table-component';
import axiosCrud from '../../config/crudAxios';
import AddDialog from './AddDialog';
import EditDialog from './EditDialog';
import { FilterComponent } from './FilterComponent';

const ProductsScreen = () => {


    const [open, setOpen] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [products, setProducts] = useState([]);
    const [productSelected, setProductSelected] = useState(null);
    const [filterText, setFilterText] = useState('');
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleClickOpenEdit = (product) => {
        setOpenEdit(true);
        setProductSelected(product)
    };

    const handleCloseEdit = () => {
        setOpenEdit(false);
        setProductSelected(null)

    };
    const StyledTable = styled(Table)`
        margin: 20px auto 0 auto;

    `
    const Thead = styled(TableRow)`
        background: #000;
        & > th {
            color: #fff;
            size: 20px;
        }
    `
    const getProducts = (async () => {
        try {
            const response = await axiosCrud.get("/products");
            setProducts(response.data)
            console.log(products)

        } catch (err) {
            console.error(err);
        }
    })

    useEffect(() => {
        getProducts();
    }, [])

    const filteredItems = products.filter(
        item => item.name && item.name.toLowerCase().includes(filterText.toLowerCase()),
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



    const columns = [
        {
            name: 'N°',
            selector: (row, i) => i + 1,
            sortable: true,
        },
        {
            name: 'Name',
            selector: row => row.name,
            sortable: true,
        },
        {
            name: 'Category',
            selector: row => row.category,
            sortable: true,
        },
        {
            name: 'Price',
            selector: row => row.price,
            sortable: true,
        },
        {
            name: 'Status',
            selector: row => row.active ? 'Active' : 'Inactive',
            sortable: true,
        },
        {
            name: 'Actions',
            button: true,
            cell: (row) => <div>
                <Button
                    variant="contained"
                    style={{ marginRight: "10px" }}
                    color="success"
                    onClick={() => handleClickOpenEdit(row)}
                >
                    Edit
                </Button>
            </div>
        },
    ];

    return (
        <Grid container direction="column" style={{ width: "90%", margin: "20px auto 0" }}>
            <Grid item xs={3}>
                <Grid container justifyContent="flex-end">
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleClickOpen}
                    >
                        Create Product
                    </Button>
                </Grid>
            </Grid>
            <Grid item>
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

            <AddDialog open={open} setProducts={setProducts} handleClickOpen={handleClickOpen} handleClose={handleClose} />
            {productSelected && <EditDialog productSelected={productSelected} open={openEdit} setProducts={setProducts} handleClickOpenEdit={handleClickOpenEdit} handleCloseEdit={handleCloseEdit} />}
        </Grid>
    )
}

export default ProductsScreen