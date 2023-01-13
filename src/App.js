import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import AddOrderScreen from './components/Order/create/AddOrderScreen';
import CRUDShop from './components/CRUDShop';
import EditOrder from './components/EditOrder';
import NavBar from './components/NavBar';
import Orders from './components/Orders';
import ProductsScreen from './components/product/ProductsScreen';

//Routes


function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route exact path="/" element={<CRUDShop /> }/>
        <Route path="/orders" element={<Orders />}/>
        <Route path="/orders/addOrder" element={<AddOrderScreen/>}/>
        <Route path="/products" element={<ProductsScreen />}/>
        <Route path="/orders/:id" element={<EditOrder/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
