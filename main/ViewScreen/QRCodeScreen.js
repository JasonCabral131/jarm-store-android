import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import RNSystemSounds from '@dashdoc/react-native-system-sounds';
import {RNCamera} from 'react-native-camera';
import {ActivityIndicator, Caption, Headline, Text} from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector} from 'react-redux';
import {checkingObjectId} from '../helpers/reusable';
import {useFocusEffect} from '@react-navigation/native';
import CustomerProfile from '../../component/CustomerProfile';
const QRCodeScreen = props => {
  const [phone, setPhone] = React.useState('');
  const {user} = useSelector(state => state.auth);
  const [cameratype, setCameraType] = useState(false);
  const {container, qrcodeContainer, addContainerView, constainerLoading} =
    styles;
  const [scanning, setScanning] = useState(false);
  const [customer, setCustomer] = useState({time: 'hello'});
  const [isSendingSms, setIsSendingSms] = useState(null);
  const [isLoading, setIsloading] = useState(false);
  const [password, setPassword] = useState('');
  const [verifySms, setVerifySms] = useState('');
  const NewSetup = () => {
    setScanning(false);
    setCustomer({time: 'hello'});
    setIsloading(false);
    setPassword('');
    setIsSendingSms(null);
    setVerifySms('');
  };
  useFocusEffect(
    React.useCallback(() => {
      // Do something when the screen is focused

      return () => {
        NewSetup();
      };
    }, []),
  );
  const ifScanneed = data => {
    RNSystemSounds.beep();
    setScanning(true);
    const isGo =
      typeof data === 'object'
        ? checkingObjectId(data.data)
        : checkingObjectId(data);
    if (isGo) {
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
      ) : customer ? (
        <CustomerProfile customer={customer}>
          {isSendingSms ? (
            <Text>Sending Sms</Text>
          ) : (
            <Text>Sending Password</Text>
          )}
        </CustomerProfile>
      ) : (
        <>
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
                {user?.branch_name} Store
              </Headline>
              <Caption style={{textAlign: 'center', display: 'flex'}}>
                Scan your QRCODE for payless transaction
              </Caption>
            </View>
          </View>
        </>
      )}
    </View>
  );
};
export default QRCodeScreen;
const {width} = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    width,
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
