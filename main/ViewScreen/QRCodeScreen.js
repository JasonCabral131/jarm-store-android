import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Dimensions,
  PermissionsAndroid,
} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import RNSystemSounds from '@dashdoc/react-native-system-sounds';
import {RNCamera} from 'react-native-camera';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  ActivityIndicator,
  Caption,
  Headline,
  Text,
  TextInput,
  Button,
} from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector, useDispatch} from 'react-redux';
import {checkingObjectId} from '../helpers/reusable';
import {useFocusEffect} from '@react-navigation/native';
import CustomerProfile from '../../component/CustomerProfile';
import randomNumber from 'random-number';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import DirectSms from 'react-native-direct-sms';
import {
  logout,
  ScanCustomerInfo,
  verifyCustomerPassword,
} from '../../redux/actions/auth.action';
import AntIcon from 'react-native-vector-icons/AntDesign';
const QRCodeScreen = props => {
  const dispatch = useDispatch();
  const {user} = useSelector(state => state.auth);
  const {socket} = useSelector(state => state.socket);
  const [cameratype, setCameraType] = useState(false);
  const {container, qrcodeContainer, addContainerView, constainerLoading} =
    styles;
  const [scanning, setScanning] = useState(false);
  const [customer, setCustomer] = useState(null);
  const [isSendingSms, setIsSendingSms] = useState(null);
  const [isLoading, setIsloading] = useState(false);
  const [password, setPassword] = useState({password: '', show: true});
  const [verifySms, setVerifySms] = useState('');
  const [onfocus, setOnFucos] = useState({email: false, password: false});
  const [showBtnSms, setShowBtnSms] = useState(false);
  const {connectionId} = useSelector(state => state.buildConnection);
  const NewSetup = () => {
    setScanning(false);
    setCustomer(null);
    setIsloading(false);
    setPassword({password: '', show: true});
    setIsSendingSms(null);
    setVerifySms('');
    setOnFucos({email: false, password: false});
    setShowBtnSms(false);
  };
  useFocusEffect(
    React.useCallback(() => {
      // Do something when the screen is focused

      return () => {
        NewSetup();
      };
    }, []),
  );
  const ifScanneed = async data => {
    RNSystemSounds.beep();
    setScanning(true);
    const isGo =
      typeof data === 'object'
        ? checkingObjectId(data.data)
        : checkingObjectId(data);
    if (isGo) {
      if (user) {
        const customer = typeof data === 'object' ? data.data : data;
        setIsloading(true);
        const res = await dispatch(
          ScanCustomerInfo({customer, branch: user._id}),
        );
        setIsloading(false);
        setScanning(false);
        if (res.result) {
          setCustomer(res.customer);
          return;
        }
      } else {
        setIsloading(false);
        setScanning(false);
        dispatch(logout());
      }
    } else {
      setIsloading(false);
      setScanning(false);
      Alert.alert('Warning', 'QRCODE Information is not valid');
    }
    setIsloading(false);
    setScanning(false);
  };
  const authenticatePassword = async () => {
    setIsloading(true);
    if (!customer) {
      Alert.alert('Failed', 'Invalid Customer');
      setCustomer(null);
      setIsloading(false);
      return;
    }
    if (password.password.length < 1) {
      Alert.alert('Failed', 'Password Required');
      setIsloading(false);
      return;
    }
    const res = await dispatch(
      verifyCustomerPassword({
        customer: customer._id,
        password: password.password,
      }),
    );
    setIsloading(false);
    if (res) {
      const gen = randomNumber.generator({
        min: -10000,
        max: 1000000,
        integer: true,
      });

      const verificationNumber = gen(100000);
      console.log(verificationNumber);
      await sendDirectSms(customer.phone, verificationNumber);
      Alert.alert(
        'Success',
        'Verication number has been sent to your phone number',
      );
      console.log(verificationNumber);
      setIsSendingSms(verificationNumber);
      setPassword({password: '', show: true});
      return;
    }
  };
  const sendDirectSms = async (phone, generatedNumber) => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.SEND_SMS,
        {
          title: 'App Sms Permission',
          message:
            'App needs access to your inbox' +
            'so you can send messages in background.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        const MessageInfo = `Your Verification Number: ${generatedNumber}`;
        DirectSms.sendDirectSms(phone, MessageInfo);
      } else {
        console.log('SMS permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };
  const authenticateSms = () => {
    if (verifySms == isSendingSms) {
      if (socket) {
        setIsloading(true);
        socket.emit(
          'customer-payless-transaction',
          {connectionId, customer, branch: user._id},
          data => {
            setIsloading(false);
            if (!data.result) {
              Alert.alert('Warning', data.message);
              NewSetup();
              return;
            } else {
              Alert.alert('Success', 'Customer Verified Successfully');
            }
            NewSetup();
          },
        );
      }
    } else {
      Alert.alert('Invalid', 'Verification Number Does not match');
    }
  };
  const handleReplace = str => {
    return str.replace(
      str.substr(1, str.length - 3),
      str.substr(1, str.length - 3).replace(/./g, '*'),
    );
  };
  return (
    <View style={container}>
      {scanning ? (
        <View style={constainerLoading}>
          <ActivityIndicator animating={true} color={'#ed1c24'} size={100} />
          <Caption style={{textAlign: 'center'}}>authenticating......</Caption>
        </View>
      ) : customer ? (
        <CustomerProfile customer={customer}>
          <TouchableOpacity
            style={{marginLeft: 10, marginTop: 6}}
            onPress={() => {
              Alert.alert(
                'Are You sure?',
                'You want to cancel this transaction?',
                [
                  {
                    text: 'Cancel',
                    onPress: () => {},
                    style: 'cancel',
                  },
                  {text: 'OK', onPress: () => NewSetup()},
                ],
              );
            }}>
            <AntIcon name="back" size={25} />
          </TouchableOpacity>
          <View style={styles.authenticationView}>
            <Caption style={styles.authenticationCaption}>
              Authentication
            </Caption>
            <MIcon
              name="security-network"
              size={40}
              style={{marginLeft: 10}}
              color={'#E55353'}
            />
          </View>

          {isLoading ? (
            <View style={styles.authenticatingLoading}>
              <ActivityIndicator
                animating={true}
                color={'#ed1c24'}
                size={100}
              />
              <Caption style={{textAlign: 'center'}}>authenticating...</Caption>
            </View>
          ) : isSendingSms ? (
            <View style={styles.viewInput}>
              <Text style={{textAlign: 'center', width}}>
                Please enter the verification code we send to{' '}
                {handleReplace(customer.phone)} phone number
              </Text>
              <SmoothPinCodeInput
                cellStyle={{
                  borderBottomWidth: 2,
                  borderColor: 'gray',
                }}
                cellStyleFocused={{
                  borderColor: 'black',
                }}
                value={verifySms}
                onTextChange={code => {
                  setVerifySms(code);
                }}
                codeLength={6}
                onFulfill={() => {
                  setShowBtnSms(true);
                }}
              />
              {showBtnSms ? (
                <Button
                  style={styles.buttonStyle}
                  icon="login"
                  mode="contained"
                  onPress={authenticateSms}>
                  Authenticate
                </Button>
              ) : null}
            </View>
          ) : (
            <>
              <View style={styles.viewInput}>
                <TextInput
                  style={{
                    ...styles.inputStyle,
                  }}
                  label="Password"
                  placeholder="Password"
                  right={
                    <TextInput.Icon
                      name={`${password.show ? 'eye' : 'eye-off'}`}
                      onPress={() => {
                        setPassword(prev => {
                          return {...prev, show: !password.show};
                        });
                      }}
                      color={'#9C98A6'}
                    />
                  }
                  onFocus={e => {
                    setOnFucos({...onfocus, password: true});
                  }}
                  onBlur={e => {
                    setOnFucos({...onfocus, password: false});
                  }}
                  value={password.password}
                  onChangeText={text =>
                    setPassword(prev => {
                      return {...prev, password: text};
                    })
                  }
                  secureTextEntry={password.show}
                  placeholderTextColor={'#443F51'}
                  theme={{
                    colors: {
                      text: '#3C4B64',
                      accent: '#559ED7',
                      primary: '#a3d1ff',
                      background: 'transparent',
                    },
                  }}
                  underlineColor="#201A30"
                  underlineColorAndroid="#201A30"
                />
                <Button
                  style={styles.buttonStyle}
                  icon="login"
                  mode="contained"
                  onPress={authenticatePassword}>
                  Authenticate
                </Button>
              </View>
            </>
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
  inputStyle: {
    alignSelf: 'center',
    width: '100%',
    letterSpacing: 3,
  },
  viewInput: {
    width: '95%',
    position: 'relative',
    marginTop: 20,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  authenticationView: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width,
    position: 'absolute',
    top: 0,
  },
  authenticationCaption: {
    fontSize: 20,
    marginTop: 20,
    textAlign: 'center',
    fontWeight: '800',
  },
  buttonStyle: {
    alignSelf: 'center',
    width: '80%',
    padding: 10,
    marginTop: 30,
    backgroundColor: '#0DF5E3',
    borderRadius: 30,
  },
  authenticatingLoading: {
    marginTop: 25,
    width,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
