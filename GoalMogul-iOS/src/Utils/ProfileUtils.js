import _ from 'lodash';
const ProfileUtils = {
    updateAccount(values) {
        const {
            name,
            headline,
            token
        } = values;

        const user = {
            name,
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
            location,
            elevatorPitch,
            token
        } = values;

        let profile = {
            image,
            about,
            occupation,
            location,
            elevatorPitch
        };

        Object.keys(profile).forEach((key) =>
            (profile[key] == undefined || profile[key] == null || _.isEmpty(profile[key])) && delete profile[key]);

        const url = 'https://goalmogul-api-dev.herokuapp.com/api/secure/user/profile';
        const headers = {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ...profile,
                token
            })
        };

        return ProfileUtils.custumeFetch(url, headers, profile);
    },

    updatePassword(values) {
        const { oldPassword, newPassword, token } = values;
        console.log('in utils old password is: ', oldPassword);
        console.log('in utils new password is: ', newPassword);
        console.log('in utils values is: ', values);
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
