import React from 'react';
import {
  View,
  KeyboardAvoidingView,
  ScrollView,
  Image,
  Text,
  TextInput,
  SafeAreaView
} from 'react-native';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import R from 'ramda';

// Components
import ModalHeader from '../Common/Header/ModalHeader';
import ViewableSettingMenu from '../Goal/ViewableSettingMenu';

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
    // const values = [{}];

    this.props.initialize({
      // steps: [...values],
      // needs: [...values],
      // media: undefined
      privacy: 'Friends'
    });
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
    ...custom
  }) => {
    const { height } = this.state;

    const inputStyle = {
      ...styles.inputStyle,
      height: Math.max(30, height + 3)
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
          placeholder="Say something about this share"
          onChangeText={onChange}
          style={inputStyle}
          editable={editable}
          maxHeight={maxHeight}
          multiline
          value={value}
          onContentSizeChange={(e) => this.updateSize(e.nativeEvent.contentSize.height)}
        />
      </SafeAreaView>
    );
  }

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

  renderPost() {
    return (
      <View style={{ marginTop: 10 }}>
        <Field
          name='content'
          label=''
          component={this.renderInput}
          editable={this.props.uploading}
          numberOfLines={10}
          style={styles.goalInputStyle}
          placeholder='What are you trying to achieve?'
        />
      </View>
    );
  }

  render() {
    const { handleSubmit, errors, user, modalTitle } = this.props;
    return (
      <KeyboardAvoidingView
        behavior='padding'
        style={{ flex: 1, backgroundColor: '#ffffff' }}
      >
        <ModalHeader
          title={modalTitle}
          actionText='Submit'
          onCancel={() => this.props.cancelShare()}
          onAction={handleSubmit(this.props.submitShare)}
        />
        <ScrollView style={{ borderTopColor: '#e9e9e9', borderTopWidth: 1 }}>
          <View style={{ flex: 1, padding: 20 }}>
            {this.renderUserInfo(user)}
            {this.renderPost()}
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}

const mapStateToProps = state => {
  const selector = formValueSelector('shareModal');
  const { user } = state.user;

  return {
    user,
    modalTitle: getModalTitle(state),
    privacy: selector(state, 'privacy'),
  };
};

const getModalTitle = (state) => {
  const {
    belongsToTribe,
    belongsToEvent,
    belongsToTribeItem,
    belongsToEventItem,
  } = state.newShare;

  const whoami = 'Your ';
  let title = `${whoami} feed`;
  if (belongsToTribe && belongsToTribeItem) {
    title = `${whoami} tribe ${belongsToTribeItem.name}`;
  }
  if (belongsToEvent && belongsToEventItem) {
    title = `${whoami} tribe ${belongsToEventItem.title}`;
  }
  return title;
};

const styles = {
  imageStyle: {
    height: 54,
    width: 54,
    borderRadius: 5,
  },
  inputStyle: {
    paddingTop: 6,
    paddingBottom: 2,
    padding: 13,
    backgroundColor: 'white',
    borderRadius: 22,
  },
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
