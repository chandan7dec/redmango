import React, { useEffect } from 'react';
import { Header, Footer } from '../Components/Layout';
import { Home, MenuItemDetails, NotFound, ShoppingCart } from '../Pages';
import { Routes,Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useGetShoppingCartQuery } from '../Apis/shoppingCartApi';
import { setshoppingCart } from '../Storage/Redux/shoppingCartSlice';

function App() {
  const dispatch = useDispatch();

  const {data, isLoading} = useGetShoppingCartQuery("4199eaf2-2fae-49d9-a44b-010110237661");
  
  useEffect(() => {
    if(!isLoading) {
      console.log(data.result?.cartItems);
      dispatch(setshoppingCart(data.result?.cartItems));
    }
  },[data]);

  return (
    <div>
      <Header />
      <div className='pb-5'>
        <Routes>
          <Route path="/" element={<Home />}> </Route>
          <Route path="/shoppingcart" element={<ShoppingCart />}> </Route>
          <Route path="*" element={<Home />}> </Route>
          <Route path="/menuItemDetails/:menuItemId" element={<MenuItemDetails />}> </Route>
        </Routes>

      </div>
      <Footer />
    </div>
  );
}

export default App;
