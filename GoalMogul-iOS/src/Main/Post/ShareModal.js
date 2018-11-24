import React from 'react';
import {
  View,
  KeyboardAvoidingView,
  ScrollView,
  Image,
  Text,
  TextInput,
  SafeAreaView,
  TouchableOpacity
} from 'react-native';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { Actions, Stack, Scene } from 'react-native-router-flux';
import { connect } from 'react-redux';
import R from 'ramda';
import { switchCase } from '../../redux/middleware/utils';

// Components
import ModalHeader from '../Common/Header/ModalHeader';
import ViewableSettingMenu from '../Goal/ViewableSettingMenu';
import RefPreview from '../Common/RefPreview';

// Actions
import {
  cancelShare,
  submitShare
} from '../../redux/modules/feed/post/ShareActions';

// Assets
import defaultUserProfile from '../../asset/utils/defaultUserProfile.png';

// Constants
const DEBUG_KEY = '[ UI ShareModal ]';
const maxHeight = 200;

class ShareModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      height: 34
    };
  }

  componentDidMount() {
    this.initializeForm();
  }

  initializeForm() {
    this.props.initialize({
      privacy: 'Friends'
    });
  }

  handleCreate = (values) => {
    this.props.submitShare(this.props.formVals.values);
  }

  updateSize = (height) => {
    console.log('new height is: ', height);
    this.setState({
      height: Math.min(height, maxHeight)
    });
  }

  renderInput = ({
    input: { onChange, onFocus, value, ...restInput },
    editable,
    meta: { touched, error },
    placeholder,
    ...custom
  }) => {
    const inputStyle = {
      ...styles.inputStyle,
    };

    return (
      <SafeAreaView
        style={{
          backgroundColor: 'white',
          borderBottomWidth: 0.5,
          margin: 5,
          borderColor: 'lightgray'
        }}
      >
        <TextInput
          placeholder={placeholder}
          onChangeText={onChange}
          style={inputStyle}
          editable={editable}
          maxHeight={150}
          multiline
          value={value}
        />
      </SafeAreaView>
    );
  }
  // onContentSizeChange={(e) => this.updateSize(e.nativeEvent.contentSize.height)}

  // Render user info
  renderUserInfo(user) {
    const name = user && user.name ? user.name : 'Jordan Gardner';
    let imageUrl = user && user.profile ? user.profile.image : undefined;
    let profileImage = (
      <Image style={styles.imageStyle} resizeMode='contain' source={defaultUserProfile} />
    );
    if (imageUrl) {
      imageUrl = `https://s3.us-west-2.amazonaws.com/goalmogul-v1/${imageUrl}`;
      profileImage = <Image style={styles.imageStyle} source={{ uri: imageUrl }} />;
    }

    const callback = R.curry((value) => this.props.change('privacy', value));

    return (
      <View style={{ flexDirection: 'row', marginBottom: 15 }}>
        {profileImage}
        <View style={{ flexDirection: 'column', marginLeft: 15 }}>
          <Text style={{ fontSize: 18, marginBottom: 8 }}>
            {name}
          </Text>
          <ViewableSettingMenu
            viewableSetting={this.props.privacy}
            callback={callback}
            shareToMastermind={null}
          />
        </View>
      </View>
    );
  }

  renderContentHeader(shareTo) {
    const { item, name } = shareTo;
    const { shareToBasicTextStyle } = styles;
    // If share to event or tribe, item must not be null
    if (!item && name !== 'Feed') return '';

    // Select the item namef
    let nameToRender = '';
    if (name === 'Tribe') nameToRender = item.name;
    if (name === 'Event') nameToRender = item.title;

    const basicText = name === 'Feed' ? 'To' : `To ${name} `;

    const shareToComponent = switchCase({
      Feed: <Text style={shareToBasicTextStyle}>Feed</Text>,
      Tribe: (
        <ShareToComponent
          name={nameToRender}
          onPress={() => Actions.push('searchTribeLightBox')}
        />
      ),
      Event: (
        <ShareToComponent
          name={nameToRender}
          onPress={() => Actions.push('searchEventLightBox')}
        />
      )
    })('Feed')(name);

    return (
      <View
        style={{ marginTop: 10, marginLeft: 10, marginRight: 10, flexDirection: 'row', width: 200 }}
      >
        <Text style={shareToBasicTextStyle}>{basicText}</Text>
        {shareToComponent}
      </View>
    );
  }

  renderPost() {
    return (
      <View style={{ marginTop: 10 }}>
        <Field
          name='content'
          label=''
          component={this.renderInput}
          editable={!this.props.uploading}
          numberOfLines={10}
          style={styles.goalInputStyle}
          placeholder='Say something about this share'
        />
      </View>
    );
  }

  render() {
    const { handleSubmit, errors, user, shareTo, itemToShare, postType } = this.props;
    const modalTitle = shareTo.name !== 'feed'
      ? `Share to ${shareTo.name}`
      : 'Share to Feed';
    return (
      <KeyboardAvoidingView
        behavior='padding'
        style={{ flex: 1, backgroundColor: '#ffffff' }}
      >
        <ModalHeader
          title={modalTitle}
          actionText='Submit'
          onCancel={() => this.props.cancelShare()}
          onAction={handleSubmit(this.handleCreate)}
        />
        <ScrollView style={{ borderTopColor: '#e9e9e9', borderTopWidth: 1 }}>
          <View style={{ flex: 1, padding: 20 }}>
            {this.renderUserInfo(user)}
            {this.renderContentHeader(shareTo)}
            {this.renderPost()}
            <RefPreview item={itemToShare} postType={postType} />
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}

const mapStateToProps = state => {
  const selector = formValueSelector('shareModal');
  const { user } = state.user;
  const { itemToShare, postType } = state.newShare;

  return {
    user,
    shareTo: getShareTo(state),
    privacy: selector(state, 'privacy'),
    itemToShare,
    postType,
    formVals: state.form.shareModal,
    uploading: state.newShare.uploading
  };
};

const getShareTo = (state) => {
  const {
    belongsToTribe,
    belongsToEvent,
    belongsToTribeItem,
    belongsToEventItem,
  } = state.newShare;

  let destination = {
    name: 'Feed'
  };
  if (belongsToTribe && belongsToTribeItem) {
    console.log('tribe item is: ', belongsToTribeItem);
    destination = {
      name: 'Tribe',
      item: belongsToTribeItem
    };
  }
  if (belongsToEvent && belongsToEventItem) {
    destination = {
      name: 'Event',
      item: belongsToEventItem
    };
  }
  return destination;
};

const ShareToComponent = (props) => {
  const { name, onPress } = props;
  return (
    <TouchableOpacity
      style={styles.shareToContainerStyler}
      onPress={onPress}
    >
      <Text
        style={styles.shareToTextStyle}
        numberOfLines={1}
        ellipsizeMode='tail'
      >
        {name}
      </Text>
    </TouchableOpacity>
  );
};

const styles = {
  imageStyle: {
    height: 54,
    width: 54,
    borderRadius: 5,
  },
  inputStyle: {
    paddingTop: 6,
    paddingBottom: 6,
    padding: 13,
    backgroundColor: 'white',
    borderRadius: 22,
  },
  shareToBasicTextStyle: {
    fontSize: 12,
    padding: 5
  },
  shareToTextStyle: {
    fontSize: 12,
    fontWeight: '600',
    flexWrap: 'wrap',
    flex: 1,
  },
  shareToContainerStyler: {
    backgroundColor: 'lightgray',
    borderRadius: 4,
    maxWidth: 200,
    padding: 5
  }
};

ShareModal = reduxForm({
  form: 'shareModal',
  enableReinitialize: true
})(ShareModal);

export default connect(
  mapStateToProps,
  {
    cancelShare,
    submitShare
  }
)(ShareModal);
