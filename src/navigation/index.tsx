import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { ColorSchemeName, Image, useWindowDimensions } from 'react-native'
import { IconButton, Provider as PaperProvider } from 'react-native-paper'
import { RootStackParamList, RootStackScreenProps, RootTabParamList, RootTabScreenProps } from '../../types'
import LogoTitle from '../components/LogoTitle'
import TabBarIcon from '../components/TabBarIcon'
import Colors from '../constants/Colors'
import useColorScheme from '../hooks/useColorScheme'
import CredentialsTabScreen from '../screens/CredentialsTabScreen'
import ImportAccountScreen from '../screens/ImportAccountScreen'
import ImportSeedScreen from '../screens/ImportSeedScreen'
import ModalScreen from '../screens/ModalScreen'
import NotFoundScreen from '../screens/NotFoundScreen'
import OnboardingScreen from '../screens/OnBoardingScreen'
import OwnablesTabScreen from '../screens/OwnablesTabScreen'
import ScanKeyScreen from '../screens/ScanKeyScreen'
import SignInScreen from '../screens/SignInScreen'
import WalletTabScreen from '../screens/WalletTabScreen'
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
  const colorScheme = useColorScheme()

  const [appFirstLaunch, setAppFirstLaunch] = useState<boolean | null>(null)
  const [accountImported, setAccountImported] = useState<boolean | null>(null)

  useEffect(() => {
    skipOnboarding()
  }, [])

  useEffect(() => {
    skipImportAccount()
  }, [])


  const skipOnboarding = (): void => {
    LocalStorageService.getData('@appFirstLaunch')
      .then(data => {
        if (data !== null) {
          setAppFirstLaunch(false)
        } else {
          setAppFirstLaunch(true)
          LocalStorageService.storeData('@appFirstLaunch', 'true')
        }
      })
      .catch(err => console.log(err))
  }


  const skipImportAccount = (): void => {
    LocalStorageService.getData('@appAuth')
      .then(data => {
        if (data) {
          setAccountImported(true)
        } else {
          setAccountImported(false)
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

      {/* REMOVE COMMENTS BELOW TO SKIP ONBOARDING AND IMPORT ACCOUNT SCREENS IF ALREADY
      SEEN AND IMPORTED */}
      {/* {appFirstLaunch
          && */}
      <Stack.Screen name="OnBoarding" component={OnboardingScreen} options={{ headerShown: false }} />
      {/* } */}

      {/* {!accountImported
          &&
          <> */}
      <Stack.Screen name="SignIn" component={SignInScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ScanKey" component={ScanKeyScreen} options={{ headerTitle: 'Back to Sign In', headerTransparent: true }} />
      <Stack.Screen name="ImportSeed" component={ImportSeedScreen} options={{ headerTitle: 'Back to Sign In' }} />
      <Stack.Screen name="ImportAccount" component={ImportAccountScreen} options={{ headerTitle: 'Back to Sign In' }} />
      {/* </>
        } */}
      <Stack.Screen name="Root" component={BottomTabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen
          name="Modal"
          component={ModalScreen}
          options={({ navigation }: RootStackScreenProps<'Modal'>) => ({
            headerLeft: () => <LogoTitle />,
            headerTitleStyle: { color: 'transparent' },
            headerRight: () => (
              <IconButton
                icon='close'
                color={Colors[colorScheme].tint}
                size={25}
                onPress={() => navigation.navigate('Root')}
              />
            )
          })}
        />
      </Stack.Group>
    </Stack.Navigator>)
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
          headerTitle: () => <LogoTitle />,
          headerStyle: { height: 100 },
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
          headerStyle: { height: 100 },
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
          headerStyle: { height: 100 },
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






