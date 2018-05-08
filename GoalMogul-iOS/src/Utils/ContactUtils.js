const ContactUtils = {
  /*
  @param contacts: [contact object]
  @param token: user token
  @return update result promise
  */
  uploadContacts(contacts, token) {
    const url = 'https://goalmogul-api-dev.herokuapp.com/api/secure/user/account/contactSync/';
    const headers = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contactList: contacts,
        token
      })
    };

    return ContactUtils.custumeFetch(url, headers, null);
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
  uploadContacts: ContactUtils.uploadContacts,
};
