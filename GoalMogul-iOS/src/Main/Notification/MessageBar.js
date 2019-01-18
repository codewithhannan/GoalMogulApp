/**
 * Notification Message Bar at the top when receiving the message
 */
import React from 'react';
import {
    View
} from 'react-native';

export default class extends React.Component {
  componentDidMount() {
    // Register the alert located on this master page
    // This MessageBar will be accessible from the current (same) component, and from its child component
    // The MessageBar is then declared only once, in your main component.
    
  }

  componentWillUnmount() {
    // Remove the alert located on this master page from the manager
    
  }

  render() {
    return (
        <View />
    );
  }
}
