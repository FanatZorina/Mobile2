import * as SQLite from 'expo-sqlite';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { initDatabase } from '../database/schema';
import { IMarker, MarkerImage } from '../types';

interface MarkerImageContextType {
    addMarker: (latitude: number, longitude: number, title:string) => Promise<number>;
    deleteMarker: (id: number) => Promise<void>;
    deleteMarkerWithImages: (id: number) => Promise<void>; 
    getMarkers: () => Promise<IMarker[]>;
    addImage: (markerId: number, uri: string) => Promise<void>;
    deleteImage: (id: number) => Promise<void>;
    getMarkerImages: (markerId: number) => Promise<MarkerImage[]>;
    isLoading: boolean;
    error: Error | null;
  }

const MarkerImageContext = createContext<MarkerImageContextType | undefined>(undefined);

export const useDatabase = () => {
  const context = useContext(MarkerImageContext);
  if (!context) throw new Error('MarkerImageContext долженн быть в DatabaseProvider');
  return context;
};

export const DatabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
      try {
          const database = initDatabase();
          setDb(database);
      } catch (err) {
          setError(err as Error);
      } finally {
          setIsLoading(false);
      }
  }, []);

  const deleteMarkerWithImages = async (id: number) => {
    if (!db) throw new Error("БД не инициализирована");
  
    try {
      await db.withExclusiveTransactionAsync(async (txn) => {
        await txn.runAsync(`DELETE FROM marker_images WHERE marker_id = ?`, [id]);
        await txn.runAsync(`DELETE FROM markers WHERE id = ?`, [id]);
      });
    } catch (err) {
      console.error("Ошибка транзакции удаления:", err);
      throw err;
    }
  };
  
  

  const addMarker = async (latitude: number, longitude: number, title:string) => {
      if (!db) throw new Error('База данных не инициализирована');
      const result = await db.runAsync(
          'INSERT INTO markers (latitude, longitude, title) VALUES (?, ?, ?)',
          [latitude, longitude, title]
      );
      return result.lastInsertRowId!;
  };

  const deleteMarker = async (id: number) => {
      if (!db) throw new Error('База данных не инициализирована');
      await db.runAsync('DELETE FROM markers WHERE id = ?', [id]);
  };

  const getMarkers = async (): Promise<IMarker[]> => {
      if (!db) throw new Error('База данных не инициализирована');
      const result = await db.getAllAsync<IMarker>('SELECT * FROM markers');
      return result;
  };

  const addImage = async (markerId: number, uri: string) => {
      if (!db) throw new Error('База данных не инициализирована');
      await db.runAsync(
          'INSERT INTO marker_images (marker_id, uri) VALUES (?, ?)',
          [markerId, uri]
      );
  };

  const deleteImage = async (id: number) => {
      if (!db) throw new Error('База данных не инициализирована');
      await db.runAsync('DELETE FROM marker_images WHERE id = ?', [id]);
  };

  const getMarkerImages = async (markerId: number): Promise<MarkerImage[]> => {
      if (!db) throw new Error('База данных не инициализирована');
      const result = await db.getAllAsync<MarkerImage>(
          'SELECT * FROM marker_images WHERE marker_id = ?',
          [markerId]
      );
      return result;
  };

  const contextValue: MarkerImageContextType = {
      addMarker,
      deleteMarker,
      getMarkers,
      addImage,
      deleteMarkerWithImages,
      deleteImage,
      getMarkerImages,
      isLoading,
      error,
  };

  return (
      <MarkerImageContext.Provider value={contextValue}>
          {children}
      </MarkerImageContext.Provider>
  );
};
