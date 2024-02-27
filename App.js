import { View, Text, Alert, ActivityIndicator, FlatList, Image, StyleSheet, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';

const Clima = () => {
    const [data, setData] = useState(null);
    const [load, setLoad] = useState(false);

    useEffect(() => {
        const fetchWeatherData = async () => {
            try {
                const response = await fetch('https://api.weatherapi.com/v1/forecast.json?key=97ca1d271e2e45e9a3f165158231110&q=huejutla&days=10&aqi=no&alerts=no&lang=es');
                const jsonData = await response.json();
                setData(jsonData);
                setLoad(true);
            } catch (error) {
                Alert.alert('Error inesperado: ' + error);
            }
        };
        fetchWeatherData();
    }, []);

    const Card = ({ fecha, iko, min, max }) => (
        <View style={styles.cardContainer}>
            <Text style={styles.cardText}>{fecha}</Text>
            <Image style={styles.weatherIcon} source={{ uri: 'https:' + iko }} />
            <Text style={styles.temperature}>{max}°C</Text>
            <Text style={styles.temperature}>{min}°C</Text>
        </View>
    );

    const LScreen = () => {
        const [currentHourlyForecast, setCurrentHourlyForecast] = useState([]);

        useEffect(() => {
            if (data) {
                const currentHour = new Date().getHours();
                const hoursArray = data.forecast.forecastday[0].hour;
                const next24Hours = hoursArray.slice(currentHour, Math.min(currentHour + 24, hoursArray.length));
                setCurrentHourlyForecast(next24Hours);
            }
        }, [data]);

        return (
            <ScrollView style={styles.scrollView}>
                <View style={styles.locationContainer}>
                    <Text style={styles.title}>{data.location.name}</Text>
                    <Text style={styles.currentTemperature}>{data.current.temp_c}°</Text>
                    <Text style={styles.condition}>
                        {data.current.condition.text} - Máx: {data.forecast.forecastday[0].day.maxtemp_c}°C / Min: {data.forecast.forecastday[0].day.mintemp_c}°C
                    </Text>
                </View>

                <FlatList
                    horizontal
                    data={currentHourlyForecast}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.hourlyContainer}>
                            <Text style={styles.hour}>{item.time.split(' ')[1]}</Text>
                            <Image style={styles.hourIcon} source={{ uri: 'https:' + item.condition.icon }} />
                            <Text style={styles.hourTemperature}>{item.temp_c}°C</Text>
                        </View>
                    )}
                    style={styles.flatList}
                />

                <FlatList
                    data={data.forecast.forecastday}
                    renderItem={({ item }) => (
                        <Card fecha={item.date} iko={item.day.condition.icon} max={item.day.maxtemp_c} min={item.day.mintemp_c} />
                    )}
                    style={styles.dailyForecastList}
                />

                <View style={styles.infoContainer}>
                    <Text style={styles.sunTimes}>Amanecer: {data.forecast.forecastday[0].astro.sunrise}</Text>
                    <Text style={styles.sunTimes}>Atardecer: {data.forecast.forecastday[0].astro.sunset}</Text>
                </View>
            </ScrollView>
        );
    };

    const Uscreen = () => (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text>Cargando datos...</Text>
        </View>
    );

    return (
        <View style={styles.mainContainer}>
            {load ? <LScreen /> : <Uscreen />}
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#083D77', // Cambiado a un azul oscuro para un contraste más fuerte
    },
    scrollView: {
        backgroundColor: '#F4D35E', // Un amarillo suave para el fondo, simulando la luz del sol
    },
    locationContainer: {
        padding: 20,
        backgroundColor: '#F95738', // Un naranja vibrante para destacar la ubicación
        borderRadius: 10,
        margin: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF', // Texto blanco para contraste
        fontFamily: 'Roboto', // Asegúrate de tener esta fuente disponible o elige otra
    },
    currentTemperature: {
        fontSize: 64,
        fontWeight: '300',
        color: '#FFFFFF', // Texto blanco para mejor visibilidad
        textAlign: 'center',
        fontFamily: 'Roboto', // Consistencia en la fuente
    },
    condition: {
        fontSize: 18,
        fontWeight: '400',
        textAlign: 'center',
        marginTop: 10,
        color: '#FFFFFF', // Texto blanco para mantener la legibilidad
        fontFamily: 'Roboto', // Fuente uniforme
    },
    cardContainer: {
        backgroundColor: '#3C91E6', // Azul claro para las tarjetas
        borderRadius: 8,
        padding: 10,
        margin: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: '#000', // Sombra para las tarjetas
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    cardText: {
        fontSize: 16,
        color: '#FFFFFF', // Texto blanco para contraste
        fontFamily: 'Roboto',
    },
    weatherIcon: {
        width: 50,
        height: 50,
    },
    temperature: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF', // Texto blanco para leer fácilmente
        fontFamily: 'Roboto',
    },
    hourlyContainer: {
        alignItems: 'center',
        marginHorizontal: 10,
    },
    hour: {
        fontSize: 16,
        color: '#FFFFFF', // Texto blanco
        fontFamily: 'Roboto',
    },
    hourIcon: {
        width: 40,
        height: 40,
    },
    hourTemperature: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF', // Texto blanco
        fontFamily: 'Roboto',
    },
    flatList: {
        backgroundColor: 'transparent', // Transparente para mantener el fondo general
    },
    dailyForecastList: {
        backgroundColor: 'transparent', // Transparente para cohesión visual
    },
    infoContainer: {
        padding: 20,
        backgroundColor: '#3C91E6', // Fondo azul para la información adicional
        borderRadius: 10,
        margin: 10,
        shadowColor: '#000', // Sombra para destacar
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    sunTimes: {
        fontSize: 16,
        textAlign: 'center',
        color: '#FFFFFF', // Texto blanco
        fontFamily: 'Roboto',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#083D77', // Fondo coherente durante la carga
    },
});

export default Clima;
