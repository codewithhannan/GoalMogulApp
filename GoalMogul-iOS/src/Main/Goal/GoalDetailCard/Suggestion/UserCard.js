import React from 'react';
import {
  TouchableOpacity
} from 'react-native';

// Components
import PeopleCard from '../../Common/PeopleCard';
import PeopleCardDetail from '../../Common/PeopleCardDetail';
import Check from '../../../Common/Check';

const UserCard = (props) => {
  const { item, onCardPress, selected } = props;
  return (
    <TouchableOpacity
      onPress={() => onCardPress(item)}
      style={{
        flexDirection: 'row',
        justifyContent: 'center'
      }}
    >
      <Check selected={selected} />
      <PeopleCard>
        <PeopleCardDetail item={item} />
      </PeopleCard>
    </TouchableOpacity>
  );
};

export default UserCard;
