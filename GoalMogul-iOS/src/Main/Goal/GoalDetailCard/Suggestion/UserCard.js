import React from 'react';
import {
  TouchableOpacity
} from 'react-native';

// Components
import PeopleCard from '../../Common/PeopleCard';
import PeopleCardDetail from '../../Common/PeopleCardDetail';

const UserCard = (props) => {
  const { item, onCardPress } = props;
  return (
    <TouchableOpacity onPress={() => onCardPress(item)}>
      <PeopleCard>
        <PeopleCardDetail item={item} />
      </PeopleCard>
    </TouchableOpacity>
  );
};

export default UserCard;
