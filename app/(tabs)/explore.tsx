import { firebaseConfig } from '../../firebase-config';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { router } from 'expo-router';
import { initializeApp } from 'firebase/app';
import { getDatabase, onValue, ref, remove } from 'firebase/database';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Linking, RefreshControl, SectionList, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function RiwayatLaporanScreen() {
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getDatabase(app);

  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const handlePress = (lokasi) => {
        const [latitude, longitude] = lokasi.split(',').map(coord => coord.trim());
        const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
        Linking.openURL(url);
    };


  // Hapus laporan
  const handleDelete = (id) => {
    Alert.alert(
      "Hapus Laporan",
      "Apakah Anda yakin ingin menghapus laporan ini?",
      [
        { text: "Batal", style: "cancel" },
        { text: "Hapus", onPress: () => remove(ref(db, `laporan/${id}`)), style: "destructive" }
      ]
    );
  }

  // Edit laporan
  const handleEdit = (item) => {
    router.push({
      pathname: "/editlaporan", // Pastikan ada screen ini
      params: { key: item.id }
    });
  }

  // Tambah laporan
  const handleAddReport = () => {
    router.push('/addreport');
  }

  useEffect(() => {
    const laporanRef = ref(db, 'laporan/');

    const unsubscribe = onValue(laporanRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const laporanArray = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));

        // Urutkan berdasarkan waktu terbaru
        laporanArray.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setSections([{
          title: 'Riwayat Laporan',
          data: laporanArray
        }]);
      } else {
        setSections([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  return (
    <View style={styles.container}>
      {sections.length > 0 ? (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handlePress(item.lokasi)}>
            <View style={styles.item}>
              <ThemedText style={styles.itemTitle}>{item.jenisInfra}</ThemedText>
              <ThemedText>Lokasi: {item.lokasi}</ThemedText>
              <ThemedText>Deskripsi: {item.deskripsi}</ThemedText>
              <ThemedText>Status: {item.status || 'Belum ditentukan'}</ThemedText>
              <View style={styles.actionButtons}>
                <TouchableOpacity onPress={() => handleEdit(item)} style={styles.editButton}>
                  <FontAwesome5 name="pencil-alt" size={20} color="orange" />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteButton}>
                  <FontAwesome5 name="trash" size={20} color="red" />
                </TouchableOpacity>
              </View>

            </View>
            </TouchableOpacity>
          )}
          renderSectionHeader={({ section: { title } }) => (
            <ThemedText style={styles.header}>{title}</ThemedText>
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          stickySectionHeadersEnabled={true}
        />
      ) : (
        <ThemedView style={styles.container}>
          <ThemedText>Tidak ada laporan tersimpan.</ThemedText>
        </ThemedView>
      )}
       <TouchableOpacity
        style={styles.fab}
        onPress={handleAddReport}
      >
        <FontAwesome5 name="plus" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 22, backgroundColor: '#f0f0f0' },
  item: { backgroundColor: "#fff0f6", borderWidth: 1, borderColor: "#ffb6d1", padding: 16, marginVertical: 8, marginHorizontal: 16, borderRadius: 8 },
  itemTitle: { fontSize: 18, fontWeight: 'bold' },
  header: { fontSize: 24, fontWeight: 'bold', backgroundColor: '#ffb6d1', color: '#fff', textAlign: 'center', padding: 16 },
  imagePreview: { width: '100%', height: 150, marginTop: 8, borderRadius: 6 },
  actionButtons: {
  flexDirection: 'row',       
  justifyContent: 'flex-end', 
  marginTop: 10,
},
editButton: {
  marginRight: 20,
},
deleteButton: {
},
fab: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ff8fab',
    alignItems: 'center',
    justifyContent: 'center',
    right: 30,
    bottom: 30,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  
});
