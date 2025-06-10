import { View, Text, ScrollView, Pressable } from 'react-native'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Login from './Login';
import { logoutUser } from '../redux/authSlice';

export default function Setting() {
  const { isAuthenticated,user } = useSelector(state => state.auth);
  const dispatch=useDispatch();
  if(!isAuthenticated) return <Login />
  else return (
    <ScrollView style={{ padding: 10, flex: 1, backgroundColor: "white" }}>
      <Text style={{ fontSize: 16, fontWeight: "bold" }}>
        Welcome {user?.email}
      </Text>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          marginTop: 12,
        }}
      >
        <Pressable
          style={{
            padding: 10,
            backgroundColor: "#E0E0E0",
            borderRadius: 25,
            flex: 1,
          }}
        >
          <Text style={{ textAlign: "center" }}>Your Account</Text>
        </Pressable>
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          marginTop: 12,
        }}
      >

        <Pressable
          onPress={() => dispatch(logoutUser())}
          style={{
            padding: 10,
            backgroundColor: "#E0E0E0",
            borderRadius: 25,
            flex: 1,
          }}
        >
          <Text style={{ textAlign: "center" }}>Logout</Text>
        </Pressable>
      </View>
    </ScrollView>
  )
}