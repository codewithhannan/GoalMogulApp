import _ from 'lodash';

import React from 'react';
import {
	View,
	KeyboardAvoidingView,
	ScrollView,
	SafeAreaView,
	TextInput,
	Image,
	Text,
	TouchableOpacity,
	ImageBackground,
} from 'react-native';
import { connect } from 'react-redux';
import { CheckBox, SearchBar } from 'react-native-elements';
import {
	Field,
	reduxForm,
	formValueSelector,
} from 'redux-form';
import R from 'ramda';
import {
	MenuProvider,
} from 'react-native-popup-menu';

import { MaterialIcons } from '@expo/vector-icons';

import {Alert} from 'react-native';

// Components
import ModalHeader from '../../Common/Header/ModalHeader';
import ImageModal from '../../Common/ImageModal';
import plus from '../../../asset/utils/plus.png';
import times from '../../../asset/utils/times.png'

// Actions
import {
	cancelCreateOrUpdateChatroom,
	createOrUpdateChatroom,
	changeModalPage,
	updateSelectedMembers,
	refreshFriendsSearch,
	loadMoreFriendsSearch,
	searchQueryUpdated,
} from '../../../redux/modules/chat/CreateChatRoomActions';
import { openCameraRoll, openCamera } from '../../../actions';

// assets
import cancel from '../../../asset/utils/cancel_no_background.png';
import camera from '../../../asset/utils/camera.png';
import cameraRoll from '../../../asset/utils/cameraRoll.png';
import { FlatList } from 'react-native-gesture-handler';
import SearchUserCard from '../../Search/People/SearchUserCard';
import { SearchIcon } from '../../../Utils/Icons';

const FRIEND_SEARCH_AUTO_SEARCH_DELAY_MS = 500;


class CreateChatroomModal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			mediaModal: false
		};
	}
	_keyExtractor = (item) => item._id;

	componentDidMount() {
		this.initializeForm();
	}

	initializeForm() {
		const defaulVals = {
			name: '',
			roomType: 'Group',
			description: undefined,
			isPublic: true,
			membersCanAdd: false,
			memberLimit: undefined,
			picture: undefined,
		};

		// Initialize based on the props, if it's opened through edit button
		const { initializeFromState, chat } = this.props;
		const initialVals = initializeFromState
			? { ...chat }
			: { ...defaulVals };

		this.props.initialize({
			...initialVals
		});
	}

	handleSubmit = () => {
		const { initializeFromState, chat, picture, membersToAdd, formVals } = this.props;
		const chatId = chat && chat._id;
		const needUpload =
			(initializeFromState && chat.picture && chat.picture !== picture)
			|| (!initializeFromState && picture);

		this.props.createOrUpdateChatroom(
			formVals.values,
			membersToAdd,
			chatId, // chatId
			initializeFromState, // isEdit
			needUpload,
		);
	}

	handleNext = () => {
		const isEdit = this.props.initializeFromState;
		if (!this.props.name.trim().length) {
			return Alert.alert('Warning', 'You must enter a Name.');
		};
		if (isEdit) {
			this.handleSubmit();
		} else if (this.props.modalPageNumber == 1) {
			this.props.changeModalPage(2);
		} else if(this.props.modalPageNumber == 2) {
			if (this.props.selectedMembers.length == 0) {
				return Alert.alert('Warning', 'You must select at least one other person to add to the conversation.');
			};
			if (this.props.selectedMembers.length > this.props.memberLimit - 1) {
				return Alert.alert('Warning', 'You\'ve added more members than the specified member limit for this chat');
			};
			this.handleSubmit();
		};
	}

	handleOpenCamera = () => {
		this.props.openCamera((result) => {
			this.props.change('picture', result.uri);
		});
	}

	handleOpenCameraRoll = () => {
		const callback = R.curry((result) => {
			this.props.change('picture', result.uri);
		});
		this.props.openCameraRoll(callback);
	}

	renderInput = ({
		input: { onChange, onFocus, value, ...restInput },
		editable,
		numberOfLines,
		meta: { touched, error },
		placeholder,
		keyboardType,
		...custom
	}) => {
		const inputStyle = {
			...styles.inputStyle,
		};

		let multiline = true;
		if (numberOfLines && numberOfLines === 1) {
			multiline = false;
		}
		return (
			<SafeAreaView
				style={{
					backgroundColor: 'white',
					borderBottomWidth: 0.5,
					margin: 5,
					borderColor: 'lightgray'
				}}
			>
				<TextInput
					placeholder={placeholder}
					onChangeText={onChange}
					style={inputStyle}
					editable={editable}
					maxHeight={150}
					keyboardType={keyboardType || 'default'}
					multiline={multiline}
					value={value}
				/>
			</SafeAreaView>
		);
	}

	renderActionIcons() {
		const actionIconStyle = { ...styles.actionIconStyle };
		const actionIconWrapperStyle = { ...styles.actionIconWrapperStyle };
		return (
			<View style={{ flexDirection: 'row', justifyContent: 'flex-start', marginTop: 10 }}>
				<TouchableOpacity activeOpacity={0.85} style={actionIconWrapperStyle} onPress={this.handleOpenCamera}>
					<Image style={actionIconStyle} source={camera} />
				</TouchableOpacity>
				<TouchableOpacity activeOpacity={0.85}
					style={{ ...actionIconWrapperStyle, marginLeft: 5 }}
					onPress={this.handleOpenCameraRoll}
				>
					<Image style={actionIconStyle} source={cameraRoll} />
				</TouchableOpacity>
			</View>
		);
	}

	// Current media type is only picture
	renderMedia = () => {
		const { initializeFromState, chat, picture } = this.props;
		let imageUrl = picture;
		if (initializeFromState && picture) {
			const hasImageModified = chat.picture && chat.picture !== picture;
			if (!hasImageModified) {
				// If editing a tribe and image hasn't changed, then image source should
				// be from server
				imageUrl = `https://s3.us-west-2.amazonaws.com/goalmogul-v1/${picture}`;
			}
		}

		if (picture) {
			return (
				<View style={{ backgroundColor: 'gray' }}>
				<TouchableOpacity onPress={() => this.setState({ mediaModal: true })}>
					<ImageBackground
						style={styles.mediaStyle}
						source={{ uri: imageUrl }}
						imageStyle={{ borderRadius: 8, opacity: 0.7, resizeMode: 'cover' }}
					>
						<TouchableOpacity activeOpacity={0.85}
							onPress={() => this.props.change('picture', null)}
							style={{
								position: 'absolute',
								top: 10,
								left: 15,
								width: 24,
								height: 24,
								borderRadius: 12,
								backgroundColor: 'rgba(0,0,0,0.3)',
								alignItems: 'center',
								justifyContent: 'center'
							}}
						>
							<Image
								source={cancel}
								style={{
									width: 16,
									height: 16,
									tintColor: '#fafafa',
									borderRadius: 8,
									padding: 2
								}}
							/>
						</TouchableOpacity>
					</ImageBackground>
				</TouchableOpacity>
					{this.renderImageModal(imageUrl)}
				</View>
			);
		}
		return null;
	}

	renderImageModal(imageUrl) {
		if (!this.state.mediaModal) {
			return null;
		};
		return (
			<ImageModal 
				mediaRef={imageUrl}
				mediaModal={true}
				isLocalFile={true}
				closeModal={() => this.setState({ mediaModal: false })}
			/>
		);
	}

	renderChatroomName() {
		const titleText = <Text style={styles.titleTextStyle}>Chatroom Name</Text>;
		return (
			<View style={{ marginBottom: 5 }}>
				{titleText}
				<Field
					name='name'
					label='name'
					component={this.renderInput}
					editable={!this.props.uploading}
					numberOfLines={1}
					multiline
					style={styles.goalInputStyle}
					placeholder='Enter a name for this room...'
				/>
			</View>
		);
	}

	renderChatRoomMemberLimit() {
		const titleText = <Text style={styles.titleTextStyle}>Member Limit (Optional)</Text>;
		return (
			<View style={{ marginBottom: 5 }}>
				{titleText}
				<Field
					name='memberLimit'
					label='memberLimit'
					component={this.renderInput}
					editable={!this.props.uploading}
					numberOfLines={1}
					keyboardType='number-pad'
					style={styles.goalInputStyle}
					placeholder='Enter a number...'
				/>
			</View>
		);
	}

	renderChatroomDescription() {
		const titleText = <Text style={styles.titleTextStyle}>Description (Optional)</Text>;
		return (
			<View style={{ marginBottom: 5 }}>
				{titleText}
				<Field
					name='description'
					label='description'
					component={this.renderInput}
					editable={!this.props.uploading}
					numberOfLines={5}
					style={styles.goalInputStyle}
					placeholder="What's this room about?"
				/>
			</View>
		);
	}

	renderOptions() {
		return (
			<View>
				<CheckBox
					title='Publicly visible'
					textStyle={{fontWeight: 'normal'}}
					checked={this.props.isPublic}
					checkedIcon={<MaterialIcons
						name="done"
						color="#111"
						size={21}
					/>}
					uncheckedIcon={<MaterialIcons
						name="done"
						color="#CCC"
						size={21}
					/>}
					onPress={() => this.props.change('isPublic', !this.props.isPublic)}
				/>
				<CheckBox
					title='Members can add their friends'
					textStyle={{fontWeight: 'normal'}}
					checked={this.props.membersCanAdd}
					checkedIcon={<MaterialIcons
						name="done"
						color="#111"
						size={21}
					/>}
					uncheckedIcon={<MaterialIcons
						name="done"
						color="#CCC"
						size={21}
					/>}
					onPress={() => this.props.change('membersCanAdd', !this.props.membersCanAdd)}
				/>
			</View>
		);
	}

	// Render field to select an image for tribe
	renderImageSelection() {
		const titleText = <Text style={styles.titleTextStyle}>Select a photo</Text>;
		return (
			<View style={{ marginTop: 4 }}>
				{titleText}
				{this.renderMedia()}
				{this.renderActionIcons()}
			</View>
		);
	}

	renderMemberItem(item) {
		return (
			<SearchUserCard
			  item={item.item}
			  onSelect={this.onSearchResultSelect}
			  cardIconSource={item.item.isSearchResult ? plus : times}
			  cardContainerStyles={item.item.isSearchResult ? {} : {backgroundColor: '#D8EDFF'}}
			/>
		  );
	}
	onSearchResultSelect = (userId, userDoc) => {
		let newSelectedMembers = _.map(this.props.selectedMembers, _.clone);
		if (userDoc.isSearchResult) {
			let newUserDoc = _.cloneDeep(userDoc);
			newUserDoc = _.set(newUserDoc, 'isSearchResult', false);
			newSelectedMembers.push(newUserDoc);
			this.search.clear();
			this.search.focus();
		} else {
			const indexToRemove = newSelectedMembers.findIndex(userDoc => userDoc._id == userId);
			if (indexToRemove > -1) {
				newSelectedMembers.splice(indexToRemove, 1);
			} else {
				return;
			};
		};
		this.props.updateSelectedMembers(newSelectedMembers);
	}
	handleOnRefresh = (maybeQuery) => {
		const query = typeof maybeQuery == "string" ? maybeQuery : this.props.searchQuery;
		this.props.refreshFriendsSearch(query, this.props.pageSize);
	}
	handleOnLoadMore = () => {
		if (!this.props.hasNextPage) return;
		this.props.loadMoreFriendsSearch(this.props.searchQuery, this.props.pageSize, this.props.pageOffset);
	}
	handleSearchUpdate(newText='') {
		if (this.friendsSearchTimer) {
			clearInterval(this.friendsSearchTimer);
		};
		this.props.searchQueryUpdated(newText);
		if (newText.trim().length) {
			this.friendsSearchTimer = setTimeout(this.handleOnRefresh.bind(this), FRIEND_SEARCH_AUTO_SEARCH_DELAY_MS);
		} else {
			this.handleOnRefresh('');
		}
	}
	renderListHeader = () => {
		const { searchQuery } = this.props;
		return (
			<SearchBar
				ref={search => this.search = search}
				platform="default"
				clearIcon={<MaterialIcons
					name="clear"
					color="#777"
					size={21}
				/>}
				containerStyle={{
					backgroundColor: 'transparent',
					padding: 6,
					borderColor: 'white',
					borderWidth: 0,
				}}
				inputContainerStyle={{
					backgroundColor: '#FAFAFA',
				}}
				inputStyle={{
					fontSize: 15
				}}
				placeholder={`Search...`}
				onChangeText={this.handleSearchUpdate.bind(this)}
				onClear={this.handleSearchUpdate.bind(this)}
				searchIcon={<SearchIcon 
					iconContainerStyle={{ marginBottom: 3, marginTop: 1 }} 
					iconStyle={{ tintColor: '#777', height: 15, width: 15 }}
				  />}
				value={searchQuery}
				lightTheme={true}
			/>
		);
	}
	renderListFooter() {
		if (!this.props.loading) return null;
		return (
			<View
				style={{
					paddingVertical: 20,
					borderTopWidth: 1,
					borderColor: "#CED0CE"
				}}
			>
				<ActivityIndicator animating size="large" />
			</View>
		);
	}
	renderListEmptyState() {
		if (!this.props.loading && !this.props.refreshing) {
			return (
				<View
					style={{
						justifyContent: "center",
						alignItems: "center",
						height: 100,
					}}
				>
					<Text
						style={{
							justifyContent: "center",
							alignItems: "center",
							fontSize: 18,
							color: '#999',
						}}
					>
						{this.props.searchQuery.trim().length ? '' : 'Search some friends to add...'}
					</Text>
				</View>
			);
		};
		return null;
	}

	render() {
		const { modalPageNumber } = this.props;
		const actionText = this.props.initializeFromState ? 'Update' : (this.props.modalPageNumber == 1 ? 'Next' : 'Create');
		const titleText = this.props.initializeFromState ? 'Edit Group Chat' : 'Create Group Chat';

		return (
			<MenuProvider customStyles={{ backdrop: styles.backdrop }}>
				<KeyboardAvoidingView
					behavior='padding'
					style={{ flex: 1, backgroundColor: '#ffffff' }}
				>
					<ModalHeader
						title={titleText}
						actionText={actionText}
						onCancel={() => this.props.cancelCreateOrUpdateChatroom()}
						onAction={this.handleNext}
					/>
					<ScrollView
						style={{ borderTopColor: '#e9e9e9', borderTopWidth: 1 }}
					>
						{modalPageNumber == 1 ?
							<View style={{ flex: 1, padding: 21 }}>
								{this.renderChatroomName()}
								{this.renderChatroomDescription()}
								{this.renderChatRoomMemberLimit()}
								{this.renderOptions()}
								{this.renderImageSelection()}
							</View>
						:
							<View style={{ flex: 1, padding: 21 }}>
								<Text
									style={{fontSize: 12, color: '#CCC', marginBottom: 6, textAlign: 'center'}}
								>
									Add friends to the chat
								</Text>
								{/* Selected items */}
								<FlatList
									data={[...this.props.selectedMembers]}
									renderItem={this.renderMemberItem.bind(this)}
									numColumns={1}
									keyExtractor={this._keyExtractor}
									ListHeaderComponent={this.renderListHeader}
								/>
								{/* Search result items */}
								<FlatList
									data={[...this.props.searchResults]}
									renderItem={this.renderMemberItem.bind(this)}
									numColumns={1}
									keyExtractor={this._keyExtractor}
									refreshing={this.props.refreshing}
									onRefresh={this.handleOnRefresh.bind(this)}
									ListFooterComponent={this.renderListFooter.bind(this)}
									ListEmptyComponent={this.renderListEmptyState.bind(this)}
									onEndThreshold={0}
									onEndReached={this.handleOnLoadMore.bind(this)}
								/>
							</View>
						}
					</ScrollView>
				</KeyboardAvoidingView>
			</MenuProvider>
		);
	}
}

CreateChatroomModal = reduxForm({
	form: 'createChatRoomModal',
	enableReinitialize: true
})(CreateChatroomModal);

const mapStateToProps = state => {
	const selector = formValueSelector('createChatRoomModal');
	const { user } = state.user;
	const {
		refreshing, loading, hasNextPage, pageSize, pageOffset,
		uploading, searchResults, selectedMembers, searchQuery, modalPageNumber
	} = state.newChatRoom;

	return {
		user,
		refreshing, loading, hasNextPage, pageSize, pageOffset,
		uploading, searchQuery, modalPageNumber,
		searchResults, selectedMembers,
		name: selector(state, 'name'),
		membersCanAdd: selector(state, 'membersCanAdd'),
		isPublic: selector(state, 'isPublic'),
		memberLimit: selector(state, 'memberLimit'),
		description: selector(state, 'description'),
		picture: selector(state, 'picture'),
		roomType: selector(state, 'roomType'),
		membersToAdd: selectedMembers.map(doc => doc._id.toString()).join(','),
		formVals: state.form.createChatRoomModal,
	};
};

export default connect(
	mapStateToProps,
	{
		cancelCreateOrUpdateChatroom,
		createOrUpdateChatroom,
		changeModalPage,
		updateSelectedMembers,
		refreshFriendsSearch,
		loadMoreFriendsSearch,
		searchQueryUpdated,
		openCameraRoll,
		openCamera
	}
)(CreateChatroomModal);

const styles = {
	sectionMargin: {
		marginTop: 20
	},
	inputContainerStyle: {
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: 5,
		borderWidth: 1,
		borderRadius: 5,
		borderColor: '#e9e9e9',
		shadowColor: '#ddd',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.8,
		shadowRadius: 1,
		elevation: 1,
	},
	imageStyle: {
		height: 54,
		width: 54,
		borderRadius: 5,
	},
	titleTextStyle: {
		fontSize: 11,
		color: '#a1a1a1',
		padding: 2
	},
	standardInputStyle: {
		flex: 1,
		fontSize: 12,
		padding: 13,
		paddingRight: 14,
		paddingLeft: 14
	},
	goalInputStyle: {
		fontSize: 20,
		padding: 20,
		paddingRight: 15,
		paddingLeft: 15
	},
	inputStyle: {
		paddingTop: 6,
		paddingBottom: 6,
		padding: 10,
		backgroundColor: 'white',
		borderRadius: 22,
	},
	cancelIconStyle: {
		height: 20,
		width: 20,
		justifyContent: 'flex-end'
	},
	mediaStyle: {
		height: 150,
		alignItems: 'center',
		justifyContent: 'center'
	},
	actionIconWrapperStyle: {
		backgroundColor: '#fafafa',
		padding: 10,
		paddingLeft: 15,
		paddingRight: 15,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 4
	},
	actionIconStyle: {
		tintColor: '#4a4a4a',
		height: 15,
		width: 18
	},
	borderStyle: {
		borderRadius: 4,
		borderWidth: 1,
		borderColor: '#e9e9e9',
		shadowColor: '#ddd',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.8,
		shadowRadius: 1,
	},
	// Menu related style
	backdrop: {
		backgroundColor: 'transparent'
	}
};
