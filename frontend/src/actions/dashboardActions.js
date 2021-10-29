import axios from 'axios'
import {
  DASHBOARD_DETAILS_FAIL,
  DASHBOARD_DETAILS_REQUEST,
  DASHBOARD_DETAILS_SUCCESS,
} from '../constants/dashboardConstants'

export const populateDashboard = () => async (dispatch, getState) => {
  try {
    dispatch({ type: DASHBOARD_DETAILS_REQUEST })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const { data } = await axios.get(`/api/dashboard`, config)

    dispatch({ type: DASHBOARD_DETAILS_SUCCESS, payload: data })
  } catch (error) {
    dispatch({
      type: DASHBOARD_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}
