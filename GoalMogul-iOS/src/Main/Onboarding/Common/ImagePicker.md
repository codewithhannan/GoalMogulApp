# Image Picker

> An image picker allows user to either select an image from the local directory or take a picture. This action resolves with an image URL produced by the user.

## Usage
```javascript
import ImagePicker from './imagePicker';
```

You should replace `'./imagePicker'` with an applicable relative path.

Note that `ImagePicker` is self closing. Please do **NOT** assign children to this component.

## Props
| Prop Name            | Type         | Description        |
| -------------------- | ------------ | ------------------ |
| handleTakingPicture* | function     | Callback function involked when user chooses to take a picture. |
| handleCameraRoll*    | function     | Callback function involked when user chooses to select photo from the camera roll.  |
| imageUri             | string       | Uri of image to be displayed in this picker. |
| icon                 | image source | Icon displayed when no image is selected. |
| rounded              | boolean      | If true, ImagePicker will be rounded in appearence. |
| bordered             | boolean      | If true, ImagePicker will include a 2mm border of gray colour. |
