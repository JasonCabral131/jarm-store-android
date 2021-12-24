import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import AnimateNumber from 'react-native-countup';
export const TodaySalesWidget = ({sales}) => {
  const {container} = styles;
  const [todaySale, setTodaySale] = useState(0);
  const handleGetDailySale = () => {
    let daily = 0;
    if (sales) {
      if (sales.salesByDay) {
        daily += parseFloat(
          sales.salesByDay.reduce((accum, item) => accum + item.total, 0),
        );
      }
    }
    setTodaySale(daily);
  };
  useEffect(() => {
    handleGetDailySale();
  }, [sales]);
  return (
    <View style={container}>
      <AnimateNumber
        value={todaySale}
        countBy={1}
        timing={(interval, progress) => {
          // slow start, slow end
          return interval * (1 - Math.sin(Math.PI * progress)) * 10;
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
