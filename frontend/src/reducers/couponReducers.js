import {
  COUPON_ADD_FAIL,
  COUPON_ADD_REQUEST,
  COUPON_ADD_RESET,
  COUPON_ADD_SUCCESS,
  COUPON_DELETE_FAIL,
  COUPON_DELETE_REQUEST,
  COUPON_DELETE_SUCCESS,
  COUPON_LIST_FAIL,
  COUPON_LIST_REQUEST,
  COUPON_LIST_SUCCESS,
} from '../constants/couponsConstants'

export const couponCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case COUPON_ADD_REQUEST:
      return { loading: true, success: false }
    case COUPON_ADD_SUCCESS:
      return { loading: false, success: true }
    case COUPON_ADD_FAIL:
      return { loading: false, error: action.payload }
    case COUPON_ADD_RESET:
      return {}
    default:
      return state
  }
}

export const couponListReducer = (state = { coupons: [] }, action) => {
  switch (action.type) {
    case COUPON_LIST_REQUEST:
      return { loading: true, success: false }
    case COUPON_LIST_SUCCESS:
      return { loading: false, success: true, coupons: action.payload }
    case COUPON_LIST_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}

export const couponDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case COUPON_DELETE_REQUEST:
      return { loading: true, success: false }
    case COUPON_DELETE_SUCCESS:
      return { loading: false, success: true }
    case COUPON_DELETE_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}
