// About.js
import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet, ScrollView, Image } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import TypingText from '../components/TypingText';
import Constants from 'expo-constants';
import logo from "../assets/images/giacomellidevs.png"

export default function About() {
    return (
        <>
            <View style={styles.backButtonContainer}>
                <TouchableOpacity onPress={() => router.back("")} style={{flexDirection:"row"}}>
                    <Ionicons name="arrow-back" size={24} color="#fff" style={{left:10, bottom:10}} />
                </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.container}>

                <Text style={styles.title}>Sobre Mim</Text>

                <Image source={require('../assets/images/giacomelli.jpg')} style={styles.profileImage} />

                <TypingText
                    text="Olá, Sou o Giacomelli!"
                    speed={100}
                    style={styles.description}
                />

                <TypingText speed={50} text="Minha Formação" style={styles.sectionTitle} />
                <Text style={styles.description}> Atualmente, estudo Desenvolvimento Web e Ethical Hacking.</Text>


                <TypingText speed={50} text="Giacomelli Dev's" style={styles.sectionTitle} />
                <Text style={styles.description}>Fundada em 2024, a Giacomelli Dev's é minha startup de desenvolvimento de websites e aplicativos móveis.</Text>
                <Image source={logo} style={styles.logoImage} />
            </ScrollView >
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: Constants.statusBarHeight,
        flex: 1,
        padding: 20,
        backgroundColor: '#f4f4f9',
    },
    backButtonContainer: {
        paddingTop: Constants.statusBarHeight + 10,
        backgroundColor: '#ffa500',
    },
    title: {
        fontSize: 28,
        fontFamily: 'bold',
        color: '#ffa500', // Cor principal do app
        marginBottom: 20,
        textAlign: 'center',
    },
    profileImage: {
        width: 150,
        height: 150,
        borderRadius: 75,
        marginBottom: 20,
        alignSelf: 'center',
        borderColor: '#ffa500', // Bordas alinhadas com a cor principal
        borderWidth: 2,
    },
    logoImage: {
        width: 180,
        height: 180,
        borderRadius: 20,
        marginBottom: 20,
        alignSelf: 'center',
        borderColor: '#ffa500', // Bordas alinhadas com a cor principal
        borderWidth: 2,
    },
    description: {
        fontFamily: 'regular',
        fontSize: 18,
        color: '#333',
        textAlign: 'center',
        marginBottom: 15,
        paddingHorizontal: 15,
        lineHeight: 26,
    },
    sectionTitle: {
        fontSize: 24,
        fontFamily: 'bold',
        color: '#ffa500', // Cor principal do app
        marginTop: 20,
        marginBottom: 10,
        textAlign: 'center',
        borderBottomWidth: 2,
        borderBottomColor: '#ffa500',
        paddingBottom: 5,
    },
});
