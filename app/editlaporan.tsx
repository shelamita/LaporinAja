import { firebaseConfig } from "../firebase-config";
import * as Location from 'expo-location';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { initializeApp } from "firebase/app";
import { child, get, getDatabase, ref, update } from "firebase/database";
import React, { useEffect, useState } from 'react';
import { Alert, Button, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-root-toast';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export default function EditLaporan() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [jenisInfra, setJenisInfra] = useState('');
  const [location, setLocation] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
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

  // Fetch data on load
  useEffect(() => {
    if (params.key) {
      const dbRef = ref(db);
      get(child(dbRef, `laporan/${params.key}`)).then((snapshot) => {
        if (snapshot.exists()) {
          const reportData = snapshot.val();
          setJenisInfra(reportData.jenisInfra || '');
          setLocation(reportData.lokasi || '');
          setDeskripsi(reportData.deskripsi || '');
        } else {
          console.log("No data available");
          Alert.alert("Error", "Data laporan tidak ditemukan.");
          router.back();
        }
      }).catch((error) => {
        console.error(error);
        Alert.alert("Error", "Gagal mengambil data laporan.");
        router.back();
      });
    }
  }, [params.key]);

  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Cannot access location');
      return;
    }
    let loc = await Location.getCurrentPositionAsync({});
    setLocation(`${loc.coords.latitude},${loc.coords.longitude}`);
  };

  const updateReport = async () => {
    if (!jenisInfra || !location || !deskripsi) {
      Alert.alert("Error", "Semua field wajib diisi");
      return;
    }

    const laporanRef = ref(db, `laporan/${params.key}`);
    update(laporanRef, {
      jenisInfra,
      lokasi: location,
      deskripsi
    })
    .then(() => {
      Toast.show('Laporan berhasil diperbarui!', {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM,
        shadow: true,
        animation: true,
      });
      router.back(); // Kembali ke layar riwayat laporan
    })
    .catch(err => {
      console.error(err);
      Alert.alert("Error", "Gagal memperbarui laporan");
    });
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <Stack.Screen options={{ title: 'Edit Laporan' }} />
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
            <Button title="Get Current Location" onPress={getCurrentLocation} />
          </View>

          <Text style={styles.label}>Deskripsi Singkat Kerusakan</Text>
          <TextInput
            style={[styles.input, { height: 80 }]}
            placeholder="Deskripsi kerusakan..."
            value={deskripsi}
            multiline
            onChangeText={setDeskripsi}
          />
          <View style={{ marginTop: 20 }}>
            <Button title="Perbarui Laporan" onPress={updateReport} />
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
  dropdownItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  pickerContainer: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, marginBottom: 12 },
});
