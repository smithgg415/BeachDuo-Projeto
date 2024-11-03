import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Alert, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { router } from "expo-router";
import Constants from 'expo-constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Swipeable } from 'react-native-gesture-handler';
import TopBar from '../../components/TopBar';
import { useTorneioDatabase } from '../../database/useTorneioDatabase';
import { useDuplasDatabase } from '../../database/useDuplasDatabase';

export default function List() {
    const { getAllTorneios } = useTorneioDatabase();
    const { getAllDuplas, createDupla, deleteDupla } = useDuplasDatabase();
    const [torneios, setTorneios] = useState([]);
    const [duplas, setDuplas] = useState([]);
    const [torneioSelecionado, setTorneioSelecionado] = useState('Todos');
    const [updateList, setUpdateList] = useState(false);

    const comeBack = () => {
        router.back();
        setTorneioSelecionado('Todos');
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const allTorneios = await getAllTorneios();
                setTorneios(allTorneios);

                const allDuplas = await getAllDuplas();
                setDuplas(allDuplas);
            } catch (error) {
                console.error("Erro ao buscar dados: ", error);
            }
        };

        fetchData();
    }, [updateList]);

    const filtrarDuplas = () => {
        return torneioSelecionado === 'Todos'
            ? duplas
            : duplas.filter(dupla => dupla.torneio === torneioSelecionado);

    };

    const contarDuplas = () => filtrarDuplas().length;

    const renderItem = ({ item }) => {
        const renderRightActions = () => (
            <TouchableOpacity onPress={() => handleDeleteDupla(item.id)} style={styles.deleteButton}>
                <Ionicons name="trash" size={24} color="#fff" />
            </TouchableOpacity>
        );

        return (
            <Swipeable renderRightActions={renderRightActions}>
                <View style={styles.itemContainer}>
                    <Text style={styles.itemText}>{`${item.jogadorOne} e ${item.jogadorTwo}`}</Text>
                    <Text style={styles.tournamentText}>{item.torneio}</Text>
                </View>
            </Swipeable>
        );
    };

    const handleAddDupla = async (novaDupla) => {
        try {
            await createDupla(novaDupla);
            setUpdateList(prev => !prev);
        } catch (error) {
            console.error("Erro ao adicionar dupla: ", error);
        }
    };

    const handleDeleteDupla = async (id) => {
        Alert.alert(
            "Excluir Dupla",
            "Tem certeza que deseja excluir esta dupla?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Excluir", onPress: async () => {
                        try {
                            await deleteDupla(id);
                            setUpdateList(prev => !prev);
                        } catch (error) {
                            console.error("Erro ao excluir dupla: ", error);
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
            <View style={styles.container}>
                <View style={styles.topBar}>
                    <Ionicons name="filter" size={20} color="#fff" />
                    <Text style={styles.topBarText}>Selecione o Torneio</Text>
                    <View style={styles.pickerContainer}>
                        <Ionicons name="trophy" size={24} color="#fff" />
                        <Picker
                            selectedValue={torneioSelecionado}
                            style={styles.picker}
                            onValueChange={(itemValue) => setTorneioSelecionado(itemValue)}
                            dropdownIconColor="#fff"
                        >
                            <Picker.Item label="Todos" value="Todos" />
                            {torneios.map(torneio => (
                                <Picker.Item key={torneio.id} label={torneio.nome} value={torneio.nome} />
                            ))}
                        </Picker>
                    </View>
                </View>

                <Text style={styles.title}>Duplas de Beach Tennis</Text>
                {contarDuplas() > 0 ? (
                    <FlatList
                        data={filtrarDuplas()}
                        keyExtractor={item => item.id.toString()}
                        renderItem={renderItem}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                    />
                ) : (
                    <Text style={styles.emptyMessage}>Nenhuma dupla cadastrada para este torneio.</Text>
                )}

                <View style={styles.counterContainer}>
                    <Ionicons name="people" size={28} color="#ffa500" style={styles.contadorIcon} />
                    <View style={styles.contadorConteudo}>
                        <Text style={styles.contadorTexto}>Duplas cadastradas em:</Text>
                        <Text style={styles.torneioNome}>{torneioSelecionado}</Text>
                        {contarDuplas() > 0 ? (
                            <Text style={styles.contador}>{contarDuplas()}</Text>
                        ) : (
                                <Text style={styles.emptyMessage}>Nenhuma dupla cadastrada para este torneio.</Text>
                        )}
                    </View>
                </View>

                <TouchableOpacity style={styles.backButton} onPress={comeBack}>
                    <Ionicons name="arrow-back" size={20} color="#fff" />
                    <Text style={styles.backButtonText}>Voltar</Text>
                </TouchableOpacity>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    top: {
        paddingTop: Constants.statusBarHeight,
        backgroundColor: '#ffa',
    },
    container: {
        backgroundColor: '#ffa',
        flex: 1,
        padding: 20,
    },
    topBar: {
        backgroundColor: '#ffa500',
        padding: 10,
        borderRadius: 8,
        marginBottom: 20,
    },
    topBarText: {
        fontSize: 20,
        fontFamily: 'bold',
        color: '#fff',
        marginBottom: 10,
        textAlign: 'center',
    },
    pickerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ff8c00',
        borderRadius: 8,
        paddingHorizontal: 10,
    },
    picker: {
        flex: 1,
        color: '#fff',
        backgroundColor: '#ff8c00',
        borderRadius: 8,
    },
    title: {
        fontSize: 28,
        fontFamily: 'bold',
        color: '#ffa500',
        marginBottom: 20,
        textAlign: 'center',
    },
    listContent: {
        paddingBottom: 30,
    },
    itemContainer: {
        padding: 15,
        backgroundColor: '#fff',
        marginVertical: 10,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
        borderColor: '#ffa500',
        borderWidth: 1,
    },
    itemText: {
        fontSize: 18,
        fontFamily: 'bold',
        color: '#333',
    },
    tournamentText: {
        fontSize: 14,
        color: '#888',
        marginTop: 5,
        fontFamily: 'italic',
    },
    deleteButton: {
        backgroundColor: '#ff0000',
        justifyContent: 'center',
        alignItems: 'center',
        width: 60,
        height: 60,
        marginTop: 25,
        borderRadius: 10,
        marginLeft: 10,
    },
    counterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 12,
        marginVertical: 20,
        borderColor: '#ffa500',
        borderWidth: 1,
    },
    contadorIcon: {
        marginRight: 10,
    },
    contadorConteudo: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    contadorTexto: {
        fontSize: 18,
        fontFamily: 'bold',
        color: '#333',
    },
    torneioNome: {
        fontSize: 16,
        fontFamily: 'italic',
        color: '#ffa500',
        marginTop: 5,
    },
    contador: {
        fontSize: 28,
        fontFamily: 'semibold',
        color: '#4d4d4d',
        marginTop: 10,
    },
    backButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: '#ffa500',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginTop: 20,
        alignItems: 'center',
        elevation: 5,
    },
    backButtonText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'bolditalic',
    },
    emptyMessage: {
        fontFamily: 'italic',
        fontSize: 16,
        color: '#888',
        textAlign: 'center',
    },
});
