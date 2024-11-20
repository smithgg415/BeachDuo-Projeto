import React, { useState, useEffect } from 'react';
import { Entypo, Ionicons, AntDesign } from "@expo/vector-icons";
import { DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { Drawer } from "expo-router/drawer";
import { Image, StyleSheet, Text, TouchableOpacity, View, Modal } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from "../../hooks/Auth/index";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';

function CustomDrawerContent(props) {
  const { user, signOut } = useAuth();
  const [imageUri, setImageUri] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    setImageUri(null);
  }, [user]);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleImagePick = async (type) => {
    let result;

    if (type === 'gallery') {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
    } else if (type === 'camera') {
      result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
    }

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }

    closeModal();
  };

  const handleRemoveImage = () => {
    setImageUri(null);
    closeModal();
  };

  const handleLogOut = async () => {
    await signOut();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={openModal}>
        <Image
          source={imageUri ? { uri: imageUri } : require("../../assets/images/placeholder.png")}
          style={styles.userImage}
        />
      </TouchableOpacity>
      <Text style={styles.username}>
        {user?.user?.username || "Faça login"}
      </Text>

      <Modal visible={modalVisible} animationType="fade" transparent={true}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              <Text style={styles.modalTitle}>Escolha uma opção</Text>
              <TouchableOpacity style={styles.modalButton} onPress={closeModal}>
                <Ionicons name="close" size={20} color="#000"  />
              </TouchableOpacity>
            </View>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity style={styles.modalButton} onPress={() => handleImagePick('gallery')}>
                <Ionicons name="image" size={35} color="#000" style={styles.icon} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={() => handleImagePick('camera')}>
                <MaterialIcons name="add-a-photo" size={35} color="#000" style={styles.icon} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={handleRemoveImage}>
                <Ionicons name="trash" size={35} color="#d9534f" style={styles.icon} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      <TouchableOpacity
        onPress={handleLogOut}
        style={styles.logout}
      >
        <Text style={styles.logoutText}>LogOut</Text>
        <Entypo name="log-out" size={24} color="#fff" />
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
            drawerLabelStyle: { fontFamily: "bold" },
          }}
        />
        <Drawer.Screen
          name="addTorneio"
          options={{
            drawerLabel: "Criar Torneio",
            drawerIcon: () => <Ionicons name="trophy" size={35} color="#000" />,
            headerShown: false,
            drawerActiveBackgroundColor: "#ffa500",
            drawerActiveTintColor: "#fff",
            drawerLabelStyle: { fontFamily: "bold" },
          }}
        />
        <Drawer.Screen
          name="addDupla"
          options={{
            drawerLabel: "Adicionar Duplas",
            drawerIcon: () => <AntDesign name="addusergroup" size={30} color="#000" />,
            headerShown: false,
            drawerActiveBackgroundColor: "#ffa500",
            drawerActiveTintColor: "#fff",
            drawerLabelStyle: { fontFamily: "bold" },
          }}
        />
        <Drawer.Screen
          name="listaDuplas"
          options={{
            drawerLabel: "Duplas",
            drawerIcon: () => <Ionicons name="people" size={35} color="#000" />,
            headerShown: false,
            drawerActiveBackgroundColor: "#ffa500",
            drawerActiveTintColor: "#fff",
            drawerLabelStyle: { fontFamily: "bold" },
          }}
        />
        <Drawer.Screen
          name="listaTorneios"
          options={{
            drawerLabel: "Torneios",
            drawerIcon: () => <Ionicons name="list" size={35} color="#000" />,
            headerShown: false,
            drawerActiveBackgroundColor: "#ffa500",
            drawerActiveTintColor: "#fff",
            drawerLabelStyle: { fontFamily: "bold" },
          }}
        />
        <Drawer.Screen
          name="montarJogos"
          options={{
            drawerLabel: "Montar Jogos",
            drawerIcon: () => <MaterialIcons name="sports-tennis" size={35} color="#000" />,
            headerShown: false,
            drawerActiveBackgroundColor: "#ffa500",
            drawerActiveTintColor: "#fff",
            drawerLabelStyle: { fontFamily: "bold" },
          }}
        />
        <Drawer.Screen
          name="perfil"
          options={{
            drawerLabel: "Perfil",
            drawerIcon: () => <Ionicons name="person" size={35} color="#000" />,
            headerShown: false,
            drawerActiveBackgroundColor: "#ffa500",
            drawerActiveTintColor: "#fff",
            drawerLabelStyle: { fontFamily: "bold" },
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
    flex: 1,
    backgroundColor: "#fff",
  },
  userImage: {
    width: 120,
    height: 120,
    alignSelf: "center",
    marginTop: 50,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "#ffa500",
  },
  username: {
    fontSize: 22,
    textAlign: "center",
    fontFamily: "bold",
    color: "#333",
    marginTop: 10,
  },
  logout: {
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    backgroundColor: "#007bff",
    margin: 10,
    borderRadius: 10,
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  logoutText: {
    color: "#fff",
    fontFamily: "bolditalic",
    fontSize: 18,
    marginHorizontal: 10,
  },
  drawerItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginVertical: 5,
  },
  drawerItemText: {
    fontFamily: "bold",
    fontSize: 16,
    color: "#333",
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    height: 200,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  modalTitle: {
    marginRight: 17,
    marginLeft: 60,
    fontSize: 18,
    fontFamily: 'bolditalic',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  modalButton: {
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  icon: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    textAlign: 'center',
    marginBottom: 5,
  },
});
