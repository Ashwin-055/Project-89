import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  Image,
  Dimensions,
  Button,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { RFValue } from 'react-native-responsive-fontsize';
import * as Google from 'expo-google-app-auth';
import firebase from 'firebase';

export default class LoginScreen extends Component {
  isUserEqual = (googleUser, firebaseUser) => {
    if (firebaseUser) {
      var providerData = firebaseUser.providerData;
      for (var i = 0; i < providerData.length; i++) {
        if (
          providerData[i].providerId ===
            firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
          providerData[i].uid === googleUser.getBasicProfile().getId()
        ) {
          return true;
        }
      }
    }
    return false;
  };

  onSignIn = (googleUser) => {
    var unsubscribe = firebase.auth().onAuthStateChanged((firebaseUser) => {
      unsubscribe();
      if (!this.isUserEqual(googleUser, firebaseUser)) {
        var credential = firebase.auth.GoogleAuthProvider.credential(
          googleUser.idToken,
          googleUser.accessToken
        );

        firebase
          .auth()
          .signInWithCredential(credential)
          .then(function (result) {
            if (result.additionalUserInfo.isNewUser) {
              firebase
                .database()
                .ref('/users/' + result.user.uid)
                .set({
                  gmail: result.user.email,
                  profile_picture: result.additionalUserInfo.profile.picture,
                  locale: result.additionalUserInfo.profile.locale,
                  first_name: result.additionalUserInfo.profile.given_name,
                  last_name: result.additionalUserInfo.profile.family_name,
                  current_theme: 'dark',
                })
                .then(function (snapshot) {});
            }
          })
          .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            var email = error.email;
            var credential = error.credential;
          });
      } else {
        console.log('User already signed-in Firebase.');
      }
    });
  };

  signInWithGoogleAsync = async () => {
    try {
      const result = await Google.logInAsync({
        behaviour: "web",
        androidClientId:
          "458337224141-vs3nbfutv0m81d7i412sropmgatpmfma.apps.googleusercontent.com",
        iosClientId:
          "458337224141-suafcm5kgta29valhnf3oelik3dft28g.apps.googleusercontent.com",
        scopes: ["profile", "email"]
      });

      if (result.type === 'success') {
        this.onSignIn(result);
        return result.accessToken;
      } else {
        return { cancelled: true };
      }
    } catch (e) {
      console.log(e.message);
      return { error: true };
    }
  };

  render() {
      return (
        <View style={styles.container}>
          <SafeAreaView style={styles.droidSafeArea} />
          <View style={styles.appTitle}>
            <Image
              source={require('../assets/logo.png')}
              style={styles.appIcon}></Image>
            <Text style={styles.appTitleText}>𝓢𝓹𝓮𝓬𝓽𝓪𝓰𝓻𝓪𝓶</Text>
          </View>
          <View style={styles.buttonContainer}>
            <TorB link={() => this.signInWithGoogleAsync()} />
          </View>
        </View>
      );
    
  }
}

const TorB = function (props) {
  if (Platform.OS === 'android') {
    return (
      <View style={{ alignItems: 'center', width: RFValue(260) }}>
        <View style={[styles.button, { position: 'absolute', marginTop: 10 }]}>
          <Image
            source={require('../assets/favicon.png')}
            style={styles.googleIcon}></Image>
          <Text style={styles.googleText}>Sign in with Google</Text>
        </View>
        <Button
          color={'transparent'}
          title={'⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀'}
          onPress={props.link}
        />
      </View>
    );
  } else {
    return (
      <TouchableOpacity style={styles.button} onPress={props.link}>
        <Image
          source={require('../assets/favicon.png')}
          style={styles.googleIcon}></Image>
        <Text style={styles.googleText}>Sign in with Google</Text>
      </TouchableOpacity>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000030',
  },
  droidSafeArea: {
    marginTop:
      Platform.OS === 'android' ? StatusBar.currentHeight : RFValue(35),
  },
  appTitle: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appIcon: {
    width: RFValue(100),
    height: RFValue(100),
    resizeMode: 'contain',
  },
  appTitleText: {
    color: 'white',
    textAlign: 'center',
    fontSize: RFValue(40),
    fontFamily: 'monospace'
  },
  buttonContainer: {
    flex: 0.3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: RFValue(250),
    height: RFValue(50),
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    borderRadius: RFValue(30),
    backgroundColor: 'white',
  },
  googleIcon: {
    width: RFValue(30),
    height: RFValue(30),
    resizeMode: 'contain',
  },
  googleText: {
    color: 'black',
    fontSize: RFValue(20)
  }
});
