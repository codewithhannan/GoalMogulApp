import axios from 'axios';
import { Image, ImageEditor } from 'react-native';
import Expo, { Permissions } from 'expo';
import _ from 'lodash';

const ImageTypes = ['ProfileImage', 'FeedImage', 'PageImage', 'GoalImage'];
const getImageUrl = (type) => {
  let imageType;
  if (!type) {
    imageType = 'ProfileImage';
  } else if (ImageTypes.some((oneType) => oneType === type)) {
    imageType = type;
  } else {
    throw new Error(`Image type: ${type} is not included`);
  }
  return `https://goalmogul-api-dev.herokuapp.com/api/secure/s3/${imageType}/signature`;
};

const ImageUtils = {
  getPresignedUrl(file, token, dispatch, type) {
    return new Promise((resolve, reject) => {
      const url = getImageUrl(type);
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
        resolve({ signedRequest, file });
      })
      .catch((err) => {
        console.log('error uploading: ', err);
        reject(err);
      });
    });
  },

  uploadImage(file, presignedUrl) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            // Successfully uploaded the file.
            console.log('Successfully uploading the file');
            resolve(xhr.responseText);
          } else {
            // The file could not be uploaded.
            reject(
              new Error(
                `Request failed. Status: ${xhr.status}. Content: ${xhr.responseText}`
              )
            );
          }
        }
      };
      xhr.open('PUT', presignedUrl);
      xhr.setRequestHeader('X-Amz-ACL', 'public-read');
      xhr.setRequestHeader('Content-Type', 'image/jpeg');
      xhr.send({ uri: file, type: 'image/jpeg' });
    });
  },

  getImageSize(file) {
    return new Promise(resolve => {
      Image.getSize(file, (width, height) => {
        resolve({ width, height });
      });
    });
  },

  resizeImage(file, width, height) {
    console.log('file to resize is: ', file);

    const cropData = {
      offset: { x: 0, y: 0 },
      size: {
        width,
        height,
      },
      displaySize: {
        width: 600 * (width > height ? 1 : width / height),
        height: 600 * (height > width ? 1 : height / width),
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
  },

  /**
	 * Upload image to S3 server
	 * @param(required) imageUri
	 * @param(required) token
	 * @param(required) dispatch
	 * @param(required) path
	 * @return
	 */
  upload(hasImageModified, imageUri, token, type, dispatch) {
    return new Promise((resolve, reject) => {
      if (!hasImageModified) {
        return resolve();
      }
      ImageUtils.getImageSize(imageUri)
        .then(({ width, height }) => {
          // Resize image
          return ImageUtils.resizeImage(imageUri, width, height);
        })
        .then((image) => {
          // Upload image to S3 server
          return ImageUtils.getPresignedUrl(image.uri, token, (objectKey) => {
            dispatch({
              type,
              payload: objectKey
            });
          });
        })
        .then(({ signedRequest, file }) => {
          return ImageUtils.uploadImage(file, signedRequest);
        })
        .then((res) => {
          if (res instanceof Error) {
            // uploading to s3 failed
            console.log('error uploading image to s3 with res: ', res);
            reject(res);
          }
          resolve();
        });
    });
  },
  async checkPermission(permissions) {
    const promises = permissions.map((value) => Permissions.getAsync(value));
    const status = await Promise.all(promises);

    const requestPromises = status.map((value, index) => {
      if (value.status !== 'granted') {
        return Permissions.askAsync(permissions[index]);
      }
      return '';
    });

    const filteredPromises = _.compact(requestPromises);
    const requestStatus = await Promise.all(filteredPromises);

    if (requestStatus.some((value) => value.status !== 'granted')) {
      alert('Please grant access to photos.');
      return false;
    }
    return true;
  }
};

export default ImageUtils;
