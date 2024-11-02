import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import TopBar from '../../components/TopBar';
import { useTorneioDatabase } from '../../database/useTorneioDatabase';
import Constants from 'expo-constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { router } from "expo-router";

// Função para formatar a data para DD-MM-YYYY
const formatDateToDDMMYYYY = (dateString) => {
    const partesData = dateString.split('-'); // Divide a data no formato YYYY-MM-DD
    if (partesData.length !== 3) {
        throw new Error("Formato de data inválido. Esperado: YYYY-MM-DD");
    }
    const ano = partesData[0];
    const mes = partesData[1];
    const dia = partesData[2];

    return `${dia}-${mes}-${ano}`; // Retorna no formato DD-MM-YYYY
};

export default function ListTorneios() {
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
            <TouchableOpacity onPress={() => handleDeleteTorneio(item.id)} style={styles.deleteButton}>
                <Ionicons name="trash" size={24} color="#fff" />
            </TouchableOpacity>
        );

        return (
            <Swipeable renderRightActions={renderRightActions}>
                <View style={styles.itemContainer}>
                    <Text style={styles.itemText}>{item.nome}</Text>
                    <TouchableOpacity
                        style={styles.detailsButton}
                        onPress={() => setExpandedTorneioId(isExpanded ? null : item.id)}
                    >
                        <Text style={styles.detailsText}>{isExpanded ? 'Menos Detalhes' : 'Detalhes'}</Text>
                    </TouchableOpacity>
                </View>
                {isExpanded && (
                    <View style={styles.detailsContainer}>
                        <Text style={styles.detailsText}>Data: {formatDateToDDMMYYYY(item.data_torneio)}</Text>
                        <Text style={styles.detailsText}>Local: {item.local}</Text>
                        <Text style={styles.detailsText}>{item.descricao}</Text>
                    </View>
                )}
            </Swipeable>
        );
    };

    const handleDeleteTorneio = async (id) => {
        Alert.alert(
            "Excluir Torneio",
            "Tem certeza que deseja excluir este torneio?",
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
                <View style={styles.container}>
                    <Text style={styles.title}>Torneios de Beach Tennis</Text>
                    <Text style={styles.message}>Aqui estão os torneios cadastrados</Text>
                    <FlatList
                        data={torneios}
                        keyExtractor={item => item.id.toString()}
                        renderItem={renderItem}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            ) : (
                <View style={styles.containerEmpty}>
                    <Text style={styles.message}>Ainda não temos nenhum torneio cadastrado.</Text>
                    <Text style={styles.message}>Cadastre um e comece a trabalhar</Text>
                    <TouchableOpacity style={styles.addButton} onPress={() => router.push('/addTorneio')}>
                        <Text style={styles.detailsText}>Cadastrar Torneio</Text>
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
    deleteButton: {
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
});
