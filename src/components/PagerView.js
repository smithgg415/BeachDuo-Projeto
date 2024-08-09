import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import PagerView from 'react-native-pager-view';
const items = [
    { id: 1, title: '2° Open de Beach Tennis A. Maui', image: require('../assets/images/logobt.png') },
    { id: 2, title: '3° Open de Beach Tennis SUN7', image: require('../assets/images/logo.png') },
    { id: 3, title: '4° Cumbuca de Beach Piquerobi', image: require('../assets/images/logobeachduo.png') },
];

export default function Pager() {
    const pagerViewRef = useRef(null);
    const [page, setPage] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setPage(prevPage => {
                const nextPage = prevPage === items.length - 1 ? 0 : prevPage + 1;
                pagerViewRef.current.setPage(nextPage);
                return nextPage;
            });
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Torneios</Text>
            <PagerView ref={pagerViewRef} style={styles.pagerView} initialPage={0} onPageSelected={e => setPage(e.nativeEvent.position)}>
                {items.map(item => (
                    <View key={item.id} style={styles.item}>
                        <Text style={styles.textoCarrossel}>{item.title}</Text>
                        <Image source={item.image} style={styles.imagem} />
                    </View>
                ))}
            </PagerView>
            <View style={styles.indicatorContainer}>
                {items.map((_, index) => (
                    <View key={index} style={[styles.indicator, page === index && styles.activeIndicator]} />
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    pagerView: {
        flex: 1,
        width: '100%',
        height: '70%',
    },
    textoCarrossel: {
        fontSize: 22,
        color: 'black',
        textAlign: 'center',
        marginTop: 20,
        fontFamily: "bolditalic",
    },
    imagem: {
        width: 300,
        height: 300,
        alignSelf: 'center',
        marginTop: 20,
        borderRadius: 20,
    },
    title: {
        fontSize: 35,
        marginBottom: 20,
        textAlign: 'center',
        fontFamily: "bolditalic",
        backgroundColor:"#007b",
        color:"#fff",
        width:"100%",
        paddingBottom:5
    },
    item: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 10,

    },
    indicatorContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    indicator: {
        width: 50,
        height: 5,
        borderRadius: 5,
        backgroundColor: '#ccc',
        margin: 5,
    },
    activeIndicator: {
        backgroundColor: '#000',
    },
});
