import React from 'react';
import {StyleSheet, View, Alert} from 'react-native';
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import {Avatar, Title, Caption, Drawer, Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Fa from 'react-native-vector-icons/FontAwesome5';
import {useDispatch, useSelector} from 'react-redux';
import {logout} from '../../redux/actions/auth.action';
import {newBuildConnection} from '../../redux/actions/buildConnection.action';
const TheDrawerScreen = props => {
  const {user} = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const DisConnection = () => {
    dispatch(newBuildConnection());
  };
  const handleLogout = () => {
    dispatch(logout());
  };
  return (
    <View style={{flex: 1, backgroundColor: '#201A30'}}>
      <DrawerContentScrollView {...props}>
        <View style={styles.DrawerContent}>
          <View style={styles.userInfoSection}>
            <View
              style={{
                justifyContent: 'center',
                alignContent: 'center',
                alignItems: 'center',
              }}>
              <Avatar.Image
                source={require('./../../assets/logoJarm.png')}
                size={100}
              />
              <View style={{justifyContent: 'center', alignContent: 'center'}}>
                <Title style={{textAlign: 'center', color: '#ffffff'}}>
                  {user?.branch_name + ' Store'}
                </Title>
                <Caption style={{textAlign: 'center', color: '#605B6B'}}>
                  {typeof user.branch_address === 'string'
                    ? JSON.parse(user.branch_address).fullAddress
                    : user.branch_address.fullAddress}
                </Caption>
              </View>
            </View>
            <View style={styles.row}></View>
          </View>
          <Drawer.Section style={styles.drawerSection}>
            <DrawerItem
              icon={({color, size}) => (
                <Icon name="home-outline" color={color} size={size} />
              )}
              label={() => <Text style={{color: '#fff'}}>Dashboard</Text>}
              onPress={() => {
                props.navigation.navigate('Home');
              }}
              color="#ffffff"
            />
            <DrawerItem
              icon={({color, size}) => (
                <Fa name="barcode" color={color} size={size} />
              )}
              label={() => <Text style={{color: '#fff'}}>Scan Barcode</Text>}
              onPress={() => {
                props.navigation.navigate('BarcodeScanner');
              }}
            />
            <DrawerItem
              icon={({color, size}) => (
                <Fa name="qrcode" color={color} size={size} />
              )}
              label={() => <Text style={{color: '#fff'}}>Q Payment</Text>}
              onPress={() => {
                props.navigation.navigate('QRCODESCANNER');
              }}
            />

            <DrawerItem
              icon={({color, size}) => (
                <Fa name="qrcode" color={color} size={size} />
              )}
              label={() => <Text style={{color: '#fff'}}>Customer Area</Text>}
              onPress={() => {
                props.navigation.navigate('CustomerArea');
              }}
            />
          </Drawer.Section>
        </View>
      </DrawerContentScrollView>
      <Drawer.Section style={styles.bottomDrawerSection}>
        <DrawerItem
          icon={({color, size}) => (
            <Icon name="transit-connection-variant" color={color} size={size} />
          )}
          label={() => <Text style={{color: '#fff'}}>New Connection</Text>}
          onPress={() => DisConnection()}
        />
      </Drawer.Section>
      <Drawer.Section style={styles.bottomDrawerSection}>
        <DrawerItem
          icon={({color, size}) => (
            <Icon name="exit-to-app" color={color} size={size} />
          )}
          label={() => <Text style={{color: '#fff'}}>Logout</Text>}
          onPress={() => handleLogout()}
        />
      </Drawer.Section>
    </View>
  );
};
const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    backgroundColor: '#201A30',
  },
  userInfoSection: {
    paddingLeft: 20,
  },
  title: {
    fontSize: 16,
    marginTop: 3,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },
  row: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  paragraph: {
    fontWeight: 'bold',
    marginRight: 3,
  },
  drawerSection: {
    borderTopWidth: 1,
    marginHorizontal: 20,
    color: '#ffffff',
  },
  bottomDrawerSection: {
    borderTopColor: '#f4f4f4',
    borderTopWidth: 1,
  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});

export default TheDrawerScreen;
