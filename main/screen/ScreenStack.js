import React from 'react';
import {TouchableOpacity} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Avatar} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import IconMaterial from 'react-native-vector-icons/MaterialIcons';
import Ant from 'react-native-vector-icons/AntDesign';
import {useTheme} from '@react-navigation/native';
import HomeScreen from './../ViewScreen/HomeScreen';
import ProductScannerScreen from '../ViewScreen/BarcodeScanner';
import {useSelector} from 'react-redux';
import QRCodeScreen from '../ViewScreen/QRCodeScreen';
import AddCustomerToBranch from '../ViewScreen/AddCustomerToBranch';
import AddCustomerToDepositBranch from '../ViewScreen/AddCustomerToDeposit';

const HomeScreenStack = createStackNavigator();
const BuyProductStack = createStackNavigator();
const QRCODESTACK = createStackNavigator();
const Tab = createBottomTabNavigator();
export const MainHomeStackScreen = ({navigation}) => {
  const {user} = useSelector(state => state.auth);
  const headerRightImage =
    'https://media.istockphoto.com/vectors/user-sign-icon-person-symbol-human-avatar-vector-id639085642?k=20&m=639085642&s=170667a&w=0&h=Oz2wAbb8r_b8sU8k4yZ3RR4NRbe-s7GF0kxjs1aez9M=';
  return (
    <HomeScreenStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#201A30',
          shadowColor: '#201A30',
          elevation: 0,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontFamily: 'sans-serif-light',
        },
      }}>
      <HomeScreenStack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          title: user.branch_name + ' Store',
          headerLeft: () => (
            <Icon.Button
              name="ios-menu"
              size={30}
              backgroundColor="#201A30"
              onPress={() => navigation.openDrawer()}
            />
          ),
          headerRight: () => (
            <TouchableOpacity
              style={{
                backgroundColor: '#201A30',
                marginRight: 10,
                elevation: 1,
              }}
              onPress={() => navigation.navigate('Profile')}>
              <Avatar.Image
                size={35}
                source={{
                  uri: user
                    ? user.branch_owner_profile.profile
                    : headerRightImage,
                }}
              />
            </TouchableOpacity>
          ),
        }}
      />
    </HomeScreenStack.Navigator>
  );
};

export const BarcodeScannerStack = ({navigation}) => {
  return (
    <BuyProductStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#201A30',
          shadowColor: '#201A30',
          elevation: 0,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontFamily: 'sans-serif-light',
        },
      }}>
      <BuyProductStack.Screen
        name="BuyProductScreen"
        component={ProductScannerScreen}
        options={{
          title: 'Barcode Scanner',
          headerLeft: () => (
            <Icon.Button
              name="ios-menu"
              size={30}
              backgroundColor="#201A30"
              onPress={() => navigation.openDrawer()}
            />
          ),
        }}
      />
    </BuyProductStack.Navigator>
  );
};
export const QRCODESTACKSCREEN = ({navigation}) => {
  return (
    <QRCODESTACK.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#201A30',
          shadowColor: '#201A30',
          elevation: 0,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontFamily: 'sans-serif-light',
        },
      }}>
      <QRCODESTACK.Screen
        name="QRCODESCREEN"
        component={QRCodeScreen}
        options={{
          title: 'QRCODE PAYMENT',
          headerLeft: () => (
            <Icon.Button
              name="ios-menu"
              size={30}
              backgroundColor="#201A30"
              onPress={() => navigation.openDrawer()}
            />
          ),
        }}
      />
    </QRCODESTACK.Navigator>
  );
};
export const CustomerArea = ({navigation}) => {
  const {colors} = useTheme();
  return (
    <Tab.Navigator
      initialRouteName="add-customer-branch"
      activeColor={colors.text}
      inactiveColor="#DBE6E0"
      screenOptions={{
        headerShown: false,
      }}>
      <Tab.Screen
        name="add-customer-branch"
        component={AddCustomerToBranch}
        options={{
          tabBarLabel: 'Add',
          tabBarColor: colors.background,
          tabBarIcon: ({color}) => (
            <Ant name="adduser" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={AddCustomerToDepositBranch}
        options={{
          tabBarLabel: 'Deposit',
          tabBarColor: colors.background,
          tabBarIcon: ({color}) => (
            <IconMaterial name="attach-money" color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
