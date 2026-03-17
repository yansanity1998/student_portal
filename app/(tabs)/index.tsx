import Biometric from '@/components/Auth/Biometric';
import Login from '@/components/Auth/Login';
import Register from '@/components/Auth/Register';
import Achievements from '@/components/Main/Achievements/Achievements';
import Billing from '@/components/Main/Billing/Billing';
import Home from '@/components/Main/Home';
import NavButtons from '@/components/Main/NavButtons';
import QrScanner from '@/components/Main/QrScanner';
import Settings from '@/components/Main/Settings';
import PersonalInformation from '@/components/Personal/PersonalInformation';
import SecurityPassword from '@/components/Personal/SecurityPassword';
import Attendance from '@/components/Quick Access/Attendance';
import Courses from '@/components/Quick Access/Courses';
import Grades from '@/components/Quick Access/Grades';
import Message from '@/components/Quick Access/Message';
import Schedule from '@/components/Quick Access/Schedule';
import Tasks from '@/components/Quick Access/Tasks/Tasks';
import SplashScreen from '@/components/SplashScreen/SplashScreen';
import Location from '@/components/Main/Timetable/Location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useState } from 'react';
import { View } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';

type Screen = 'Home' | 'Settings' | 'Scan' | 'Login' | 'Biometric' | 'PersonalInformation' | 'SecurityPassword' | 'SplashScreen' | 'Schedule' | 'Messages' | 'Grades' | 'Attendance' | 'Courses' | 'Tasks' | 'Achievements' | 'Billing' | 'Register' | 'Location';
const ScreenContext = createContext({
  currentScreen: 'SplashScreen' as Screen,
  setScreen: (screen: Screen, target?: Screen) => { },
  goBack: () => { },
  canGoBack: false,
  showBreakingNews: true,
  setShowBreakingNews: (val: boolean) => { },
});

export const useNavigation = () => useContext(ScreenContext);

export default function AppContainer() {
  const [currentScreen, setScreenState] = useState<Screen>('SplashScreen');
  const [targetScreen, setTargetScreen] = useState<Screen>('Login');
  const [history, setHistory] = useState<Screen[]>([]);
  const [showBreakingNews, setShowBreakingNewsState] = useState(true);

  React.useEffect(() => {
    const loadBreakingNewsPref = async () => {
      try {
        const saved = await AsyncStorage.getItem('show_breaking_news');
        if (saved !== null) {
          setShowBreakingNewsState(JSON.parse(saved));
        }
      } catch (e) { }
    };
    loadBreakingNewsPref();
  }, []);

  const setShowBreakingNews = async (val: boolean) => {
    setShowBreakingNewsState(val);
    try {
      await AsyncStorage.setItem('show_breaking_news', JSON.stringify(val));
    } catch (e) { }
  };

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
    .activeOffsetX(20) // Require 20px horizontal movement to activate
    .failOffsetY([-20, 20]) // Fail if there's significant vertical movement
    .onUpdate((event) => {
      if (event.translationX > 50 && event.velocityX > 500 && history.length > 0) {
        runOnJS(goBack)();
      }
    })
    .runOnJS(true);

  return (
    <ScreenContext.Provider value={{
      currentScreen,
      setScreen,
      goBack,
      canGoBack: history.length > 0,
      showBreakingNews,
      setShowBreakingNews
    }}>
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
            {currentScreen === 'Achievements' && <Achievements />}
            {currentScreen === 'Billing' && <Billing />}
            {currentScreen === 'Register' && <Register />}
            {currentScreen === 'Location' && <Location />}
            {currentScreen === 'SplashScreen' && <SplashScreen onFinish={() => setScreen(targetScreen)} />}
            {['Home', 'Settings', 'Scan', 'Billing'].includes(currentScreen) && <NavButtons />}
          </View>
        </GestureDetector>
      </GestureHandlerRootView>
    </ScreenContext.Provider>
  );
}