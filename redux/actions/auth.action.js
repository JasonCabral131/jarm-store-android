import axiosInstance from '../../main/helpers/axios';
import {authConstant} from './../constants/index';
import {newBuildConnection} from './buildConnection.action';

export const loginAuthentication = data => {
  return async dispatch => {
    try {
      dispatch({type: authConstant.LOGIN_REQUEST});
      const res = await axiosInstance.post(
        '/login-mobile-application-branch',
        data,
      );
      if (res.status === 200) {
        const {token, user} = res.data;
        await dispatch({
          type: authConstant.LOGIN_SUCCESS,
          payload: {
            token,
            user,
          },
        });
        return {result: true, user};
      } else {
        dispatch({type: authConstant.LOGIN_FAILURE});
        return {result: false, message: res.data.message};
      }
    } catch (e) {
      console.log('happening error');
      return {result: false, message: 'Check Internet Connection'};
    }
  };
};

export const logout = () => {
  return async dispatch => {
    dispatch(newBuildConnection());
    dispatch({type: authConstant.LOGOUT_SUCCESS});
  };
};
