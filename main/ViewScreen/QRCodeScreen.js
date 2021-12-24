import React, {useState} from 'react';
import {View, Text, StyleSheet, TextInput} from 'react-native';
import MaskInput from 'react-native-mask-input';
const QRCodeScreen = props => {
  const [phone, setPhone] = React.useState('');
  const {container} = styles;
  return (
    <View style={container}>
      <Text>Hello</Text>
    </View>
  );
};
export default QRCodeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
