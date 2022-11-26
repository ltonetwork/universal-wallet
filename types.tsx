import { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs'
import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList { }
  }
}

export type RootStackParamList = {
  OnBoarding: undefined
  SignUp: undefined
  SignIn: undefined
  ImportSeed: undefined
  RegisterAccount: { data: string }
  Root: NavigatorScreenParams<RootTabParamList> | undefined
  QrReader: undefined
  Menu: undefined
  Profile: undefined
  Transfer: undefined
  NotFound: undefined
}

export type RootStackScreenProps<Screen extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  Screen
>

export type RootTabParamList = {
  Wallet: undefined
  Credentials: undefined
  Ownables: undefined
}

export type RootTabScreenProps<Screen extends keyof RootTabParamList> = CompositeScreenProps<
  MaterialTopTabScreenProps<RootTabParamList, Screen>,
  NativeStackScreenProps<RootStackParamList>
>
