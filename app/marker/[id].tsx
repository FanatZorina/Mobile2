import React from 'react';
import {Alert, Button, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { ImageList } from '../../components/ImageList';
import { useEffect, useState } from 'react';
import { useDatabase } from '../../context/MarkerImageContext';
import { IMarker, MarkerImage } from '../../types';

export default function MarkerDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { deleteMarkerWithImages, getMarkers, getMarkerImages, addImage, deleteImage, deleteMarker } = useDatabase();

  const [marker, setMarker] = useState<IMarker | null>(null);
  const [markerImages, setMarkerImages] = useState<MarkerImage[]>([]);

  // Подгружаем информацию о маркере
  useEffect(() => {
      const loadMarkerData = async () => {
          if (!id) return;
          const allMarkers = await getMarkers();
          const found = allMarkers.find((m) => m.id === Number(id));
          setMarker(found ?? null);

          if (found) {
              const images = await getMarkerImages(found.id);
              setMarkerImages(images);
          }
      };

      loadMarkerData();
  }, [id]);

  // Обработчик выбора изображения
  const handlePickImage = async () => {
      try {
          const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              quality: 1,
          });

          if (!result.canceled && result.assets.length > 0 && marker) {
              const uri = result.assets[0].uri;
              await addImage(marker.id, uri);
              const updatedImages = await getMarkerImages(marker.id);
              setMarkerImages(updatedImages);
          }
      } catch (error) {
          alert('Ошибка при выборе изображения');
      }
  };

  // Обработчик удаления изображения
  const handleDeleteImage = async (imageId: number) => {
      if (!marker) return;
      await deleteImage(imageId);
      const updatedImages = await getMarkerImages(marker.id);
      setMarkerImages(updatedImages);
  };

  if (!marker) {
      return (
          <View style={styles.container}>
              <Text>Маркер не найден</Text>
              <Button title="Назад" onPress={() => router.back()} />
          </View>
      );
  }



    const handleDeleteMarker = () => {
    Alert.alert(
        "Удалить маркер?",
        "Это действие удалит маркер и все связанные изображения.",
        [
        { text: "Отмена", style: "cancel" },
        {
            text: "Удалить",
            style: "destructive",
            onPress: async () => {
            try {
                await deleteMarkerWithImages(marker.id);
                router.back();
            } catch (err) {
                console.error("Ошибка при удалении:", err);
            }
            },
        },
        ]
    );
    };



  return (
      <View style={styles.container}>
          <Text style={styles.title}>Маркер: {marker.title}</Text>
          <Text>Широта: {marker.latitude}</Text>
          <Text>Долгота: {marker.longitude}</Text>
          <Button title="Добавить изображение" onPress={handlePickImage} />
          <ImageList images={markerImages} onDelete={handleDeleteImage} />
          <Button title="Удалить маркер" color="red" onPress={handleDeleteMarker} />
          <Button title="Назад к карте" onPress={() => router.back()} />
      </View>
  );

}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      padding: 24,
      justifyContent: 'center',
      alignItems: 'center',
      gap: 16,
  },
  title: {
      fontSize: 20,
      fontWeight: 'bold',
  },
  image: {
      width: 100,
      height: 100,
      marginRight: 10,
      borderRadius: 10,
  },
});