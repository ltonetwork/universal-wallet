import { FontAwesome } from '@expo/vector-icons'
import * as Font from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'
import { setStatusBarHidden } from 'expo-status-bar'
import { useEffect, useState } from 'react'

export default function useCachedResources() {
  const [isLoadingComplete, setLoadingComplete] = useState(false)


  useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        setStatusBarHidden(true, 'none')
        SplashScreen.preventAutoHideAsync()
        // Load fonts
        await Font.loadAsync({
          ...FontAwesome.font,
          'space-mono': require('../assets/fonts/SpaceMono-Regular.ttf'),
        })
      } catch (e) {
        console.warn(e)
      } finally {
        setLoadingComplete(true)
        SplashScreen.hideAsync()
        setStatusBarHidden(false, 'fade')
      }
    }

    loadResourcesAndDataAsync()
  }, [])

  return isLoadingComplete
}
