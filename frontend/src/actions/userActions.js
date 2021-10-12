import axios from 'axios'
import {
  USER_DISABLE_FAIL,
  USER_DISABLE_REQUEST,
  USER_DISABLE_SUCCESS,
  USER_GOOGLE_SIGNIN_FAIL,
  USER_GOOGLE_SIGNIN_REQUEST,
  USER_GOOGLE_SIGNIN_SUCCESS,
  USER_LIST_FAIL,
  USER_LIST_REQUEST,
  USER_LIST_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGOUT,
  USER_REGISTER_FAIL,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
} from '../constants/userConstants'

export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: USER_LOGIN_REQUEST })

    const config = { headers: { 'Content-Type': 'application/json' } }

    const { data } = await axios.post(
      '/api/users/login',
      { email, password },
      config
    )

    dispatch({ type: USER_LOGIN_SUCCESS, payload: data })
    localStorage.setItem('userInfo', JSON.stringify(data))
  } catch (error) {
    dispatch({
      type: USER_LOGIN_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

export const logout = () => (dispatch) => {
  localStorage.removeItem('userInfo')
  dispatch({ type: USER_LOGOUT })
}

export const register = (name, email, password) => async (dispatch) => {
  try {
    dispatch({ type: USER_REGISTER_REQUEST })

    const config = { headers: { 'Content-Type': 'application/json' } }

    const { data } = await axios.post(
      '/api/users',
      { email, password, name },
      config
    )

    dispatch({ type: USER_REGISTER_SUCCESS, payload: data })
    dispatch({ type: USER_LOGIN_SUCCESS, payload: data })
    localStorage.setItem('userInfo', JSON.stringify(data))
  } catch (error) {
    dispatch({
      type: USER_REGISTER_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

export const googleSignIn = (token) => async (dispatch) => {
  try {
    dispatch({ type: USER_GOOGLE_SIGNIN_REQUEST })

    const config = { headers: { 'Content-Type': 'application/json' } }

    const { data } = await axios.post(
      '/api/users/signinwithgoogle',
      { credential: token },
      config
    )

    dispatch({ type: USER_GOOGLE_SIGNIN_SUCCESS, payload: data })
    dispatch({ type: USER_LOGIN_SUCCESS, payload: data })
    localStorage.setItem('userInfo', JSON.stringify(data))
  } catch (error) {
    dispatch({
      type: USER_GOOGLE_SIGNIN_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

export const listUsers = () => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_LIST_REQUEST })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = { headers: { Authorization: `Bearer ${userInfo.token}` } }

    const { data } = await axios.get('/api/users', config)

    dispatch({ type: USER_LIST_SUCCESS, payload: data })
  } catch (error) {
    dispatch({
      type: USER_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

export const disableUser = (id, disable) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_DISABLE_REQUEST })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = { headers: { Authorization: `Bearer ${userInfo.token}` } }

    const { data } = await axios.patch(
      `/api/users/${id}`,
      { isDisabled: disable },
      config
    )
    console.log(data, id, disable)

    dispatch({ type: USER_DISABLE_SUCCESS, payload: data })
  } catch (error) {
    dispatch({
      type: USER_DISABLE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}
