import {
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet,
  View,
  Platform,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import React from 'react';
import { BottomBar } from './view';
import { useAdvisorScreen } from './useAdvisorScreen';
import type { AdvisorResponse } from './model/advisorResponse';
import { MessageSendTextView } from './view/message/MessageSendTextView';
import { MessageResponseView } from './view/message/MessageResponseView';
import { MessageSendImageView } from './view/message/MessageSendImageView';
import { TypingView } from './view/message/TypingView';
import IngredientsView from './view/IngredientsView';
import { BackNavigation } from '../../components';
import { useBranding, type Branding } from '../../contexts';

export const AdvisorScreen = () => {
  const {
    inputMessage,
    messages,
    ingredientAdvisorResponse,
    sending,
    configureStatus,
    onChangeTextInput,
    onPressSendBtn,
    onPressPlusIcon,
    onCloseIngredientView,
    fetchIngredients,
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
            response={item.response}
            error={item.error}
            onResponse={fetchIngredients}
          />
        );
      case 'image':
        return <MessageSendImageView imgUrl={item.uri} />;
      case 'typing':
        return <TypingView />;
      default:
        return <></>;
    }
  };

  return (
    <>
      <BackNavigation title="AI Advisor" />
      <SafeAreaView style={styles.body}>
        <KeyboardAvoidingView
          style={styles.body}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={[styles.body, styles.container]}>
            <View style={styles.chatBody}>
              <View style={styles.chatBodyContainer}>
                <FlatList
                  data={messages}
                  keyExtractor={(_item, index) => index.toString()}
                  renderItem={renderItem}
                  showsVerticalScrollIndicator={false}
                  style={styles.flatListStyle}
                />
              </View>
            </View>
            <View style={styles.bottomView}>
              {configureStatus === 'Success' ? (
                <BottomBar
                  inputValue={inputMessage}
                  textInputChnageHandler={onChangeTextInput}
                  sendBtnHandler={onPressSendBtn}
                  plusIconHandler={onPressPlusIcon}
                  sending={sending}
                />
              ) : (
                <ActivityIndicator />
              )}
            </View>
          </View>
        </KeyboardAvoidingView>
        {ingredientAdvisorResponse && (
          <IngredientsView
            response={ingredientAdvisorResponse}
            onClose={onCloseIngredientView}
          />
        )}
      </SafeAreaView>
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
    chatBody: {
      flex: 1,
    },
    bottomView: {
      marginBottom: 40,
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
