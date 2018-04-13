import React, { Component } from 'react';
import {
  View,
  Text
} from 'react-native';
import { connect } from 'react-redux';

/* Components */
import Card from './Card';
import EditButton from '../../Common/Button/EditButton';

/* Actions */
import { openProfileOccupationEditForm } from '../../../actions/';

// TODO: use redux instead of passed in props
class ProfileOccupationCard extends Component {

  handleEditOnPressed() {
    console.log('I am editing');
    this.props.openProfileOccupationEditForm();
  }

  renderEditButton() {
    if (this.props.canEdit) {
      return <EditButton onPress={() => this.handleEditOnPressed()} />;
    }
  }

  render() {
    const { elevatorPitch, occupation } = this.props.data.profile;
    return (
      <Card>
        <View style={styles.containerStyle}>
          <View style={styles.headerContainerStyle}>
            <Text style={styles.titleTextStyle}>Occupation</Text>
            <Text style={styles.headlineTextStyle}>
              {occupation}
            </Text>
            {this.renderEditButton()}
          </View>
          <View style={styles.detailContainerStyle}>
            <Text stye={styles.detailTextStyle}>{elevatorPitch}</Text>
          </View>

        </View>
      </Card>
    );
  }
}

const styles = {
  containerStyle: {
    display: 'flex',
    paddingTop: 15,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 15
  },
  headerContainerStyle: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 20
  },
  titleTextStyle: {
    fontSize: 23,
    marginRight: 10
  },
  occupationTextStyle: {
    fontSize: 15
  },
  detailContainerStyle: {
    display: 'flex',
    minHeight: 60
  },
  detailTextStyle: {
    fontSize: 20
  },
  buttonContainerStyle: {
    display: 'flex',
    flex: 1
  },
  editButtonStyle: {
    height: 23,
    width: 23,
    padding: 3,
    alignSelf: 'flex-end',
  }
};

const mapStateToProps = state => {
  const canEdit = state.profile.userId.toString() === state.user.userId.toString();
  console.log('current profile id: ', state.profile.userId);
  console.log('current user id: ', state.user.userId);
  console.log('result: ', canEdit);
  return {
    canEdit
  };
};

export default connect(
  mapStateToProps,
  {
    openProfileOccupationEditForm
  }
)(ProfileOccupationCard);
