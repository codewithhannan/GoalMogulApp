/**
 * Note: event edition is in EventActions
 *  }
 *
 * @format
 * @param title
 * @param start
 * @param durationHours
 * @param options: { participantsCanInvite, isInviteOnly, participantLimit, location, description, picture
 */

// Actions to create a new event
import { Actions } from 'react-native-router-flux'
import { Alert } from 'react-native'
import moment from 'moment'
import { SubmissionError } from 'redux-form'
import { api as API } from '../../middleware/api'
import ImageUtils from '../../../Utils/ImageUtils'

import {
    EVENT_NEW_SUBMIT,
    EVENT_NEW_SUBMIT_SUCCESS,
    EVENT_NEW_SUBMIT_FAIL,
    EVENT_NEW_CANCEL,
    EVENT_NEW_UPLOAD_PICTURE_SUCCESS,
} from './NewEventReducers'

import { EVENT_EDIT_SUCCESS } from './EventReducers'

import { refreshEvent } from './MyEventTabActions'

const BASE_ROUTE = 'secure/event'
const DEBUG_KEY = '[ Action New Event ]'

// Open creating event modal
export const openNewEventModal = () => (dispatch) => {
    Actions.push('createEventStack')
}

export const cancelCreatingNewEvent = () => (dispatch) => {
    Actions.pop()
    dispatch({
        type: EVENT_NEW_CANCEL,
    })
}

/**
 * @param values: new tribe values
 * @param needUpload: if there is media to be uploaded
 * @param isEdit: if edit, then use put rather than post
 *
 * @param title
 * @param start
 * @param durationHours
 * @param options:
  {participantsCanInvite, isInviteOnly, participantLimit, location, description, picture}
 */
export const createNewEvent = (values, needUpload, isEdit, eventId) => (
    dispatch,
    getState
) => {
    const { token } = getState().user
    const newEvent = formToEventAdapter(values, eventId, isEdit)
    console.log(`${DEBUG_KEY}: newEvent to submit is: `, newEvent)

    dispatch({
        type: EVENT_NEW_SUBMIT,
    })

    const onSuccess = (res, event) => {
        dispatch({
            type: EVENT_NEW_SUBMIT_SUCCESS,
            payload: res,
        })

        if (isEdit) {
            console.log(`${DEBUG_KEY}: event edit success with res: `, res)
            dispatch({
                type: EVENT_EDIT_SUCCESS,
                payload: {
                    newEvent: {
                        _id: event.eventId,
                        ...event.details,
                    },
                },
            })
            refreshEvent()(dispatch, getState)
        }
        Actions.pop()
        Alert.alert(
            'Success',
            `Congrats! Your event is successfully ${
                isEdit ? 'updated' : 'created'
            }.`
        )
    }

    const onError = (err) => {
        dispatch({
            type: EVENT_NEW_SUBMIT_FAIL,
        })
        Alert.alert(
            `Failed to ${isEdit ? 'update' : 'create'} new Event`,
            'Please try again later'
        )
        console.log('Error submitting new Event with err: ', err)
    }

    const imageUri = isEdit
        ? newEvent.details.picture
        : newEvent.options.picture
    if (!needUpload) {
        // If no mediaRef then directly submit the post
        sendCreateEventRequest(
            newEvent,
            token,
            isEdit,
            dispatch,
            onSuccess,
            onError
        )
    } else {
        ImageUtils.getImageSize(imageUri)
            .then(({ width, height }) => {
                // Resize image
                console.log('width, height are: ', width, height)
                return ImageUtils.resizeImage(imageUri, width, height)
            })
            .then((image) => {
                // Upload image to S3 server
                console.log('image to upload is: ', image)
                return ImageUtils.getPresignedUrl(
                    image.uri,
                    token,
                    (objectKey) => {
                        // Obtain pre-signed url and store in getState().postDetail.newPost.mediaRef
                        dispatch({
                            type: EVENT_NEW_UPLOAD_PICTURE_SUCCESS,
                            payload: objectKey,
                        })
                    },
                    'PageImage'
                )
            })
            .then(({ signedRequest, file }) => {
                return ImageUtils.uploadImage(file, signedRequest)
            })
            .then((res) => {
                if (res instanceof Error) {
                    // uploading to s3 failed
                    console.log(
                        `${DEBUG_KEY}: error uploading image to s3 with res: `,
                        res
                    )
                    throw res
                }
                return getState().newEvent.tmpPicture
            })
            .then((image) => {
                // Use the presignedUrl as media string
                console.log(`${BASE_ROUTE}: presigned url sent is: `, image)
                const newEventObject = isEdit
                    ? {
                          ...newEvent,
                          details: { ...newEvent.details, picture: image },
                      }
                    : {
                          ...newEvent,
                          options: { ...newEvent.options, picture: image },
                      }
                return sendCreateEventRequest(
                    newEventObject,
                    token,
                    isEdit,
                    dispatch,
                    onSuccess,
                    onError
                )
            })
            .catch((err) => {
                // TODO: error handling for different kinds of errors.
                /*
        Error Type:
          image getSize
          image Resize
          image upload to S3
          update profile image Id
        */
                onError(err)
            })
    }
}

const sendCreateEventRequest = (
    newEvent,
    token,
    isEdit,
    dispatch,
    onSuccess,
    onError
) => {
    if (isEdit) {
        API.put(`${BASE_ROUTE}`, { ...newEvent }, token)
            .then((res) => {
                if (res.data || res.status === 200) {
                    return onSuccess(res, newEvent)
                }
                onError(res.message)
            })
            .catch((err) => {
                onError(err)
            })
        return
    }
    API.post(`${BASE_ROUTE}`, { ...newEvent }, token)
        .then((res) => {
            if (res.data || res.status === 200) {
                return onSuccess(res)
            }
            onError(res.message)
        })
        .catch((err) => {
            onError(err)
        })
}

// Tranform form values to a event object
/**
 * @param title
 * @param start
 * @param durationHours
 * @param options:
  {participantsCanInvite, isInviteOnly, participantLimit, location, description, picture}
 */
const formToEventAdapter = (values, eventId, isEdit) => {
    const {
        title,
        startTime,
        endTime,
        participantsCanInvite,
        isInviteOnly,
        participantLimit,
        location,
        description,
        picture,
    } = values

    if (
        !title ||
        !startTime.date ||
        !endTime.date ||
        !location ||
        !description
    ) {
        Alert.alert(
            'Missing field',
            'Please check all the fields are filled in.'
        )
        throw new SubmissionError({
            _error: 'Missing field',
        })
    }

    const startMoment = moment(startTime.date)
    const endMoment = moment(endTime.date)
    const duration = moment.duration(endMoment.diff(startMoment))

    if (duration <= 0) {
        Alert.alert(
            'Incorrect format',
            'Start time should be early than the end time.'
        )
        throw new SubmissionError({
            _error: 'Incorrect start time',
        })
    }

    if (isEdit) {
        return {
            eventId,
            details: {
                participantsCanInvite,
                isInviteOnly,
                participantLimit,
                location,
                description,
                picture,
                title,
                start: startTime.date,
                durationHours: duration.asHours(),
            },
        }
    }

    return {
        title,
        start: startTime.date,
        durationHours: duration.asHours(),
        options: {
            participantsCanInvite,
            isInviteOnly,
            participantLimit,
            location,
            description,
            picture,
        },
    }
}

// Transform event object to form values
export const eventToFormAdapter = (event) => {
    const {
        title,
        start,
        durationHours,
        participantsCanInvite,
        isInviteOnly,
        participantLimit,
        location,
        description,
        picture,
    } = event

    const cloneStartDate = new Date(start)
    const end = moment(cloneStartDate).add(durationHours, 'h').toDate()
    const hasTimeline = start && durationHours

    return {
        title,
        startTime: {
            date: cloneStartDate,
            picker: false,
        },
        endTime: {
            date: end,
            picker: false,
        },
        participantsCanInvite,
        isInviteOnly,
        participantLimit,
        location,
        description,
        picture,
        hasTimeline,
    }
}
