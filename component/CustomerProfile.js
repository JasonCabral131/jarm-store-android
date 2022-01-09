import React from 'react';
import {View, Image, StyleSheet, Dimensions} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Headline, Avatar, Caption, Paragraph} from 'react-native-paper';
import {useSelector} from 'react-redux';
import {toCapitalized} from '../main/helpers/reusable';
const CustomerProfile = ({customer, children}) => {
  const {container} = styles;
  const {user} = useSelector(state => state.auth);
  const imageAddress =
    'https://res.cloudinary.com/seven-eleven-grocery-netlify-com/image/upload/v1639228337/tk6u764y3biuyyyxdvkl.jpg';
  return (
    <View style={container}>
      <LinearGradient
        colors={['#AEBEC1', '#FFFFFF']}
        style={styles.linearGradient}>
        <Image
          source={require('../assets/background.png')}
          style={styles.backgroundImage}
        />
        <Headline style={styles.headlineTxt}>
          {' '}
          {user?.branch_name} Store
        </Headline>
        <View style={styles.lining} />
        <Avatar.Image
          size={64}
          source={{uri: customer ? customer.profile.url : imageAddress}}
          style={styles.avatarStyle}
        />
        <View style={styles.userInfo}>
          <Paragraph style={{display: 'flex', textAlign: 'right'}}>
            {toCapitalized(
              customer
                ? `${customer.firstname} ${customer.lastname}`
                : 'Jason Cabral',
            )}
          </Paragraph>
        </View>
        <Caption
          style={{
            display: 'flex',
            textAlign: 'right',
            fontSize: 12,
            marginTop: 25,
          }}>
          {toCapitalized(
            customer
              ? `${customer.address.fullAddress}`
              : 'San Antonio Street, San Antonio Poblacion, Dagami Leyte',
          )}
        </Caption>
      </LinearGradient>
      <View style={{marginTop: 10}}>{children}</View>
    </View>
  );
};

export default CustomerProfile;
const {width} = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    width,
    margin: 0,
    padding: 0,
    height: '100%',
  },
  linearGradient: {
    width: width,
    height: 250,
    borderBottomColor: '#EAECEE',
    borderBottomWidth: 1,
    elevation: 2,
    position: 'relative',
    padding: 5,
  },
  backgroundImage: {
    width: width,
    height: 150,
  },
  headlineTxt: {
    color: '#C047BE',
    position: 'absolute',
    top: '25%',
    right: 10,
    width,
    textAlign: 'right',
    letterSpacing: 3,
    display: 'flex',
  },
  lining: {
    position: 'absolute',
    top: '62%',
    right: 5,
    width: '65%',

    borderColor: '#6E6E6E',
    borderWidth: 2,
  },
  avatarStyle: {
    position: 'absolute',
    top: '50%',
    right: 10,
    background: '#ffffff',
  },
  userInfo: {
    position: 'absolute',
    top: '64%',
    right: '22%',
    width,
    display: 'flex',
    textAlign: 'right',
  },
  childrenContent: {
    marginTop: 20,
    width,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
