import { Text, View, TouchableOpacity, ScrollView, TextInput, StyleSheet, Alert, Image, Modal } from "react-native";
import { useState, useEffect } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { z } from "zod";
import { useTorneioDatabase } from "../../database/useTorneioDatabase";
import { router } from "expo-router";
import Constants from 'expo-constants';
import TopBar from "../../components/TopBar";
import { Ionicons } from "@expo/vector-icons";
import { requestNotificationPermission, scheduleNotification } from "../../components/Notifications";
import { useNotificationListener } from "../../components/Notifications";
import * as ImagePicker from 'expo-image-picker';

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export default function AddTorneio() {
    useNotificationListener();
    const torneioSchema = z.object({
        nome: z.string().nonempty("Por favor, insira um nome para o torneio."),
        data_torneio: z.string(),
        local: z.string().nonempty("O local do torneio é necessário."),
        linkLocal: z.string().url("URL do local inválida"),
        foto: z.string().url("URL da foto inválida"),
        descricao: z.string().optional(),
    });

    const { createTorneio } = useTorneioDatabase()
    const [nome, setNome] = useState("");
    const [local, setLocal] = useState("");
    const [foto, setFoto] = useState("");
    const [descricao, setDescricao] = useState("");
    const [linkLocal, setLinkLocal] = useState("");
    const [dataTorneio, setDataTorneio] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    useEffect(() => {
        requestNotificationPermission();
    }, []);

    const handleDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || dataTorneio;
        setShowDatePicker(false);
        setDataTorneio(currentDate);
    };

    const handleImagePicker = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            Alert.alert("Erro", "Você precisa permitir o acesso à galeria para selecionar uma imagem.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri);
            setFoto(result.assets[0].uri);
        }
    };
    const handleSubmit = async () => {
        const torneio = {
            nome,
            data_torneio: formatDate(dataTorneio),
            local,
            linkLocal,
            foto,
            descricao,
        };
        try {
            await torneioSchema.parseAsync(torneio);
            await createTorneio(torneio);
            Alert.alert("Sucesso", "Torneio criado! Relogue para atualizar a lista de torneios.");

            await scheduleNotification(
                "Torneio Criado!",
                `O torneio ${nome} foi criado com sucesso para ${dataTorneio.toLocaleDateString()}.`
            );

            router.back();
        } catch (error) {
            Alert.alert("Erro", error.errors?.[0]?.message || "Erro: Não foi possível criar o torneio. Por favor, verifique os detalhes e tente novamente");
        }
    };

    return (
        <View style={styles.container}>
            <TopBar />
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.title}>Crie um torneio</Text>

                <View style={styles.inputContainer}>
                    <TextInput
                        placeholder="Insira o nome do torneio"
                        style={styles.inputWithIcon}
                        onChangeText={setNome}
                        value={nome}
                    />
                    <Ionicons name="trophy" size={24} color="#FFA500" style={styles.iconInsideInput} />
                </View>

                <TouchableOpacity style={styles.datePicker} onPress={() => setShowDatePicker(true)}>
                    <Text style={styles.dateText}>Data do Torneio: {dataTorneio.toLocaleDateString()}</Text>
                    <Ionicons name="calendar" size={24} color="#fff" style={styles.iconInsideInputCalendar} />
                </TouchableOpacity>

                {showDatePicker && (
                    <DateTimePicker
                        value={dataTorneio}
                        mode="date"
                        display="default"
                        onChange={handleDateChange}
                    />
                )}

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.inputWithIcon}
                        placeholder="Nome da arena ou quadra..."
                        onChangeText={setLocal}
                        value={local}
                    />
                    <Ionicons name="location" size={24} color="#FFA500" style={styles.iconInsideInput} />
                </View>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.inputWithIcon}
                        placeholder="URL do endereço Google Maps"
                        onChangeText={setLinkLocal}
                        value={linkLocal}
                    />
                    <Ionicons name="logo-google" size={24} color="#FFA500" style={styles.iconInsideInput} />
                </View>

                <TouchableOpacity style={styles.imagePicker} onPress={handleImagePicker}>
                    <Text style={styles.imageText}>{selectedImage ? "Imagem Selecionada" : "Selecionar Imagem"}</Text>
                </TouchableOpacity>
                {selectedImage && (
                    <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
                )}

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.inputWithIconDescription}
                        placeholder="Descreva brevemente o torneio."
                        onChangeText={setDescricao}
                        value={descricao} multiline={true}
                    />
                    <Ionicons name="document-text" size={24} color="#FFA500" style={styles.iconInsideInputDescription} />
                </View>

                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                    <Text style={styles.buttonText}>
                        Criar Torneio</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>

    );
}

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: 350,
        height: "100",
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
    },
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
        fontFamily: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#ffa500',
    },
    inputWithIcon: {
        fontFamily: 'regular',
        height: 50,
        flex: 1,
        borderColor: '#ffa500',
        borderWidth: 2,
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingRight: 40,
        fontSize: 16,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },

    inputWithIconDescription: {
        paddingTop: 15,
        fontFamily: 'regular',
        textAlignVertical: 'top',
        height: 120,
        flex: 1,
        borderColor: '#ffa500',
        borderWidth: 2,
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingRight: 40,
        fontSize: 16,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    inputContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        position: 'relative',
    },
    iconInsideInput: {
        position: 'absolute',
        right: 15,
    },
    iconInsideInputDescription: {
        position: 'absolute',
        right: 15,
        top: 15,
    },
    iconInsideInputCalendar: {
        position: 'absolute',
        right: 15,
        top: 15,
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
        fontFamily: 'bold',
    },
    imagePicker: {
        width: '100%',
        padding: 15,
        backgroundColor: '#00a3a3',
        borderRadius: 8,
        marginBottom: 15,
        alignItems: 'center',
    },
    imageText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'bold',
    },
    imagePreview: {
        borderWidth: 3,
        borderColor: '#ffa500',
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginTop: 10,
        marginBottom: 15,
        resizeMode: 'cover',
    },
    button: {
        width: '100%',
        backgroundColor: '#00a3a3',
        borderRadius: 8,
        paddingVertical: 15,
        alignItems: 'center',
        marginTop: 20
    },
    buttonText: {
        color: '#fff',
        fontSize: 26,
        fontFamily: 'bolditalic',
    },
});
