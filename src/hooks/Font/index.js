import { useFonts } from "expo-font";
import { createContext, useContext } from "react";
import { ActivityIndicator, View, Text } from "react-native";

const FontContext = createContext({});


export default function FontProvider({ children }) {
    const [loaded, error] = useFonts({
        regular: require("../../assets/fonts/JosefinSans-Regular.ttf"),
        bold: require("../../assets/fonts/JosefinSans-Bold.ttf"),
        italic: require("../../assets/fonts/JosefinSans-Italic.ttf"),
        semibold: require("../../assets/fonts/JosefinSans-SemiBold.ttf"),
        bolditalic: require("../../assets/fonts/JosefinSans-BoldItalic.ttf"),
        semibolditalic: require("../../assets/fonts/JosefinSans-SemiBoldItalic.ttf"),
        light: require("../../assets/fonts/JosefinSans-Light.ttf"),
        lightitalic: require("../../assets/fonts/JosefinSans-LightItalic.ttf"),
        thin: require("../../assets/fonts/JosefinSans-Thin.ttf"),
        thinitalic: require("../../assets/fonts/JosefinSans-ThinItalic.ttf"),
        extralight: require("../../assets/fonts/JosefinSans-ExtraLight.ttf"),
        extralightitalic: require("../../assets/fonts/JosefinSans-ExtraLightItalic.ttf"),

    });
    if (!loaded && !error) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text style={{ fontSize:28, marginBottom:15 }}>Preparando tudo...</Text>
                <ActivityIndicator size="large" color="#ffc500" />
            </View>
        )
    }
    return <FontContext.Provider value={{loaded}}>{children}</FontContext.Provider>
}
export function useFont() {
    const context = useContext(FontContext);
    if (!context) {
        throw new Error("useFont must be used within a FontProvider");
    }
    return context;
}