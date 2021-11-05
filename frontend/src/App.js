import Header from './Components/Header'
import Footer from './Components/Footer'
import { Container } from 'react-bootstrap'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import HomeScreen from './Screens/HomeScreen'
import ProductScreen from './Screens/ProductScreen'
import LoginScreen from './Screens/LoginScreen'
import RegisterScreen from './Screens/RegisterScreen'
import AdminDashboard from './Screens/AdminDashboard'
import ProductManage from './Screens/ProductManage'
import UserManage from './Screens/UserManage'
import CategoryManage from './Screens/CategoryManage'
import OrderManage from './Screens/OrderManage'
import ProductEditScreen from './Screens/ProductEditScreen'
import CartScreen from './Screens/CartScreen'
import ShippingScreen from './Screens/ShippingScreen'
import PaymentScreen from './Screens/PaymentScreen'
import PlaceOrderScreen from './Screens/PlaceOrderScreen'
import OrderScreen from './Screens/OrderScreen'
import ProfileScreen from './Screens/ProfileScreen'
import CouponManage from './Screens/CouponManage'

const App = () => {
  return (
    <Router>
      <Header />
      <main className='py-3'>
        <Container>
          <Route path='/' component={HomeScreen} exact />
          <Route path='/login' component={LoginScreen} />
          <Route path='/register' component={RegisterScreen} />
          <Route path='/profile' component={ProfileScreen} />
          <Route path='/product/:id' component={ProductScreen} />
          <Route path='/cart/:id?' component={CartScreen} />
          <Route path='/shipping' component={ShippingScreen} />
          <Route path='/payment' component={PaymentScreen} />
          <Route path='/placeorder' component={PlaceOrderScreen} />
          <Route path='/order/:id' component={OrderScreen} />
          <Route path='/admin' component={AdminDashboard} exact />
          <Route path='/admin/manageproducts' component={ProductManage} />
          <Route path='/admin/manageusers' component={UserManage} />
          <Route path='/admin/managecategories' component={CategoryManage} />
          <Route path='/admin/manageorders' component={OrderManage} />
          <Route path='/admin/managecoupons' component={CouponManage} />
          <Route path='/admin/product/:id/edit' component={ProductEditScreen} />
        </Container>
      </main>
      <Footer />
    </Router>
  )
}

export default App
