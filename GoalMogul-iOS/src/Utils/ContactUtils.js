import Expo from 'expo';

const pageSize = 100;

const ContactUtils = {

  async handleUploadContacts(token) {
    let pageOffset = 0;
    let uploadPromise = [];

    const total = await ContactUtils.getContactSize();
    console.log('total number of contact is: ', total);

    // TODO: revert this change
    for (pageOffset = 0; pageOffset < pageSize; pageOffset += pageSize) {
      console.log('page offset is: ', pageOffset);
      const contacts = await Expo.Contacts.getContactsAsync({
        fields: [
          Expo.Contacts.PHONE_NUMBERS,
          Expo.Contacts.EMAILS,
          Expo.Contacts.ADDRESSES,
          Expo.Contacts.NONGREGORIANBIRTHDAY,
          Expo.Contacts.SOCIAL_PROFILES,
          Expo.Contacts.IM_ADDRESSES,
          // Expo.Contacts.URLS,
          Expo.Contacts.DATES,
        ],
        pageSize,
        pageOffset,
      });
      uploadPromise.push(ContactUtils.uploadContacts(contacts.data, token));
    }

    return Promise.all(uploadPromise);
  },

  async getContactSize() {
    const contacts = await Expo.Contacts.getContactsAsync({
      fields: [],
      pageSize: 1,
      pageOffset: 0
    });
    return contacts.total;
  },

  /*
  @param contacts: [contact object]
  @param token: user token
  @return update result promise
  */
  uploadContacts(contacts, token) {
    // const url = 'https://goalmogul-api-dev.herokuapp.com/api/secure/user/contactSync/';
    const url = 'http://192.168.0.3:8081/api/secure/user/contactSync/';
    const headers = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-access-token': token
      },
      body: JSON.stringify({
        contactList: contacts
      })
    };

    return ContactUtils.custumeFetch(url, headers, null);
  },

  /**
  @param token: user token
  @return [user object]
  */
  async fetchMatchedContacts(token, skip, limit) {
    console.log('fetching matched contacts');
    // const url = `https://goalmogul-api-dev.herokuapp.com/api/secure/user/contactSync/stored-matches?limit=${limit}&skip=${skip}`;
    const url = `http://192.168.0.3:8081/api/secure/user/contactSync/stored-matches?limit=${limit}&skip=${skip}`;
    const headers = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-access-token': token
      }
    };

    return ContactUtils.custumeFetch(url, headers, null);
  },

  custumeFetch(url, headers, data) {
    return new Promise((resolve, reject) => {
      fetch(url, headers)
      .then((res) => res.json())
      .then((res) => {
        console.log('original res is: ', res);
        if (!res.message && res.success) {
          if (data) {
            return resolve(data);
          }
          return resolve(true);
        }
        // Update fails
        // reject(res.message);
        return resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
    });
  }
};

module.exports = {
  uploadContacts: ContactUtils.uploadContacts,
  handleUploadContacts: ContactUtils.handleUploadContacts,
  fetchMatchedContacts: ContactUtils.fetchMatchedContacts
};
