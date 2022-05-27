import { StatusBar } from 'expo-status-bar';
import { ImageBackground, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';

const localImage = require('./assets/images/background_degree.png')

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <ImageBackground source={localImage} style={styles.container}>
          <Navigation colorScheme={colorScheme} />
          <StatusBar />
        </ImageBackground>

      </SafeAreaProvider>
    );
  }
}
// Still make background image work 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '',
    justifyContent: 'center',
    resizeMode: 'cover',
    zIndex: 1


  }
})