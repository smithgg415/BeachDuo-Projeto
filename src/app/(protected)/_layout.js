import { Ionicons } from "@expo/vector-icons";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { Drawer } from "expo-router/drawer";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useAuth } from "../../hooks/Auth/index";

function CustomDrawerContent(props) {
  const { user, signOut } = useAuth();

  const handleLogOut = async () => {
    await signOut();
  };

  return (
    <View style={{ flex: 1 }}>
      <View>
        <Image
          source={require("../../assets/images/giacomelli.jpg")}
          style={{
            width: 120,
            height: 120,
            alignSelf: "center",
            marginTop: 100,
            borderRadius: 60,
          }}
        />
      </View>
      <View>
        <Text style={{ fontSize: 20, textAlign: "center", fontFamily: "bold" }}>
          {user?.user?.username || "Faça login"}
        </Text>
      </View>
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <TouchableOpacity
        onPress={handleLogOut}
        style={{
          justifyContent: "center",
          alignItems: "center",
          height: 50,
          backgroundColor: "#007bff",
          margin: 10,
          borderRadius: 10,
        }}
      >
        <Text style={{ color: "#fff", fontFamily: "regular" }}>LogOut</Text>
      </TouchableOpacity>
    </View>
  );
}

const DrawerLayout = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer drawerContent={(props) => <CustomDrawerContent {...props} />}>
        <Drawer.Screen
          name="index"
          options={{
            drawerLabel: "Início",
            drawerIcon: () => <Ionicons name="home" size={35} color="#000" />,
            headerShown: false,
            drawerActiveBackgroundColor: "#ffa500",
            drawerActiveTintColor: "#fff",
            drawerLabelStyle: {
              fontFamily: "bold",
            },
          }}
        />
        <Drawer.Screen
          name="addDupla"
          options={{
            drawerLabel: "Adicionar Duplas",
            drawerIcon: () => (
              <Ionicons name="add-circle" size={35} color="#000" />
            ),
            headerShown: false,
            drawerActiveBackgroundColor: "#ffa500",
            drawerActiveTintColor: "#fff",
            drawerLabelStyle: {
              fontFamily: "bold",
            },
          }}
        />
        <Drawer.Screen
          name="listaDuplas"
          options={{
            drawerLabel: "Duplas",
            drawerIcon: () => <Ionicons name="list" size={35} color="#000" />,
            headerShown: false,
            drawerActiveBackgroundColor: "#ffa500",
            drawerActiveTintColor: "#fff",
            drawerLabelStyle: {
              fontFamily: "bold",
            },
          }}
        />
        <Drawer.Screen
          name="perfil"
          options={{
            drawerLabel: "Perfil",
            drawerActiveBackgroundColor: "#ffa500",
            drawerIcon: () => <Ionicons name="person" size={35} color="#000" />,
            headerShown: false,
            drawerActiveTintColor: "#fff",
            drawerActiveBackgroundColor: "#ffa500",
            drawerLabelStyle: {
              fontFamily: "bold",
            },
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
};

export default function Layout() {
  return DrawerLayout();
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    width: "80%",
    height: 60,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#ffa500",
    position: "absolute",
    bottom: 20,
    left: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
});
