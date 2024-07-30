import { Text, View } from "react-native";
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

export const MainFooter = () => {
  return (
    <View style={styles1.footerContainer}>
      <Text style={styles1.footerText}>Developed By:- CMP Techsseract LLP</Text>
    </View>
  );
};

const styles1 = StyleSheet.create({
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffff', // Change to your preferred background color
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    color: '#000', // Change to your preferred text color
    fontSize: 8,
  },
});