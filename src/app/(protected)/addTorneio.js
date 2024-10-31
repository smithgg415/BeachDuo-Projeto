import { Text, View, TouchableOpacity, ScrollView, TextInput, StyleSheet, Alert } from "react-native";
import { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { z } from "zod";
import { useTorneioDatabase } from "../../database/useTorneioDatabase";
import { router } from "expo-router";
import Constants from 'expo-constants';
import TopBar from "../../components/TopBar";

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export default function AddTorneio() {
    const torneioSchema = z.object({
        nome: z.string().nonempty("Nome é obrigatório"),
        data_torneio: z.string(), // Use string para o formato ISO
        local: z.string().nonempty("Local é obrigatório"),
        foto: z.string().url("URL da foto inválida"),
        descricao: z.string().optional(),
    });

    const { createTorneio } = useTorneioDatabase();

    const [nome, setNome] = useState("");
    const [local, setLocal] = useState("");
    const [foto, setFoto] = useState("");
    const [descricao, setDescricao] = useState("");
    const [dataTorneio, setDataTorneio] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || dataTorneio;
        setShowDatePicker(false);
        setDataTorneio(currentDate);
    };

    const handleSubmit = async () => {
        const torneio = {
            nome,
            data_torneio: formatDate(dataTorneio),
            local,
            foto,
            descricao,
        };

        try {
            await torneioSchema.parseAsync(torneio);
            await createTorneio(torneio);
            Alert.alert("Sucesso", "Torneio criado com sucesso!");
            router.back();
        } catch (error) {
            Alert.alert("Erro", error.errors?.[0]?.message || "Erro ao criar torneio");
        }
    };

    return (
        <View style={styles.container}>
            <TopBar />
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.title}>Adicionar Torneio</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Nome"
                    onChangeText={setNome}
                    value={nome}
                />

                <TouchableOpacity style={styles.datePicker} onPress={() => setShowDatePicker(true)}>
                    <Text style={styles.dateText}>Data do Torneio: {dataTorneio.toLocaleDateString()}</Text>
                </TouchableOpacity>

                {showDatePicker && (
                    <DateTimePicker
                        value={dataTorneio}
                        mode="date"
                        display="default"
                        onChange={handleDateChange}
                    />
                )}

                <TextInput
                    style={styles.input}
                    placeholder="Local"
                    onChangeText={setLocal}
                    value={local}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Foto (URL)"
                    onChangeText={setFoto}
                    value={foto}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Descrição (opcional)"
                    onChangeText={setDescricao}
                    value={descricao}
                />

                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                    <Text style={styles.buttonText}>Adicionar Torneio</Text>
                </TouchableOpacity>
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
    scrollContainer: {
        padding: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#ffa500',
    },
    input: {
        height: 50,
        width: '100%',
        borderColor: '#ffa500',
        borderWidth: 2,
        borderRadius: 8,
        paddingHorizontal: 15,
        fontSize: 16,
        marginBottom: 15,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    datePicker: {
        width: '100%',
        padding: 15,
        backgroundColor: '#ffa500',
        borderRadius: 8,
        marginBottom: 15,
        alignItems: 'center',
    },
    dateText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    button: {
        width: '100%',
        backgroundColor: '#ffa500',
        borderRadius: 8,
        paddingVertical: 15,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
