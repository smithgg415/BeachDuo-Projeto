
import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import PagerView from 'react-native-pager-view';

const items = [
    { id: 1, title: '2° Open de Beach Tennis A. Maui', image: require('../assets/images/logomaui.png'), data: '11/09/2024' },
    { id: 2, title: '1° Torneio Paradise', image: require('../assets/images/torneioparadise.png'), data: '25/12/2024' },
    { id: 3, title: '5° Open de Beach Tennis SUN7', image: require('../assets/images/logosun7.png'), data: '25/12/2024' },
    { id: 4, title: '1° Torneio interno Itaguará', image: require('../assets/images/banner.png'), data: '11/03/2024' },
];

export default function Pager() {
    const pagerViewRef = useRef(null);
    const [page, setPage] = useState(0);
    -
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
            <Text style={styles.title}>Torneios de BT</Text>
            <PagerView ref={pagerViewRef} style={styles.pagerView} initialPage={0} onPageSelected={e => setPage(e.nativeEvent.position)}>
                {items.map(item => (
                    <View key={item.id} style={styles.item}>
                        <Text style={styles.textoCarrossel}>{item.title}</Text>
                        <Image source={item.image} style={styles.imagem} />
                        {/* <Text style={styles.textoCarrossel}>Data: {item.data}</Text> */}
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
        objectFit: 'cover',
        width: 350,
        height: 350,
        marginTop: 20,
        borderRadius: 20,
    },
    title: {
        fontSize: 35,
        marginBottom: 20,
        textAlign: 'center',
        fontFamily: "bolditalic",
        backgroundColor: "#00a3a3",
        color: "#fff",
        width: "100%",
        paddingBottom: 5,
        padding: 10,
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
        width: 10,
        height: 5,
        borderRadius: 5,
        backgroundColor: '#ccc',
        margin: 5,
    },
    activeIndicator: {
        backgroundColor: '#000',
    },
});


