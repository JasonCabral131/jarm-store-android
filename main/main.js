import React, {useEffect} from 'react';
import {Alert, LogBox, StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {TheLoginScreen} from './screen/TheLoginScreen';
import {TheNavigation} from './screen/TheNavigation';
import io from 'socket.io-client';
import {apiConfig} from './helpers/apiConfig';
import {
  disconnectSocketConnect,
  socketConnection,
} from '../redux/actions/socket.actions';
import {checkIsStillValidOwner, logout} from '../redux/actions';
import {newBuildConnection} from '../redux/actions/buildConnection.action';
export const Main = props => {
  const {container} = styles;
  const dispatch = useDispatch();
  const {isAuthenticated, token, user} = useSelector(state => state.auth);
  useEffect(() => {
    if (token) {
      if (user) {
        dispatch(checkIsStillValidOwner({token, _id: user._id}));
      } else {
        Alert.alert('', 'Session is over');
        dispatch(logout());
        dispatch(newBuildConnection());
      }

      const newSocket = io(apiConfig.socketApi, {
        query: {
          token,
        },
      });
      newSocket.on('disconnect', () => {
        dispatch(disconnectSocketConnect());
      });
      newSocket.on('connect', () => {
        dispatch(socketConnection(newSocket));
      });
    } else {
      dispatch(disconnectSocketConnect());
    }

    // eslint-disable-next-line
  }, [token]);
  useEffect(() => {
    LogBox.ignoreLogs(['...']);
    dispatch(newBuildConnection());
    if (token) {
      if (user) {
        dispatch(checkIsStillValidOwner({token, _id: user._id}));
      } else {
        Alert.alert('', 'Session is over');
        dispatch(logout());
        dispatch(newBuildConnection());
      }
    }
  }, []);

  return isAuthenticated ? <TheNavigation {...props} /> : <TheLoginScreen />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
});
console.disableYellowBox = true;
