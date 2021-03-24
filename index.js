/** @format */

import { AppRegistry } from 'react-native'
import { registerRootComponent } from 'expo'
import App from './App'

/**
 * registerRootComponent is roughly equivalent to React Native's AppRegistry.registerComponent,
 * with some additional hooks to provide Expo specific functionality.
 * link: https://docs.expo.io/versions/latest/sdk/register-root-component/
 */
registerRootComponent(App)
// AppRegistry.registerComponent('GoalMoguliOS', () => App);
