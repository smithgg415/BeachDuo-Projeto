import * as Notifications from 'expo-notifications';
import { Alert } from 'react-native';
import { useEffect } from 'react';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

export const requestNotificationPermission = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
        Alert.alert('Permissão negada', 'Não foi possível obter permissão para notificações.');
    }
};

export const scheduleNotification = async (title, body, data = {}) => {
    try {
        await Notifications.scheduleNotificationAsync({
            content: {
                title,
                body,
                data,
                icon: require('../assets/images/logobeachduo.png'),
            },
            trigger: { seconds: 1 },
        });
    } catch (error) {
        console.error("Erro ao agendar notificação:", error);
    }
};

export const useNotificationListener = () => {
    useEffect(() => {
        const subscription = Notifications.addNotificationReceivedListener(notification => {
            // console.log("Notificação recebida:", notification);
        });

        return () => subscription.remove();
    }, []);
};
