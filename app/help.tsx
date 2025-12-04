import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

const Help = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Panduan Pengisian Pelaporan</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1. Pilih Jenis Infrastruktur</Text>
        <Text style={styles.sectionText}>
          Pilih jenis infrastruktur yang ingin Anda laporkan, misalnya jalan, jembatan, lampu jalan, dan lain-lain.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>2. Isi Lokasi</Text>
        <Text style={styles.sectionText}>
          Gunakan tombol "Get Current Location" untuk mengisi koordinat otomatis sesuai posisi Anda saat ini.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>3. Tambahkan Foto</Text>
        <Text style={styles.sectionText}>
          Unggah foto infrastruktur yang ingin dilaporkan agar pihak terkait dapat melihat kondisi secara langsung.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>4. Tambahkan Keterangan</Text>
        <Text style={styles.sectionText}>
          Jelaskan kondisi infrastruktur secara singkat dan jelas. Misalnya: rusak parah, lampu mati, lubang besar, dsb.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>5. Kirim Laporan</Text>
        <Text style={styles.sectionText}>
          Setelah semua informasi terisi dengan benar, tekan tombol "Simpan Laporan" untuk mengirim laporan Anda.
        </Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Terima kasih telah membantu melaporkan kondisi infrastruktur!</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
container: {
flex: 1,
padding: 16,
backgroundColor: '#fff',
},
header: {
fontSize: 24,
fontWeight: 'bold',
marginBottom: 16,
color: '#ff8fab',
},
section: {
marginBottom: 16,
},
sectionTitle: {
fontSize: 18,
fontWeight: 'bold',
marginBottom: 6,
color: '#333',
},
sectionText: {
fontSize: 16,
color: '#555',
lineHeight: 22,
},
footer: {
marginTop: 32,
paddingVertical: 16,
borderTopWidth: 1,
borderColor: '#eee',
},
footerText: {
textAlign: 'center',
color: '#777',
fontSize: 14,
},
});

export default Help;