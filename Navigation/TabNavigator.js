import React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { StyleSheet } from 'react-native';
import CreatePost from '../screens/CreatPost';
import { RFValue } from 'react-native-responsive-fontsize';
import Feed from '../screens/Feed';
import firebase from 'firebase';

const Tab = createMaterialBottomTabNavigator();

export default class BottomTabNavigator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isUpdated: false
      };
  }

  renderFeed = props => {
    return <Feed setUpdateToFalse={this.removeUpdated} {...props} />;
  };

  renderPost = props => {
    return <CreatePost setUpdateToTrue={this.changeUpdated} {...props} />;
  };

  changeUpdated = () => {
    this.setState({ isUpdated: true });
  };

  removeUpdated = () => {
    this.setState({ isUpdated: false });
  };
  
  componentDidMount() {
    this.fetchUser();
    this.fetchUser();
  }

  fetchUser = () => {
    let theme;
    firebase
      .database()
      .ref("/users/" + firebase.auth().currentUser.uid)
      .on("value", snapshot => {
        theme = snapshot.val().current_theme;
        this.setState({ light_theme: theme === "light" });
      });
  };

  render() {
    return (
      <Tab.Navigator
        labeled={false}
        barStyle={[styles.bottomTabStyle,{backgroundColor:this.state.light_theme ? "#a0a0a0" : "#1f549d"}]}
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Feed') {
              iconName = focused ? 'book' : 'book-outline';
            } else if (route.name === 'CreatePost') {
              iconName = focused ? 'create' : 'create-outline';
            }
            return (
              <Ionicons
                name={iconName}
                size={RFValue(30)}
                color={color}
                style={styles.icons}
              />
            );
          },
        })}
        tabBarOptions={{
          activeTintColor: 'tomato',
          inactiveTintColor: 'gray',
        }}>
        <Tab.Screen
          name="Feed"
          component={this.renderFeed}
          options={{ unmountOnBlur: true }}
        />
        <Tab.Screen
          name="CreatePost"
          component={this.renderPost}
          options={{ unmountOnBlur: true }}
        />
      </Tab.Navigator>
    );
  }
}

const styles = StyleSheet.create({
  bottomTabStyle: {
    height: '8%',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    overflow: 'hidden',
    position: 'absolute',
  },
  icons: {
    width: RFValue(30),
    height: RFValue(30),
    marginTop: -4,
  },
});
