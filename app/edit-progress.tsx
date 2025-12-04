// app/edit-progress.tsx
import { firebaseConfig } from '../firebase-config';
import { useRouter } from 'expo-router';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase, onValue, ref, update } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

export default function EditProgressScreen() {
  const router = useRouter();
  const [reports, setReports] = useState<any[]>([]);
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) {
      Alert.alert('Error', 'Harus login untuk mengakses halaman ini');
      router.push('/login');
      return;
    }

    const laporanRef = ref(db, 'laporan');
    const unsubscribe = onValue(laporanRef, snapshot => {
      const data = snapshot.val();
      if (data) {
        const formatted = Object.entries(data).map(([key, value]: any) => ({
          id: key,
          ...value
        }));
        setReports(formatted);
      } else {
        setReports([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const updateStatus = (id: string, newStatus: string) => {
    const reportRef = ref(db, `laporan/${id}`);
    update(reportRef, { status: newStatus })
      .then(() => {
        Alert.alert('Sukses', `Status laporan diubah menjadi "${newStatus}"`);
      })
      .catch(err => {
        console.error(err);
        Alert.alert('Error', 'Gagal mengubah status');
      });
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.reportCard}>
      <Text style={styles.title}>{item.jenisInfra}</Text>
      <Text>Lokasi: {item.lokasi}</Text>
      <Text>Status: {item.status || 'Belum Dikerjakan'}</Text>

      <View style={styles.buttonRow}>
        {['Belum Dikerjakan', 'Proses', 'Selesai'].map(status => (
          <TouchableOpacity
            key={status}
            style={[
              styles.statusButton,
              item.status === status && styles.activeButton
            ]}
            onPress={() => updateStatus(item.id, status)}
          >
            <Text style={styles.buttonText}>{status}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Edit Status Laporan</Text>
      {reports.length === 0 ? (
        <Text>Tidak ada laporan</Text>
      ) : (
        <FlatList
          data={reports}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, padding:20, backgroundColor:'#fff' },
  header: { fontSize:24, fontWeight:'bold', marginBottom:20, textAlign:'center' },
  reportCard: { borderWidth:1, borderColor:'#ccc', borderRadius:8, padding:15, marginBottom:12 },
  title: { fontSize:18, fontWeight:'600', marginBottom:5 },
  buttonRow: { flexDirection:'row', marginTop:10, justifyContent:'space-between' },
  statusButton: { padding:8, borderRadius:6, backgroundColor:'#eee', flex:1, marginHorizontal:2, alignItems:'center' },
  activeButton: { backgroundColor:'#ffa500' },
  buttonText: { color:'#000', fontWeight:'500' }
});
