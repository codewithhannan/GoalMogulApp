import axios from 'axios';

const ImageUtils = {
    UploadImage(file, token) {
    return new Promise((resolve, reject) => {
      const url = 'https://goalmogul-api-dev.herokuapp.com/api/secure/s3/ProfileImage/signature';
      const param = {
        url,
        method: 'post',
        data: {
          fileType: 'image/jpeg',
          token
        }
      };

      axios(param)
        .then((res) => {
          const { objectKey, signedRequest } = res.data;
          console.log('url is: ', signedRequest);
          const options = {
            headers: {
              'Content-Type': 'image/jpeg'
            }
          };
          return axios.put(signedRequest, file, options);
        })
        .then((res) => {
          console.log('res from s3: ', res);
        })
        .catch((err) => {
          console.log('error uploading: ', err);
          reject();
        });
    });
  }
};

export default ImageUtils;
