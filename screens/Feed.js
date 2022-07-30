import React, { Component } from 'react';
import {
  Text,
  View,
  Platform,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Image,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import PostCard from './PostCard';
import firebase from 'firebase';
let posts = require('./temp_stories.json');

export default class Feed extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  fetchPosts = () => {
    firebase
      .database()
      .ref('/posts/')
      .on(
        'value',
        (snapshot) => {
          let posts = [];
          if (snapshot.val()) {
            Object.keys(snapshot.val()).forEach(function (key) {
              posts.push({
                key: key,
                value: snapshot.val()[key],
              });
            });
          }
          this.setState({ posts: posts });
          this.props.setUpdateToFalse();
        },
        function (errorObject) {
          console.log('The read failed: ' + errorObject.code);
        }
      );
  };

  renderItem = ({ item: post }) => {
    return <PostCard post={post} navigation={this.props.navigation} />;
  };

  keyExtractor = (item, index) => index.toString();

  componentDidMount() {
    this.fetchUser();
    this.fetchUser();
    this.fetchPosts();
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
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: this.state.light_theme ? 'white' : 'black' },
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
              Spectagram
            </Text>
          </View>
        </View>
        <View style={styles.cardContainer}>
          <FlatList
            keyExtractor={this.keyExtractor}
            data={this.state.posts}
            renderItem={this.renderItem}
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
  appTitleTextContainer: {
    flex: 0.8,
    justifyContent: 'center',
  },
  appTitleText: {
    color: 'white',
    fontSize: RFValue(28),
  },
  cardContainer: {
    flex: 0.85,
  },
});
