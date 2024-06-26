import React from 'react';
import {
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet,
  View,
  Platform,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { BottomBar } from './view';
import { useAdvisorScreen } from './useAdvisorScreen';
import type { AdvisorResponse } from './model/advisorResponse';
import { MessageSendTextView } from './view/message/MessageSendTextView';
import { MessageResponseView } from './view/message/MessageResponseView';
import { MessageSendImageView } from './view/message/MessageSendImageView';
import { TypingView } from './view/message/TypingView';
import IngredientsView from './view/IngredientsView';
import { BackNavigation, Text } from '../../components';
import { useBranding, type Branding } from '../../contexts';
import { MessageRecords } from './view/message/records/MessageRecords';
import { ImageScanning } from './view/message/ImageScanning';

export const AdvisorScreen = () => {
  const {
    inputMessage,
    messages,
    ingredientAdvisorResponse,
    sending,
    configureStatus,
    sdkError,
    isOptionShow,
    listRef,
    onLogSelect,
    onChangeTextInput,
    onPressSendBtn,
    onPressPlusIcon,
    onCloseIngredientView,
    onPickerImageOrGallery,
  } = useAdvisorScreen();
  const branding = useBranding();
  const styles = chatStyle(branding);

  const renderItem = ({ item }: { item: AdvisorResponse }) => {
    switch (item.type) {
      case 'text':
        return (
          <MessageSendTextView
            msg={
              item.type === 'text'
                ? item.message ?? ''
                : item.response?.markupContent ?? ''
            }
          />
        );
      case 'response':
        return (
          <MessageResponseView
            response={item.response?.markupContent}
            error={item.error}
          />
        );
      case 'defaultResponse':
        return (
          <MessageResponseView
            response={item.defaultResponse}
            error={item.error}
          />
        );
      case 'image':
        return <MessageSendImageView imgUrl={item.uri} />;
      case 'records':
        return <MessageRecords response={item} onLogSelect={onLogSelect} />;
      case 'typing':
        return <TypingView />;
      case 'imageScanning':
        return <ImageScanning />;
      default:
        return <></>;
    }
  };

  return (
    <>
      <BackNavigation title="AI Advisor" />

      {configureStatus === 'Success' ? (
        <KeyboardAvoidingView
          style={styles.body}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <SafeAreaView style={styles.body}>
            <View style={[styles.body, styles.container]}>
              <View style={styles.chatBody}>
                <View style={styles.chatBodyContainer}>
                  <FlatList
                    data={messages}
                    ref={listRef}
                    keyExtractor={(_item, index) => index.toString()}
                    renderItem={renderItem}
                    showsVerticalScrollIndicator={false}
                    style={styles.flatListStyle}
                    // onContentSizeChange={() => listRef.current?.scrollToEnd()}
                    // onLayout={() => listRef.current?.scrollToEnd()}
                  />
                </View>
              </View>
              <View style={styles.bottomView}>
                <BottomBar
                  inputValue={inputMessage}
                  textInputChnageHandler={onChangeTextInput}
                  sendBtnHandler={onPressSendBtn}
                  plusIconHandler={onPressPlusIcon}
                  onGalleryPicker={() => onPickerImageOrGallery('gallery')}
                  onImagePicker={() => onPickerImageOrGallery('camera')}
                  sending={sending}
                  isOptionShow={isOptionShow}
                />
              </View>
            </View>
          </SafeAreaView>
        </KeyboardAvoidingView>
      ) : configureStatus === 'Error' ? (
        <Text style={styles.error}>{sdkError}</Text>
      ) : (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <ActivityIndicator />
        </View>
      )}

      {ingredientAdvisorResponse && (
        <IngredientsView
          response={ingredientAdvisorResponse}
          onClose={onCloseIngredientView}
        />
      )}
    </>
  );
};

// Styles for the component
const chatStyle = ({ backgroundColor }: Branding) =>
  StyleSheet.create({
    body: {
      flex: 1,
      backgroundColor: backgroundColor,
    },
    error: {
      flex: 1,
      justifyContent: 'center',
      alignSelf: 'center',
      alignContent: 'center',
      textAlign: 'center',
      marginTop: 120,
      alignItems: 'center',
    },
    chatBody: {
      flex: 1,
    },
    bottomView: {
      marginBottom: 10,
    },
    container: {
      paddingHorizontal: 16,
    },
    closeButton: {},
    closeText: {
      margin: 16,
      height: 24,
      width: 24,
    },
    chatBodyContainer: {
      flex: 1,
    },
    flatListStyle: {
      marginBottom: 10,
    },
  });

export default AdvisorScreen;
