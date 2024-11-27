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
import { useUsersDatabase } from "../database/useUsersDatabase"; 
import { router } from "expo-router";
import logo from "../assets/images/logobeach.png";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export default function Register() {
  const { createUser } = useUsersDatabase();
  const [username, setUsername] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmSenha, setConfirmSenha] = useState("");
  const [passwordVisibility, setPasswordVisibility] = useState(true);

  const togglePasswordVisibility = () => {
    setPasswordVisibility(!passwordVisibility);
  };

  const handleRegister = async () => {
    if (senha !== confirmSenha) {
      Alert.alert("Erro", "As senhas não coincidem.");
      return;
    }

    try {
      const result = await createUser({ username, senha });
      if (result && result.insertedID) {
        Alert.alert("Sucesso", "Conta criada com sucesso! Faça login");
        router.push("signin");
      }
    } catch (error) {
      Alert.alert("Erro", "Não foi possível registrar o usuário.");
      console.log("Erro na criação do usuário:", error);
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
      <Text style={styles.subtitle}>Registre-se para começar</Text>
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
      <View style={styles.inputContainer}>
        <Ionicons
          name={
            passwordVisibility ? "lock-closed-outline" : "lock-open-outline"
          }
          size={24}
          color="#ffa500"
        />
        <TextInput
          placeholder="Confirme a Senha"
          onChangeText={setConfirmSenha}
          value={confirmSenha}
          style={styles.input}
          secureTextEntry={passwordVisibility}
        />
      </View>
      <TouchableOpacity onPress={handleRegister} style={styles.button}>
        <Text style={styles.buttonText}>Registrar</Text>
        <MaterialCommunityIcons
          name="account-plus"
          size={24}
          color="#fff"
          style={styles.iconRegister}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => router.push("signin")}
        style={styles.link}
      >
        <Text style={styles.linkText}>Já tem uma conta? Faça login</Text>
      </TouchableOpacity>
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
    margin: 10,
    marginTop: 10,
  },
  linkText: {
    fontFamily: "semibold",
    fontSize: 20,
    color: "#ffa500",
    textDecorationLine: "underline",
  },
  iconRegister: {
    marginLeft: 10,
    marginTop: 10,
  },
});
