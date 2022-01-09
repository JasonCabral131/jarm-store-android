import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import RNSystemSounds from '@dashdoc/react-native-system-sounds';
import {RNCamera} from 'react-native-camera';
import {ActivityIndicator, Caption, Headline, Button} from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
const AddCustomerToDepositBranch = props => {
  const {container, qrcodeContainer, addContainerView, constainerLoading} =
    styles;
  const [scanning, setScanning] = useState(false);
  const [cameratype, setCameraType] = useState(false);
  const ifScanneed = e => {
    RNSystemSounds.beep();
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
              Scan To Deposit
            </Headline>
            <Caption style={{textAlign: 'center', display: 'flex'}}>
              Scan Customer QRCODE to add in deposit list
            </Caption>
          </View>
        </View>
      )}
    </View>
  );
};
export default AddCustomerToDepositBranch;
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
