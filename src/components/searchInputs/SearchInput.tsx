import React from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { ic_search_gray_2x, ic_close_white } from '../../assets';
import { TextInput } from '../index';
import { COLORS } from '../../constants';

interface SearchInputProps {
  searchQuery: string;
  onChangeSearchInput: (val: string) => void;
  clearSearchInput: () => void;
}

const SearchInput = (props: SearchInputProps) => {
  const { searchQuery, onChangeSearchInput, clearSearchInput } = props;
  return (
    <View style={[styles.searchBarLayout]}>
      <Image
        source={ic_search_gray_2x}
        style={styles.searchImg}
        resizeMode="contain"
      />
      <TextInput
        value={searchQuery}
        testID="testSearchInput"
        placeholder="Search for"
        style={styles.searchInput}
        onChangeText={(val: string) => onChangeSearchInput(val)}
      />
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
    </View>
  );
};

const styles = StyleSheet.create({
  searchBarLayout: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingHorizontal: 10,
    marginHorizontal: 10,
    alignItems: 'center',
    flex: 1,
  },
  searchImg: {
    width: 25,
    height: 25,
  },
  closeImg: {
    width: 10,
    height: 10,
  },
  searchInput: {
    borderWidth: 0,
    width: Dimensions.get('screen').width / 1.4 + 16,
    borderRadius: 0,
    fontSize: 16,
    height: 36,
    paddingVertical: 2,
  },
  headerCloseImgLayout: {
    backgroundColor: COLORS.blue,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    padding: 5,
    width: 22,
    height: 22,
  },
});

export default SearchInput;
