/**
 * This is the about tab in Profile.js as one of the four tabs ['about', 'goals', 'posts', 'needs']
 *
 * It has two
 */

import React from "react";
import { ScrollView } from "react-native";

import ProfileInfoCard from "./ProfileCard/ProfileInfoCard";

class About extends React.PureComponent {
  render() {
    const { userId, pageId } = this.props;
    return (
      <ScrollView>
        <ProfileInfoCard userId={userId} pageId={pageId} />
      </ScrollView>
    );
  }
}

export default About;
