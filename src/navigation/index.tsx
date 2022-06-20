import * as React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { ColorSchemeName, Image, useWindowDimensions } from 'react-native'
import { IconButton, Provider as PaperProvider } from 'react-native-paper'
import { RootStackParamList, RootTabParamList, RootTabScreenProps } from '../../types'
import LogoTitle from '../components/LogoTitle'
import TabBarIcon from '../components/TabBarIcon'
import Colors from '../constants/Colors'
import useColorScheme from '../hooks/useColorScheme'
import CredentialsTabScreen from '../screens/CredentialsTabScreen'
import ImportAccountScreen from '../screens/ImportAccountScreen'
import ImportAccountScreen2 from '../screens/ImportAccountScreen2'
import ModalScreen from '../screens/ModalScreen'
import NotFoundScreen from '../screens/NotFoundScreen'
import OnboardingScreen from '../screens/OnBoardingScreen'
import OwnablesTabScreen from '../screens/OwnablesTabScreen'
import ScanKeyScreen from '../screens/ScanKeyScreen'
import SignInScreen from '../screens/SignInScreen'
import WalletTabScreen from '../screens/WalletTabScreen'
import { backgroundImage } from '../utils/images'
import LinkingConfiguration from './LinkingConfiguration'

import AsyncStorage from '@react-native-async-storage/async-storage'
import { useEffect, useState } from 'react'

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'transparent',
  },
}

export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {

  const { width, height } = useWindowDimensions()

  return (
    <PaperProvider>
      <NavigationContainer
        linking={LinkingConfiguration}
        theme={colorScheme === 'dark' ? DarkTheme : navTheme}>
        <Image source={backgroundImage} style={{ width, height, position: "absolute" }} />
        <RootNavigator />
      </NavigationContainer >
    </PaperProvider>
  )
}



/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>()

function RootNavigator() {

  const [appFirstLaunch, setAppFirstLaunch] = useState(null || Boolean)
  const [accountImported, setAccountImported] = useState(null || Boolean)

  useEffect(() => {
    skipOnboarding()
    skipImportAccount()
  }, [])

  const skipOnboarding = (): void => {
    AsyncStorage.getItem('AppFirstLaunch')
      .then(value => {
        if (value == null) {
          setAppFirstLaunch(true)
          AsyncStorage.setItem('AppFirstLaunch', 'false')
        } else {
          setAppFirstLaunch(false)
        }
      })
      .catch(err => console.log(err))
  }

  const skipImportAccount = (): void => {
    AsyncStorage.getItem('storageKey')
      .then(value => {
        if (value == null) {
          setAccountImported(false)
        }
        else {
          setAccountImported(true)
        }
      })
      .catch(err => console.log(err))
  }

  return (

    <Stack.Navigator
      screenOptions={{
        headerTitleStyle: { color: '#A017B7', fontWeight: '400', fontSize: 16 },
        headerTintColor: '#A017B7',
        headerShadowVisible: false,
        headerStyle: { backgroundColor: 'transparent' }
      }}>
      REMOVE COMMENTS BELOW TO SKIP ONBOARDING AND IMPORT ACCOUNT SCREENS IF ALREADY
      SEEN AND IMPORTED
      {appFirstLaunch
        &&
        <Stack.Screen name="OnBoarding" component={OnboardingScreen} options={{ headerShown: false }} />
      }

      {accountImported
        &&
        <>
          <Stack.Screen name="SignIn" component={SignInScreen} options={{ headerShown: false }} />
          <Stack.Screen name="ScanKey" component={ScanKeyScreen} options={{ headerTitle: 'Back to Sign In', }} />
          <Stack.Screen name="Import" component={ImportAccountScreen} options={{ headerTitle: 'Back to Sign In' }} />
          <Stack.Screen name="Import2" component={ImportAccountScreen2} options={{ headerTitle: 'Back to Sign In' }} />
        </>
      }
      <Stack.Screen name="Root" component={BottomTabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen name="Modal" component={ModalScreen} />
      </Stack.Group>
    </Stack.Navigator>
  )
}



/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>()

function BottomTabNavigator() {
  const colorScheme = useColorScheme()

  return (
    <BottomTab.Navigator
      initialRouteName="Wallet"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
        tabBarStyle: { height: 60 }
      }}>
      <BottomTab.Screen
        name="Wallet"
        component={WalletTabScreen}
        options={({ navigation }: RootTabScreenProps<'Wallet'>) => ({
          headerStyle: { height: 100 },
          headerTitle: (props) => <LogoTitle {...props} />,
          tabBarIcon: ({ color }) => <TabBarIcon icon="wallet-outline" color={color} />,
          tabBarLabelStyle: { fontSize: 12 },
          headerRight: () => (
            <IconButton
              icon="menu"
              color={Colors[colorScheme].tint}
              size={25}
              onPress={() => navigation.navigate('Modal')}
            />
          ),
        })}
      />
      <BottomTab.Screen
        name="Credentials"
        component={CredentialsTabScreen}
        options={({ navigation }: RootTabScreenProps<'Credentials'>) => ({
          headerTitle: 'Credentials',
          headerTitleStyle: { fontWeight: '800', marginLeft: 20 },
          tabBarIcon: ({ color }) => <TabBarIcon icon="account-box-multiple-outline" color={color} />,
          tabBarLabelStyle: { fontSize: 12 },
          headerRight: () => (
            <IconButton
              icon="menu"
              color={Colors[colorScheme].tint}
              size={25}
              onPress={() => navigation.navigate('Modal')}
            />
          ),
        })}
      />
      <BottomTab.Screen
        name="Ownables"
        component={OwnablesTabScreen}
        options={({ navigation }: RootTabScreenProps<'Ownables'>) => ({
          headerTitle: 'Ownables',
          headerTitleStyle: { fontWeight: '800', marginLeft: 20 },
          headerTitleAllowFontScaling: true,
          tabBarIcon: ({ color }) => <TabBarIcon icon="bookmark-box-multiple-outline" color={color} />,
          tabBarLabelStyle: { fontSize: 12 },
          headerRight: () => (
            <IconButton
              icon="menu"
              color={Colors[colorScheme].tint}
              size={25}
              onPress={() => navigation.navigate('Modal')}
            />
          ),
        })}
      />
    </BottomTab.Navigator>
  )
}






