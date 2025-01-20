import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './Pages/Home'
import Header from './Component/Header'
import SignIn from './Pages/SignIn'
import SignUp from './Pages/SignUp'
import PrivateRoute from './Component/PrivateRoute'
import DashBoard from './Pages/DashBoard'
import CreateProduct from './Pages/CreateProduct'
import OnlySellerPrivateRoute from './Component/OnlySellerPrivateRoute'
import UpdateProduct from './Pages/UpdateProduct'
import ProductPage from './Pages/ProductPage'
import ScrollToTop from './Component/ScrollToTop'
import About from './Pages/About'
import UserLists from './Pages/UsersLists'
import Details from './Pages/Details'
import Search from './Pages/Search'
import Order from './Pages/Order'

export default function App() {
  return (
    <BrowserRouter>
    <ScrollToTop />
        <Header/>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/sign-in' element={<SignIn />}/>
          <Route path='/sign-up' element={<SignUp />}/>
          <Route path='/product/:productSlug' element={<ProductPage />}/>
          <Route path='/detail/:userDetail' element={<Details />} />
          <Route path='/search' element={<Search />}/>
          <Route path='/userslist' element={<UserLists />}/>
          <Route path='/about' element={<About />}/>
          <Route path='/orders' element={<Order />}/>
          <Route element={<PrivateRoute />}>
          <Route path='/dashboard' element={<DashBoard />}/>
          </Route>
          <Route element={<OnlySellerPrivateRoute />}>
          <Route path='/createproduct' element={<CreateProduct />}/>
          <Route path='/updateproduct/:productId' element={<UpdateProduct />}/>
          </Route>
        </Routes>
    </BrowserRouter>
  )
}
