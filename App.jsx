import React,{Component, useState} from 'react';
import {ScrollView,StatusBar,StyleSheet,Text,useColorScheme,View,} from 'react-native';
import Login from './src/screens/Login';
import TabNavigator1 from './TabNavigator1';
import { useDispatch, useSelector } from 'react-redux';


const App=()=>{
  const[isSplashScreenVisible,setIsSplashScreenVisible]=useState(false);
  const { isAuthenticated,user } = useSelector(state => state.auth);
  console.log(user)
    if(!isAuthenticated)
      return <Login />
    else return <TabNavigator1 />
  }

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;