/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import * as React from 'react'
import { ColorSchemeName, Image, useWindowDimensions } from 'react-native'
import { IconButton, Provider as PaperProvider } from 'react-native-paper'
import LogoTitle from '../components/LogoTitle'
import Colors from '../constants/Colors'
import useColorScheme from '../hooks/useColorScheme'
import CredentialsTabScreen from '../screens/CredentialsTabScreen'
import ImportAccountScreen from '../screens/ImportAccountScreen'
import ImportAccountScreen2 from '../screens/ImportAccountScreen2'
import ModalScreen from '../screens/ModalScreen'
import NotFoundScreen from '../screens/NotFoundScreen'
import OnboardingScreen from '../screens/OnBoardingScreen'
import OwnablesTabScreen from '../screens/OwnablesTabScreen'
import ScanScreen from '../screens/ScanScreen'
import SignInScreen from '../screens/SignInScreen'
import WalletTabScreen from '../screens/WalletTabScreen'
import { RootStackParamList, RootTabParamList, RootTabScreenProps } from '../types'
import { localImage } from '../utils/utils'
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
        <Image source={localImage} style={{ width, height, position: "absolute" }} />
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

  // const [isAppFirstLaunch, setIsAppFirstLaunch] = useState(null)

  // useEffect(() => {
  //   AsyncStorage.getItem('isAppFirstLaunch')
  //     .then(value => {
  //       if (value === null) {
  //         setIsAppFirstLaunch(true)
  //         AsyncStorage.setItem('isAppFirstLaunch', 'false')
  //       } else {
  //         setIsAppFirstLaunch(false)
  //       }
  //     })
  // }, [])


  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleStyle: { color: '#A017B7', fontWeight: '400', fontSize: 16 },
        headerTintColor: '#A017B7',
        headerShadowVisible: false,
        headerStyle: { backgroundColor: 'transparent' }
      }}>
      <Stack.Screen name="OnBoarding" component={OnboardingScreen} options={{ headerShown: false }} />
      <Stack.Screen name="SignIn" component={SignInScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Scan" component={ScanScreen} options={{ headerTitle: 'Back to Sign In', }} />
      <Stack.Screen name="Import" component={ImportAccountScreen} options={{ headerTitle: 'Back to Sign In' }} />
      <Stack.Screen name="Import2" component={ImportAccountScreen2} options={{ headerTitle: 'Back to Sign In' }} />
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
      }}>
      <BottomTab.Screen
        name="Wallet"
        component={WalletTabScreen}
        options={({ navigation }: RootTabScreenProps<'Wallet'>) => ({
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
        })
        }
      />
      <BottomTab.Screen
        name="Credentials"
        component={CredentialsTabScreen}
        options={{
          title: 'Credentials',
          tabBarIcon: ({ color }) => <TabBarIcon icon="account-box-multiple-outline" color={color} />,
          tabBarLabelStyle: { fontSize: 12 }
        }}
      />
      <BottomTab.Screen
        name="Ownables"
        component={OwnablesTabScreen}
        options={{
          title: 'Ownables',
          headerTitleAllowFontScaling: true,
          tabBarIcon: ({ color }) => <TabBarIcon icon="bookmark-box-multiple-outline" color={color} />,
          tabBarLabelStyle: { fontSize: 12 }
        }}
      />
    </BottomTab.Navigator>
  )
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
// function TabBarIcon(props: {
//   name: React.ComponentProps<typeof FontAwesome>['name']
//   color: string
// }) {
//   return <FontAwesome size={30} style={{ marginBottom: -3 }} {...props} />
// }

function TabBarIcon(props: { icon: React.ComponentProps<typeof IconButton>['icon'], color: string }) {
  return (
    <IconButton
      size={35}
      style={{ marginBottom: 3 }} {...props}
    />

  )
}






