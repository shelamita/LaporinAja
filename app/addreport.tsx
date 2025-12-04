import { firebaseConfig } from "../firebase-config";
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Stack } from 'expo-router';
import { initializeApp } from "firebase/app";
import { getDatabase, push, ref } from "firebase/database";
import React, { useState } from 'react';
import { Alert, Button, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-root-toast';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export default function InputLaporan() {
  const [jenisInfra, setJenisInfra] = useState('');
  const [location, setLocation] = useState('');
  const [accuration, setAccuration] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [image, setImage] = useState(null);
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const jenisPilihan = [
    "Jalan / Trotoar",
    "Jembatan",
    "Lampu jalan / PJU",
    "Saluran air / Drainase",
    "Gedung",
    "Pos Kamling",
    "Fasilitas lainnya"
  ];

  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Cannot access location');
      return;
    }
    let loc = await Location.getCurrentPositionAsync({});
    setLocation(`${loc.coords.latitude},${loc.coords.longitude}`);
    setAccuration(`${loc.coords.accuracy} m`);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const saveReport = async () => {
    if (!jenisInfra || !location || !deskripsi) {
      Alert.alert("Error", "Semua field wajib diisi");
      return;
    }

    const laporanRef = ref(db, 'laporan/');
    push(laporanRef, {
      jenisInfra,
      lokasi: location,
      deskripsi,
      imageUri: image || '',
      createdAt: new Date().toISOString(),
      status: 'Belum Dikerjakan',
    })
      .then(() => {
        Toast.show('Laporan berhasil disimpan!', {
          duration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM,
          shadow: true,
          animation: true,
        });
        setJenisInfra('');
        setLocation('');
        setDeskripsi('');
        setImage(null);
      })
      .catch(err => {
        console.error(err);
        Alert.alert("Error", "Gagal menyimpan laporan");
      });
  };


  return (<SafeAreaProvider>
    <SafeAreaView style={{ flex: 1 }}>
      <Stack.Screen options={{ title: 'Tambah Laporan' }} />
      <ScrollView contentContainerStyle={{ padding: 20 }}>

        <Text style={styles.label}>Jenis Infrastruktur</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setDropdownOpen(!isDropdownOpen)}
        >
          <Text style={{ color: jenisInfra ? '#000' : '#999' }}>
            {jenisInfra || '-- Pilih Jenis Infrastruktur --'}
          </Text>
        </TouchableOpacity>

        {isDropdownOpen && (
          <View style={styles.dropdownList}>
            {jenisPilihan.map((item) => (
              <TouchableOpacity
                key={item}
                style={styles.dropdownItem}
                onPress={() => {
                  setJenisInfra(item);
                  setDropdownOpen(false);
                }}
              >
                <Text>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        <Text style={styles.label}>Lokasi Kerusakan</Text>
        <TextInput
          style={styles.input}
          placeholder="Ketik koordinat atau gunakan tombol"
          value={location}
          onChangeText={setLocation}
        />
        <View style={{ marginVertical: 10 }}>
          <Button title="Get Current Location" onPress={getCurrentLocation} color="#ff8fab" />
        </View>

        <Text style={styles.label}>Akurasi</Text>
        <TextInput
          style={styles.input}
          placeholder="Isikan accuration (contoh: 5 meter)"
          value={accuration}
          onChangeText={setAccuration}
        />

        <Text style={styles.label}>Deskripsi Singkat Kerusakan</Text>
        <TextInput
          style={[styles.input, { height: 80 }]}
          placeholder="Deskripsi kerusakan..."
          value={deskripsi}
          multiline
          onChangeText={setDeskripsi}
        />

        <Text style={styles.label}>Upload Gambar</Text>
        <Button title="Pilih Gambar" onPress={pickImage} color="#ff8fab" />
        {image && <Image source={{ uri: image }} style={styles.imagePreview} />}

        <View style={{ marginTop: 20 }}>
          <Button title="Simpan Laporan" onPress={saveReport} color="#ff8fab" />
        </View>

      </ScrollView>
    </SafeAreaView>
  </SafeAreaProvider>

  );
}

const styles = StyleSheet.create({
  label: { fontSize: 16, fontWeight: '600', marginTop: 12, marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 10, marginBottom: 12, justifyContent: 'center' },
  dropdownList: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, marginTop: -12, marginBottom: 12, backgroundColor: '#fff' },
  dropdownItem: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#eee' },
  pickerContainer: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, marginBottom: 12 },
  imagePreview: { width: '100%', height: 200, marginTop: 10, borderRadius: 6 },
});
