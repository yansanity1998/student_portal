import Biometric from '@/components/Auth/Biometric';
import Login from '@/components/Auth/Login';
import Home from '@/components/Main/Home';
import QrScanner from '@/components/Main/QrScanner';
import Settings from '@/components/Main/Settings';
import PersonalInformation from '@/components/Personal/PersonalInformation';
import SecurityPassword from '@/components/Personal/SecurityPassword';
import Attendance from '@/components/Quick Access/Attendance';
import Courses from '@/components/Quick Access/Courses';
import Grades from '@/components/Quick Access/Grades';
import Tasks from '@/components/Quick Access/Tasks';
import Message from '@/components/Quick Access/Message';
import Schedule from '@/components/Quick Access/Schedule';
import SplashScreen from '@/components/SplashScreen/SplashScreen';
import React, { createContext, useContext, useState } from 'react';
import { View } from 'react-native';
import { GestureDetector, Gesture, GestureHandlerRootView } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';

type Screen = 'Home' | 'Settings' | 'Scan' | 'Login' | 'Biometric' | 'PersonalInformation' | 'SecurityPassword' | 'SplashScreen' | 'Schedule' | 'Messages' | 'Grades' | 'Attendance' | 'Courses' | 'Tasks';
const ScreenContext = createContext({
  currentScreen: 'SplashScreen' as Screen,
  setScreen: (screen: Screen, target?: Screen) => { },
  goBack: () => { },
  canGoBack: false,
});

export const useNavigation = () => useContext(ScreenContext);

export default function AppContainer() {
  const [currentScreen, setScreenState] = useState<Screen>('SplashScreen');
  const [targetScreen, setTargetScreen] = useState<Screen>('Login');
  const [history, setHistory] = useState<Screen[]>([]);

  const setScreen = (screen: Screen, target?: Screen) => {
    if (screen === 'SplashScreen' && target) {
      setTargetScreen(target);
    }
    
    // Add to history if it's a meaningful navigation (exclude splash screen transitions)
    if (screen !== currentScreen && screen !== 'SplashScreen' && currentScreen !== 'SplashScreen') {
      setHistory(prev => [...prev, currentScreen]);
    }
    
    setScreenState(screen);
  };

  const goBack = () => {
    if (history.length > 0) {
      const newHistory = [...history];
      const prevScreen = newHistory.pop();
      if (prevScreen) {
        setHistory(newHistory);
        setScreenState(prevScreen);
      }
    }
  };
  const swipeBackGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationX > 50 && event.velocityX > 500 && history.length > 0) {
        runOnJS(goBack)();
      }
    })
    .runOnJS(true);

  return (
    <ScreenContext.Provider value={{ currentScreen, setScreen, goBack, canGoBack: history.length > 0 }}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <GestureDetector gesture={swipeBackGesture}>
          <View style={{ flex: 1, backgroundColor: '#F0F9F9' }}>
            {currentScreen === 'Home' && <Home />}
            {currentScreen === 'Settings' && <Settings />}
            {currentScreen === 'Scan' && <QrScanner />}
            {currentScreen === 'Login' && <Login />}
            {currentScreen === 'Biometric' && <Biometric />}
            {currentScreen === 'PersonalInformation' && <PersonalInformation />}
            {currentScreen === 'SecurityPassword' && <SecurityPassword />}
            {currentScreen === 'Schedule' && <Schedule />}
            {currentScreen === 'Messages' && <Message />}
            {currentScreen === 'Grades' && <Grades />}
            {currentScreen === 'Attendance' && <Attendance />}
            {currentScreen === 'Courses' && <Courses />}
            {currentScreen === 'Tasks' && <Tasks />}
            {currentScreen === 'SplashScreen' && <SplashScreen onFinish={() => setScreen(targetScreen)} />}
          </View>
        </GestureDetector>
      </GestureHandlerRootView>
    </ScreenContext.Provider>
  );
}