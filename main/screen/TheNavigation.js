import React, {useEffect} from 'react';
import TheConnectionDevice from './TheConnectionDevice';
import TheDrawerScreen from './TheDrawerScreen';

import {
  NavigationContainer,
  DefaultTheme as NavigationDefaultTheme,
  DarkTheme as NavigationDarkTheme,
} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';

import {useDispatch, useSelector} from 'react-redux';
import {
  BarcodeScannerStack,
  CustomerArea,
  MainHomeStackScreen,
  QRCODESTACKSCREEN,
} from './ScreenStack';
import {newBuildConnection} from '../../redux/actions/buildConnection.action';

const Drawer = createDrawerNavigator();

export const TheNavigation = props => {
  const {connectionId} = useSelector(state => state.buildConnection);
  const {socket} = useSelector(state => state.socket);
  const {user} = useSelector(state => state.auth);
  const [isDarkTheme, setIsDarkTheme] = React.useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    if (socket) {
      socket.on('disconnected-from-server', async data => {
        // if (data.toString() === connectionId.toString()) {
        //   dispatch(newBuildConnection());
        // }
      });
    }
  }, [socket]);
  const CustomDefaultTheme = {
    ...NavigationDefaultTheme,

    colors: {
      ...NavigationDefaultTheme.colors,

      background: '#ffffff',
      text: '#333333',
    },
  };
  const CustomDarkTheme = {
    ...NavigationDarkTheme,
    colors: {
      ...NavigationDarkTheme.colors,

      background: '#333333',
      text: '#ffffff',
    },
  };
  const theme = isDarkTheme ? CustomDarkTheme : CustomDefaultTheme;
  return (
    <NavigationContainer
      options={{title: user.branch_name + ' Branch'}}
      theme={theme}>
      {connectionId ? (
        <Drawer.Navigator
          screenOptions={{
            headerShown: false,
          }}
          drawerContent={props => <TheDrawerScreen {...props} />}>
          <Drawer.Screen name="Home" component={MainHomeStackScreen} />
          <Drawer.Screen
            name="BarcodeScanner"
            component={BarcodeScannerStack}
          />
          <Drawer.Screen name="QRCODESCANNER" component={QRCODESTACKSCREEN} />
          <Drawer.Screen name="CustomerArea" component={CustomerArea} />
        </Drawer.Navigator>
      ) : (
        <TheConnectionDevice />
      )}
    </NavigationContainer>
  );
};
