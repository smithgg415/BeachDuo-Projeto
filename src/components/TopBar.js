import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import { useNavigation } from '@react-navigation/native';
import { useDrawerStatus } from '@react-navigation/drawer';
import { useRouter } from "expo-router";
import { Constants } from "expo-constants";

export default function TopBar() {
    const navigation = useNavigation();
    const router = useRouter();
    const [icone, setIcone] = useState("menu");

    const isDrawerOpen = useDrawerStatus() === 'open';

    useEffect(() => {
        if (isDrawerOpen) {
            setIcone("close");
        } else {
            setIcone("menu");
        }
    }, [isDrawerOpen]);

    return (
        <View style={styles.topBar}>
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
                <Ionicons name={icone} size={35} color="#000" style={styles.Icon} />
            </TouchableOpacity>
            <Text style={styles.title}>BeachDuo</Text>
            <TouchableOpacity onPress={() => router.push("/perfil")}>
                <Ionicons name="person" size={35} color="black" style={{ marginRight: 30 }} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    topBar: {
        width: "100%",
        height: 60,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#ffa500",
    },
    title: {
        fontSize: 35,
        fontFamily: "bolditalic",
        color: "black",
    },
    Icon: {
        marginLeft: 30,
    },
});
