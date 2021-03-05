/**
 * This wraps the list of chat messages so that we can animate the slide in effect each time a new message comes in
 * If we try to do this at the individual message item, we have to do a margin animation which is not supported by native driver
 * Instead, we can do a smoother animation by quickly making the list jump to a -ve offset and sliding it into 0 offset each time...
 * ...a new message comes in, using `transform.translateY` which is supported by the native driver
 *
 * @format
 */

import React, { Component } from 'react'
import { Animated } from 'react-native'

// a quick slide in animation (250ms)
export const MESSAGE_SLIDE_IN_ANIMATION_MS = 250
// starting new messages with an offset of 48 points below the text box, and then sliding them up to offset 0
// NOTE: 48 points was chosen because it's enough to 'feel' like a message box is sliding in, without animating full slide in (which can get clunky since we're not writing native code)
export const MESSAGE_SLIDE_IN_ANIMATION_INITIAL_OFFSET = 48

/**
 * @prop {required fn} renderMessageList
 */
export default class GMGiftedChatMessagesWrapper extends Component {
    constructor(props) {
        super(props)

        this.state = {
            listSlideUpAnim: new Animated.Value(0),
        }
    }

    _getFirstMessage(messages) {
        return messages && messages.length
            ? messages[0]
            : {
                  createdAt: '',
              }
    }

    componentDidUpdate(prevProps) {
        if (
            this._getFirstMessage(prevProps.messages).createdAt.toString() !=
            this._getFirstMessage(this.props.messages).createdAt.toString()
        ) {
            this.setState(
                {
                    listSlideUpAnim: new Animated.Value(
                        MESSAGE_SLIDE_IN_ANIMATION_INITIAL_OFFSET
                    ),
                },
                () => {
                    Animated.timing(this.state.listSlideUpAnim, {
                        toValue: 0,
                        duration: MESSAGE_SLIDE_IN_ANIMATION_MS,
                        useNativeDriver: true,
                    }).start()
                }
            )
        }
    }

    render() {
        return (
            <Animated.View
                style={{
                    flex: 1,
                    transform: [
                        {
                            translateY: this.state.listSlideUpAnim,
                        },
                    ],
                }}
            >
                {this.props.renderMessagesList()}
            </Animated.View>
        )
    }
}
