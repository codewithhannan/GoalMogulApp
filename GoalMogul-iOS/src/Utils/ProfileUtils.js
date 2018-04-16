const ProfileUtils = {
  updateAccount(values) {
    const {
      name,
      email,
      headline,
      token
    } = values;

    const user = {
      name,
      email,
      headline
    };

    const url = 'https://goalmogul-api-dev.herokuapp.com/api/secure/user/account';
    const headers = {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        name,
        headline,
        token
      })
    };

    return ProfileUtils.custumeFetch(url, headers, user);
  },

  updateProfile(values) {
    const {
      image,
      about,
      occupation,
      elevatorPitch,
      token
    } = values;

    const profile = {
      image,
      about,
      occupation,
      elevatorPitch
    };

    const url = 'https://goalmogul-api-dev.herokuapp.com/api/secure/user/profile';
    const headers = {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        image,
        about,
        occupation,
        elevatorPitch,
        token
      })
    };

    return ProfileUtils.custumeFetch(url, headers, profile);
  },

  updatePassword(values) {
    const { oldPassword, newPassword, token } = values;
    const url = 'https://goalmogul-api-dev.herokuapp.com/api/secure/user/account/password';
    const headers = {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        oldPassword,
        newPassword,
        token
      })
    };
    return ProfileUtils.custumeFetch(url, headers, null);
  },

  custumeFetch(url, headers, data) {
    return new Promise((resolve, reject) => {
      fetch(url, headers)
      .then((res) => res.json())
      .then((res) => {
        if (!res.message && res.success) {
          if (data) {
            return resolve(data);
          }
          return resolve(true);
        }
        // Update fails
        reject(res.message);
      })
      .catch((err) => {
        reject(err);
      });
    });
  }
};

module.exports = {
  updateProfile: ProfileUtils.updateProfile,
  updateAccount: ProfileUtils.updateAccount,
  updatePassword: ProfileUtils.updatePassword
};
