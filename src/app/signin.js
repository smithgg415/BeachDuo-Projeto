import React, { useState } from "react";
import {
  Alert,
  StatusBar,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  BackHandler,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Feather from "@expo/vector-icons/Feather";
import { useAuth } from "../hooks/Auth";
import { router } from "expo-router";
import logo from "../assets/images/logobeach.png";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export default function App() {
  const { signIn } = useAuth();
  const [username, setUsername] = useState("Giacomelli");
  const [senha, setSenha] = useState("12345678");
  const [passwordVisibility, setPasswordVisibility] = useState(true);

  const togglePasswordVisibility = () => {
    setPasswordVisibility(!passwordVisibility);
  };

  const handleLogin = async () => {
    try {
      await signIn({ username, senha });
    } catch (error) {
      Alert.alert("Erro", error.message);
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Image
        source={logo}
        style={{ width: 350, height: 350, marginBottom: -50 }}
      />
      <Text style={styles.title}>BeachDuo</Text>
      <Text style={styles.subtitle}>Faça login para continuar</Text>
      <View style={styles.inputContainer}>
        <Feather name="user" size={24} color="#ffa500" />
        <TextInput
          placeholder="Username"
          onChangeText={setUsername}
          value={username}
          style={styles.input}
        />
      </View>
      <View style={styles.inputContainer}>
        <Ionicons
          name={
            passwordVisibility ? "lock-closed-outline" : "lock-open-outline"
          }
          size={24}
          color="#ffa500"
        />
        <TextInput
          placeholder="Senha"
          onChangeText={setSenha}
          value={senha}
          style={styles.input}
          secureTextEntry={passwordVisibility}
        />
        <Ionicons
          name={passwordVisibility ? "eye" : "eye-off-outline"}
          size={24}
          color="#ffa500"
          onPress={togglePasswordVisibility}
        />
      </View>
      <TouchableOpacity onPress={handleLogin} style={styles.button}>
        <Text style={styles.buttonText}>Entrar</Text>
        <MaterialCommunityIcons
          name="login-variant"
          size={24}
          color="#fff"
          style={styles.iconLogin}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => router.push("/about")}
        style={styles.link}
      >
        <Text style={styles.linkText}>Sobre</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => BackHandler.exitApp()}
        style={styles.link}
      >
        <Text style={styles.linkText}>Fechar APP</Text>
      </TouchableOpacity>
      {/* <TouchableOpacity style={styles.linkText} onPress={()=> router.push("/maintenance")}>
        <Text style={styles.linkText}>Banco de dados</Text>
      </TouchableOpacity> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f4f9",
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontFamily: "bolditalic",
    color: "#333",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: "semibold",
    color: "#666",
    marginBottom: 30,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 25,
    marginBottom: 15,
    paddingHorizontal: 15,
    width: "100%",
    shadowColor: "#ccc",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  input: {
    flex: 1,
    height: 50,
    marginLeft: 10,
    fontSize: 16,
    fontFamily: "regular",
    color: "#333",
  },
  button: {
    backgroundColor: "#ffa500",
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 30,
    marginTop: 20,
    alignItems: "center",
    width: "100%",
    shadowColor: "#e67e22",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  buttonText: {
    color: "#fff",
    fontSize: 26,
    fontFamily: "semibold",
  },
  link: {
    marginTop: 10,
  },
  linkText: {
    fontFamily: "semibold",
    fontSize: 20,
    color: "#ffa500",
    textDecorationLine: "underline",
  },
  iconLogin: {
    marginLeft: 10,
    marginTop: 10,
  },
});