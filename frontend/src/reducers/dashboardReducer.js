import {
  DASHBOARD_DETAILS_FAIL,
  DASHBOARD_DETAILS_REQUEST,
  DASHBOARD_DETAILS_SUCCESS,
} from '../constants/dashboardConstants'

export const dashboardPopulateReducer = (state = {}, action) => {
  switch (action.type) {
    case DASHBOARD_DETAILS_REQUEST:
      return {
        loading: true,
      }
    case DASHBOARD_DETAILS_SUCCESS:
      return {
        loading: false,
        data: action.payload,
      }
    case DASHBOARD_DETAILS_FAIL:
      return {
        loading: false,
        error: action.payload,
      }
    default:
      return state
  }
}
