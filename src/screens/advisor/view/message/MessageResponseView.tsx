import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Markdown, { MarkdownIt } from 'react-native-markdown-display';
import { useBranding } from '../../../../contexts';
import { BasicButton } from '../../../../components';

const { width: ScreenWidth } = Dimensions.get('window');

interface MessageResponseViewProps {
  response?: string;
  tools?: string[];
  error?: string;
  isLoading?: boolean;
  onFindFoodPress?: () => void;
}

export const MessageResponseView = ({
  response,
  error,
  isLoading,
  tools,
  onFindFoodPress,
}: MessageResponseViewProps) => {
  const styles = ResponseViewStyle();

  const content = response ?? '';

  const renderText = () => {
    let output = '';

    if (content) {
      output = content;
    } else if (error) {
      output = error;
    } else {
      output = 'Something went wrong, please try again';
    }
    return output;
  };

  const branding = useBranding();

  return (
    <View style={[styles.msgView, styles.receivedMsgView]}>
      <Markdown
        markdownit={MarkdownIt({
          break: true,
        })}
        style={markdownStyles}
      >
        {renderText()}
      </Markdown>
      {tools &&
        tools?.length > 0 &&
        tools.includes('SearchIngredientMatches') && (
          <View style={styles.buttonContainer}>
            <BasicButton
              onPress={() => {
                onFindFoodPress?.();
              }}
              backgroundColor={branding.backgroundColor}
              boarderColor={branding.backgroundColor}
              textColor={branding.primaryColor}
              style={styles.buttonLogSelected}
              isLoading={isLoading}
              text={'Find Foods'}
            />
          </View>
        )}
    </View>
  );
};

const markdownStyles = {
  body: {
    color: '#FFFFFF', // White color for the text
    fontSize: 13,
  },
  heading1: {
    color: '#FFFFFF', // White color for headings
    fontSize: 14,
  },
  strong: {
    color: '#FFFFFF', // White color for bold text
    fontSize: 14,
  },
  em: {
    color: '#FFFFFF', // White color for italic text
    fontSize: 14,
  },
  link: {
    color: '#FFFFFF', // White color for links
    fontSize: 14,
  },
};

// Styles for the component
const ResponseViewStyle = () =>
  StyleSheet.create({
    msgView: {
      maxWidth: ScreenWidth * 0.75,
      borderTopEndRadius: 8,
      borderTopStartRadius: 8,
      marginVertical: 16,
      paddingVertical: 8,
      paddingHorizontal: 10,
    },
    receivedMsgView: {
      backgroundColor: '#6366F1',
      borderBottomRightRadius: 8,
      borderBottomLeftRadius: 0,
    },

    msgText: {
      fontSize: 14,
      fontWeight: '400',
    },

    receivedMsg: {
      color: '#FFFFFF',
    },
    buttonContainer: {
      flexDirection: 'row',
      marginVertical: 16,
      justifyContent: 'center',
    },
    buttonLogSelected: {
      marginEnd: 16,
      alignSelf: 'center',
      marginStart: 8,
      borderWidth: 0,
    },
  });
