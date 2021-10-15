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
})

const userInfoFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null

const initialState = {
  userLogin: { userInfo: userInfoFromStorage },
}
const middleware = [thunk]

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
)

export default store
