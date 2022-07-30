import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  Image,
  ScrollView,
  TextInput,
  Dimensions,
  Button,
  Alert,
} from 'react-native';
import firebase from 'firebase';
import { RFValue } from 'react-native-responsive-fontsize';
import DropDownPicker from 'react-native-dropdown-picker';

export default class CreateStory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      previewImage: 'image_1',
      dropdownHeight: 40,
    };
  }

  async addPost() {
    if (this.state.caption) {
      let postData = {
        preview_image: this.state.previewImage,
        caption: this.state.caption,
        title: this.state.title,
        author: firebase.auth().currentUser.displayName,
        created_on: new Date(),
        author_uid: firebase.auth().currentUser.uid,
        likes: 0,
        image: firebase.auth().currentUser.photoURL
      };
      console.log(postData);
      await firebase
        .database()
        .ref(
          "/posts/" +
            Math.random()
              .toString(36)
              .slice(2)
        )
        .set(postData)
        .then(function(snapshot) {});
      this.props.setUpdateToTrue();
      this.props.navigation.navigate('Feed');
    } else {
      Alert.alert(
        'Error',
        'All fields are required!',
        [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
        { cancelable: false }
      );
    }
  }

  componentDidMount() {
    this.fetchUser();
  }

  fetchUser = () => {
    let theme;
    firebase
      .database()
      .ref('/users/' + firebase.auth().currentUser.uid)
      .on('value', (snapshot) => {
        theme = snapshot.val().current_theme;
        this.setState({ light_theme: theme === 'light' });
      });
  };

  render() {
    let preview_images = {
      image_1: require('../assets/image_1.jpg'),
      image_2: require('../assets/image_3.jpg'),
      image_3: require('../assets/image_6.jpg'),
      image_4: require('../assets/image_5.jpg'),
      image_5: require('../assets/image_7.jpg'),
    };
    console.log(this.state.previewImage);
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: this.state.light_theme ? 'white' : '#15193c' },
        ]}>
        <SafeAreaView style={styles.droidSafeArea} />
        <View style={styles.appTitle}>
          <View
            style={[
              styles.appIcon,
              {
                backgroundColor: this.state.isEnabled ? 'transparent' : 'black',
              },
            ]}>
            <Image
              source={require('../assets/logo.png')}
              style={styles.iconImage}></Image>
          </View>
          <View style={styles.appTitleTextContainer}>
            <Text
              style={[
                styles.appTitleText,
                { color: this.state.light_theme ? 'black' : 'white' },
              ]}>
              New Post
            </Text>
          </View>
        </View>
        <View style={styles.fieldsContainer}>
          <Image
            source={preview_images[this.state.previewImage]}
            style={styles.previewImage}></Image>
          <ScrollView>
            <View
              style={{
                height: RFValue(this.state.dropdownHeight),
                width: '95%',
                alignSelf: 'center',
                marginBottom: this.state.dropdownHeight == 170 ? 50 : 5,
              }}>
              <DropDownPicker
                items={[
                  { label: 'Image 1', value: 'image_1' },
                  { label: 'Image 2', value: 'image_2' },
                  { label: 'Image 3', value: 'image_3' },
                  { label: 'Image 4', value: 'image_4' },
                  { label: 'Image 5', value: 'image_5' },
                ]}
                defaultValue={this.state.previewImage}
                containerStyle={{
                  height: 40,
                  borderRadius: RFValue(20),
                  marginBottom: RFValue(20),
                }}
                onOpen={() => {
                  this.setState({ dropdownHeight: 170 });
                }}
                onClose={() => {
                  this.setState({ dropdownHeight: 40 });
                }}
                style={{
                  backgroundColor: 'transparent',
                  borderColor: this.state.light_theme ? 'black' : 'white',
                }}
                itemStyle={{
                  justifyContent: 'flex-start',
                }}
                dropDownStyle={{
                  backgroundColor: this.state.light_theme ? '#eee' : '#2f345d',
                }}
                labelStyle={
                  this.state.light_theme
                    ? styles.dropdownLabelLight
                    : styles.dropdownLabel
                }
                arrowStyle={
                  this.state.light_theme
                    ? styles.dropdownLabelLight
                    : styles.dropdownLabel
                }
                onChangeItem={(item) =>
                  this.setState({
                    previewImage: item.value,
                  })
                }
              />
            </View>

            <TextInput
              style={[
                styles.inputFont,
                {
                  borderColor: this.state.light_theme ? 'black' : 'white',
                  color: this.state.light_theme ? 'black' : 'white',
                },
              ]}
              onChangeText={(title) => this.setState({ title })}
              placeholder={'Title'}
              placeholderTextColor={this.state.light_theme ? 'black' : 'white'}
            />

            <TextInput
              style={[
                styles.inputFont,
                styles.inputTextBig,
                {
                  borderColor: this.state.light_theme ? 'black' : 'white',
                  color: this.state.light_theme ? 'black' : 'white',
                },
              ]}
              onChangeText={(caption) => this.setState({ caption })}
              placeholder={'Caption'}
              multiline={true}
              numberOfLines={4}
              placeholderTextColor={this.state.light_theme ? 'black' : 'white'}
            />
          </ScrollView>
          <Button
            onPress={() => this.addPost()}
            title="Submit"
            color="#841584"
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  droidSafeArea: {
    marginTop:
      Platform.OS === 'android' ? StatusBar.currentHeight : RFValue(35),
  },
  appTitle: {
    flex: 0.07,
    flexDirection: 'row',
  },
  appIcon: {
    flex: 0.3,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
  },
  iconImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  dropdownLabel: {
    color: 'white',
    fontFamily: 'Bubblegum-Sans',
  },
  dropdownLabelLight: {
    color: 'black',
    fontFamily: 'Bubblegum-Sans',
  },
  appTitleTextContainer: {
    flex: 0.7,
    justifyContent: 'center',
  },
  appTitleText: {
    color: 'white',
    fontSize: RFValue(28),
  },
  fieldsContainer: {
    flex: 0.85,
  },
  previewImage: {
    width: '93%',
    height: RFValue(250),
    alignSelf: 'center',
    borderRadius: RFValue(10),
    marginVertical: RFValue(10),
    resizeMode: 'contain',
  },
  inputFont: {
    height: RFValue(40),
    borderColor: 'white',
    borderWidth: RFValue(1),
    borderRadius: RFValue(10),
    paddingLeft: RFValue(10),
    color: 'white',
    width: '95%',
    marginTop: RFValue(10),
    alignSelf: 'center',
    justifyContent: 'center',
  },
  inputTextBig: {
    padding: RFValue(5),
  },
});
