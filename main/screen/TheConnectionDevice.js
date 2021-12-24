import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Button, Avatar} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import {setbuildConnectionAdmin} from '../../redux/actions/buildConnection.action';
import {useFocusEffect} from '@react-navigation/native';
const NoData = () => {
  return (
    <View style={styles.buildConnection}>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 5,
        }}>
        <Text style={{color: 'red', fontWeight: 'bold'}}>
          No Active Device Found
        </Text>
      </View>
    </View>
  );
};
const TheConnectionDevice = props => {
  const dispatch = useDispatch();
  const {socket} = useSelector(state => state.socket);
  const {user} = useSelector(state => state.auth);
  const [activeUser, setActiveUser] = useState(null);
  const getActiveData = () => {
    if (socket) {
      socket.emit('getActiveData', {user}, data => {
        setActiveUser(data);
        console.log('The Get Active Data');
        console.log(data);
      });
    }
  };
  useEffect(() => {
    if (socket) {
      socket.emit('getActiveData', {user}, data => {
        setActiveUser(data);
        console.log('The Get Active Data');
        console.log(data);
      });
    }
  }, []);
  useEffect(() => {
    if (socket) {
      socket.emit('getActiveData', {user}, data => {
        setActiveUser(data);
        console.log('The Get Active Data');
        console.log(data);
      });
      socket.on('UpdateActiveData', function (data) {
        console.log('The UpdateActiveData');
        console.log(data);
        setActiveUser(data);
      });
    }
  }, [socket]);
  const BuildConnection = _id => {
    dispatch(setbuildConnectionAdmin(_id));
  };
  useFocusEffect(
    useCallback(() => {
      if (socket) {
        socket.emit('getActiveData', {user}, data => {
          setActiveUser(data);
          console.log('The Get Active Data');
          console.log(data);
        });
        socket.on('UpdateActiveData', function (data) {
          console.log('The UpdateActiveData');
          console.log(data);
          setActiveUser(data);
        });
      }
    }, []),
  );
  return (
    <View style={styles.container}>
      <View style={styles.connectionIcon}>
        <Icon name="transit-connection" color={'#413D4F'} size={40} />
        <TouchableOpacity onPress={getActiveData}>
          <Text style={styles.buildConnectionText}>Build Connection</Text>
        </TouchableOpacity>

        <Icon name="transit-connection-variant" color={'#413D4F'} size={40} />
      </View>

      {activeUser ? (
        activeUser.users.length > 0 ? (
          <ScrollView contentContainerStyle={{marginTop: 100, width: '100%'}}>
            {activeUser.users.map((data, key) => {
              return (
                <View style={styles.activeUserBox} key={key}>
                  <View style={styles.informationConnect}>
                    <View style={styles.imageConnect}>
                      <Avatar.Image size={44} source={{uri: data.profile}} />
                    </View>
                    <View style={styles.information}>
                      <Text style={styles.textInformation}>
                        Name: {' ' + data.name}
                      </Text>
                      <Text
                        style={{
                          color: '#ffffff',
                          fontWeight: 'bold',
                        }}>
                        Status: {' ' + data.status}
                      </Text>
                    </View>
                  </View>
                  <Button
                    icon="hand"
                    mode="contained"
                    style={{backgroundColor: '#0DF5E3'}}
                    onPress={() => BuildConnection(data._id)}>
                    Connect
                  </Button>
                </View>
              );
            })}
          </ScrollView>
        ) : (
          <NoData />
        )
      ) : (
        <NoData />
      )}
    </View>
  );
};
export default TheConnectionDevice;
const styles = StyleSheet.create({
  container: {
    width: '100%',
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#201A30',
    overflow: 'scroll',
  },
  buildConnection: {
    display: 'flex',
    margin: 1,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
  },
  listActiveView: {
    flex: 1,
    width: '100',
    display: 'flex',
    flexDirection: 'row',
    maxHeight: '80%',
    position: 'relative',
    overflow: 'hidden',
    padding: 10,
  },
  connectionIcon: {
    position: 'absolute',
    zIndex: 2,
    top: 20,
    marginBottom: 5,
    display: 'flex',
    flexDirection: 'row',
  },
  buildConnectionText: {
    color: '#ffffff',
    fontWeight: 'bold',
    padding: 3,
    letterSpacing: 2,
  },
  buttonStyle: {
    alignSelf: 'center',
    width: '30%',
    padding: 10,
    marginTop: 10,
  },
  activeUserBox: {
    borderWidth: 0.5,
    width: 300,
    padding: 10,
    borderColor: '#38304C',
    backgroundColor: '#38304C',
    elevation: 5,
    marginTop: 10,
  },
  informationConnect: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    borderBottomWidth: 0.5,
    marginBottom: 5,
    padding: 5,
  },
  imageConnect: {
    display: 'flex',
    width: '30%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  information: {
    display: 'flex',
    width: '70%',
    flexDirection: 'column',
  },
  textInformation: {
    color: '#ffffff',
    fontWeight: 'bold',
    borderBottomWidth: 0.5,
  },
});
