import { combineReducers, createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import {
  productDetailsReducer,
  productListReducer,
  productDeleteReducer,
  productCreateReducer,
  productUpdateReducer,
  productTopRatedReducer,
} from './reducers/productReducers'
import {
  userLoginReducer,
  userRegisterReducer,
  userGoogleSignInReducer,
  userListReducer,
  userDisableReducer,
  userDetailsReducer,
  userUpdateProfileReducer,
} from './reducers/userReducer'
import {
  categoryCreateReducer,
  categoryListReducer,
} from './reducers/categoryReducer'
import { cartReducer } from './reducers/cartReducer'
import {
  orderCancelReducer,
  orderCreateReducer,
  orderDetailsReducer,
  orderListProfileReducer,
  orderListReducer,
  orderPayReducer,
  orderUpdateStatusReducer,
} from './reducers/orderReducers'
import { dashboardPopulateReducer } from './reducers/dashboardReducer'
import {
  couponCreateReducer,
  couponDeleteReducer,
  couponListReducer,
} from './reducers/couponReducers'

const reducer = combineReducers({
  productList: productListReducer,
  productDetails: productDetailsReducer,
  productDelete: productDeleteReducer,
  productCreate: productCreateReducer,
  productUpdate: productUpdateReducer,
  productTopRated: productTopRatedReducer,
  userLogin: userLoginReducer,
  userRegister: userRegisterReducer,
  userGoogleSignIn: userGoogleSignInReducer,
  userDetails: userDetailsReducer,
  userList: userListReducer,
  userDisable: userDisableReducer,
  userUpdateProfile: userUpdateProfileReducer,
  categoryCreate: categoryCreateReducer,
  categoryList: categoryListReducer,
  cart: cartReducer,
  orderCreate: orderCreateReducer,
  orderDetails: orderDetailsReducer,
  orderListProfile: orderListProfileReducer,
  orderList: orderListReducer,
  orderUpdateStatus: orderUpdateStatusReducer,
  orderPay: orderPayReducer,
  orderCancel: orderCancelReducer,
  dashboardPopulate: dashboardPopulateReducer,
  couponCreate: couponCreateReducer,
  couponList: couponListReducer,
  couponDelete: couponDeleteReducer,
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
