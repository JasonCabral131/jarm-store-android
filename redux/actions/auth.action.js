import {Alert} from 'react-native';
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
export const ScanCustomerInfo = data => {
  return async dispatch => {
    try {
      const res = await axiosInstance.post('/scan-customer-branch', data);
      if (res.status === 200) {
        return {result: true, customer: res.data.customer};
      }
      if (res.status === 203) {
        Alert.alert('Warning', res.data.msg);
        return {result: false};
      }
    } catch (e) {
      Alert.alert('Warning', 'Invalid Customer');
      console.log(e.response.data);
      return {result: false};
    }
  };
};
export const verifyCustomerPassword = data => {
  return async dispatch => {
    try {
      const res = await axiosInstance.post(
        '/authenticate-customer-branch',
        data,
      );
      if (res.status === 200) {
        Alert.alert('Success', 'Authenticated Successfully');
        return true;
      }
      Alert.alert('Warning', 'Invalid Password');
      return false;
    } catch (e) {
      Alert.alert('Warning', 'Invalid Password');
      return false;
    }
  };
};
export const checkIsStillValidOwner = data => {
  return async dispatch => {
    try {
      const res = await axiosInstance.post('/is-grant-access-owner', {
        ...data,
      });
      if (res.status === 200) {
        const {user, token} = res.data;
        await dispatch({
          type: authConstant.LOGIN_SUCCESS,
          payload: {
            token,
            user,
          },
        });
        return {result: true};
      } else {
        dispatch(logout());
        dispatch(newBuildConnection());
        return {result: false};
      }
    } catch (e) {
      dispatch(logout());
      dispatch(newBuildConnection());
      return {result: false};
    }
  };
};
