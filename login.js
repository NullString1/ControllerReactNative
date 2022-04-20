import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const Login = ({ navigation }) => {
  const [token, setToken] = useState("");
  const [serverStatus, setServerStatus] = useState(false);
  const [controllerStatus, setControllerStatus] = useState(false);
  var [err, setErrVisibility] = useState(false);
  const checkAuth = () => {
    fetch("https://blynk.cloud/external/api/isHardwareConnected?token=" + token)
      .then(response => {
    if (response.status == 200){
        storeToken(token);
        console.log("Valid token");
        navigation.navigate("Control");
        setServerStatus(true);
        response.json().then(a => setControllerStatus(a=="true"));
        return true;
    } else {
        console.log("Invalid token");
        setErrVisibility(true);
        return false;
    }
    })
  }
  const checkServerStatus = () => {
    const reachable = false;
    const timeout = new Promise((resolve, reject) => {
        setTimeout(reject, 2000, 'Request timed out');
    });

    const request = fetch('https://lon1.blynk.cloud');

    Promise
      .race([timeout, request])
      .then(response => setServerStatus(true))
      .catch(error => setServerStatus(false));
    return reachable;
  }
  
  useEffect(checkServerStatus);

  return (
    <View style={loginstyles.container}>
      <View style={loginstyles.loginRow}>
      { err && <Text style={loginstyles.authErrorText}>Error: Auth token incorrect</Text> }
        <TextInput placeholder="Auth Token" style={loginstyles.authToken} onChangeText={(text) => {setToken(text)}}></TextInput>
        <TouchableOpacity style={loginstyles.button} onPress={checkAuth}>
          <Text style={loginstyles.logIn}>Log In</Text>
        </TouchableOpacity>
      </View>
      <View style={[loginstyles.flexRow, loginstyles.statusRow]}>
        <View style={loginstyles.flexRow}>
          <Text style={loginstyles.controller1}>Controller:</Text>
          <Text style={loginstyles.controllerStatus}>{controllerStatus ? "Connected":"Not connected"}</Text>
        </View>
        <View style={loginstyles.flexRow}>
          <Text style={loginstyles.server1}>Server:</Text>
          <Text style={loginstyles.serverStatus}>{serverStatus ? "Connected":"Not connected"}</Text>
        </View>
      </View>
    </View>
  );
}
  

const loginstyles = StyleSheet.create({
container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-end"
},
loginRow: {
    alignItems: "center",
    flexBasis: "50%"
},
statusRow: {
    flexBasis: "4%"
},
authErrorText: {
    //fontFamily: "roboto-regular",
    color: "rgba(255,0,0,1)",
    fontSize: 16,
},
flexRow: {
    flexDirection: "row",
    justifyContent: "space-evenly"
},
button: {
    width: 107,
    height: 38,
    backgroundColor: "#E6E6E6",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10
},
logIn: {
    //fontFamily: "roboto-regular",
    color: "#121212",
},
controller1: {
    //fontFamily: "roboto-regular",
    color: "#121212"
},
controllerStatus: {
    //fontFamily: "roboto-regular",
    color: "#121212",
    marginLeft: 6
},
server1: {
    //fontFamily: "roboto-regular",
    color: "#121212",
    marginLeft: 44
},
serverStatus: {
    //fontFamily: "roboto-regular",
    color: "#121212",
    marginLeft: 12
},
authToken: {
    //fontFamily: "roboto-regular",
    color: "#121212",
    height: 46,
    width: 302,
    borderWidth: 1,
    borderColor: "#000000",
    borderRadius: 5,
    padding: 10
},
});


const storeToken = async (t) => {
try {
    await AsyncStorage.setItem('authtoken', t);
} catch (e) {
    console.log(e)
}
}
export const getToken = async () => {
try {
    const value = await AsyncStorage.getItem('authtoken');
    if(value !== null) {
    console.log(value);
    return value;
    }
} catch(e) {
    console.log(e)
}
}