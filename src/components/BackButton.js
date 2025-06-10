import React from 'react';
import { TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import IconMC from 'react-native-vector-icons/MaterialCommunityIcons';

const BackButton = () => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity  onPress={() => navigation.goBack()}>
      <IconMC name="arrow-left" size={25} color='#ccc' style={{marginLeft:10}}/>
    </TouchableOpacity>
  );
};

export default BackButton;