import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { Text, TextInput } from '..';
import { searchHeaderStyle } from './SearchHeader.style';
import { ic_search_gray_2x, ic_close_white } from '../../assets';
import { useBranding } from '../../contexts';

interface SearchHeaderProps {
  searchQuery: string;
  onChangeSearchInput: (val: string) => void;
  clearSearchInput: () => void;
  onPressCancleBtn: () => void;
  autoFocusForSearchInput?: boolean;
}

const SearchHeader = (props: SearchHeaderProps) => {
  const {
    searchQuery,
    onChangeSearchInput,
    clearSearchInput,
    onPressCancleBtn,
    autoFocusForSearchInput = false,
  } = props;

  const branding = useBranding();

  const { primaryColor } = branding;
  const styles = searchHeaderStyle(branding);
  return (
    <View style={[styles.headerContainer, styles.row]}>
      <View style={[styles.row, styles.searchBarLayout]}>
        <Image
          source={ic_search_gray_2x}
          style={styles.searchImg}
          resizeMode="contain"
        />
        <View style={styles.inputContainer}>
          <TextInput
            value={searchQuery}
            testID="testSearchInput"
            style={styles.searchInput}
            cursorColor={primaryColor}
            containerStyle={styles.searchInputContainer}
            placeholder="Type in food name"
            onChangeText={(val: string) => onChangeSearchInput(val)}
            autoFocus={autoFocusForSearchInput}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={clearSearchInput}
              style={styles.headerCloseImgLayout}
            >
              <Image
                style={styles.closeImg}
                source={ic_close_white}
                resizeMode="contain"
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <TouchableOpacity onPress={onPressCancleBtn}>
        <Text weight="500" size="_15px" color="text" style={styles.cancleTxt}>
          Cancel
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default React.memo(SearchHeader);
