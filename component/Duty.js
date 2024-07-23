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
          style={[{flex: 1,width:500,height:300}, styles.signature]}
          ref="sign"
          onSaveEvent={this._onSaveEvent}
          onDragEvent={this._onDragEvent}
          saveImageFileInExtStorage={false}
          showNativeButtons={false}
          showTitleLabel={false}
          backgroundColor="#ff00ff"
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
            <Text>Save</Text>
          </TouchableHighlight>

          <TouchableHighlight
            style={styles.buttonStyle}
            onPress={() => {
              this.resetSign();
            }}>
            <Text>Reset</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

const Duty = () => {
    const tableData = [
      ['', 'Start', 'End Km'],
      ['Km', '0.00', '0.0'],
      ['Time', '00:00', '00:0'],
    ];
    const [accept, setaccept] = useState(false);
     
  return (
    <View style={styles.outerContainer}>
      <ScrollView style={styles.container}>
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerText}>KAIREE SINGH</Text>
              <Text style={styles.headerText}>NK230110005</Text>
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
              onPress={() => console.log('Reject')}
              style={[styles.button, styles.noShowButton]}>
              <Text style={styles.buttonText}>
                Signature
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => afteraccept()}
              style={[styles.button, styles.startButton]}>
              <Text style={styles.buttonText}>
                SendOtp
              </Text>
            </TouchableOpacity>
        </View>
        <Sign/>
      </ScrollView>
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
    backgroundColor: '#FFFFFF',
  },
  button: {
    width: 120,
    height: 60,
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
        borderWidth: 1,
    },
    buttonStyle: {
        flex: 1, justifyContent: "center", alignItems: "center", height: 50,
        backgroundColor: "#eeeeee",
        margin: 10
    },
  buttonText: {
    color: '#FFFFFF',
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
    backgroundColor: '#FFFFFF',
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