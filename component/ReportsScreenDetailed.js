import React from 'react';
import {StyleSheet, Image, Text, View,TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon1 from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native';


const ReportsScreenDetailed = props => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Maxx Scooter</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon1 name="chevron-left" color="#FFF" size={25} />
        </TouchableOpacity>
      </View>
      
        <Image
          source={require('../assets/car_photo1.png')}
          style={styles.img}
        />
    
      <ScrollView style={styles.cont3}>
        <Text style={styles.title}>Maxx Scooter</Text>
        <Text style={styles.subtitle}>Model S1</Text>
        <View style={styles.cont2}>
          <Text style={{...styles.title, flex: 2, marginTop: 0}}>Colors</Text>
          <View style={styles.selected}>
            <View style={styles.c1} />
          </View>
          <View style={styles.c2} />
          <View style={styles.c3} />
        </View>
        <Text style={styles.text}>
          Lorem ipsum dolor sit amet, consectutur adipsing elit, sed do eiusmod
          tempor inciduent ut labore et dolore magna
        </Text>
        <View style={styles.cont1}>
          <Icon name="heart-o" color="#000" size={25} />
          <TouchableOpacity
            style={styles.btn}
            onPress={() => navigation.navigate('Home')}>
            <Text style={styles.btnText}>Next</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default ReportsScreenDetailed;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#121212',
  },
  title: {
    fontSize: 25,
    fontFamily: 'Montserrat_700Bold',
    marginTop: 30,
  },
  subtitle: {
    fontSize: 20,
    color: '#474747',
    marginTop: 10,
    fontFamily: 'Montserrat_400Regular',
  },
  text: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 18,
    paddingRight: 80,
    lineHeight: 25,
  },
  btn: {
    backgroundColor: '#E2443B',
    paddingHorizontal: 60,
    borderRadius: 30,
  },
  btnText: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 20,
    color: '#FFF',
  },
  cont1: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  c3: {
    height: 20,
    width: 20,
    borderRadius: 15,
    backgroundColor: '#529CC0',
  },
  c2: {
    height: 20,
    width: 20,
    borderRadius: 15,
    backgroundColor: '#529C47',
    marginHorizontal: 10,
  },
  c1: {
    height: 20,
    width: 20,
    borderRadius: 15,
    backgroundColor: '#E2443B',
  },
  selected: {
    borderColor: '#E2443B',
    height: 30,
    width: 30,
    borderRadius: 24,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cont2: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  img: {
    height: '40%',
    width: '100%',
    resizeMode:'contain',
    borderRadius:15,
  },
  cont3: {
    marginBottom:5,
    flex: 1,
    backgroundColor: '#FFF',
    width: '100%',
    borderRadius: 50,
    paddingHorizontal: 20,
  },
});
