import * as Contacts from "expo-contacts";
import * as FileSystem from "expo-file-system";

import { api as API, BASE_API_URL } from "../redux/middleware/api";

const pageSize = 3;
const DEBUG_KEY = "[ Utils ContactUtils ]";

const ContactUtils = {
  async handleUploadContacts(token, loadContactCallback) {
    let pageOffset = 0;
    let uploadPromise = [];
    console.log(`${DEBUG_KEY}: [ handleUploadContacts ]`);

    const total = await ContactUtils.getContactSize();
    console.log("total number of contact is: ", total);

    // TODO: revert this change
    // for (pageOffset = 0; pageOffset < 24; pageOffset += pageSize) {
    // console.log('page offset is: ', pageOffset);
    // const contacts = await Expo.Contacts.getContactsAsync({
    //   fields: [
    //     Expo.Contacts.PHONE_NUMBERS,
    //     Expo.Contacts.EMAILS,
    //     Expo.Contacts.ADDRESSES,
    //     // Expo.Contacts.NONGREGORIANBIRTHDAY,
    //     Expo.Contacts.SOCIAL_PROFILES,
    //     Expo.Contacts.IM_ADDRESSES,
    //     // Expo.Contacts.URLS,
    //     Expo.Contacts.DATES,
    //   ]
    // });
    const contacts = await Contacts.getContactsAsync();
    console.log(
      `${DEBUG_KEY}: [ handleUploadContacts ] contacts load with length: `,
      contacts && contacts.data ? contacts.data.length : 0
    );
    uploadPromise.push(ContactUtils.uploadContacts(contacts.data, token));
    // }

    // Pass loaded contacts through callback to reducer. This is currently passed in through MeetActions
    if (loadContactCallback && contacts && contacts.data) {
      loadContactCallback(contacts.data);
    }

    return Promise.all(uploadPromise);
  },

  async getContactSize() {
    const contacts = await Contacts.getContactsAsync({
      fields: [],
      pageSize: 1,
      pageOffset: 0,
    });
    return contacts.total;
  },

  /*
  @param contacts: [contact object]
  @param token: user token
  @return update result promise
  */
  uploadContacts(contacts, token) {
    return new Promise((resolve, reject) => {
      const url = `${BASE_API_URL}secure/user/contactsync`;

      const contactListJSONString = JSON.stringify(contacts);
      const uri = `${FileSystem.documentDirectory}contactsList.txt`;

      FileSystem.writeAsStringAsync(uri, contactListJSONString)
        .then(() => {
          var formData = new FormData();
          formData.append("contactList", {
            uri,
            name: "contactsList.txt",
            type: "text/plain",
          });

          const xhr = new XMLHttpRequest();
          xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
              if (xhr.status === 200) {
                // Successfully uploaded the file.
                console.log(
                  `${DEBUG_KEY}: [ uploadContacts ]: Successfully uploading the file with res:`,
                  xhr
                );
                resolve(xhr.responseText);
              } else {
                // The file could not be uploaded.
                console.log(
                  `${DEBUG_KEY}: [ uploadContacts ]: failed uploading the file with res:`,
                  xhr
                );
                reject(
                  new Error(
                    `Request failed. Status: ${xhr.status}. Content: ${xhr.responseText}.`
                  )
                );
              }
            }
          };
          xhr.open("POST", url, true);
          xhr.setRequestHeader("x-access-token", token);
          xhr.setRequestHeader("Content-Type", "multipart/form-data");
          xhr.send(formData);
        })
        .catch((err) => reject(err));
    });
  },

  /**
  @param token: user token
  @return [user object]
  */
  async fetchMatchedContacts(token, skip, limit) {
    console.log(`${DEBUG_KEY}: [ fetchMatchedContacts ]`);
    const url = `${BASE_API_URL}secure/user/contactSync/stored-matches`;
    // const url = `https://goalmogul-api-dev.herokuapp.com/api/secure/user/contactSync/stored-matches?limit=${limit}&skip=${skip}`;
    // const url = `http://192.168.0.3:8081/api/secure/user/contactSync/stored-matches?limit=${limit}&skip=${skip}`;
    const headers = {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-access-token": token,
      },
    };
    return ContactUtils.custumeFetch(url, headers, null);
  },

  custumeFetch(url, headers, data) {
    return new Promise((resolve, reject) => {
      fetch(url, headers)
        .then((res) => {
          if (!res.ok || !res.status === 200) {
            console.log(`${DEBUG_KEY}: [ custumeFetch ] header:`, headers);
            console.log(`${DEBUG_KEY}: [ custumeFetch ] url:`, url);
            console.log(
              `${DEBUG_KEY}: [ custumeFetch ] fetch failed with status:`,
              res.status
            );
            console.log(
              `${DEBUG_KEY}: [ custumeFetch ] fetch failed with res:`,
              res
            );
          }
          return new Promise(async (resol, rej) => {
            res
              .json()
              .then((resData) => {
                resol({
                  ...resData,
                  status: res.status,
                });
              })
              .catch((err) => {
                rej(err);
              });
          });
        })
        .then((res) => {
          // console.log(`${DEBUG_KEY}: original res is: `, res);
          if (res.status === 200 || res.data) {
            return resolve(res);
          }

          console.log(`${DEBUG_KEY}: failed headers: `, headers);
          console.log(`${DEBUG_KEY}: failed data: `, data);
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
  },
};

module.exports = {
  uploadContacts: ContactUtils.uploadContacts,
  handleUploadContacts: ContactUtils.handleUploadContacts,
  fetchMatchedContacts: ContactUtils.fetchMatchedContacts,
};
