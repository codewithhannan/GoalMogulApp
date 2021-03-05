<!-- @format -->

# Image Picker

> An image picker allows user to either select an image from the local directory or take a picture. This action resolves with an image URL produced by the user.

## Usage

```javascript
import ImagePicker from './imagePicker'
```

You should replace `'./imagePicker'` with an applicable relative path.

Note that `ImagePicker` is self closing. Please do **NOT** assign children to this component.

## Props

| Prop Name             | Type         | Description                                                                        |
| --------------------- | ------------ | ---------------------------------------------------------------------------------- |
| handleTakingPicture\* | function     | Callback function involked when user chooses to take a picture.                    |
| handleCameraRoll\*    | function     | Callback function involked when user chooses to select photo from the camera roll. |
| imageUri              | string       | Uri of image to be displayed in this picker.                                       |
| icon                  | image source | Icon displayed when no image is selected.                                          |
| rounded               | boolean      | If true, ImagePicker will be rounded in appearence.                                |
| bordered              | boolean      | If true, ImagePicker will include a 2mm border of gray colour.                     |

\* required props

## Examples

To effectively use the `ImagePicker` component, we complement the use of two action creators:

```javascript
import { openCamera, openCameraRoll } from '../../actions'
```

Currently, `'../../actions'` refers to the actions folder found directly under `src`.

We will also use `profilePic` from the redux store in this example, as the following:

```javascript
const mapStateToProps = (state) => {
    const { profilePic } = state.registration

    return { profilePic }
}
```

### Creating a simple ImagePicker

```jsx
<ImagePicker
    handleTakingPicture={openCamera}
    handleCameraRoll={openCameraRoll}
    imageUri={profilePic}
/>
```

As Jia Zeng handles the update of `profilePic`, once the user obtains an image through `openCamera` or `openCameraRoll`, `profilePic` is updated with the uri of the image, hence the `ImagePicker` will show the correct image.

### Changing the Appearence

When we want a circular image picker, or when we want an image picker with border, or perhaps both, we use the props `rounded` and `bordered`. For example:

```jsx
<ImagePicker
    handleTakingPicture={openCamera}
    handleCameraRoll={openCameraRoll}
    imageUri={profilePic}
    rounded
    bordered
/>
```
