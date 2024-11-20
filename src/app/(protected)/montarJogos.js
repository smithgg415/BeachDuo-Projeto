import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Alert, Share } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Swipeable } from 'react-native-gesture-handler';
import { router } from 'expo-router';
import { useTorneioDatabase } from '../../database/useTorneioDatabase';
import { useDuplasDatabase } from '../../database/useDuplasDatabase';
import TopBar from '../../components/TopBar';
import { Picker } from '@react-native-picker/picker';
import Constants from 'expo-constants';

export default function MontarJogos() {
    const { getAllTorneios } = useTorneioDatabase();
    const { getAllDuplas, deleteDupla } = useDuplasDatabase();
    const [torneios, setTorneios] = useState([]);
    const [duplas, setDuplas] = useState([]);
    const [torneioSelecionado, setTorneioSelecionado] = useState('Todos');
    const [jogosSorteados, setJogosSorteados] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const allTorneios = await getAllTorneios();
                setTorneios(allTorneios);

                const allDuplas = await getAllDuplas();
                setDuplas(allDuplas);
            } catch (error) {
                console.error('Erro ao buscar dados: ', error);
            }
        };

        fetchData();
    }, []);
    
    const filtrarDuplas = () => {
        return torneioSelecionado === 'Todos'
            ? duplas
            : duplas.filter(dupla => dupla.torneio === torneioSelecionado);
    };

    const sortearJogos = () => {
        if (torneioSelecionado === 'Todos') {
            Alert.alert('Erro', 'Selecione um torneio específico para sortear os jogos!');
            return;
        }

        const duplasFiltradas = filtrarDuplas();
        const jogos = [];
        const duplasRestantes = [...duplasFiltradas];

        while (duplasRestantes.length >= 2) {
            const dupla1 = duplasRestantes.splice(Math.floor(Math.random() * duplasRestantes.length), 1)[0];
            const dupla2 = duplasRestantes.splice(Math.floor(Math.random() * duplasRestantes.length), 1)[0];
            jogos.push({ jogo: `${dupla1.jogadorOne} & ${dupla1.jogadorTwo} enfrentarão ${dupla2.jogadorOne} & ${dupla2.jogadorTwo}` });
        }

        setJogosSorteados(jogos);
    };

    const handleDeleteJogo = async (jogo) => {
        Alert.alert(
            'Excluir Jogo',
            `Tem certeza que deseja excluir o jogo: ${jogo.jogo}?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Excluir', onPress: async () => {
                        try {
                            setJogosSorteados(jogosSorteados.filter(item => item !== jogo));
                        } catch (error) {
                            console.error('Erro ao excluir jogo: ', error);
                        }
                    }
                },
            ]
        );
    };
    const compartilharJogos = async () => {
        const textoCompartilhamento = jogosSorteados.map((item, index) => `Jogo ${index + 1}: ${item.jogo}`).join('\n\n');
        try {
            await Share.share({
                message: textoCompartilhamento,
            });
        }
        catch (error) {
            console.error('Erro ao compartilhar jogos: ', error);
        }
    }
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

                {jogosSorteados.length === 0 ? (
                    <View style={styles.title}>
                        <Text style={styles.jogosTitle}>Nenhum jogo sorteado ainda!</Text>
                    </View>
                ) : (
                    <View style={styles.title}>
                        <Text style={styles.jogosTitle}>Jogos Sorteados:</Text>
                        <View style={styles.jogosContainer}>
                            <Text style={styles.jogosTitle}>
                                <Text>Torneio: </Text>
                                {torneioSelecionado}</Text>
                            <FlatList
                                data={jogosSorteados}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item }) => (
                                    <Swipeable
                                        renderRightActions={() => (
                                            <TouchableOpacity
                                                style={styles.deleteButton}
                                                onPress={() => handleDeleteJogo(item)}
                                            >
                                                <Ionicons name="trash" size={24} color="#fff" />
                                            </TouchableOpacity>
                                        )}
                                    >
                                        <View style={[styles.jogoItem, { marginBottom: 10 }]}>
                                            <Text style={styles.jogoText}>{item.jogo}</Text>
                                        </View>
                                    </Swipeable>
                                )}
                            />
                        </View>
                    </View>
                )}

                <View style={styles.containerButtons}>
                    <TouchableOpacity style={styles.sortButton} onPress={sortearJogos}>
                        <Text style={styles.sortButtonText}>Sortear Jogos</Text>
                    </TouchableOpacity>
                    {jogosSorteados.length > 0 && (
                        <TouchableOpacity style={styles.shareButton} onPress={compartilharJogos}>
                            <Ionicons name="share-social" size={24} color="#fff" />
                            <Text style={styles.shareButtonText}>Compartilhar</Text>
                        </TouchableOpacity>
                    )
                    }
                </View>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    top: {
        paddingTop: Constants.statusBarHeight,
        backgroundColor: '#ffa500',
    },
    container: {
        backgroundColor: '#ffa',
        flex: 1,
        padding: 20,
    },
    topBar: {
        backgroundColor: '#ffa500',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 12,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
    },
    topBarText: {
        fontSize: 22,
        fontFamily: 'bold',
        color: '#fff',
        textAlign: 'center',
        letterSpacing: 1,
        marginBottom: 10,
    },
    pickerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ff8c00',
        borderRadius: 12,
        paddingHorizontal: 15,
        paddingVertical: 8,
        width: '100%',
    },
    picker: {
        width: '100%',
        flex: 1,
        color: '#fff',
        borderRadius: 8,
    },
    sortButton: {
        backgroundColor: '#ffa500',
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
    },
    sortButtonText: {
        fontSize: 18,
        fontFamily: 'bold',
        color: '#fff',
    },
    jogosContainer: {
        borderWidth: 1,
        borderColor: '#ffa500',
        borderRadius: 12,
        padding: 20,
        height: 320,
        overflow: "scroll",
        marginTop: 20,
        marginBottom: 30,
    },
    jogosTitle: {
        borderRadius: 12,
        backgroundColor: '#00a3a3',
        fontSize: 20,
        fontFamily: 'bolditalic',
        color: '#fff',
        padding: 15,
        textAlign: 'center',
        marginBottom: 10,
    },
    jogoItem: {
        backgroundColor: '#ffa500',
        padding: 15,
        borderRadius: 12,
        marginVertical: 8,
        height: 70,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
    },
    jogoText: {
        fontSize: 16,
        fontFamily: 'bold',
        color: '#fff',
        textAlign: 'center',
        letterSpacing: 0.5,
    },
    deleteButton: {
        backgroundColor: '#ff6347',
        height: 50,
        width: 50,
        marginTop: 15,
        marginLeft: 10,
        elevation: 5,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },

    backButtonText: {
        fontSize: 16,
        fontFamily: 'bold',
        color: '#fff',
        marginLeft: 10,
        letterSpacing: 0.5,
    },
    shareButton: {
        flexDirection: 'row',
        backgroundColor: '#00a3a3',
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 15,
    },
    shareButtonText: {
        fontSize: 18,
        fontFamily: 'bold',
        color: '#fff',
        marginLeft: 10,
    },
    containerButtons: {
        left: 22,
        width: '100%',
        position: 'absolute',
        bottom: 20,
    }
});
