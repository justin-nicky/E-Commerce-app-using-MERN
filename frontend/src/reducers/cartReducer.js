import { CART_ADD_ITEM, CART_REMOVE_ITEM } from '../constants/cartConstants'

export const cartReducer = (state = { cartItems: [] }, action) => {
  switch (action.type) {
    case CART_ADD_ITEM:
      const item = action.payload

      const existItem = state.cartItems.find(
        (_item) => _item.product === item.product
      )

      if (existItem) {
        return {
          ...state,
          cartItems: state.cartItems.map((_item) =>
            _item.product === existItem.product ? item : _item
          ),
        }
      } else {
        return {
          ...state,
          cartItems: [...state.cartItems, item],
        }
      }

    case CART_REMOVE_ITEM:
      return {
        ...state,
        cartItems: state.cartItems.filter(
          (_item) => _item.product !== action.payload
        ),
      }
    default:
      return state
  }
}
