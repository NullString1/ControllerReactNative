import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Switch} from "react-native";
import { getToken } from "./login";
export const Control = ({ navigation }) => {
    const [heating, setHeating] = useState(false);
    const [water, setWater] = useState(false);
    const [serverStatus, setServerStatus] = useState(false);
    const [controllerStatus, setControllerStatus] = useState(false);
    const syncState = () => {
        getToken().then(token => {
            let url = new URL("https://blynk.cloud/external/api/isHardwareConnected");
            url.searchParams.append("token", token)
            fetch(url).then(response => {
                if (response.ok){
                    response.text().then(t => setControllerStatus(t=="true"));
                }
            }).catch(e => console.log(e));

            let url2 = new URL("https://blynk.cloud/external/api/get");
            url2.searchParams.append("token", token);
            url2.searchParams.append("v0", "");
            url2.searchParams.append("v1", "");
            fetch(url2)
            .then(response => response.json().then(j => {
                setServerStatus(true);
                setHeating(j.v0 == 1);
                setWater(j.v1 == 1);
            })).catch(e => console.error(e));
            
            
        });
        
    }

    useEffect(syncState);
    return (
      <View style={styles.container}>
        <Text style={styles.homeController}>Home Controller</Text>
        <View style={styles.heating}>
          <View style={styles.rect}>
            <Text style={styles.heatingText}>Heating</Text>
            <Switch value={heating} style={styles.hSwitch} onValueChange={(t) => {setHeating(!heating); setHWState("V0", heating ? 0:1)}}></Switch>
          </View>
        </View>
        <View style={styles.water}>
          <View style={styles.rect1}>
            <Text style={styles.waterText}>Water</Text>
            <Switch value={water} style={styles.wSwitch} onValueChange={(t) => {setWater(!water); setHWState("V1", water ? 0:1)}}></Switch>
          </View>
        </View>
        
        <View style={[styles.flexRow, styles.statusRow]}>
            <View style={styles.flexRow}>
            <Text style={styles.controller1}>Controller:</Text>
            <Text style={styles.controllerStatus}>{controllerStatus ? "Connected":"Not connected"}</Text>
            </View>
            <View style={styles.flexRow}>
            <Text style={styles.server1}>Server:</Text>
            <Text style={styles.serverStatus}>{serverStatus ? "Connected":"Not connected"}</Text>
            </View>
      </View>
      </View>
    );
  }
  
const setHWState = async(pin, value) => {
    const url = new URL("https:blynk.cloud/external/api/update");
    url.searchParams.append("token", await getToken());
    url.searchParams.append(pin, value);
    fetch(url)
      .then(response => response.status)
      .then(c => console.log(c));
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexShrink: 1,
        flexDirection: "column",
        justifyContent: "flex-end",
        alignItems: "center"
    },
    heating: {
        alignItems: "center",
        flexBasis: "50%"
    },
    statusRow: {
        flexBasis: "4%"
    },
    flexRow: {
        flexDirection: "row",
        justifyContent: "space-evenly"
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
    heating: {
        width: 355,
        height: 74,
    },
    rect: {
        width: 355,
        height: 74,
        backgroundColor: "#E6E6E6",
        borderRadius: 24,
        flexDirection: "row"
    },
    heatingText: {
        //fontFamily: "roboto-regular",
        color: "#121212",
        fontSize: 26,
        marginLeft: 26,
        marginTop: 20,
    },
    hSwitch: {
        marginLeft: 174,
        marginTop: 25
    },
    water: {
        width: 355,
        height: 74,
        marginTop: 10,
        flexBasis: "50%"
    },
    rect1: {
        width: 355,
        height: 74,
        backgroundColor: "#E6E6E6",
        borderRadius: 24,
        flexDirection: "row"
    },
    waterText: {
        //fontFamily: "roboto-regular",
        color: "#121212",
        fontSize: 26,
        marginLeft: 26,
        marginTop: 20
    },
    wSwitch: {
        marginLeft: 197,
        marginTop: 25
    },
    homeController: {
        //fontFamily: "roboto-regular",
        color: "#121212",
        fontSize: 32,
        flexBasis: "40%",
    },
    });