import {useState, useEffect} from "react";
import * as ImagePicker from "expo-image-picker";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Image } from 'react-native';

export default function App() {
  const [image, setImage] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);

  /** Request library permission */
 useEffect(() => {
    (async () => {
     const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync(); 

     if(status === "granted") {
      setHasPermission(true);
     }
    })();
 }, [])

  /** Pick image from library */
  const pickImage = async () => {
    if(!hasPermission) {
      alert("Permission is required to access the library");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    })

    if(!result.canceled)  {
      setImage(result.assets[0].uri);
    }
  } 

  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <Button title="Pick an image" onPress={pickImage}/>
      <Image source={{uri: image}} style={{width: 200, height: 200}}/>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
