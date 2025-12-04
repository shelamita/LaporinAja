import { FontAwesome } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { router } from 'expo-router';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { WebView } from 'react-native-webview';


const webmap = require('../../assets/html/map.html')


export default function App() {
  return (
    <View style={styles.container}>
      <WebView
        style={styles.webview}
        source={webmap}
        originWhitelist={['*']}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowFileAccess={true}
        allowUniversalAccessFromFileURLs={true}
        onMessage={(event) => {
          const msg = JSON.parse(event.nativeEvent.data);


          // Jika WebView mengirim perintah edit
          if (msg.type === "EDIT_POINT") {
            router.push({ pathname: "/editlaporan", params: { key: msg.key } });
            return;
          }


          // Jika ada data dari Firebase
          if (msg.data) {
            console.log("Data from WebView:", msg.data);
            return;
          }


          // Jika ada error
          if (msg.error) {
            console.error("Error from WebView:", msg.error);
            return;
          }


          // Default
          console.log("Message from WebView:", msg);
        }}

      />
      <TouchableOpacity style={styles.fab} onPress={() => router.push('/addreport')}>
        <FontAwesome name="plus" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
  },
  webview: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 20,
    backgroundColor: '#0275d8',
    borderRadius: 30,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
