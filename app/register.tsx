// app/register.tsx
import { firebaseConfig } from '../firebase-config';
import { useRouter } from 'expo-router';
import { initializeApp } from 'firebase/app';
import { createUserWithEmailAndPassword, getAuth, updateProfile } from 'firebase/auth';
import React, { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Semua field wajib diisi');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Password dan konfirmasi tidak sama');
      return;
    }

    try {
      // Buat akun
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Set nama pengguna
      await updateProfile(user, { displayName: name });

      Alert.alert('Sukses', 'Akun berhasil dibuat!');
      router.push('/login'); // arahkan ke login setelah register
    } catch (error: any) {
      console.error(error);
      Alert.alert('Error', error.message || 'Gagal membuat akun');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>

      <TextInput
        style={styles.input}
        placeholder="Nama"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TextInput
        style={styles.input}
        placeholder="Konfirmasi Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <Button title="Daftar" onPress={handleRegister} color="#ff8fab" />

      <TouchableOpacity onPress={() => router.push('/login')}>
        <Text style={styles.loginText}>Sudah punya akun? Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    padding:20,
    backgroundColor:'#fff'
  },
  title: {
    fontSize:24,
    fontWeight:'bold',
    marginBottom:20
  },
  input: {
    width:'100%',
    borderWidth:1,
    borderColor:'#ccc',
    borderRadius:6,
    padding:10,
    marginBottom:12
  },
  loginText: {
    marginTop:20,
    color:'#ff8fab',
    textDecorationLine:'underline'
  }
});
