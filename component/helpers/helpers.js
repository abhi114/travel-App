import { View } from "react-native";
import { Alert, StyleSheet } from "react-native";

export const validateEmail = email => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    Alert.alert("Enter A valid Email")
    return false;
  } 
  return true;
};

export const LineView = ()=>{
  return <View style={styles.line}></View>;
}
const styles = StyleSheet.create({
  line: {
    height: 1,
    backgroundColor: '#000000',
    marginVertical: 10,
  },
});