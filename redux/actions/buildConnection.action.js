import {buildConstants} from './../constants/index';

export const setbuildConnectionAdmin = connectionId => {
  return async dispatch => {
    try {
      dispatch({
        type: buildConstants.BUILD_CONNECTION_SUCCESS,
        payload: connectionId,
      });
    } catch (e) {}
  };
};
export const newBuildConnection = () => {
  return async dispatch => {
    try {
      dispatch({type: buildConstants.NEW_CONNECTION_SUCCESS});
    } catch (e) {}
  };
};
