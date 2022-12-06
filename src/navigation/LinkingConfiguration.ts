import { LinkingOptions } from '@react-navigation/native'
import * as Linking from 'expo-linking'

import { RootStackParamList } from '../../types'

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [Linking.makeUrl('/')],
  config: {
    screens: {
      Root: {
        screens: {
          Wallet: {
            screens: {
              WalletTabScreen: 'one',
            },
          },
          Credentials: {
            screens: {
              CredentialsTabScreen: 'two',
            },
          },
          Ownables: {
            screens: {
              OwnablesTabScreen: 'three',
            },
          },
        },
      },
      Menu: 'modal',
      NotFound: '*',
    },
  },
}


export default linking
