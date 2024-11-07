import { View, TouchableOpacity, Text, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import AntDesign from '@expo/vector-icons/AntDesign';
import { MaterialIcons } from "@expo/vector-icons";

export default function Actions() {
    return (
        <View style={styles.containerItems}>
            <ScrollView style={{ flexDirection: "row" }} horizontal={true} showsHorizontalScrollIndicator={false}>
                <TouchableOpacity style={styles.btn} onPress={() => router.push('/addDupla')}>
                    <AntDesign name="addusergroup" size={30} color="#ffa500" />
                    <Text style={styles.btnName}>Adicionar Dupla</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btn} onPress={() => router.push('/addTorneio')}>
                    <Ionicons name="trophy" size={30} color="#FFA500" />
                    <Text style={styles.btnName}>Criar Torneio</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btn} onPress={() => router.push("/listaDuplas")}>
                    <Ionicons name="people" size={30} color="#FFA500" />
                    <Text style={styles.btnName}>Lista de Duplas</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btn} onPress={() => router.push("listaTorneios")}>
                    <Ionicons name="list" size={30} color="#FFA500" />
                    <Text style={styles.btnName}>Lista de Torneios</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btn} onPress={() => router.push("/montarJogos")}>
                <MaterialIcons name="sports-tennis" size={35} color="#ffa500" />
                    <Text style={styles.btnName}>Montar Jogos</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    containerItems: {
        flexDirection: "row",
        marginBottom: 20,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10,
    },
    btn: {
        width: 150,
        height: 100,
        margin: 10,
        backgroundColor: "#FFFFFF",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
        borderWidth: 1,
        borderColor: "#FFA500",
    },
    btnName: {
        textAlign: "center",
        color: "#333333",
        fontSize: 16,
        marginTop: 8,
        fontFamily: "bolditalic",
    },
});
