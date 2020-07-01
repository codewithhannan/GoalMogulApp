/**
 * Invite user card
 *
 * @format
 */

import React from 'react'
import { withStyles, Layout, Text, CheckBox } from '@ui-kitten/components'
import DelayedButton from '../../Common/Button/DelayedButton'
import { EVENT, trackWithProperties } from '../../../monitoring/segment'
import defaultProfilePic from '../../../asset/utils/defaultUserProfile.png'
import { IMAGE_BASE_URL } from '../../../Utils/Constants'
import { Image, View } from 'react-native'

class InviteUserCard extends React.PureComponent {
    onPress = (_id) => {
        trackWithProperties(EVENT.SEARCH_RESULT_CLICKED, {
            Type: 'people',
            Id: _id,
        })
        if (this.props.onSelect && this.props.onSelect instanceof Function) {
            return this.props.onSelect(_id, this.props.item)
        }
        this.props.openProfile(_id)
    }

    renderProfileImage(item) {
        const { profile } = item
        const { image } = profile

        let imageUrl
        if (image) {
            imageUrl =
                typeof image == 'string'
                    ? `${IMAGE_BASE_URL}${image}`
                    : imageUrl
        }
        return (
            <Layout style={{ marginLeft: 16, marginRight: 8 }}>
                <View style={styles.imageContainerStyle}>
                    <Image
                        source={
                            imageUrl ? { uri: imageUrl } : defaultProfilePic
                        }
                        style={
                            imageUrl
                                ? styles.imageStyle
                                : styles.defaultImageStyle
                        }
                    />
                </View>
            </Layout>
        )
    }

    render() {
        const { item } = this.props
        if (!item) return null

        const { _id, name, selected } = item
        return (
            <DelayedButton
                activeOpacity={0.7}
                onPress={() => this.onPress(_id)}
            >
                <Layout
                    style={[
                        {
                            flexDirection: 'row',
                            paddingVertical: 12,
                            paddingHorizontal: 16,
                            alignItems: 'center',
                        },
                    ]}
                >
                    <CheckBox
                        checked={selected == undefined ? false : selected}
                        onChange={() => this.onPress(_id)}
                    />
                    {this.renderProfileImage(item)}
                    <Text category="h6">{name}</Text>
                </Layout>
            </DelayedButton>
        )
    }
}

const styles = {
    imageContainerStyle: {
        borderWidth: 0.5,
        padding: 1.5,
        borderColor: 'lightgray',
        alignItems: 'center',
        height: 34,
        width: 34,
        borderRadius: 17,
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    imageStyle: {
        height: 34,
        width: 34,
        borderRadius: 17,
    },
    defaultImageStyle: {
        height: 26,
        width: 26,
        borderRadius: 13,
    },
}

/**
 * Map app theme to styles. These styles can be accessed
 * using the <eva> prop. For example,
 * const { eva } = this.props;
 * eva.style.container;
 * @see https://github.com/akveo/react-native-ui-kitten/blob/master/docs/src/articles/design-system/use-theme-variables.md
 *
 * Later on this function should be migrated to a centralized place
 */
const mapThemeToStyles = (theme) => ({
    backgroundPrimary: {
        backgroundColor: theme['color-primary-500'],
    },
    container: {
        backgroundColor: theme['color-card-background'],
        flex: 1,
    },
})
const StyledInviteUserCard = withStyles(InviteUserCard, mapThemeToStyles)
export default StyledInviteUserCard
