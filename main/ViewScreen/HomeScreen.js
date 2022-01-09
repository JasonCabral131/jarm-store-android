import React, {useCallback, useEffect, useState} from 'react';
import {
  Text,
  StyleSheet,
  View,
  Dimensions,
  RefreshControl,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import * as Animatable from 'react-native-animatable';

import {useDispatch} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import {getSales} from './../../redux/actions/';
import {
  Caption,
  ActivityIndicator,
  DataTable,
  Avatar,
  Badge,
} from 'react-native-paper';
import AnimateNumber from 'react-native-countup';
import FontIcon from 'react-native-vector-icons/FontAwesome';
import AntIcon from 'react-native-vector-icons/AntDesign';
import {LineChart} from 'react-native-chart-kit';
import {monthNames, handleInformation} from './../helpers/reusable';
import moment from 'moment';
const {width} = Dimensions.get('window');

const HomeScreen = props => {
  const [sales, setSales] = useState(null);
  const [todaySale, setTodaySale] = useState(0);
  const [weeklySale, setWeeklySale] = useState(0);
  const [weeklySaleChart, setWeeklySaleChart] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [monthlySale, setMonthlySale] = useState(0);
  const [loadingChart, setLoadingChart] = useState(false);
  const [showInformation, setShowInformation] = useState(0);
  const dispatch = useDispatch();

  const handleGetSales = async () => {
    setRefreshing(true);
    setLoadingChart(true);
    const res = await dispatch(getSales());
    setRefreshing(false);
    if (res.result) {
      setSales(res.POS);
      if (res.POS) {
        if (res.POS.salesByDay) {
          const daily = parseFloat(
            res.POS.salesByDay.reduce((accum, item) => accum + item.total, 0),
          );
          setTodaySale(daily);
        }
        if (res.POS.salesByWeek) {
          const weakly = parseFloat(
            res.POS.salesByWeek.reduce((accum, item) => accum + item.total, 0),
          );
          setWeeklySale(weakly);
          handleWeekLyData(res.POS);
        }
        if (res.POS.salesByMonth) {
          const monthly = parseFloat(
            res.POS.salesByMonth.reduce((accum, item) => accum + item.total, 0),
          );
          setMonthlySale(monthly);
        }
      }
    }
  };
  useFocusEffect(
    useCallback(() => {
      handleGetSales();
    }, []),
  );
  const onRefresh = async () => {
    handleGetSales();
    console.log('reload');
  };
  const handleWeekLyData = saleInfo => {
    let Weeklydata = [];
    if (saleInfo) {
      if (saleInfo.salesByWeek) {
        const SundaySale = saleInfo.salesByWeek
          .filter(data => data.day === 'Sunday')
          .reduce((accum, item) => accum + item.total, 0);
        const MondaySale = saleInfo.salesByWeek
          .filter(data => data.day === 'Monday')
          .reduce((accum, item) => accum + item.total, 0);
        const TuesdaySale = saleInfo.salesByWeek
          .filter(data => data.day === 'Tuesday')
          .reduce((accum, item) => accum + item.total, 0);
        const WednesdaySale = saleInfo.salesByWeek
          .filter(data => data.day === 'Wednesday')
          .reduce((accum, item) => accum + item.total, 0);
        const ThursdaySale = saleInfo.salesByWeek
          .filter(data => data.day === 'Thursday')
          .reduce((accum, item) => accum + item.total, 0);
        const FridaySale = saleInfo.salesByWeek
          .filter(data => data.day === 'Friday')
          .reduce((accum, item) => accum + item.total, 0);
        const Saturday = saleInfo.salesByWeek
          .filter(data => data.day === 'Saturday')
          .reduce((accum, item) => accum + item.total, 0);
        Weeklydata.push(SundaySale);
        Weeklydata.push(MondaySale);
        Weeklydata.push(TuesdaySale);
        Weeklydata.push(WednesdaySale);
        Weeklydata.push(ThursdaySale);
        Weeklydata.push(FridaySale);
        Weeklydata.push(Saturday);
      }
    }
    setLoadingChart(false);
    setWeeklySaleChart(Weeklydata);
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={{width, padding: 20}}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <Animatable.View style={styles.widget} animation={'fadeInRight'}>
          <Caption style={styles.caption}>Today Sales</Caption>
          <View style={styles.widgetContent}>
            <Text style={styles.saleInfo}>
              <AnimateNumber
                value={todaySale}
                countBy={2}
                timing={(interval, progress) => {
                  // slow start, slow end
                  return interval * (1 - Math.sin(Math.PI * progress)) * 10;
                }}
                formatter={val => {
                  return '₱. ' + parseFloat(val).toFixed(2);
                }}
              />
            </Text>
            <FontIcon
              name="bar-chart"
              size={25}
              color={'#2EA4D5'}
              style={{marginLeft: 20}}
            />
          </View>
        </Animatable.View>
        <Animatable.View style={styles.widget} animation={'fadeInLeft'}>
          <Caption style={styles.caption}>Weekly Sales</Caption>
          <View style={styles.widgetContent}>
            <Text style={styles.saleInfo}>
              <AnimateNumber
                value={weeklySale}
                countBy={3}
                timing={(interval, progress) => {
                  // slow start, slow end
                  return interval * (1 - Math.sin(Math.PI * progress)) * 10;
                }}
                formatter={val => {
                  return '₱. ' + parseFloat(val).toFixed(2);
                }}
              />
            </Text>
            <AntIcon
              name="linechart"
              size={25}
              color={'#2EA4D5'}
              style={{marginLeft: 20}}
            />
          </View>
        </Animatable.View>
        <Animatable.View style={styles.chartView} animation={'zoomInUp'}>
          <LineChart
            data={{
              labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thurs', 'Fri', 'Sat'],
              datasets: [
                {
                  data:
                    weeklySaleChart.length < 1
                      ? [0, 0, 0, 0, 0, 0, 0]
                      : [...weeklySaleChart],
                },
              ],
              legend: ['Weekly Sale'],
            }}
            width={width * 0.85} // from react-native
            height={220}
            yAxisLabel="₱."
            yAxisInterval={1} // optional, defaults to 1
            chartConfig={{
              backgroundColor: '#201A30',
              backgroundGradientFrom: '#700979',
              backgroundGradientTo: '#ffa726',

              decimalPlaces: 2, // optional, defaults to 2dp
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16,
                padding: 5,
              },
              propsForDots: {
                r: '6',
                strokeWidth: '2',
                stroke: '#ffa726',
              },
              paddingLeftL: 5,
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
        </Animatable.View>
        <Animatable.View style={styles.widget} animation={'zoomIn'}>
          <Caption style={styles.caption}>
            {monthNames[new Date().getMonth()]} Sales
          </Caption>
          <View style={styles.widgetContent}>
            <Text style={styles.saleInfo}>
              <AnimateNumber
                value={monthlySale}
                countBy={10}
                timing={(interval, progress) => {
                  // slow start, slow end
                  return interval * (1 - Math.sin(Math.PI * progress)) * 10;
                }}
                formatter={val => {
                  return '₱. ' + parseFloat(val).toFixed(2);
                }}
              />
            </Text>
            <AntIcon
              name="barchart"
              size={25}
              color={'#2EA4D5'}
              style={{marginLeft: 20}}
            />
          </View>
        </Animatable.View>
        <Animatable.View
          style={styles.todaySaleWidget}
          animation={'fadeInRight'}>
          <Caption style={styles.caption}>Today Sales Information</Caption>
          <ScrollView horizontal contentContainerStyle={{width: width + 200}}>
            <DataTable style={{width: width + 200}}>
              <DataTable.Header>
                <DataTable.Title>
                  <Text style={styles.headingDatable}>Details</Text>
                </DataTable.Title>
                <DataTable.Title>
                  <Text style={styles.headingDatable}>Transaction</Text>
                </DataTable.Title>
                <DataTable.Title numeric>
                  <Text style={styles.headingDatable}>Total</Text>
                </DataTable.Title>
                <DataTable.Title numeric>
                  <Text style={styles.headingDatable}>Time</Text>
                </DataTable.Title>
              </DataTable.Header>
              {sales
                ? Array.isArray(sales.salesByDay)
                  ? sales.salesByDay.map((item, index) => {
                      return (
                        <>
                          <DataTable.Row>
                            <DataTable.Cell>
                              <TouchableOpacity
                                style={styles.toggleDown}
                                onPress={() => {
                                  if (index + 1 === showInformation) {
                                    setShowInformation(0);
                                    return;
                                  }
                                  setShowInformation(index + 1);
                                }}>
                                <FontIcon
                                  size={15}
                                  color={'#dedcdc'}
                                  name={
                                    showInformation === index + 1
                                      ? 'chevron-up'
                                      : 'chevron-down'
                                  }
                                />
                              </TouchableOpacity>
                            </DataTable.Cell>
                            <DataTable.Cell>
                              <View
                                style={{
                                  display: 'flex',
                                  flexDirection: 'row',
                                }}>
                                <Avatar.Image
                                  size={25}
                                  source={{uri: handleInformation(item).url}}
                                />
                                <Text style={{color: '#ffffff', marginLeft: 5}}>
                                  {handleInformation(item).name}
                                </Text>
                              </View>
                            </DataTable.Cell>
                            <DataTable.Cell numeric>
                              <Text style={{color: '#ffffff'}}>
                                {item.total}
                              </Text>
                            </DataTable.Cell>
                            <DataTable.Cell numeric>
                              <Text style={{color: '#ffffff'}}>
                                {moment(new Date(item.createdAt)).fromNow()}{' '}
                              </Text>
                            </DataTable.Cell>
                          </DataTable.Row>
                          {showInformation === index + 1 ? (
                            <>
                              <View
                                style={{display: 'flex', flexDirection: 'row'}}>
                                <Caption style={{color: '#ff0090'}}>
                                  Transaction Id:{' '}
                                </Caption>
                                <Text style={{marginLeft: 5, color: '#ffffff'}}>
                                  {item.salesId}
                                </Text>
                              </View>
                              <DataTable style={styles.dropdownProduct}>
                                <DataTable.Header>
                                  <DataTable.Title>
                                    <Text style={styles.headingDatable}>
                                      Product
                                    </Text>
                                  </DataTable.Title>
                                  <DataTable.Title>
                                    <Text style={styles.headingDatable}>
                                      Price
                                    </Text>
                                  </DataTable.Title>
                                  <DataTable.Title>
                                    <Text style={styles.headingDatable}>
                                      Quantity
                                    </Text>
                                  </DataTable.Title>
                                  <DataTable.Title>
                                    <Text style={styles.headingDatable}>
                                      Amount
                                    </Text>
                                  </DataTable.Title>
                                </DataTable.Header>
                                {item.product.map(product => {
                                  return (
                                    <DataTable.Header>
                                      <DataTable.Title>
                                        <Text style={styles.headingDatable}>
                                          {product.product.product}
                                        </Text>
                                      </DataTable.Title>
                                      <DataTable.Title>
                                        <Text style={styles.headingDatable}>
                                          {product.price}
                                        </Text>
                                      </DataTable.Title>
                                      <DataTable.Title>
                                        <Text style={styles.headingDatable}>
                                          {product.quantity}
                                        </Text>
                                      </DataTable.Title>
                                      <DataTable.Title>
                                        <Text style={styles.headingDatable}>
                                          {product.amount}
                                        </Text>
                                      </DataTable.Title>
                                    </DataTable.Header>
                                  );
                                })}
                              </DataTable>
                            </>
                          ) : null}
                        </>
                      );
                    })
                  : null
                : null}
            </DataTable>
          </ScrollView>
        </Animatable.View>
      </ScrollView>
    </SafeAreaView>
  );
};
export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#201A30',
    width,
  },
  widget: {
    height: 100,
    width: '95%',
    alignSelf: 'center',
    elevation: 2,
    backgroundColor: '#283040',
    padding: 10,
    marginTop: 5,
  },
  todaySaleWidget: {
    width: '95%',
    alignSelf: 'center',
    elevation: 2,
    backgroundColor: '#283040',
    padding: 10,
    marginTop: 5,
    marginBottom: 50,
  },
  widgetContent: {
    width: '80%',
    alignSelf: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    flexDirection: 'row',
  },
  caption: {
    color: '#ffffff',
  },
  saleInfo: {
    color: '#2D88B0',
    fontSize: 18,
  },
  chartView: {
    width: '100%',
    alignSelf: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  headingDatable: {
    color: '#ebebeb',
  },
  toggleDown: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 20,
    height: 20,
    marginStart: 10,
    marginLeft: 10,
  },
  dropdownProduct: {
    width: width + 200,
    margin: 4,
    elevation: 2,
    backgroundColor: '#b0b0b0',
    borderColor: '#c0c0c0',
    display: 'flex',
    alignSelf: 'center',
  },
});
