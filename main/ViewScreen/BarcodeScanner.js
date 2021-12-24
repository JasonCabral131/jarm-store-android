import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import RNSystemSounds from '@dashdoc/react-native-system-sounds';
import {RNCamera} from 'react-native-camera';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {ActivityIndicator, Caption} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
const ProductScannerScreen = props => {
  const dispatch = useDispatch();
  const {socket} = useSelector(state => state.socket);
  const {connectionId} = useSelector(state => state.buildConnection);
  const [scanning, setScanning] = useState(false);
  const {container, constainerLoading} = styles;
  useFocusEffect(
    React.useCallback(() => {
      // Do something when the screen is focused
      setScanning(false);
      return () => {
        setScanning(false);
      };
    }, []),
  );
  const ifScanneed = e => {
    setScanning(true);
    const ProductBarcodeID = typeof e == 'object' ? e.data : e;
    RNSystemSounds.beep();
    socket.emit('send-scanned-data', {connectionId, ProductBarcodeID}, data => {
      if (!data.result) {
        Alert.alert('Warning', data.message);
      }
      setScanning(false);
    });
  };
  return (
    <View style={container}>
      {scanning ? (
        <View style={constainerLoading}>
          <ActivityIndicator animating={true} color={'#ed1c24'} size={100} />
          <Caption style={{textAlign: 'center'}}>Wait Sending Data...</Caption>
        </View>
      ) : (
        <QRCodeScanner
          containerStyle={{
            backgroundColor: '#201A30',
            height: '100%',
          }}
          onRead={ifScanneed}
          permissionDialogMessage="Need Permission To Access Camera"
          flashMode={RNCamera.Constants.FlashMode.on}
          reactivate={true}
          reactivateTimeout={1500}
          showMarker={true}
          fadeIn={true}
          cameraStyle={{
            width: '100%',
            height: '100%',
          }}
          markerStyle={{borderColor: '#fff', borderRadius: 10}}
          topContent={
            <TouchableOpacity>
              <Text
                style={{
                  fontSize: 21,
                  color: 'white',
                  marginBottom: 2,
                }}>
                <AntDesign name="qrcode" color={'black'} size={30} /> Product
                Scanner
              </Text>
            </TouchableOpacity>
          }
        />
      )}
    </View>
  );
};
export default ProductScannerScreen;

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
  },
  constainerLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
});
