import React, { useEffect } from 'react';
import { Header, Footer } from '../Components/Layout';
import { AccessDenied, AuthenticationTest, AuthenticationTestadmin, Home, Login, MenuItemDetails, NotFound, Payment, Register, ShoppingCart } from '../Pages';
import { Routes,Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useGetShoppingCartQuery } from '../Apis/shoppingCartApi';
import { setshoppingCart } from '../Storage/Redux/shoppingCartSlice';
import { userModel } from '../Interfaces';
import jwt_decode from "jwt-decode";
import { setLoggedInUser } from '../Storage/Redux/userAuthSlice';
import { RootState } from '../Storage/Redux/store';

function App() {
  const dispatch = useDispatch();
  const userData:userModel = useSelector((state:RootState) => state.userAuthStore ); 
  
  const {data, isLoading} = useGetShoppingCartQuery(userData.id);
  
  useEffect(()=>{
    const localToken = localStorage.getItem("token");
    if(localToken) {
      const {fullName, id, email, role} : userModel = jwt_decode(localToken);
      dispatch(setLoggedInUser({fullName, id, email, role}));
    }
  },[])
  useEffect(() => {
    if(!isLoading) {
      //console.log(data.result?.cartItems);
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
          <Route path="/login" element={<Login />}> </Route>
          <Route path="/register" element={<Register />}> </Route>
          <Route path="/authentication" element={<AuthenticationTest />}> </Route>
          <Route path="/authorization" element={<AuthenticationTestadmin />}> </Route>
          <Route path="/accessDenied" element={<AccessDenied />}> </Route>
          <Route path="/payment" element={<Payment />}> </Route>
          <Route path="*" element={<Home />}> </Route>
          <Route path="/menuItemDetails/:menuItemId" element={<MenuItemDetails />}> </Route>
        </Routes>

      </div>
      <Footer />
    </div>
  );
}

export default App;
