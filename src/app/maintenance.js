import { router } from "expo-router";
import { View, Text, Alert, Button, StyleSheet, TouchableOpacity } from "react-native";
import { useMaintenanceDatabase } from "../database/useMaintenanceDatabase";

export default function MainTenance() {
    const { resetDatabase, importUsers, importDuplas, importTorneios } = useMaintenanceDatabase();

    const handleReset = async () => {
        Alert.alert(
            "Confirmação",
            "Você tem certeza que deseja apagar todos os dados?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "OK", onPress: async () => {
                        try {
                            await resetDatabase();
                            Alert.alert("Duplas", "Banco de dados resetado com sucesso!");
                        } catch (error) {
                            Alert.alert("Duplas:", `Erro ao resetar banco de dados: ${error.message}`);
                        }
                    }
                },
            ]
        );
    };

    const handleImportUsers = async () => {
        try {
            await importUsers();
            Alert.alert("Duplas", "Usuários importados com sucesso!");
        } catch (error) {
            Alert.alert("Duplas:", `Erro ao importar usuários: ${error.message}`);
        }
    };

    const handleImportDuplas = async () => {
        try {
            await importDuplas();
            Alert.alert("Duplas", "Duplas importadas com sucesso!");
        } catch (error) {
            Alert.alert("Duplas:", `Erro ao importar duplas: ${error.message}`);
        }
    };

    const handleImportTorneios = async () => {
        try {
            await importTorneios();
            Alert.alert("Duplas", "Torneios importados com sucesso!");
        } catch (error) {
            Alert.alert("Duplas:", `Erro ao importar torneios: ${error.message}`);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                Manutenção do Banco de Dados
            </Text>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={handleReset}>
                    <Text style={styles.buttonText}>Zerar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={handleImportUsers}>
                    <Text style={styles.buttonText}>Importar Usuários</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={handleImportDuplas}>
                    <Text style={styles.buttonText}>Importar Duplas</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={handleImportTorneios}>
                    <Text style={styles.buttonText}>Importar Torneios</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Text style={styles.backButtonText}>Voltar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        textAlign: 'center',
        fontSize: 24,
        fontFamily: 'bold',
        color: '#333',
        marginBottom: 20,
    },
    buttonContainer: {
        width: '100%',
        alignItems: 'center',
    },
    button: {
        backgroundColor: '#ffa500',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 8,
        marginVertical: 10,
        width: '80%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    backButton: {
        marginTop: 20,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ffa500',
        backgroundColor: 'transparent',
        width: '60%',
        alignItems: 'center',
    },
    backButtonText: {
        color: '#ffa500',
        fontSize: 16,
        fontWeight: 'bold',
    }
});
