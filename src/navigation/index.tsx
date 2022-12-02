import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { ColorSchemeName, Dimensions } from 'react-native'
import { RootStackParamList, RootStackScreenProps, RootTabParamList, RootTabScreenProps } from '../../types'
import SnackbarMessage from '../components/Snackbar'
import TabBarImage from '../components/TabBarImage'
import Colors from '../constants/Colors'
import useColorScheme from '../hooks/useColorScheme'
import SignUpScreen from '../screens/SignUpScreen/SignUpScreen'
import CredentialsTabScreen from '../screens/CredentialsTabScreen/CredentialsTabScreen'
import RegisterAccountScreen from '../screens/RegisterAccountScreen/RegisterAccountScreen'
import ImportSeedScreen from '../screens/ImportWithSeedScreen/ImportWithSeedScreen'
import MenuScreen from '../screens/MenuScreen/MenuScreen'
import NotFoundScreen from '../screens/NotFoundScreen'
import OnboardingScreen from '../screens/OnBoardingScreen/OnBoardingScreen'
import OwnablesTabScreen from '../screens/OwnablesTabScreen/OwnablesTabScreen'
import ProfileScreen from '../screens/ProfileScreen/ProfileScreen'
import QrReaderScreen from '../screens/QrReaderScreen/QrReaderScreen'
import SignInScreen from '../screens/SignInScreen/SignInScreen'
import WalletTabScreen from '../screens/WalletTabScreen/WalletTabScreen'
import LocalStorageService from '../services/LocalStorage.service'
import { imagesIcon } from '../utils/images'
import LinkingConfiguration from './LinkingConfiguration'
import TransferScreen from "../screens/TransferScreen/TransferScreen";
import LeaseScreen from "../screens/LeaseScreen/LeaseScreen";
import TransactionsScreen from "../screens/TransactionsScreen/TransactionsScreen";

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#ffffff',
  },
}

export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {

  return (
    <NavigationContainer linking={LinkingConfiguration} theme={colorScheme === 'dark' ? DarkTheme : navTheme}>
      <SnackbarMessage />
      <RootNavigator />
    </NavigationContainer>
  )
}

const Stack = createNativeStackNavigator<RootStackParamList>()

function RootNavigator(): any {
  const [appFirstLaunch, setAppFirstLaunch] = useState<boolean | null>(null)
  const [userAlias, setUserAlias] = useState<boolean | null>(null)

  useEffect(() => {
    skipOnboarding()
  }, [appFirstLaunch])

  const skipOnboarding = (): void => {
    LocalStorageService.getData('@appFirstLaunch')
      .then((data) => {
        if (data === null) {
          setAppFirstLaunch(true)
          LocalStorageService.storeData('@appFirstLaunch', false)
        } else {
          setAppFirstLaunch(false)
        }
      })
      .catch((error) => {
        throw new Error(`Error retrieving data. ${error}`)
      })
  }

  LocalStorageService.getData('@userAlias')
    .then((data) => {
      if (data !== null) {
        setUserAlias(true)
      }
    })
    .catch((error) => {
      throw new Error(`Error retrieving data. ${error}`)
    })


  return (
    appFirstLaunch !== null && (
      <Stack.Navigator
        initialRouteName={appFirstLaunch ? 'OnBoarding' : userAlias ? 'SignIn' : 'SignUp'}
        screenOptions={{
          headerTitleStyle: { color: '#A017B7', fontWeight: '400', fontSize: 16 },
          headerTintColor: '#A017B7',
          headerShadowVisible: false,
          headerStyle: { backgroundColor: '#ffffff' },
          presentation: 'card'
        }}
      >
        <Stack.Screen name='OnBoarding' component={OnboardingScreen} options={{ headerShown: false }} />
        <Stack.Screen name='SignUp' component={SignUpScreen} options={{ headerShown: false }} />
        <Stack.Screen name='SignIn' component={SignInScreen} options={{ headerShown: false }} />
        <Stack.Screen
          name='ImportSeed'
          component={ImportSeedScreen}
          options={{ headerTitle: '', headerBackTitleVisible: false }} />
        <Stack.Screen
          name='RegisterAccount'
          component={RegisterAccountScreen}
          options={{ headerTitle: '', headerBackTitleVisible: false }}
        />
        <Stack.Screen name='Root' component={BottomTabNavigator} options={{ headerShown: false }} />
        <Stack.Screen name='NotFound' component={NotFoundScreen} options={{ title: 'Oops!' }} />
        <Stack.Screen
          name='QrReader'
          component={QrReaderScreen}
          options={{
            headerBackTitleVisible: false,
            headerTransparent: true,
            headerTitle: '',
            headerStyle: { backgroundColor: 'transparent' }
          }}
        />
        <Stack.Group>
          <Stack.Screen
            name='Menu'
            component={MenuScreen}
            options={({ navigation }: RootStackScreenProps<'Menu'>) => ({
              headerShown: false,
            })}
          />
          <Stack.Screen
            name='Profile'
            component={ProfileScreen}
            options={{
              headerBackTitleVisible: false,
              headerTitle: 'MY ACCOUNT',
              headerTitleStyle: { fontSize: 20, color: '#000000' },
            }}
          />
        </Stack.Group>
        <Stack.Screen
          name='Transfer'
          component={TransferScreen}
          options={({ navigation }: RootStackScreenProps<'Transfer'>) => ({
            headerShown: false,
          })}
        />
        <Stack.Screen
          name='Lease'
          component={LeaseScreen}
          options={({ navigation }: RootStackScreenProps<'Lease'>) => ({
            headerShown: false,
          })}
        />
        <Stack.Screen
          name='Transactions'
          component={TransactionsScreen}
          options={({ navigation }: RootStackScreenProps<'Transactions'>) => ({
            headerShown: false,
          })}
        />
      </Stack.Navigator>
    )
  )
}

const Tab = createMaterialTopTabNavigator<RootTabParamList>()
function BottomTabNavigator() {
  const colorScheme = useColorScheme()

  return (
    <Tab.Navigator
      initialRouteName='Wallet'
      tabBarPosition='bottom'
      initialLayout={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height }}
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
        tabBarInactiveTintColor: Colors[colorScheme].tabIconDefault,
        tabBarStyle: { height: 75 },
        tabBarPressColor: '#A329B9',
      }}
    >
      <Tab.Screen
        name='Wallet'
        component={WalletTabScreen}
        options={({ navigation }: RootTabScreenProps<'Wallet'>) => ({
          tabBarShowIcon: true,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <TabBarImage source={imagesIcon.wallet} />
            ) : (
              <TabBarImage source={imagesIcon.inactiveWallet} />
            ),
          tabBarLabelStyle: { fontSize: 13, textTransform: 'capitalize' },
          tabBarIndicatorStyle: { backgroundColor: Colors[colorScheme].tint, top: 0, height: 3 },
        })}
      />
      <Tab.Screen
        name='Credentials'
        component={CredentialsTabScreen}
        options={({ navigation }: RootTabScreenProps<'Credentials'>) => ({
          tabBarIcon: ({ focused }) =>
            focused ? (
              <TabBarImage source={imagesIcon.credentials} />
            ) : (
              <TabBarImage source={imagesIcon.inactiveCredentials} />
            ),
          tabBarLabelStyle: { fontSize: 13, textTransform: 'capitalize' },
          tabBarIndicatorStyle: { backgroundColor: Colors[colorScheme].tint, top: 0, height: 3 },
        })}
      />
      <Tab.Screen
        name='Ownables'
        component={OwnablesTabScreen}
        options={({ navigation }: RootTabScreenProps<'Ownables'>) => ({
          headerTitle: 'Ownables',
          headerStyle: { height: 100 },
          headerTitleStyle: { fontWeight: '800', marginLeft: 20 },
          headerTitleAllowFontScaling: true,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <TabBarImage source={imagesIcon.ownables} />
            ) : (
              <TabBarImage source={imagesIcon.inactiveOwnables} />
            ),
          tabBarLabelStyle: { fontSize: 13, textTransform: 'capitalize' },
          tabBarIndicatorStyle: { backgroundColor: Colors[colorScheme].tint, top: 0, height: 3 },
        })}
      />
    </Tab.Navigator>
  )
}
