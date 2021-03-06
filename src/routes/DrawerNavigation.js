import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import React from 'react';
import { Image, Text, TouchableHighlight, View, StyleSheet, Alert } from 'react-native';
import PropTypes from 'prop-types';
import { sessionService } from 'redux-react-native-session';
import { Avatar } from 'react-native-paper';
import APP_CONSTANTS from '../utils/appConstants/AppConstants';
import { Button } from '../utils/reusableComponents';
import Storage from '../utils/Storage';
import { userLogout } from '../redux/user/userAction';
import { Pressable } from 'react-native';

const {
  IMAGES: { iconDrawerHome, iconTabBooking, iconWallet },
} = APP_CONSTANTS;

const styles = StyleSheet.create({
  drwerHeader: {
    display: 'flex',
    flexDirection: 'column',
  },
  menuTitle: {
    marginLeft: 10,
    color: '#fff',
  },
  menuLabelFlex: {
    display: 'flex',
    flexDirection: 'row',
  },
  userName: {
    color: '#fff',
    fontSize: 18,
  },
  divider: {
    borderBottomColor: 'white',
    opacity: 0.2,
    borderBottomWidth: 1,
    margin: 15,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  avatarText: {
    width: 60,
    height: 60,
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 30,
  },
  avatarContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    margin: 20,
    marginBottom: 10,
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    margin: 10,
    marginBottom: 10,
  },
});

drawerData = [
  {
    name: 'Home',
    path: 'home',
    icon: iconDrawerHome,
  },
  {
    name: 'Bookings',
    path: 'bookings',
    icon: iconTabBooking,
  },
  {
    name: 'Commissions',
    path: 'wallet',
    icon: iconWallet,
  },
  //   {
  //     name: 'Mason',
  //     path: 'mason',
  //     icon: iconMason,
  //   },
  //   {
  //     name: 'Carpenter',
  //     path: 'carpenter',
  //     icon: iconCarpenter,
  //   },
  //   {
  //     name: 'Electrician',
  //     path: 'electrician',
  //     icon: iconElectrician,
  //   },
  //   {
  //     name: 'Plumber',
  //     path: 'plumber',
  //     icon: iconPlumber,
  //   },
  //   {
  //     name: 'Painter',
  //     path: 'painter',
  //     icon: iconPainter,
  //   },
  //   {
  //     name: 'Welder',
  //     path: 'welder',
  //     icon: iconWelder,
  //   },
  //   {
  //     name: 'Tiles / Stones / Flooring',
  //     path: 'tiles',
  //     icon: iconTiles,
  //   },
  //   {
  //     name: 'Home Decoration',
  //     path: 'home-decor',
  //     icon: iconHomeDecor,
  //   },
];

export default function RenderDrawer(props) {
  const {
    IMAGES: { iconLogin, iconLogout, iconSignup, iconSettings },
  } = APP_CONSTANTS;
  const { navigation, authenticated, user, dispatch } = props;
  const handleLogout = async () => {
    dispatch(userLogout());
    await sessionService.deleteSession();
    await sessionService.deleteUser();
    await Storage.clearStorage();
    Alert.alert(
      'Success',
      'You have logged out successfully!',
      [{ text: 'OK', onPress: () => navigation.navigate('home') }],
      { cancelable: false },
    );
  };
  return (
    <DrawerContentScrollView {...props} style={{ padding: 0 }}>
      <View style={styles.drawerHeader}>
        {authenticated ? (
          <View style={styles.avatarContainer}>
            <Pressable onPress={() => navigation.navigate('profile')}>
              {user?.image ? (
                <Avatar.Image style={styles.avatar} source={{ uri: user?.image }} />
              ) : (
                <Avatar.Text
                  style={styles.avatarText}
                  label={user?.name && user?.name.slice(0, 1)}
                />
              )}
            </Pressable>
            <View style={{ paddingLeft: 15 }}>
              <Text style={styles.userName}>{`Hi! ${user.name}`}</Text>
              <Text style={{ color: '#4BC1FD' }}>{user.username}</Text>
            </View>
          </View>
        ) : (
          <View style={styles.avatarContainer}>
            <TouchableHighlight onPress={() => navigation.navigate('login')}>
              <Avatar.Icon style={styles.avatarText} icon="account" />
            </TouchableHighlight>
            <View style={{ paddingLeft: 15 }}>
              <Text style={styles.userName}>Welcome, Guest!</Text>
            </View>
          </View>
        )}
        {!authenticated ? (
          <View style={styles.buttonContainer}>
            <Button
              bordered
              rounded
              caption="Login"
              icon={iconLogin}
              onPress={() => {
                navigation.navigate('login');
              }}
            />
            <Button
              bordered
              rounded
              caption="Signup"
              icon={iconSignup}
              onPress={() => {
                navigation.navigate('register');
              }}
            />
          </View>
        ) : (
          <View style={styles.buttonContainer}>
            <Button bordered rounded caption="Logout" icon={iconLogout} onPress={handleLogout} />
          </View>
        )}
      </View>
      <View style={styles.divider} />
      {drawerData.map((item, idx) => (
        <DrawerItem
          key={`drawer_item-${idx + 1}`}
          label={() => (
            <View style={styles.menuLabelFlex}>
              <Image style={{ width: 20, height: 20 }} source={item.icon} />
              <Text style={styles.menuTitle}>{item.name}</Text>
            </View>
          )}
          onPress={() => navigation.navigate(item.path)}
        />
      ))}
      <View style={styles.divider} />
      <DrawerItem
        label={() => (
          <View style={styles.menuLabelFlex}>
            <Image style={{ width: 20, height: 20 }} source={iconSettings} />
            <Text style={styles.menuTitle}>Settings</Text>
          </View>
        )}
        onPress={() => navigation.navigate('setting')}
      />
    </DrawerContentScrollView>
  );
}

RenderDrawer.propTypes = {
  navigation: PropTypes.oneOfType([PropTypes.object]).isRequired,
  authenticated: PropTypes.bool.isRequired,
  user: PropTypes.oneOfType([PropTypes.object]).isRequired,
  dispatch: PropTypes.func.isRequired,
};
