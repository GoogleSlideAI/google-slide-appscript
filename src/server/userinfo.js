export const getUserInfo = () => {
  const userEmail = Session.getActiveUser().getEmail();
  
  // Get user profile information using People API
  const url = 'https://www.googleapis.com/oauth2/v1/userinfo?alt=json';
  const response = UrlFetchApp.fetch(url, {
    headers: {
      Authorization: 'Bearer ' + ScriptApp.getOAuthToken()
    },
    muteHttpExceptions: true
  });
  
  if (response.getResponseCode() === 200) {
    const userInfo = JSON.parse(response.getContentText());
    return {
      email: userEmail,
      name: userInfo.name || '',
      givenName: userInfo.given_name || '',
      familyName: userInfo.family_name || '',
      pictureUrl: userInfo.picture || '',
      locale: userInfo.locale || '',
      id: userInfo.id || ''
    };
  } else {
    // Fallback to just email if profile fetch fails
    return {
      email: userEmail,
      name: '',
      givenName: '',
      familyName: '',
      pictureUrl: '',
      locale: '',
      id: ''
    };
  }
};

// Optional: Add a function to get just the profile picture URL
export const getUserProfilePicture = () => {
  try {
    const userInfo = getUserInfo();
    return userInfo.pictureUrl;
  } catch (error) {
    console.error('Error getting user profile picture:', error);
    return '';
  }
};

