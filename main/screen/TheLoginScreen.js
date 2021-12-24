import React, {useState, useEffect} from 'react';
import {
  View,
  Image,
  ImageBackground,
  StyleSheet,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
} from 'react-native';
import {
  Title,
  TextInput,
  Button,
  ActivityIndicator,
  Caption,
  Headline,
} from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import {useDispatch} from 'react-redux';
import {loginAuthentication} from '../../redux/actions/auth.action';
const {width, height} = Dimensions.get('window');
export const TheLoginScreen = props => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState({password: '', show: true});
  const [onfocus, setOnFucos] = useState({email: false, password: false});
  useEffect(() => {
    return () => {
      setEmail('');
      setLoading(false);
      setPassword({password: '', show: true});
    };
  }, []);
  const handleSignIn = async () => {
    setLoading(true);
    if (!password.password) {
      Alert.alert('Warning', `Password required!`);
      setLoading(false);
      return;
    }

    if (!email) {
      Alert.alert('Warning', `Email required!`);
      setLoading(false);
      return;
    }
    const result = await dispatch(
      loginAuthentication({email, password: password.password}),
    );
    if (result.result) {
      Alert.alert(
        'Success',
        `Welcome ${
          result.user.branch_owner_fname + '  ' + result.user.branch_owner_lname
        }`,
      );
      setLoading(false);
      return;
    } else {
      Alert.alert('Warning', result.message);
      setLoading(false);
      return;
    }
  };

  return loading ? (
    <View style={styles.loadingContainer}>
      <ActivityIndicator animating={true} size={90} color={'#ffd700'} />
      <Caption style={{color: '#d40827'}}>Authenticating...</Caption>
    </View>
  ) : (
    <KeyboardAvoidingView>
      <View style={styles.container}>
        <Animatable.Image
          animation={'slideInLeft'}
          source={require('./../../assets/waveUp.png')}
          style={{
            width: width,
            height: 100,
            position: 'absolute',
            top: 0,
          }}
          resizeMode="stretch"
        />
        <Animatable.Image
          animation={'fadeInDown'}
          source={require('./../../assets/Jarm.png')}
          style={styles.logo}
        />

        <Animatable.View animation={'zoomIn'} style={styles.infomationView}>
          <Animatable.Image
            animation={'slideInRight'}
            source={require('./../../assets/login.png')}
            style={{
              width: 100,
              height: 100,
              position: 'absolute',
              right: 10,
              top: -10,
            }}
            resizeMode="stretch"
          />
          <Headline style={styles.headline}>Login</Headline>
          <Caption style={styles.caption}>Please sign in to continue</Caption>
          <View style={styles.viewInput}>
            <TextInput
              style={{
                ...styles.inputStyle,
                backgroundColor: onfocus.email ? '#38304C' : '#201A30',
              }}
              label="Email"
              placeholder="Email"
              value={email}
              onChangeText={text => setEmail(text)}
              right={<TextInput.Icon name="email" color={'#9C98A6'} />}
              autoCapitalize="none"
              placeholderTextColor={'#443F51'}
              theme={{
                colors: {
                  text: '#f5f5f5',
                  accent: '#ffffff',
                  primary: '#a3d1ff',
                  placeholder: '#f5f5f5',
                  background: 'transparent',
                },
              }}
              underlineColor="#201A30"
              underlineColorAndroid="#201A30"
              activeOutlineColor="#ffffff"
              onBlur={e => {
                setOnFucos({...onfocus, email: false});
              }}
              onFocus={e => {
                setOnFucos({...onfocus, email: true});
              }}
            />
          </View>
          <View style={styles.viewInput}>
            <TextInput
              style={{
                ...styles.inputStyle,
                backgroundColor: onfocus.password ? '#38304C' : '#201A30',
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
                  text: '#f5f5f5',
                  accent: '#ffffff',
                  primary: '#a3d1ff',
                  placeholder: '#f5f5f5',
                  background: 'transparent',
                },
              }}
              underlineColor="#201A30"
              underlineColorAndroid="#201A30"
              activeOutlineColor="#ffffff"
            />
          </View>
          <Button
            style={styles.buttonStyle}
            icon="login"
            mode="contained"
            onPress={handleSignIn}>
            {loading} Login
          </Button>
        </Animatable.View>
        <Animatable.Image
          animation={'slideInRight'}
          source={require('./../../assets/wave.png')}
          style={{
            width: width,
            height: 100,
            position: 'absolute',
            bottom: 0,
          }}
          resizeMode="stretch"
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#201A30',
  },
  container: {
    width,
    height: height,
    position: 'relative',
    backgroundColor: '#201A30',
    padding: 10,
  },
  infomationView: {
    width,
    position: 'relative',
    padding: 15,
  },
  logo: {
    width: '90%',
    display: 'flex',
    alignSelf: 'center',
    justifySelf: 'center',
    height: 250,
  },
  headline: {
    color: '#F3F2F4',
    letterSpacing: 2,
    fontWeight: '800',
  },
  caption: {
    color: '#605B6B',
  },
  viewInput: {
    width: '95%',
    position: 'relative',
    marginTop: 20,
  },
  inputStyle: {
    alignSelf: 'center',
    width: '100%',
    color: '#ffffff',
    letterSpacing: 3,
  },
  buttonStyle: {
    alignSelf: 'center',
    width: '80%',
    padding: 10,
    marginTop: 30,
    backgroundColor: '#0DF5E3',
    borderRadius: 30,
  },
});
console.disableYellowBox = true;
