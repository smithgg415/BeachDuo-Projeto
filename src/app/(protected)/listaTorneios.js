import React, { useState, useEffect } from 'react';
import { View, Image, Text, TouchableOpacity, FlatList, StyleSheet, Alert, Linking } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import TopBar from '../../components/TopBar';
import { useTorneioDatabase } from '../../database/useTorneioDatabase';
import Constants from 'expo-constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { router } from "expo-router";
import { useAuth } from '../../hooks/Auth';

const formatDateToDDMMYYYY = (dateString) => {
    const partesData = dateString.split('-');
    if (partesData.length !== 3) {
        throw new Error("Formato de data inválido. Esperado: YYYY-MM-DD");
    }
    const ano = partesData[0];
    const mes = partesData[1];
    const dia = partesData[2];
    
    return `${dia}-${mes}-${ano}`;
};

export default function ListTorneios() {
    const { user } = useAuth();
    const { getAllTorneios, deleteTorneio } = useTorneioDatabase();
    const [torneios, setTorneios] = useState([]);
    const [updateList, setUpdateList] = useState(false);
    const [expandedTorneioId, setExpandedTorneioId] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const allTorneios = await getAllTorneios();
                setTorneios(allTorneios);
            } catch (error) {
                console.error("Erro ao buscar dados: ", error);
            }
        };

        fetchData();
    }, [updateList]);

    const renderItem = ({ item }) => {
        const isExpanded = item.id === expandedTorneioId;

        const renderRightActions = () => (
            <TouchableOpacity onPress={() => handleDeleteTorneio(item.id)} style={styles.deleteButtonLeft}>
                <Ionicons name="trash" size={24} color="#fff" />
            </TouchableOpacity>
        );
        const renderLeftActions = () => (
            <TouchableOpacity onPress={() => handleDeleteTorneio(item.id)} style={styles.deleteButtonRight}>
                <Ionicons name="trash" size={24} color="#fff" />
            </TouchableOpacity>
        );
        return (
            <Swipeable renderRightActions={renderRightActions} renderLeftActions={renderLeftActions}>
                <View style={styles.itemContainer}>
                    <Text style={styles.itemText}>{item.nome}</Text>
                    <TouchableOpacity
                        style={styles.detailsButton}
                        onPress={() => setExpandedTorneioId(isExpanded ? null : item.id)}
                    >
                        <Text style={styles.cardText}>{isExpanded ? 'Ocultar Detalhes' : 'Detalhes'}</Text>
                    </TouchableOpacity>
                </View>
                {isExpanded && (
                    <View style={styles.detailsContainer}>
                        <Text style={styles.cardText}>Criado por: {user?.user?.username}</Text>
                        <Text style={styles.cardText}>Data do torneio: {formatDateToDDMMYYYY(item.data_torneio)}</Text>
                        <Text style={styles.cardText}>Local do evento: {item.local}</Text>
                        <TouchableOpacity onPress={() => Linking.openURL(item.linkLocal)} style={styles.buttonAddress}>
                            <Ionicons name="location-outline" size={24} color="white" />
                            <Text style={styles.address}>Acesse o endereço</Text>
                        </TouchableOpacity>
                        <Text style={styles.cardTextDescricao}>Descrição: {item.descricao}</Text>
                        <View style={styles.containerImage}>
                            <Image source={{ uri: item.foto }} style={{ width: 140, height: 140, borderRadius: 10, marginTop: 10 }} />
                        </View>
                    </View>
                )}
            </Swipeable>
        );
    };

    const handleDeleteTorneio = async (id) => {
        Alert.alert(
            "Excluir Torneio",
            "Confirma a exclusão deste torneio? Esta ação não pode ser desfeita.",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Excluir", onPress: async () => {
                        try {
                            await deleteTorneio(id);
                            setUpdateList(prev => !prev);
                        } catch (error) {
                            console.error("Erro ao excluir torneio: ", error);
                        }
                    }
                },
            ]
        );
    };

    return (
        <>
            <View style={styles.top}>
                <TopBar />
            </View>
            {torneios.length > 0 ? (
                <>
                    <View style={styles.container}>
                        <Text style={styles.title}>Gerenciamento de Torneios de Beach Tennis</Text>
                        <Text style={styles.message}>Lista de Torneios Registrados</Text>
                        <FlatList
                            data={torneios}
                            keyExtractor={item => item.id.toString()}
                            renderItem={renderItem}
                            contentContainerStyle={styles.listContent}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>
                    <View style={styles.containerMessage}>
                        <Text style={styles.messageDelete}>Para apagar, arraste para o lado</Text>
                    </View>
                </>
            ) : (
                <View style={styles.containerEmpty}>
                    <Text style={styles.message}>Ainda não há nenhum torneio cadastrado.</Text>
                    <Text style={styles.message}>Crie um novo torneio para iniciar.</Text>
                    <TouchableOpacity style={styles.addButton} onPress={() => router.push('/addTorneio')}>
                        <Text style={styles.detailsText}>Criar Torneio</Text>
                    </TouchableOpacity>
                </View>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    top: {
        paddingTop: Constants.statusBarHeight,
        backgroundColor: '#FFA500',
        elevation: 4,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    container: {
        top: 50,
        flex: 1,
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderColor: '#FFA500',
        borderWidth: 2,
        borderRadius: 15,
    },
    containerEmpty: {
        top: 50,
        flex: 1,
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderColor: '#FFA500',
        borderWidth: 2,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemContainer: {
        padding: 20,
        backgroundColor: '#FAFAFA',
        marginVertical: 10,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#FFA500',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemText: {
        fontSize: 20,
        fontFamily: 'bold',
        color: '#333',
        flex: 1,
        marginRight: 10,
    },
    deleteButtonLeft: {
        top: 15,
        backgroundColor: '#FF3B30',
        justifyContent: 'center',
        alignItems: 'center',
        width: 60,
        height: 60,
        borderRadius: 10,
        marginLeft: 10,
        elevation: 3,
    },
    deleteButtonRight: {
        top: 15,
        backgroundColor: '#FF3B30',
        justifyContent: 'center',
        alignItems: 'center',
        width: 60,
        height: 60,
        borderRadius: 10,
        marginRight: 10,
        elevation: 3,
    },
    title: {
        fontSize: 28,
        fontFamily: 'bold',
        color: '#FFA500',
        marginBottom: 20,
        textAlign: 'center',
    },
    message: {
        fontSize: 20,
        color: '#333',
        textAlign: 'center',
        marginBottom: 20,
        fontFamily: 'bolditalic',
    },
    messageDelete: {
        fontSize: 20,
        color: '#fff',
        textAlign: 'center',
        marginBottom: 10,
        fontFamily: 'bolditalic',
    },
    detailsButton: {
        backgroundColor: '#FFA500',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 8,
    },
    detailsText: {
        fontSize: 23,
        color: '#fff',
        fontFamily: 'bold',
    },
    cardText: {
        fontSize: 18,
        color: '#fff',
        fontFamily: 'bold',
    },
    cardTextDescricao: {
        fontSize: 14,
        textAlign: 'justify',
        color: '#fff',
        fontFamily: 'bold',
    },
    addButton: {
        backgroundColor: "#ffa500",
        padding: 10,
        borderRadius: 10,
        marginTop: 20,
    },
    detailsContainer: {
        padding: 15,
        backgroundColor: 'rgba(255, 165, 0, 0.9)',
        borderRadius: 10,
        marginTop: 5,
    },
    containerMessage: {
        marginTop: 10,
        padding: 10,
        position: 'relative',
        backgroundColor: '#FFA500',
        justifyContent: 'center',
        alignItems: 'center',
    },
    containerImage: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonAddress: {
        flexDirection: 'row',
        backgroundColor: '#007b',
        padding: 5,
        borderRadius: 10,
        marginBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    address: {
        color: 'white',
        fontSize: 20,
        fontFamily: 'bolditalic',
        marginLeft: 5,
    },
});
