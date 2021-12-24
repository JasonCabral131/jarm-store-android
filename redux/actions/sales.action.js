import {salesConstant} from './../constants/';
import axiosInstance from '../../main/helpers/axios';
export const getSales = () => {
  return async dispatch => {
    try {
      dispatch({type: salesConstant.SALES_REQUEST});
      const res = await axiosInstance.get('/get-brand-owner-sales');
      if (res.status === 200) {
        dispatch({
          type: salesConstant.GET_SALES_SUCCESS,
          payload: res.data.POS,
        });
        return {result: true, POS: res.data.POS};
      }

      dispatch({type: salesConstant.GET_SALES_FAIL});
      return {result: false};
    } catch (e) {
      console.log('no Date');
      dispatch({type: salesConstant.GET_SALES_FAIL});
      return {result: false};
    }
  };
};
