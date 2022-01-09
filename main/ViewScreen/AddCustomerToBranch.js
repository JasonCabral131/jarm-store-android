import React, {useState} from 'react';
import {View, StyleSheet, Alert, TouchableOpacity} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import RNSystemSounds from '@dashdoc/react-native-system-sounds';
import {RNCamera} from 'react-native-camera';
import {ActivityIndicator, Caption, Headline, Button} from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector} from 'react-redux';
import {checkingObjectId} from '../helpers/reusable';

const AddCustomerToBranch = props => {
  const {socket} = useSelector(state => state.socket);
  const {connectionId} = useSelector(state => state.buildConnection);
  const {container, qrcodeContainer, addContainerView, constainerLoading} =
    styles;
  const [scanning, setScanning] = useState(false);
  const [cameratype, setCameraType] = useState(false);

  const ifScanneed = data => {
    RNSystemSounds.beep();
    setScanning(true);
    const isGo =
      typeof data === 'object'
        ? checkingObjectId(data.data)
        : checkingObjectId(data);
    if (isGo) {
      if (socket) {
        setScanning(false);
        const customerId = typeof data === 'object' ? data.data : data;
        socket.emit(
          'send-scanned-qrcode-to-save',
          {connectionId, customerId},
          callback => {
            if (callback.result) {
              Alert.alert('Success', callback.message);
              setScanning(false);
              return;
            }
            Alert.alert('Failed', callback.message);
            setScanning(false);
            return;
          },
        );
      }
    } else {
      Alert.alert('Warning', 'QRCODE Information is not valid');
    }
  };

  return (
    <View style={container}>
      {scanning ? (
        <View style={constainerLoading}>
          <ActivityIndicator animating={true} color={'#ed1c24'} size={100} />
          <Caption style={{textAlign: 'center'}}>Wait Sending Data...</Caption>
        </View>
      ) : (
        <View style={addContainerView}>
          <View style={qrcodeContainer}>
            <QRCodeScanner
              containerStyle={{
                backgroundColor: '#ffffff',
                height: '100%',
              }}
              onRead={ifScanneed}
              permissionDialogMessage="Need Permission To Access Camera"
              flashMode={RNCamera.Constants.FlashMode.on}
              reactivate={true}
              reactivateTimeout={1500}
              showMarker={true}
              fadeIn={true}
              cameraType={cameratype ? 'front' : 'back'}
              cameraStyle={{
                width: '100%',
                height: '100%',
              }}
              markerStyle={{borderColor: '#fff', borderRadius: 10}}
            />

            <TouchableOpacity
              style={styles.changingCamera}
              onPress={() => {
                setCameraType(!cameratype);
              }}>
              <Icon size={30} name="camera-retake-outline" />
            </TouchableOpacity>
          </View>
          <View style={styles.headingContainer}>
            <LinearGradient
              start={{x: 0.6, y: 0.35}}
              end={{x: 0.5, y: 2.0}}
              locations={[0.4, 1, 0.6]}
              colors={['#fafc77', '#47e2ed', '#192f6a']}
              style={{width: 100, height: 10, marginTop: 10}}
            />
            <Headline style={{textAlign: 'left', display: 'flex'}}>
              Scan Customer
            </Headline>
            <Caption style={{textAlign: 'center', display: 'flex'}}>
              Scan Customer QRCODE to add to your branch
            </Caption>
          </View>
        </View>
      )}
    </View>
  );
};
export default AddCustomerToBranch;
const styles = StyleSheet.create({
  container: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    margin: 0,
    padding: 0,
  },
  addContainerView: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
  },
  qrcodeContainer: {
    height: '85%',
    width: '100%',
    position: 'relative',
  },
  changingCamera: {
    position: 'absolute',
    bottom: 10,
    left: '45%',
    color: '#ffffff',
  },
  constainerLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  headingContainer: {
    paddingLeft: '10%',
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: '100%',
    height: '15%',
  },
});
