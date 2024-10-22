
import React from 'react';
import { Text, View, Button, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';

export default function About() {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Sobre o App</Text>
            <Text style={styles.description}>
                Este aplicativo foi desenvolvido para auxiliar no controle e gestão de duplas em torneios de beach tennis. 
                Com ele, você pode facilmente:
            </Text>
            <Text style={styles.listItem}>- Gerenciar informações das duplas participantes</Text>
            <Text style={styles.description}>
                O objetivo é proporcionar uma forma simples e eficiente para a administração de torneios, garantindo que todas as partidas sejam bem organizadas e que os resultados sejam facilmente acessíveis.
            </Text>
            <Button title='Voltar' onPress={() => router.back('/')} color="#ffa500" />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f4f4f9',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
    },
    description: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 10,
    },
    listItem: {
        fontSize: 16,
        color: '#333',
        marginBottom: 5,
    },
});
