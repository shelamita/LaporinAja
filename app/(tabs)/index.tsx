import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { firebaseConfig } from "../../firebase-config";

import { initializeApp } from "firebase/app";
import { getDatabase, onValue, ref } from "firebase/database";

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export default function Beranda() {
  const router = useRouter();
  const [lastReport, setLastReport] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [stats, setStats] = useState({
    total: 0,
    selesai: 0,
    proses: 0
  });

  // realtime waktu
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const q = ref(db, "laporan/");
    onValue(q, (snap) => {
      const val = snap.val() || {};

      // ubah ke array
      const arr = Object.keys(val).map((key) => ({
        id: key,
        ...val[key],
      }));

      // hitung statistik
      const total = arr.length;
      const selesai = arr.filter(r => r.status?.toLowerCase() === "selesai").length;
      const proses = arr.filter(r => r.status?.toLowerCase() === "proses").length;

      setStats({ total, selesai, proses });

      // laporan terbaru
      if (arr.length > 0) {
        const newest = arr[arr.length - 1];
        setLastReport(newest);
      }
    });
  }, []);

  // ambil laporan terakhir
  useEffect(() => {
    const q = ref(db, "laporan/");
    onValue(q, (snap) => {
      const val = snap.val() || {};
      const arr = Object.keys(val).map((key) => ({
        id: key,
        ...val[key],
      }));
      if (arr.length > 0) {
        const newest = arr[arr.length - 1];
        setLastReport(newest);
      }
    });
  }, []);

  return (
    <View style={{ flex: 1 }}>

      {/* SCROLL VIEW */}
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>

        {/* JUDUL */}
        <Text style={styles.title}>MENYAPA WONOSOBO</Text>

        {/* HEADER IMAGE */}
        <Image
          source={require("../../assets/images/wonosobo.jpg")}
          style={styles.headerImage}
          resizeMode="cover"
        />

        <Text style={styles.subtitle}>Kami siap membantu laporanmu...</Text>

        {/* CARD INFO */}
        <View style={styles.cardCombined}>
          <Text style={styles.dateText}>
            {currentTime.toLocaleDateString("id-ID", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Text>

          <Text style={styles.timeText}>
            {currentTime.toLocaleTimeString("id-ID")}
          </Text>

          <View style={styles.divider} />

          <Text style={styles.cardTitle}>Status Laporan</Text>

          {lastReport ? (
            <>
              <Text style={styles.text}>Jenis Infrastruktur: {lastReport.jenisInfra}</Text>
              <Text style={styles.text}>Lokasi: {lastReport.lokasi}</Text>
              <Text style={styles.text}>Status: {lastReport.status || 'Belum ditentukan'}</Text>
            </>
          ) : (
            <Text style={styles.text}>Belum ada laporan.</Text>
          )}

        </View>

        <View style={styles.statCard}>
          <Text style={styles.statTitle}>Statistik Bulan Ini</Text>

          <View style={styles.statRow}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{stats.total}</Text>
              <Text style={styles.statLabel}>Laporan</Text>
            </View>

            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{stats.selesai}</Text>
              <Text style={styles.statLabel}>Selesai</Text>
            </View>

            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{stats.proses}</Text>
              <Text style={styles.statLabel}>Proses</Text>
            </View>
          </View>
        </View>

        {/* FOOTER BUTTONS (NON-FLOATING) */}
        <View style={styles.bottomButtons}>
          <TouchableOpacity style={styles.fab}
            onPress={() => router.push("/addreport")}>
            <Image source={require("../../assets/images/report.png")} style={styles.icon} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.fab}
            onPress={() => router.push("/mapwebview")}>
            <Image source={require("../../assets/images/map.png")} style={styles.icon} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.fab}
            onPress={() => router.push("/help")}>
            <Image source={require("../../assets/images/help.png")} style={styles.icon} />
          </TouchableOpacity>
        </View>
      </ScrollView>

    </View>
  );

}


const styles = StyleSheet.create({
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center", color: "#e91e63" },
  subtitle: { fontSize: 15, marginBottom: 20, textAlign: "center" },
  text: { textAlign: "center" },
  bottomButtons: {
    flexDirection: "row",          // horizontal
    justifyContent: "space-around", // rata tengah dan beri jarak merata
    marginVertical: 20,             // jarak atas & bawah
  },

  cardCombined: {
    padding: 18,
    borderRadius: 12,
    backgroundColor: "#ffe1ea",
    marginBottom: 20,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#ffb5c8",
  },

  dateText: { fontSize: 15, textAlign: "center", marginBottom: 4 },
  timeText: { fontSize: 18, fontWeight: "bold", textAlign: "center" },
  divider: { height: 1, backgroundColor: "#ff8fab", marginVertical: 12 },

  cardTitle: { fontSize: 16, fontWeight: "bold", textAlign: "center" },

  fabContainer: {
    position: "absolute",
    bottom: 25,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#ff8fab",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  icon: {
    width: 28,
    height: 28,
    tintColor: "white",
  },
  statCard: {
    marginTop: 10,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#fff0f6",
    borderWidth: 1,
    borderColor: "#ffb6d1",
    marginBottom: 20,
  },

  statTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },

  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  statBox: {
    flex: 1,
    alignItems: "center",
  },

  statNumber: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#e91e63",
  },

  statLabel: {
    fontSize: 13,
    marginTop: 4,
    color: "#333",
  },

  headerImage: {
    width: "100%",
    height: 160,
    borderRadius: 12,
    marginBottom: 15,
  },

});
