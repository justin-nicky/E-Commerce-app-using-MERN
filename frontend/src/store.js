import { combineReducers, createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import {
  productDetailsReducer,
  productListReducer,
  productDeleteReducer,
  productCreateReducer,
  productUpdateReducer,
} from './reducers/productReducers'
import {
  userLoginReducer,
  userRegisterReducer,
  userGoogleSignInReducer,
  userListReducer,
  userDisableReducer,
} from './reducers/userReducer'
import {
  categoryCreateReducer,
  categoryListReducer,
} from './reducers/categoryReducer'
import { cartReducer } from './reducers/cartReducer'
import {
  orderCreateReducer,
  orderDetailsReducer,
} from './reducers/orderReducers'

const reducer = combineReducers({
  productList: productListReducer,
  productDetails: productDetailsReducer,
  productDelete: productDeleteReducer,
  productCreate: productCreateReducer,
  productUpdate: productUpdateReducer,
  userLogin: userLoginReducer,
  userRegister: userRegisterReducer,
  userGoogleSignIn: userGoogleSignInReducer,
  userList: userListReducer,
  userDisable: userDisableReducer,
  categoryCreate: categoryCreateReducer,
  categoryList: categoryListReducer,
  cart: cartReducer,
  orderCreate: orderCreateReducer,
  orderDetails: orderDetailsReducer,
})

const userInfoFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null

const cartItemsFromStorage = localStorage.getItem('cartItems')
  ? JSON.parse(localStorage.getItem('cartItems'))
  : []

const shippingAddressFromStorage = localStorage.getItem('cartShippingAddress')
  ? JSON.parse(localStorage.getItem('cartShippingAddress'))
  : {}

console.log('store init shipping address -', shippingAddressFromStorage)

const initialState = {
  userLogin: { userInfo: userInfoFromStorage },
  cart: {
    cartItems: cartItemsFromStorage,
    shippingAddress: shippingAddressFromStorage,
  },
}
const middleware = [thunk]

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
)

export default store
