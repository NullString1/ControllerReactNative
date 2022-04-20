//import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Login } from './login.js';
import { Control } from './control.js';
import 'react-native-url-polyfill/auto';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ title: 'Login' }}
        />
        <Stack.Screen
          name="Control"
          component={Control}
          options={{ title: 'Control' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;