import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, StatusBar, Image, TouchableOpacity, Alert } from 'react-native';
import TopBar from '../../components/TopBar';
import Actions from '../../components/ActionsApp';
import Pager from '../../components/PagerView';
import Constants from 'expo-constants';
import { useTorneioDatabase } from '../../database/useTorneioDatabase';
import { useAuth } from '../../hooks/Auth';
import { Ionicons } from '@expo/vector-icons';
import Fontisto from '@expo/vector-icons/Fontisto';
export default function Home() {
    const { user } = useAuth();
    const { getAllTorneios, deleteTorneio } = useTorneioDatabase();
    const [torneios, setTorneios] = useState([]);

    const fetchTorneios = async () => {
        try {
            const allTorneios = await getAllTorneios();
            setTorneios(allTorneios);
        } catch (error) {
            console.error("Erro ao buscar torneios: ", error);
        }
    };

    useEffect(() => {
        fetchTorneios();
    }, []);

    const handleDelete = async (id) => {
        Alert.alert(
            "Excluir Torneio",
            "Você tem certeza que deseja excluir este torneio?",
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                {
                    text: "Excluir",
                    onPress: async () => {
                        try {
                            await deleteTorneio(id);
                            fetchTorneios();
                        } catch (error) {
                            console.error("Erro ao excluir torneio: ", error);
                        }
                    }
                }
            ]
        );
    };
    return (
        <View style={styles.container}>
            <StatusBar style="dark" />
            <TopBar />
            <ScrollView style={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
                <Actions />
                <View style={styles.bannerContainer}>
                    <Pager />
                </View>
                <View style={styles.highlightSection}>
                    <Text style={styles.sectionTitle}>Novidades</Text>
                    {torneios.length > 0 ? (
                        torneios.map(torneio => (
                                <View key={torneio.id} style={styles.card}>
                                    {/* <Text style={styles.usernameText}>{user?.user?.username} publicou este torneio</Text> */}
                                    <Image source={{ uri: torneio.foto }} style={styles.cardImage} />
                                    <View style={styles.cardInfo}>
                                        <Text style={styles.cardNome}>{torneio.nome}</Text>
                                        <Text style={styles.cardText}>Data: {torneio.data_torneio}</Text>
                                        <Text style={styles.cardText}>{torneio.local}</Text>

                                        {/* <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(torneio.id)}>
                                        <Text style={styles.deleteButtonText}>Excluir</Text>
                                    </TouchableOpacity> */}
                                    </View>
                                </View>
                        ))
                    ) : (
                        <Text style={styles.noTorneiosText}>Nenhum torneio encontrado.</Text>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffa',
        paddingTop: Constants.statusBarHeight,
    },
    scrollViewContent: {
        paddingBottom: 20,
    },
    bannerContainer: {
        height: 520,
    },
    highlightSection: {
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        marginTop: 10,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#ffa500',
    },
    card: {
        flexDirection: 'row',
        width: '100%',
        marginBottom: 15,
        borderRadius: 10,
        overflow: 'hidden',
        backgroundColor: '#ffa500',
        padding: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    cardImage: {
        width: '40%',
        height: 100,
        borderRadius: 10,
        marginTop: 10,
    },
    cardInfo: {
        top: 16,
        flex: 1,
        padding: 5,
        alignItems: 'center',
    },
    cardNome: {
        top: -16,
        left: -15,
        color: '#fff',
        fontSize: 15,
        fontFamily: 'bold',
    },
    cardText: {
        textAlign: 'center',
        color: 'rgba(0, 0, 0, 0.5)',
        top: -10,
        fontSize: 16,
        fontFamily: 'semibold',
    },
    usernameText: {
        textAlign: 'center',
        color: '#fff',
        fontSize: 14,
        fontStyle: 'italic',
        marginBottom: 5,
    },
    noTorneiosText: {
        textAlign: 'center',
        color: '#666',
        fontSize: 16,
        marginTop: 20,
    },
    deleteButton: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#ff0000',
        borderRadius: 5,
    },
    deleteButtonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
    },
});
