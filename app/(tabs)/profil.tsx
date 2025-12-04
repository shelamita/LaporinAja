// app/(tabs)/profil.tsx
import { useRouter } from 'expo-router';
import { getAuth, signOut } from "firebase/auth";
import React from 'react';
import { Alert, Button, StyleSheet, Text, View } from 'react-native';

export default function ProfilScreen() {
  const auth = getAuth();
  const user = auth.currentUser;
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.replace('/login'); // arahkan ke halaman login setelah logout
  };

  const handleLogin = () => {
    router.push('/login'); // arahkan ke halaman login
  };

  const handleRegister = () => {
    router.push('/register'); // arahkan ke halaman register
  };

  const handleEditProgress = () => {
    if (!user) {
      Alert.alert('Error', 'Harus login untuk mengakses fitur ini');
      return;
    }
    router.push('/edit-progress'); // arahkan ke halaman edit progress
  };

  return (
    <View style={styles.container}>
      {user ? (
        <>
          <Text style={styles.label}>Nama: {user.displayName || 'Warga'}</Text>
          <Text style={styles.label}>Email: {user.email}</Text>
          <Text style={styles.label}>Role: {user.role || 'Admin'}</Text>
          <Button title="Logout" onPress={handleLogout} color="#ff8fab" />
        </>
      ) : (
        <>
          <Text style={styles.label}>Anda belum login</Text>
          <View style={styles.buttonContainer}>
            <Button title="Login" onPress={handleLogin} color="#ff8fab" />
          </View>
          <View style={styles.buttonContainer}>
            <Button title="Daftar" onPress={handleRegister} color="#aaa" />
          </View>
        </>
      )}

      {user && (
        <View style={{ marginTop: 20 }}>
          <Button
            title="Edit Progress"
            onPress={handleEditProgress}
            color="#ffa500"
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, justifyContent:'center', alignItems:'center', padding:20 },
  label: { fontSize:16, marginBottom:20 },
  buttonContainer: { width:'60%', marginVertical:5 }
});
