import { router, Stack } from "expo-router";
import { useEffect } from "react";
import { AppProvider } from "../hooks";
import { useAuth } from "../hooks/Auth";

const StackLayout = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (user?.autenticated === false) {
      router.replace("signin");
    } else {
      router.replace("(protected)");
    }
  }, [user]);

  return (
    <Stack>
      <Stack.Screen name="signin" options={{ headerShown: false }} />
      <Stack.Screen name="(protected)" options={{ headerShown: false }} />
      <Stack.Screen name="about" options={{ headerShown: false }} />
    </Stack>
  );
};
export default function Layout() {
  return (
    <AppProvider>
      <StackLayout />
    </AppProvider>
  );
}
