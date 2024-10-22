import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { router } from "expo-router";
import Constants from 'expo-constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TopBar from '../../components/TopBar';

export default function List() {
    const comeBack = () => {
        router.back();
        setTorneioSelecionado('Todos');
    };
    const [torneios, setTorneios] = useState([
        'Todos',
        '5° Open da Sun7',
        '5° Cumbuca de Beach Piquerobi',
        '3° Open A. Mauí'
    ]);
    const [torneioSelecionado, setTorneioSelecionado] = useState('Todos');

    const [duplas, setDuplas] = useState([
        { id: '1', dupla: 'João e Maria', torneio: '5° Open da Sun7' },
        { id: '2', dupla: 'Pedro e Ana', torneio: '5° Cumbuca de Beach Piquerobi' },
        { id: '3', dupla: 'Lucas e Carla', torneio: '3° Open A. Mauí' },
        { id: '4', dupla: 'Roberto e Luiza', torneio: '5° Open da Sun7' },
    ]);

    const filtrarDuplas = () => {
        if (torneioSelecionado === 'Todos') {
            return duplas;
        }
        return duplas.filter(dupla => dupla.torneio === torneioSelecionado);
    };

    const contarDuplas = () => {
        const duplasFiltradas = filtrarDuplas();
        return duplasFiltradas.length;
    };
    const renderItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <Text style={styles.itemText}>{item.dupla}</Text>
            <Text style={styles.tournamentText}>{item.torneio}</Text>
        </View>);
    return (
        <>
            <View style={styles.top}>
                <TopBar />
            </View>
            <View style={styles.container}>
                <View style={styles.topBar}>
                    <Ionicons name="filter" size={20} color="#fff" />
                    <Text style={styles.topBarText}>
                        Selecione o Torneio
                    </Text>
                    <View style={styles.pickerContainer}>
                        <Ionicons name="trophy" size={24} color="#fff" />
                        <Picker
                            selectedValue={torneioSelecionado}
                            style={styles.picker}
                            onValueChange={(itemValue) => setTorneioSelecionado(itemValue)}
                            dropdownIconColor="#fff"

                        >
                            {torneios.map(torneio => (
                                <Picker.Item key={torneio} label={torneio} value={torneio} />
                            ))}
                        </Picker>
                    </View>
                </View>

                <Text style={styles.title}>Duplas de Beach Tennis</Text>

                <FlatList
                    data={filtrarDuplas()}
                    keyExtractor={item => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />

                <View style={styles.counterContainer}>
                    <Ionicons name="people" size={28} color="#ffa500" style={styles.contadorIcon} />
                    <View style={styles.contadorConteudo}>
                        <Text style={styles.contadorTexto}>
                            Duplas cadastradas em:
                        </Text>
                        <Text style={styles.torneioNome}>
                            {torneioSelecionado}
                        </Text>
                        <Text style={styles.contador}>
                            {contarDuplas()}
                        </Text>
                    </View>
                </View>

                <TouchableOpacity style={styles.backButton} onPress={comeBack}>
                    <Ionicons name="arrow-back" size={20} color="#fff" />
                    <Text style={styles.backButtonText}>
                        Voltar
                    </Text>
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
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
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
        fontFamily: 'bolditalic',
    },
    counterContainer: {
        flexDirection: 'row',
        display: 'flex',
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
        fontFamily: 'bolditalic',
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
        display: 'flex',
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
});