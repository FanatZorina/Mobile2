import React from 'react';
import { Alert, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { MarkerImage } from '../types';

interface ImageListProps {
    images: MarkerImage[];
    onDelete: (imageId: number) => void;
}

export const ImageList: React.FC<ImageListProps> = ({ images, onDelete }) => {
    const handleLongPress = (imageId: number) => {
        Alert.alert(
            'Удаление изображения',
            'Вы уверены, что хотите удалить это изображение?',
            [
                { text: 'Отмена', style: 'cancel' },
                {
                    text: 'Удалить',
                    style: 'destructive',
                    onPress: () => onDelete(imageId),
                },
            ]
        );
    };

    return (
        <FlatList
            data={images}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
                <TouchableOpacity onLongPress={() => handleLongPress(item.id)}>
                    <Image source={{ uri: item.uri }} style={styles.image} />
                </TouchableOpacity>
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
        />
    );
};

const styles = StyleSheet.create({
    image: {
        width: 100,
        height: 100,
        marginRight: 10,
        borderRadius: 10,
    },
});
