import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Animated, Modal, ScrollView, Platform, Image, RefreshControl } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { router } from 'expo-router';
import TopBar from '../../components/TopBar';
import Constants from 'expo-constants';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { z } from "zod";
import { useDuplasDatabase } from "../../database/useDuplasDatabase";
import { useTorneioDatabase } from '../../database/useTorneioDatabase';
import { requestNotificationPermission, scheduleNotification } from "../../components/Notifications";
import { useNotificationListener } from "../../components/Notifications";

export default function AddDupla() {
    useNotificationListener();
    const [nome01, setNome01] = useState("");
    const [nome02, setNome02] = useState("");
    const [showForm, setShowForm] = useState(false);
    const formTranslateY = useRef(new Animated.Value(500)).current;
    const [modalVisible, setModalVisible] = useState(false);
    const [duplaVisible, setDuplaVisible] = useState(false);
    const [duplaVisibleContinue, setDuplaVisibleContinue] = useState(false);
    const [campoVazio, setCampoVazio] = useState(false);
    const [confirmationVisible, setConfirmationVisible] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const duplaSchema = z.object({
        id: z.number(),
        jogadorOne: z.string().min(3),
        jogadorTwo: z.string().min(3),
        torneio: z.string().min(3),
    });
    const { createDupla } = useDuplasDatabase();
    const handleSubmit = async () => {
        const duplas = {
            id: id,
            jogadorOne: nome01,
            jogadorTwo: nome02,
            torneio: torneios.find((item) => item.id === selectedTorneio)?.nome,

        };
        const updatedTorneios = await getAllTorneios();
        setTorneios(updatedTorneios);
        try {
            const result = await duplaSchema.parseAsync(duplas);
            const { insertedID } = await createDupla(duplas);
            console.log(result);
            console.log(insertedID);
            await scheduleNotification(
                "Dupla adicionada!",
                `A dupla ${nome01} e ${nome02} foi adicionada com sucesso para ${torneios.find((item) => item.id === selectedTorneio)?.nome}.`
            );
        } catch (error) {
            console.error(error);
        }
    };
    const fetchData = async () => {
        try {
            const allTorneios = await getAllTorneios();
            setTorneios(allTorneios);
        } catch (error) {
            console.error("Erro ao buscar dados: ", error);
        }
    };
    useEffect(() => {
        fetchData();
        requestNotificationPermission();
    }, []);
    const onRefresh = async () => {
        setRefreshing(true);
        await fetchData();
        setRefreshing(false);
    };
    const showDuplaCheck = () => {
        if (!nome01 || !nome02) {
            setCampoVazio(true);
        }
        else {
            setDuplaVisible(true);
        }
    };
    const showDuplaCheckContinue = () => {
        if (!nome01 || !nome02) {
            setCampoVazio(true);
        }
        else {
            setDuplaVisibleContinue(true);
        };
    }
    const hideDupla = () => {
        setDuplaVisible(false);
    };
    const showFormContainer = () => {
        setShowForm(true);
        Animated.timing(formTranslateY, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true
        }).start();
        setModalVisible(true);

    };

    const hideFormContainer = () => {
        Animated.timing(formTranslateY, {
            toValue: 500,
            duration: 500,
            useNativeDriver: true
        }).start(() => setShowForm(false));
        setNome01("");
        setNome02("");
    };
    const cancelForm = () => {
        setConfirmationVisible(true);
    };
    const hideConfirmation = () => {
        setConfirmationVisible(false);
    };
    const close = () => {
        setConfirmationVisible(false);
        hideFormContainer();
        router.back("/");
        setNome01("");
        setNome02("");
    };
    const hideAlert = () => {
        setDuplaVisible(false);
        setModalVisible(false);
        setNome01("");
        setNome02("");
        router.back("/");
        setShowForm(false);
    };
    const hideAlertMessage = () => {
        setModalVisible(false);
    };
    const hideAlertContinue = () => {
        setCampoVazio(false);
        setDuplaVisibleContinue(false);
        setModalVisible(false);
        setNome01("");
        setNome02("");
    }

    const [id, setId] = useState(1);

    const { getAllTorneios } = useTorneioDatabase();
    const [torneios, setTorneios] = useState([]);
    const [selectedTorneio, setSelectedTorneio] = useState(null);
    useEffect(() => {
        const fetchTorneios = async () => {
            try {
                const allTorneios = await getAllTorneios();
                setTorneios(allTorneios);
            } catch (error) {
                console.error("Erro ao buscar torneios: ", error);
            }
        };

        fetchTorneios();
    }, []);

    const handleTorneioChange = (itemValue) => {
        setSelectedTorneio(itemValue);
        console.log("Torneio selecionado:", itemValue);
    };
    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"} >
            <View style={styles.cont}>
                <TopBar />
                <View style={styles.container}>
                    <View style={styles.containerTextinhoExplicando}>
                        <Text style={styles.textinhoExplicando}>Adicione e controle duplas utilizando o nome de dois jogadores e selecionando o torneio.</Text>
                    </View>
                    {!showForm && (
                        <View style={styles.circleActions}>
                            <View>
                                <TouchableOpacity style={styles.circles} onPress={showFormContainer}>
                                    <Ionicons name="add" size={40} color="#fff" />
                                </TouchableOpacity>
                                <Text style={styles.nameBtn}>Adicionar Dupla</Text>
                            </View>
                            <View>
                                <TouchableOpacity style={styles.circles} onPress={() => { router.push("/listaDuplas") }}>
                                    <Ionicons name="people" size={40} color="#fff" />
                                </TouchableOpacity>
                                <Text style={styles.nameBtn}>Lista de Duplas</Text>
                            </View>
                            <View>
                                <TouchableOpacity style={styles.circles} onPress={() => { router.push("/listaTorneios") }}>
                                    <Ionicons name="trophy" size={40} color="#fff" />
                                </TouchableOpacity>
                                <Text style={styles.nameBtn}>Lista de Torneios</Text>
                            </View>

                        </View>
                    )}
                    {showForm && (
                        <Animated.View style={[styles.formContainer, { transform: [{ translateY: formTranslateY }] }]}
                        >
                            <TouchableOpacity onPress={hideFormContainer} style={styles.closeButton}>
                                <Ionicons name="close" size={24} color="#ffffff" />
                            </TouchableOpacity>
                            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center", alignItems: "center" }} showsVerticalScrollIndicator={false} refreshControl={
                                <RefreshControl
                                    refreshing={refreshing}
                                    onRefresh={onRefresh} // Função para atualizar os dados
                                />
                            }>
                            <View style={styles.input}>
                                <TextInput
                                    onChangeText={setNome01}
                                    placeholder='Digite o primeiro jogador'
                                    value={nome01}
                                />
                                <Ionicons name="person" size={24} color="#333" />
                            </View>
                            <View style={styles.input}>
                                <TextInput
                                    onChangeText={setNome02}
                                    placeholder='Digite o segundo jogador'
                                    value={nome02}
                                />
                                <Ionicons name="person" size={24} color="#333" />
                            </View>
                            <View>
                                <Text style={{ fontFamily: "regular", fontSize: 20 }}>Selecione o Torneio</Text>
                            </View>
                            <View style={styles.input}>
                                {torneios.length === 0 ? (
                                    <Text style={styles.noTorneioText}>Nenhum torneio cadastrado ainda...</Text>
                                ) : (
                                    <Picker
                                        style={{ width: '100%' }}
                                        selectedValue={selectedTorneio}
                                        onValueChange={handleTorneioChange}
                                        dropdownIconColor={"#333"}
                                        enabled={torneios.length > 0}
                                    >
                                        {torneios.map((torneio) => (
                                            <Picker.Item
                                                key={torneio.id}
                                                label={torneio.nome}
                                                value={torneio.id}
                                            />
                                        ))}
                                    </Picker>
                                )}
                            </View>
                            <Text style={styles.updated}>Puxe para baixo para atualizar a lista de Torneios</Text>
                            <View style={styles.duplaContainer}>
                                <Text style={styles.conferir}>Confira os nomes</Text>
                                <Text style={styles.name}>{nome01 ? nome01 : "Jogador 01"}</Text>
                                <Text style={styles.and}>&</Text>
                                <Text style={styles.name}>{nome02 ? nome02 : "Jogador 02"}</Text>
                            </View>
                            <View style={styles.duplaContainer}>
                                <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                                    <Text style={styles.conferir}>Confira o Torneio</Text>
                                    <Ionicons name="trophy" size={24} color="#333" style={{ marginTop: 12, marginLeft: 10 }} />
                                </View>
                                <Text style={styles.name}>
                                    {selectedTorneio === null
                                        ? "Nenhum torneio selecionado"
                                        : torneios.find((item) => item.id === selectedTorneio)?.nome}
                                </Text>


                            </View>
                            <View style={styles.contentButtons}>
                                <View style={styles.firstRow}>
                                    <TouchableOpacity style={styles.addButton} onPress={() => { handleSubmit(); showDuplaCheck() }}>
                                        <Text style={styles.buttonText}>Cadastrar Dupla </Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.secondRow}>
                                    <TouchableOpacity style={styles.cancelButton} onPress={cancelForm}>
                                        <Text style={styles.buttonText}>Cancelar cadastro</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            {/* <View style={styles.containerInfo}>
                            <Text style={styles.info}>
                                As duplas adicionadas vão aparecer na lista de duplas, para conferir, clique no botão dentro da caixa de ações
                            </Text>
                        </View> */}
                            <Modal
                                animationType="fade"
                                transparent={true}
                                visible={modalVisible}
                                onRequestClose={hideAlert}
                            >
                                <View style={styles.modalBackground}>
                                    <View style={styles.modalContainer}>
                                        <Text style={styles.alertTitle}>Atenção, BeachLover!</Text>
                                        <Text style={styles.alertMessage}>As duplas adicionadas vão aparecer na lista de duplas, para conferir, relogue e clique no botão dentro da caixa de ações.</Text>
                                        <TouchableOpacity style={styles.alertButton} onPress={hideAlertMessage}>
                                            <Text style={styles.alertButtonText}>Fechar</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </Modal>
                            <Modal animationType='fade' transparent={true} visible={duplaVisible} onRequestClose={hideDupla}>
                                <View style={styles.modalBackground}>
                                    <View style={styles.modalContainer}>
                                        <Text style={styles.alertTitle}>Parabéns, dupla adicionada com sucesso!</Text>
                                        <Text style={styles.alertMessage}>Verifique a lista</Text>
                                        <Ionicons name="checkmark-circle" size={50} color="#4caf50" style={{ marginBottom: 10 }} />
                                        <TouchableOpacity style={styles.alertConfirmation} onPress={hideAlert}>
                                            <Text style={styles.alertButtonText}>Fechar</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </Modal>
                            <Modal animationType='fade' transparent={true} visible={duplaVisibleContinue} onRequestClose={hideDupla}>
                                <View style={styles.modalBackground}>
                                    <View style={styles.modalContainer}>
                                        <Text style={styles.alertTitle}>Parabéns, dupla adicionada com sucesso! Relogue para atualizar a lista.</Text>
                                        <Text style={styles.alertMessage}>Continue adicionando</Text>
                                        <Ionicons name="checkmark-circle" size={50} color="#4caf50" style={{ marginBottom: 10 }} />
                                        <TouchableOpacity style={styles.alertConfirmation} onPress={hideAlertContinue}>
                                            <Text style={styles.alertButtonText}>Fechar</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </Modal>
                            <Modal animationType='fade' transparent={true} visible={campoVazio} onRequestClose={hideDupla}>
                                <View style={styles.modalBackground}>
                                    <View style={styles.modalContainer}>
                                        <Text style={styles.alertTitle}>OPA, VAMOS COM CALMA!!</Text>
                                        <Text style={styles.alertMessage}>Preencha os campos, eles não podem ficar vazios.</Text>
                                        <TouchableOpacity style={styles.alertCampoVazio} onPress={hideAlertContinue}>
                                            <Text style={styles.alertButtonText}>Fechar</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </Modal>
                            <Modal animationType='fade' transparent={true} visible={confirmationVisible} onRequestClose={hideConfirmation}>
                                <View style={styles.modalBackground}>
                                    <View style={styles.modalContainer}>
                                        <Text style={styles.alertTitle}>Tem certeza disso?</Text>
                                        <Text style={styles.alertMessage}>Os dados serão apagados!</Text>
                                        <TouchableOpacity style={{ backgroundColor: '#ff6f61', paddingVertical: 10, paddingHorizontal: 26, borderRadius: 5, marginBottom: 10, }} onPress={close}>
                                            <Text style={styles.alertButtonText}>Sim, desejo cancelar!</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{ backgroundColor: '#4caf50', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 5, }} onPress={hideConfirmation}>
                                            <Text style={styles.alertButtonText}>Não, continuarei aqui!</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </Modal>
                        </ScrollView>
                        </Animated.View>
                    )}
            </View>
        </View >
        </KeyboardAvoidingView >
    );
}

const styles = StyleSheet.create({
    alertCampoVazio: {
        backgroundColor: '#ff6f61',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    contentButtons: {
        flexDirection: 'column',
        marginBottom: 20,
    },
    cont: {
        flex: 1,
        backgroundColor: '#ffa',
        paddingTop: Constants.statusBarHeight,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    containerTextinhoExplicando: {
        top: -220,
        backgroundColor: '#ffa500',
        padding: 15,
        borderRadius: 8,
        marginBottom: 20,
        width: '100%',
        maxWidth: 400,
    },
    textinhoExplicando: {
        fontSize: 18,
        color: '#ffffff',
        textAlign: 'center',
        fontFamily: 'bold',
    },
    circleActions: {
        top: -200,
        width: '100%',
        backgroundColor: '#fff',
        margin: 20,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        padding: 15,
        alignItems: "center",
        marginTop: 20,
        borderRadius: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },

    circles: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#ffa500",
        padding: 10,
        borderRadius: 50,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    formContainer: {
        width: 430,
        maxWidth: 400,
        height: '98%',
        backgroundColor: '#ffffff',
        borderRadius: 20,
        padding: 20,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
    },
    input: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '90%',
        borderWidth: 1,
        borderColor: '#d0d0d0',
        borderRadius: 8,
        padding: 12,
        marginVertical: 12,
        fontSize: 16,
        backgroundColor: '#fafafa',
    },
    duplaContainer: {
        width: '100%',
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        padding: 15,
        marginVertical: 20,
        alignItems: 'center',
        borderColor: '#ddd',
        borderWidth: 1,
    },
    conferir: {
        fontFamily: 'bolditalic',
        fontSize: 20,
        color: '#333',
        marginVertical: 8,
    },
    name: {
        fontFamily: 'semibolditalic',
        fontSize: 18,
        color: '#333',
        marginVertical: 8,
    },
    addButton: {
        height: 60,
        width: "100%",
        backgroundColor: 'green',
        justifyContent: 'center',
        borderRadius: 8,
        marginTop: 20,
        alignItems: 'center',
    },
    cancelButton: {
        display: 'flex',
        flexDirection: 'row',
        height: 60,
        justifyContent: 'center',
        backgroundColor: '#ff6f61',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        marginTop: 20,
        width: '100%',
        alignItems: 'center',
    },
    firstRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    secondRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
    },
    buttonText: {
        textAlign: 'center',
        color: '#ffffff',
        fontSize: 16,
        fontFamily: 'bold',
        marginLeft: 8,
    },
    // containerInfo: {
    // backgroundColor: '#ffa500',
    // padding:13,
    // width: 400,
    // borderRadius: 8,
    // marginTop: 20,
    // },

    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: 300,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
    },
    alertTitle: {
        textAlign: 'center',
        fontSize: 18,
        fontFamily: 'bold',
        marginBottom: 10,
    },
    alertMessage: {
        fontSize: 16,
        fontFamily: 'regular',
        textAlign: 'center',
        marginBottom: 20,
    },
    alertConfirmation: {
        backgroundColor: '#4caf50',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    alertButton: {
        backgroundColor: '#ffa500',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    alertButtonText: {
        color: 'white',
        fontFamily: 'bold',
        fontSize: 16,
    },
    info: {
        fontSize: 16,
        color: '#ffffff',
        textAlign: 'center',
        fontFamily: 'bolditalic',
    },
    closeButton: {
        marginBottom: 20,
        backgroundColor: '#ff6f61',
        borderRadius: 15,
        width: 100,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#ffffff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    noTorneioText: {
        color: '#888',
        textAlign: 'center',
    },
    nameBtn: {
        textAlign: 'center',
        fontFamily: 'bold',
        color: '#ffa500',
        fontSize: 10
    },
    updated: {
        textAlign: 'center',
        fontFamily: 'bold',
        color: '#333',
        fontSize: 14,
        opacity: 0.5,
    }
});
