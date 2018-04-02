import axios from 'axios';
import { Image, ImageEditor } from 'react-native';

const ImageUtils = {
  uploadImage(file, token, dispatch) {
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
          dispatch(objectKey);
          // console.log('signed request: ', signedRequest);

          const request = {
            url: signedRequest,
            data: {
              uri: file,
              type: 'image/jpeg'
            },
            method: 'PUT',
            headers: {
                'Content-Type': 'image/jpeg',
                'x-amz-acl': 'public-read'
            },
          };
          return axios.put(request);
          // return resolve(5)
        })
        .then((res) => {
          // console.log('res from s3: ', res);
        })
        .catch((err) => {
          console.log('error uploading: ', err);
          reject();
        });
    });
  },

  getImageSize(file) {
    return new Promise(resolve => {
      Image.getSize(file, (width, height) => {
        // console.log('width is: ', width, ' height is: ', height);
        resolve({ width, height });
      });
    });
  },

  resizeImage(file, width, height) {
    const cropData = {
      offset: { x: 0, y: 0 },
      size: {
        width,
        height,
      },
      displaySize: {
        width: 750 * (width > height ? 1 : width / height),
        height: 750 * (height > width ? 1 : height / width),
      },
      resizeMode: 'cover',
    };

    // get info for original image
    const fileType = 'jpeg';

    const promise = new Promise(resolve => {
      ImageEditor.cropImage(
        file,
        cropData,
        success => {
          resolve({
            uri: success,
            name: `photo.${fileType}`,
            type: `image/${fileType}`,
          });
        },
        err => {
          console.log('edited err: ', err);
        }
      );
    });

    return promise;
  }
};

export default ImageUtils;
