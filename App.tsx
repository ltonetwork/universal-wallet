import { StatusBar } from 'expo-status-bar';
import { ImageBackground, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <Navigation colorScheme={colorScheme} />
        <StatusBar />

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