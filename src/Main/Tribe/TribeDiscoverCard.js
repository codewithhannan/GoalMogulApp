/**
 * Tribe discover page card
 * @format
 */
import React from 'react'
import { connect } from 'react-redux'
import DelayedButton from '../Common/Button/DelayedButton'
import { getImageOrDefault, decode } from '../../redux/middleware/utils'
import tribe_default_icon from '../../asset/utils/tribeIcon.png'
import { View, Image, Dimensions, Text } from 'react-native'
import { Icon } from '@ui-kitten/components'
import { color, default_style, text } from '../../styles/basic'
import { tribeDetailOpen } from '../../redux/modules/tribe/MyTribeActions'

const { width } = Dimensions.get('window')
class TribeDiscoverCard extends React.PureComponent {
    render() {
        const { onPress, item, canSelect } = this.props
        const { selected, name, picture, description, memberCount } = item
        const containerStyle = selected
            ? styles.tribeCardSelectedContainerStyle
            : styles.tribeCardContainerStyle

        return (
            <DelayedButton
                style={containerStyle}
                onPress={() => onPress(item)}
                activeOpacity={0.9}
            >
                <View
                    style={{
                        flex: 1,
                        borderTopLeftRadius: 3,
                        borderTopRightRadius: 3,
                    }}
                >
                    {canSelect && (
                        <View
                            style={{
                                position: 'absolute',
                                bottom: 16,
                                left: 16,
                                zIndex: 2,
                                borderRadius: 10,
                                borderWidth: 0.5,
                                backgroundColor: selected
                                    ? color.GM_BLUE
                                    : color.GM_CARD_BACKGROUND,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderColor: selected
                                    ? color.GM_BLUE
                                    : '#8C8C8C',
                            }}
                        >
                            <Icon
                                name="check"
                                pack="material-community"
                                style={{
                                    tintColor: selected
                                        ? color.GM_CARD_BACKGROUND
                                        : '#8C8C8C',
                                    height: 20,
                                    width: 20,
                                }}
                            />
                        </View>
                    )}
                    {picture ? (
                        <Image
                            style={{
                                height: (width - 32) / 2.2,
                                width: width - 32,
                                borderTopLeftRadius: 5,
                                borderTopRightRadius: 5,
                            }}
                            resizeMode="cover"
                            source={getImageOrDefault(picture)}
                        />
                    ) : (
                        <View
                            style={{
                                height: (width - 32) / 2.2,
                                width: width - 32,
                                borderTopLeftRadius: 5,
                                borderTopRightRadius: 5,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Icon
                                pack="material-community"
                                name="flag"
                                style={{ height: 72 }}
                            />
                        </View>
                    )}
                </View>
                <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
                    <View
                        style={{
                            flexDirection: 'row',
                            width: '100%',
                            paddingVertical: 8,
                            alignItems: 'center',
                        }}
                    >
                        <Text
                            style={[
                                default_style.titleText_1,
                                {
                                    letterSpacing: text.LETTER_SPACING.REGULAR,
                                    flex: 1,
                                },
                            ]}
                        >
                            {name}
                        </Text>
                        <Text
                            style={[
                                default_style.normalText_1,
                                {
                                    color: '#828282',
                                    letterSpacing: text.LETTER_SPACING.REGULAR,
                                },
                            ]}
                        >
                            {memberCount}{' '}
                            {memberCount > 1 ? 'members' : 'member'}
                        </Text>
                    </View>
                    <Text
                        style={[
                            default_style.normalText_1,
                            {
                                color: '#828282',
                                letterSpacing: text.LETTER_SPACING.REGULAR,
                            },
                        ]}
                    >
                        {decode(description)}
                    </Text>
                </View>
            </DelayedButton>
        )
    }
}

const styles = {
    tribeCardContainerStyle: {
        backgroundColor: 'white',
        borderRadius: 5,
        justifyContent: 'center',
        flex: 1,
        marginTop: 20,
        marginLeft: 16,
        marginRight: 16,
        shadowOffset: {
            width: -2,
            height: 2,
        },
        shadowRadius: 3,
        shadowOpacity: 0.9,
        shadowColor: 'rgba(0,0,0,0.1)',
        borderWidth: 0.5,
        borderColor: '#FAFAFA',
    },
    tribeCardSelectedContainerStyle: {
        backgroundColor: '#F6FDFF',
        borderRadius: 5,
        justifyContent: 'center',
        flex: 1,
        marginTop: 20,
        marginLeft: 16,
        marginRight: 16,
        shadowOffset: {
            width: -2,
            height: 2,
        },
        shadowRadius: 3,
        shadowOpacity: 0.9,
        shadowColor: 'rgba(0,0,0,0.1)',
        borderWidth: 0.5,
        borderColor: color.GM_BLUE,
    },
}

export default connect(null, {
    tribeDetailOpen,
})(TribeDiscoverCard)
