import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from "../../hooks/Auth";
import Constants from 'expo-constants';
import avatar from '../../assets/images/giacomelli.jpg';
export default function Perfil() {
    const { user, signOut } = useAuth();
    const statusBarHeight = Constants.statusBarHeight;
    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back('/')}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Perfil</Text>
                <TouchableOpacity>
                    <Ionicons name="settings-outline" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            <View style={styles.profileSection}>
                <Image source={avatar} style={styles.profileImage} />
                <Text style={styles.userName}>{user?.user?.username || "Realize login para continuar"}</Text>
            </View>
            <View style={styles.actionsSection}>
                <TouchableOpacity style={styles.actionButton} onPress={() => { signOut() }}>
                    <Ionicons name="exit-outline" size={20} color="#fff" />
                    <Text style={styles.actionButtonText}>Sair da Conta</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffa',
        paddingTop: Constants.statusBarHeight+5
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#ffa500',
        paddingVertical: 15,
        paddingHorizontal: 20,
        elevation: 3, 
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    profileSection: {
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#ffa500',
        marginBottom: 10,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        elevation: 2,
    },
    profileImage: {
        width: 160,
        height: 160,
        borderRadius: 80,
        borderWidth: 4,
        borderColor: '#ffa500',
        marginBottom: 10,
    },
    userName: {
        fontFamily: 'bold',
        fontSize: 24,
        color: '#fff ',
    },
    actionsSection: {
        padding: 20,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffa500',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginVertical: 8,
    },
    actionButtonText: {
        fontFamily: 'bolditalic',
        color: '#fff',
        fontSize: 16,
        marginLeft: 8,
    },
});
