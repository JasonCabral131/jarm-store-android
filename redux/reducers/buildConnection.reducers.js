import {buildConstants} from '../constants';

const initialState = {
  ListConnection: [],
  connectionId: null,
};

const buildConnectionReducer = (state = initialState, action) => {
  switch (action.type) {
    case buildConstants.BUILD_CONNECTION_SUCCESS:
      return (state = {
        ...state,
        connectionId: action.payload,
      });
    case buildConstants.NEW_CONNECTION_SUCCESS:
      return (state = {
        ...state,
        connectionId: null,
      });
    default:
      return state;
  }
};
export default buildConnectionReducer;
