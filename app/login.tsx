// app/login.tsx
import { firebaseConfig } from '../firebase-config';
import { useRouter } from 'expo-router';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Email dan password wajib diisi');
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert('Sukses', 'Login berhasil!');
      router.push('/profil'); // ganti sesuai halaman utama setelah login
    } catch (error: any) {
      console.error(error);
      Alert.alert('Error', error.message || 'Gagal login');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

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

      <Button title="Login" onPress={handleLogin} color="#ff8fab" />

      <TouchableOpacity onPress={() => router.push('/register')}>
        <Text style={styles.registerText}>Belum punya akun? Daftar</Text>
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
  registerText: {
    marginTop:20,
    color:'#ff8fab',
    textDecorationLine:'underline'
  }
});
