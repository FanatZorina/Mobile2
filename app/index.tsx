import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { StyleSheet, View } from 'react-native';
import { LongPressEvent } from 'react-native-maps';
import Map from '../components/Map';
import { useDatabase } from '../context/MarkerImageContext';
import { IMarker } from '../types';

export default function MapScreen() {
  const router = useRouter();
  // Храним список маркеров в контексте
  const { addMarker, getMarkers, isLoading, error } = useDatabase();
  const [markers, setMarkers] = useState<IMarker[]>([]);

  // Загрузка маркеров при монтировании
  useFocusEffect(
    useCallback(() => {
      const loadMarkers = async () => {
        try {
          const dbMarkers = await getMarkers();
          setMarkers(dbMarkers);
        } catch (err) {
          console.error('Ошибка загрузки маркеров из БД:', err);
        }
      };
  
      loadMarkers();
    }, [getMarkers])
  );

  // Обработка долгово нажатия на карту
  const handleLongPress = useCallback(
    async (event: LongPressEvent) => {
      const { coordinate } = event.nativeEvent;
      const timestamp = Date.now();
      const title = `Маркер ${timestamp}`;
  
      try {
        const id = await addMarker(coordinate.latitude, coordinate.longitude, title);
        const newMarker: IMarker = {
          id,
          latitude: coordinate.latitude,
          longitude: coordinate.longitude,
          title,
          created_at: new Date().toISOString(),
        };
        setMarkers((prev) => [...prev, newMarker]);
      } catch (err) {
        console.error('Ошибка добавления маркера:', err);
      }
    },
    [addMarker]
  );

  // Обработка нажатия на маркер
  const handleMarkerPress = (id: number) => {
    router.push(`/marker/${id}`);
  };

  if (isLoading) return <View style={styles.loading}><></></View>;
  if (error) return <View><></></View>; // обработка ошибки

  return (
    <View style={styles.container}>
      <Map
        markers={markers}
        onLongPress={handleLongPress}
        onMarkerPress={handleMarkerPress}
      />
    </View>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loading: {
    flex: 1,
    backgroundColor: '#fff',
  },
});