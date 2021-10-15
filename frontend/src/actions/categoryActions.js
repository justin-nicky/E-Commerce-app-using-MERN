import axios from 'axios'
import {
  CATEGORY_CREATE_FAIL,
  CATEGORY_CREATE_REQUEST,
  CATEGORY_CREATE_SUCCESS,
  CATEGORY_LIST_FAIL,
  CATEGORY_LIST_REQUEST,
  CATEGORY_LIST_SUCCESS,
} from '../constants/categoryConstants'

export const createCategory =
  (category, subCategory) => async (dispatch, getState) => {
    try {
      dispatch({ type: CATEGORY_CREATE_REQUEST })

      const {
        userLogin: { userInfo },
      } = getState()

      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } }

      const { data } = await axios.post(
        `/api/categories`,
        { category, subCategory },
        config
      )

      dispatch({ type: CATEGORY_CREATE_SUCCESS })
    } catch (error) {
      dispatch({
        type: CATEGORY_CREATE_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      })
    }
  }

export const listCategories = () => async (dispatch, getState) => {
  try {
    dispatch({ type: CATEGORY_LIST_REQUEST })
    const {
      userLogin: { userInfo },
    } = getState()

    const config = { headers: { Authorization: `Bearer ${userInfo.token}` } }
    const { data } = await axios.get('/api/categories', config)
    dispatch({ type: CATEGORY_LIST_SUCCESS, payload: data })
  } catch (error) {
    dispatch({
      type: CATEGORY_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}
