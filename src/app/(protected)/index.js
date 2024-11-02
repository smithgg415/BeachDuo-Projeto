import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, StatusBar, Image, TouchableOpacity, Alert, Linking } from 'react-native';
import TopBar from '../../components/TopBar';
import Actions from '../../components/ActionsApp';
import Pager from '../../components/PagerView';
import Constants from 'expo-constants';
import { useTorneioDatabase } from '../../database/useTorneioDatabase';
import { useAuth } from '../../hooks/Auth';
import { Ionicons } from '@expo/vector-icons';
import Fontisto from '@expo/vector-icons/Fontisto';
import { ActivityIndicator } from 'react-native';

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

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

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
    const produtos = [
        {
            id: 1,
            nome: 'Camiseta BeachDuo',
            preco: 50.00,
            foto: 'https://http2.mlstatic.com/D_NQ_NP_937626-MLB75553644721_042024-O.webp',
            link_compra: "https://nutriflow.netlify.app"
        },
        {
            id: 2,
            nome: 'Bola HEAD ITF',
            preco: 29.00,
            foto: 'https://static.prospin.com.br/media/catalog/product/cache/0e3f1fa1e1f5782c73be0e8cb4ab3f9d/5/7/578102-bola-de-beach-tennis-head-pack-com-02-unidades.jpg',
            link_compra: "https://nutriflow.netlify.app"
        },
        {
            id: 3,
            nome: 'Boné Shark',
            preco: 30.00,
            foto: 'https://images.tcdn.com.br/img/img_prod/589314/bone_beach_tennis_shark_tela_4809_1_f5e4ef8832f46313fab4b30ad2cb145a_20240515165917.jpg',
            link_compra: "https://nutriflow.netlify.app"
        },
        {
            id: 4,
            nome: 'Raquete Shark Elite',
            preco: 420.00,
            foto: 'https://imgcentauro-a.akamaihd.net/1366x1366/M0L7G100.jpg',
            link_compra: "https://nutriflow.netlify.app"
        }
    ]
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
                        torneios.slice(0, 4).map(torneio => (
                            <View key={torneio.id} style={styles.card}>
                                <Image source={{ uri: torneio.foto }} style={styles.cardImage} />
                                <View style={styles.cardInfo}>
                                    <Text style={styles.cardNome}>{torneio.nome}</Text>
                                    <Text style={styles.cardText}>Data: {formatDate(torneio.data_torneio)}</Text>
                                    <Text style={styles.cardText}>{torneio.local}</Text>
                                </View>
                            </View>
                        ))
                    ) : (
                        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                            <Text style={styles.noTorneiosText}>Nenhum torneio por aqui...</Text>
                            <ActivityIndicator size="large" color="#ccc" />
                        </View>
                    )}
                </View>
                <View style={styles.lojaContainer}>
                    <Text style={styles.lojaTitle}>Loja BeachDuo</Text>
                    <View style={styles.row}>
                        <View style={styles.lojaCard}>
                            <Image source={{ uri: produtos[0].foto }} style={styles.lojaCardImage} />
                            <View style={styles.lojaCardInfo}>
                                <Text style={styles.lojaCardNome}>{produtos[0].nome}</Text>
                                <Text style={styles.lojaCardText}>R$ {produtos[0].preco.toFixed(2)}</Text>
                                <TouchableOpacity onPress={() => { Linking.openURL(produtos[0].link_compra) }} style={{ alignItems: "center", marginTop: 5 }}>
                                    <Fontisto name="shopping-basket" size={24} color="white" />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.lojaCard}>
                            <Image source={{ uri: produtos[1].foto }} style={styles.lojaCardImage} />
                            <View style={styles.lojaCardInfo}>
                                <Text style={styles.lojaCardNome}>{produtos[1].nome}</Text>
                                <Text style={styles.lojaCardText}>R$ {produtos[1].preco.toFixed(2)}</Text>
                                <TouchableOpacity onPress={() => { Linking.openURL(produtos[1].link_compra) }} style={{ alignItems: "center", marginTop: 5 }}>
                                    <Fontisto name="shopping-basket" size={24} color="white" />
                                </TouchableOpacity>

                            </View>
                        </View>
                    </View>
                    <View style={styles.row}>
                        <View style={styles.lojaCard}>
                            <Image source={{ uri: produtos[2].foto }} style={styles.lojaCardImage} />
                            <View style={styles.lojaCardInfo}>
                                <Text style={styles.lojaCardNome}>{produtos[2].nome}</Text>
                                <Text style={styles.lojaCardText}>R$ {produtos[2].preco.toFixed(2)}</Text>
                                <TouchableOpacity onPress={() => { Linking.openURL(produtos[2].link_compra) }} style={{ alignItems: "center", marginTop: 5 }}>
                                    <Fontisto name="shopping-basket" size={24} color="white" />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.lojaCard}>
                            <Image source={{ uri: produtos[3].foto }} style={styles.lojaCardImage} />
                            <View style={styles.lojaCardInfo}>
                                <Text style={styles.lojaCardNome}>{produtos[3].nome}</Text>
                                <Text style={styles.lojaCardText}>R$ {produtos[3].preco.toFixed(2)}</Text>
                                <TouchableOpacity onPress={() => { Linking.openURL(produtos[3].link_compra) }} style={{ alignItems: "center", marginTop: 5 }}>
                                    <Fontisto name="shopping-basket" size={24} color="white" />
                                </TouchableOpacity>

                            </View>
                        </View>
                    </View>
                </View>

            </ScrollView >
        </View >
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
        fontFamily: 'bold',
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
    noTorneiosText: {
        textAlign: 'center',
        color: '#666',
        fontSize: 16,
        fontFamily: 'bold',
        marginTop: 20,
    },
    lojaContainer: {
        padding: 20,
        backgroundColor: '#ffa',
        borderRadius: 10,
        marginTop: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        alignItems: 'center',
    },
    lojaTitle: {
        fontSize: 28,
        color: '#ffa500',
        fontFamily: 'bold',
        marginBottom: 15,
    },
    lojaCard: {
        justifyContent: "center",
        alignItems: 'center',
        flexDirection: 'column',
        backgroundColor: '#ffa500',
        borderRadius: 10,
        overflow: 'hidden',
        padding: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        marginBottom: 15,
        width: '44%',
    },
    lojaCardImage: {
        objectFit: 'scale-down',
        width: '70%',
        height: 100,
        borderRadius: 15,
    },
    lojaCardInfo: {
        flex: 1,
        padding: 10,
        justifyContent: 'center',
    },
    lojaCardNome: {
        textAlign: 'center',
        color: '#fff',
        fontSize: 18,
        fontFamily: 'semibold',
    },
    lojaCardText: {
        textAlign: 'center',
        color: '#fff',
        fontSize: 16,
        fontFamily: 'bold',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    }
});
