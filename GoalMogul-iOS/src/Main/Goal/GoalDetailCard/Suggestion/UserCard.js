import React from 'react';

import PeopleCard from '../../Common/PeopleCard';
import PeopleCardDetail from '../../Common/PeopleCardDetail';

const UserCard = (props) => {
  const { item } = props;
  return (
    <PeopleCard>
      <PeopleCardDetail item={item} />
    </PeopleCard>
  );
};

export default UserCard;
