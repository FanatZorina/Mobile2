import React from 'react';
import { StyleSheet } from 'react-native';
import MapView, { LongPressEvent, Marker } from 'react-native-maps';
import { IMarker } from '../types';

interface MapProps {
    markers: IMarker[];
    onLongPress: (event: LongPressEvent) => void;
    onMarkerPress: (id: number) => void;
}

const Map: React.FC<MapProps> = ({ markers, onLongPress, onMarkerPress }) => {
    return (
        <MapView
            style={styles.map}
            onLongPress={onLongPress}
            initialRegion={{
                latitude: 55.751244,
                longitude: 37.618423,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            }}
        >
            {markers.map((marker) => (
                <Marker
                    key={marker.id}
                    coordinate={{
                        latitude: marker.latitude,
                        longitude: marker.longitude,
                    }}
                    onPress={() => onMarkerPress(marker.id)}
                />
            ))}
        </MapView>
    );
};

const styles = StyleSheet.create({
    map: {
        flex: 1,
    },
});

export default Map;