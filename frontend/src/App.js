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

const App = () => {
  return (
    <Router>
      <Header />
      <main className='py-3'>
        <Container>
          <Route path='/' component={HomeScreen} exact />
          <Route path='/login' component={LoginScreen} />
          <Route path='/register' component={RegisterScreen} />
          <Route path='/product/:id' component={ProductScreen} />
          <Route path='/admin' component={AdminDashboard} exact />
          <Route path='/admin/manageproducts' component={ProductManage} />
          <Route path='/admin/manageusers' component={UserManage} />
          <Route path='/admin/managecategories' component={CategoryManage} />
          <Route path='/admin/manageorders' component={OrderManage} />
        </Container>
      </main>
      <Footer />
    </Router>
  )
}

export default App
