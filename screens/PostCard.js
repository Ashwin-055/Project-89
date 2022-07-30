import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  StatusBar,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import firebase from 'firebase';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RFValue } from 'react-native-responsive-fontsize';

export default class PostCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      post_id: this.props.post.key,
      post_data: this.props.post.value,
      is_liked: false,
      likes: this.props.post.value.likes,
    };
  }

  likeAction = () => {
    if (this.state.is_liked) {
      firebase
        .database()
        .ref('/posts/')
        .child(this.state.post_id)
        .child('likes')
        .set(firebase.database.ServerValue.increment(-1));
      this.setState({
        likes: (this.state.likes -= 1),
        is_liked: false,
      });
    } else {
      firebase
        .database()
        .ref('/posts/')
        .child(this.state.post_id)
        .child('likes')
        .set(firebase.database.ServerValue.increment(1));
      this.setState({
        likes: (this.state.likes += 1),
        is_liked: true,
      });
    }
  };

  componentDidMount() {
    this.fetchUser();
    this.fetchUser();
  }

  fetchUser = () => {
    let theme;
    firebase
      .database()
      .ref('/users/' + firebase.auth().currentUser.uid)
      .on('value', (snapshot) => {
        theme = snapshot.val().current_theme;
        this.setState({
          light_theme: theme === 'light',
        });
      });
  };

  render() {
    let post = this.state.post_data;
    let post_id = this.state.post_id;
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={() =>
          this.props.navigation.navigate('PostScreen', {
            post: post,
            post_id: post_id,
          })
        }>
        <View style={styles.container}>
          <View
            style={[
              styles.cardContainer,
              {
                backgroundColor: this.state.light_theme
                  ? 'lightgrey'
                  : '#2f345d',
              },
            ]}>
            <View
              style={[
                styles.authorContainer,
                {
                  backgroundColor: this.state.light_theme ? 'grey' : '#2f349f',
                },
              ]}>
              <View style={styles.authorImageContainer}>
                <Image
                  source={{
                    uri: post.image,
                  }}
                  style={styles.profileImage}></Image>
              </View>
              <View style={styles.authorNameContainer}>
                <Text style={styles.authorNameText}>{post.author}</Text>
              </View>
            </View>
            <Image
              source={require('../assets/post.jpeg')}
              style={styles.postImage}></Image>
            <View
              style={[
                styles.captionContainer,
                {
                  backgroundColor: this.state.light_theme ? 'grey' : '#2f349f',
                },
              ]}>
              <Text style={styles.captionText}>Title: {post.title}</Text>
            </View>
            <View
              style={[
                styles.captionContainer,
                {
                  backgroundColor: this.state.light_theme ? 'grey' : '#2f349f',
                },
              ]}>
              <Text style={styles.captionText}>
                {post.caption.slice(0, 10)}...
              </Text>
            </View>
            <View style={styles.actionContainer}>
              <TouchableOpacity
                style={styles.likeButton}
                onPress={() => this.likeAction()}>
                <Ionicons name={'heart'} size={RFValue(30)} color={'white'} />
                <Text style={styles.likeText}>{this.state.likes}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardContainer: {
    margin: RFValue(13),
    borderRadius: RFValue(20),
  },
  postImage: {
    resizeMode: 'contain',
    width: '95%',
    alignSelf: 'center',
    height: RFValue(250),
  },
  profileImage: {
    width: (Dimensions.get('window').width * 10) / 100,
    height: (Dimensions.get('window').width * 10) / 100,
    borderRadius: 500,
  },
  authorImageContainer: {
    borderRadius: RFValue(200),
    alignSelf: 'center',
    paddingLeft: '5%',
  },
  authorContainer: {
    marginTop: (Dimensions.get('window').width * 3) / 100,
    borderRadius: RFValue(20),
    flexDirection: 'row',
    height: (Dimensions.get('window').width * 15) / 100,
  },
  authorNameContainer: {
    alignSelf: 'center',
    paddingLeft: '5%',
  },
  authorNameText: {
    fontSize: RFValue(18),
    color: 'white',
    fontWeight: 'bold',
  },
  captionContainer: {
    marginLeft: RFValue(20),
    marginRight: RFValue(20),
    marginTop: RFValue(20),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  captionText: {
    fontSize: RFValue(20),
    color: 'white',
    textAlign: 'center',
  },
  actionContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: RFValue(10),
  },
  likeButton: {
    width: RFValue(160),
    height: RFValue(40),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#eb3948',
    borderRadius: RFValue(30),
  },
  likeText: {
    color: 'white',
    fontFamily: 'Bubblegum-Sans',
    fontSize: RFValue(25),
    marginLeft: RFValue(5),
  },
});
