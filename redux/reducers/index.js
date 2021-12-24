import {combineReducers} from 'redux';
import authReducer from './auth.reducers';
import buildConnectionReducer from './buildConnection.reducers';
import salesReducer from './sales.reducers';
import socketReducer from './socket.reducer';

export const rootReducer = combineReducers({
  socket: socketReducer,
  buildConnection: buildConnectionReducer,
  auth: authReducer,
  sale: salesReducer,
});
