import { router } from "expo-router";
import { View, Text, Alert, Button, StyleSheet } from "react-native";
import { useMaintenanceDatabase } from "../database/useMaintenanceDatabase";

export default function MainTenance() {
    const { resetDatabase, importUsers, importDuplas } = useMaintenanceDatabase();

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
            <Text>
                Manutenção do banco de dados
            </Text>
            <Button title="Zerar" onPress={handleReset} />
            <Button title="Importar usuários" onPress={handleImportUsers} />
            <Button title="Importar duplas" onPress={handleImportDuplas} />
            <Button title="Importar torneios" onPress={handleImportTorneios} />
            <Button title="Voltar" onPress={() => router.back()} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
