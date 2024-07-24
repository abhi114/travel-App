import { View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity, Button, TouchableHighlight } from 'react-native'
import React, { Component, useRef, useState } from 'react'

import SignatureCapture from 'react-native-signature-capture';


class Sign extends Component {
  saveSign() {
    this.refs['sign'].saveImage();
  }

  resetSign() {
    this.refs['sign'].resetImage();
  }

  _onSaveEvent(result) {
    //result.encoded - for the base64 encoded png
    //result.pathName - for the file path name
    console.log(result);
  }
  _onDragEvent() {
    // This callback will be called when the user enters signature
    console.log('dragged');
  }
  render() {
    return (
      <View style={{flex: 1, flexDirection: 'column'}}>
        <Text style={{alignItems: 'center', justifyContent: 'center'}}>
          Signature Capture Extended{' '}
        </Text>
        <SignatureCapture
          style={[{flex: 1, width: 500, height: 300}, styles.signature]}
          ref="sign"
          onSaveEvent={this._onSaveEvent}
          onDragEvent={this._onDragEvent}
          saveImageFileInExtStorage={false}
          showNativeButtons={false}
          showTitleLabel={false}
          backgroundColor="#2f4f4f"
          strokeColor="#ffffff"
          minStrokeWidth={4}
          maxStrokeWidth={4}
          viewMode={'portrait'}
        />

        <View style={{flex: 1, flexDirection: 'row'}}>
          <TouchableHighlight
            style={styles.buttonStyle}
            onPress={() => {
              this.saveSign();
            }}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableHighlight>

          <TouchableHighlight
            style={styles.buttonStyle}
            onPress={() => {
              this.resetSign();
            }}>
            <Text style={styles.buttonText}>Reset</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

const Duty = ({route}) => {
    
    const [accept, setaccept] = useState(false);
     const {name,number,startKm} = route.params;
     const tableData = [
       ['', 'Start', 'End Km'],
       ['Km', startKm, '0.0'],
       ['Time', '00:00', '00:0'],
     ];
     const [signatureEnable,setSignatureEnable] = useState(false);
  return (
    <View style={styles.outerContainer}>
      <ScrollView style={styles.container}>
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerText}>{name}</Text>
              <Text style={styles.headerText}>{number}</Text>
            </View>
          </View>
        </View>
        <View style={styles.table}>
          {tableData.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.row}>
              {row.map((cell, colIndex) => (
                <View key={`${rowIndex}-${colIndex}`} style={styles.cell}>
                  <Text>{cell}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => setSignatureEnable(true)}
            style={[styles.button, styles.noShowButton]}>
            <Text style={styles.buttonText}>Signature</Text>
          </TouchableOpacity>
        </View>
        {signatureEnable && <Sign />}
      </ScrollView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          
          style={[styles.button, styles.noShowButton]}>
          <Text style={styles.buttonText}>Close Duty</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  signature: `
    .m-signature-pad {
      box-shadow: none;
      border: none;
      background-color: #fff;
    }
    .m-signature-pad--body {
      border: 1px solid #000;
    }
    .m-signature-pad--footer {
      display: none;
    }
  `,
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    padding: 20,
    backgroundColor: '#ffffff',
  },
  button: {
    width: 100,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noShowButton: {
    backgroundColor: '#808080',
  },
  startButton: {
    backgroundColor: '#0000FF',
  },
  signature: {
    flex: 1,
    borderColor: '#000033',
    borderWidth: 3,
  },
  buttonStyle: {
    flex: 1,
    width: 100,
    height: 40,
    borderRadius: 10,
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#808080',
  },
  buttonText: {
    color: '#f8f8ff',
    alignSelf: 'center',
  },
  textInput: {
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 10, // Adjust corner curvature here
    padding: 10,
    margin: 5,
  },
  outerContainer: {
    flex: 1,
    backgroundColor: '#f0f8ff',
  },
  table: {
    // Set table styles here (optional)
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    flex: 1, // Makes cells share available space equally
    borderWidth: 1, // Optional border for cells
    borderColor: 'gray', // Optional border color
    padding: 5, // Optional padding for cells
  },
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 5,
    paddingLeft: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#D3D3D3',
    height: 80, // Fixed height for the header
  },
  headerTextContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  headerText: {
    marginBottom: 16,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerIconContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginRight: 12,
  },
});
export default Duty