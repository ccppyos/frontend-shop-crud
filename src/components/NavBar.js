import { AppBar, Toolbar, Typography, styled } from '@mui/material'
import React from 'react'
import { NavLink } from 'react-router-dom';

const Header = styled(AppBar)`
    background: #111111;
`;

const Tabs = styled(NavLink)`
    color: #FFFFFF;
    margin-right: 20px;
    text-decoration: none;
    font-size: 20px;
`;



const NavBar = () => {
    return (
        <Header position='static'>
            <Toolbar>
                <Tabs >Blaze</Tabs>
                <Tabs to="/orders">Orders</Tabs>
                <Tabs to="/products">Products</Tabs>
            </Toolbar>
        </Header>
    )
}

export default NavBar