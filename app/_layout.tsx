import { DarkTheme as NavigationDarkTheme, DefaultTheme as NavigationDefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useFonts } from "expo-font";
import { ThemeProviderCustom, useThemeCustom } from "@/theme/provider";
import "react-native-reanimated";
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

function RootLayoutNav() {
  const { isDark } = useThemeCustom();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem('authToken');
      setIsLoggedIn(!!token);
    };
    checkLoginStatus();
  }, []);

  return (
    <ThemeProvider value={isDark ? NavigationDarkTheme : NavigationDefaultTheme}>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "none",
        }}
      >
        {!isLoggedIn ? (
          <>
            <Stack.Screen name="login" />
            <Stack.Screen name="signup" />
            <Stack.Screen name="privacy-policy" />
          </>
        ) : (
          <>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="chatroom/[id]" />
            <Stack.Screen name="transfer-credit" />
            <Stack.Screen name="transfer-history" />
            <Stack.Screen name="official-comment" />
            <Stack.Screen name="+not-found" />
          </>
        )}
      </Stack>
      <StatusBar style={isDark ? "light" : "dark"} />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProviderCustom>
        <RootLayoutNav />
      </ThemeProviderCustom>
    </GestureHandlerRootView>
  );
}