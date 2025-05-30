import { Stack } from 'expo-router';
import { DatabaseProvider  } from '../context/MarkerImageContext';

export default function Layout() {
  return (
    <DatabaseProvider>
        <Stack />
    </DatabaseProvider>
  );
}
