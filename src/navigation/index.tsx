import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { DarkTheme, DefaultTheme, NavigationContainer, useNavigation } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { ColorSchemeName, Dimensions, Image, Platform, useWindowDimensions } from 'react-native'
import { RootStackParamList, RootStackScreenProps, RootTabParamList, RootTabScreenProps } from '../../types'
import SnackbarMessage from '../components/Snackbar'
import TabBarIcon from '../components/TabBarIcon'
import Colors from '../constants/Colors'
import useColorScheme from '../hooks/useColorScheme'
import CredentialsTabScreen from '../screens/CredentialsTabScreen/CredentialsTabScreen'
import ImportAccountScreen from '../screens/ImportAccountScreen/ImportAccountScreen'
import ModalScreen from '../screens/ModalScreen/ModalScreen'
import NotFoundScreen from '../screens/NotFoundScreen'
import OnboardingScreen from '../screens/OnBoardingScreen/OnBoardingScreen'
import OwnablesTabScreen from '../screens/OwnablesTabScreen/OwnablesTabScreen'
import ProfileScreen from '../screens/ProfileScreen/ProfileScreen'
import ScanKeyScreen from '../screens/ScanKeyScreen/ScanKeyScreen'
import ScanTransactionScreen from '../screens/ScanTransactionScreen/ScanTransactionScreen'
import SignInScreen from '../screens/SignInScreen/SignInScreen'
import WalletTabScreen from '../screens/WalletTabScreen/WalletTabScreen'
import LocalStorageService from '../services/LocalStorage.service'
import { backgroundImage } from '../utils/images'
import LinkingConfiguration from './LinkingConfiguration'

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
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : navTheme}>
      <SnackbarMessage />
      <RootNavigator />
    </NavigationContainer >
  )
}


/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>()

function RootNavigator(): any {
  const colorScheme = useColorScheme()
  const navigation = useNavigation()

  const [appFirstLaunch, setAppFirstLaunch] = useState<boolean | null>(null)

  useEffect(() => {
    skipOnboarding()
  }, [])

  const skipOnboarding = (): void => {
    LocalStorageService.getData('@appFirstLaunch')
      .then(data => {
        if (data === null) {
          setAppFirstLaunch(true)
          LocalStorageService.storeData('@appFirstLaunch', false)
        } else {
          setAppFirstLaunch(false)
        }
      })
      .catch(err => console.log(err))
  }


  return (
    appFirstLaunch !== null && (
      <Stack.Navigator
        screenOptions={{
          headerTitleStyle: { color: '#A017B7', fontWeight: '400', fontSize: 16 },
          headerTintColor: '#A017B7',
          headerShadowVisible: false,
          headerStyle: { backgroundColor: 'transparent' }
        }}>
        {appFirstLaunch && (
          <Stack.Screen name="OnBoarding" component={OnboardingScreen} options={{ headerShown: false }} />
        )}
        <Stack.Screen name="SignIn" component={SignInScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ScanKey" component={ScanKeyScreen} options={{ headerBackTitle: 'Back to Sign In', headerTransparent: true, headerTitle: '' }} />
        <Stack.Screen name="ImportAccount" component={ImportAccountScreen} options={{ headerTitle: '' }} />
        <Stack.Screen name="Root" component={BottomTabNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
        <Stack.Screen name="ScanTransaction" component={ScanTransactionScreen} options={{ headerBackTitle: 'Go back', headerTransparent: true, headerTitle: '' }} />
        <Stack.Group>
          <Stack.Screen name="Modal" component={ModalScreen}
            options={({ navigation }: RootStackScreenProps<'Modal'>) => ({
              headerShown: false,
            })} />
          <Stack.Screen name="Profile" component={ProfileScreen}
            options={{
              headerTitle: '',
              headerBackTitle: 'Profile',
              headerStyle: { backgroundColor: '#ffffff' }
            }} />

        </Stack.Group>
      </Stack.Navigator>
    )
  )
}



const Tab = createMaterialTopTabNavigator<RootTabParamList>()
function BottomTabNavigator() {
  const colorScheme = useColorScheme()

  return (
    <Tab.Navigator
      initialRouteName="Wallet"
      tabBarPosition='bottom'
      initialLayout={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height }}
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
        tabBarInactiveTintColor: Colors[colorScheme].tabIconDefault,
        tabBarStyle: { height: 75 },
      }}
    >
      <Tab.Screen
        name="Wallet"
        component={WalletTabScreen}
        options={({ navigation }: RootTabScreenProps<'Wallet'>) => ({
          tabBarShowIcon: true,
          tabBarIcon: ({ color }) => <TabBarIcon icon="wallet-outline" color={color} />,
          tabBarLabelStyle: { fontSize: 13, textTransform: 'capitalize' },
          tabBarIndicatorStyle: { backgroundColor: Colors[colorScheme].tint, top: 0, height: 3 },
        })}
      />
      <Tab.Screen
        name="Credentials"
        component={CredentialsTabScreen}
        options={({ navigation }: RootTabScreenProps<'Credentials'>) => ({
          tabBarIcon: ({ color }) => <TabBarIcon icon="account-box-multiple-outline" color={color} />,
          tabBarLabelStyle: { fontSize: 13, textTransform: 'capitalize' },
          tabBarIndicatorStyle: { backgroundColor: Colors[colorScheme].tint, top: 0, height: 3 },
        })}
      />
      <Tab.Screen
        name="Ownables"
        component={OwnablesTabScreen}
        options={({ navigation }: RootTabScreenProps<'Ownables'>) => ({
          headerTitle: 'Ownables',
          headerStyle: { height: 100 },
          headerTitleStyle: { fontWeight: '800', marginLeft: 20 },
          headerTitleAllowFontScaling: true,
          tabBarIcon: ({ color }) => <TabBarIcon icon="bookmark-box-multiple-outline" color={color} />,
          tabBarLabelStyle: { fontSize: 13, textTransform: 'capitalize' },
          tabBarIndicatorStyle: { backgroundColor: Colors[colorScheme].tint, top: 0, height: 3 },
        })}
      />
    </Tab.Navigator>
  )
}