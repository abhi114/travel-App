import AsyncStorage from '@react-native-async-storage/async-storage';

const LOGIN_IDS_KEY = 'LOGIN_IDS';

export const saveLoginId = async loginId => {
  try {
    const loginIds =
      JSON.parse(await AsyncStorage.getItem(LOGIN_IDS_KEY)) || {};

    // Update frequency or add the new login ID
    loginIds[loginId] = (loginIds[loginId] || 0) + 1;

    await AsyncStorage.setItem(LOGIN_IDS_KEY, JSON.stringify(loginIds));
  } catch (error) {
    console.error('Error saving login ID:', error);
  }
};

export const getMostUsedLoginId = async () => {
  try {
    const loginIds =
      JSON.parse(await AsyncStorage.getItem(LOGIN_IDS_KEY)) || {};
    const sortedLoginIds = Object.entries(loginIds).sort((a, b) => b[1] - a[1]);

    return sortedLoginIds.length > 0 ? sortedLoginIds[0][0] : null;
  } catch (error) {
    console.error('Error retrieving login ID:', error);
    return null;
  }
};
