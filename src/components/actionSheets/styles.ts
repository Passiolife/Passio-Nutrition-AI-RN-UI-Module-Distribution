import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 25,
    elevation: 5,
  },
  noVisibleContainer: {},
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    zIndex: 50,
  },
  modalView: {
    width: width,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    textAlign: 'center',
    color: '#333333',
    fontSize: 15,
    fontWeight: 'bold',
  },
  actionHeader: {
    flexDirection: 'row',
    width: '100%',
    paddingVertical: 5,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  closeIcon: {
    height: 20,
    width: 20,
  },
  actionItem: {
    height: 54,
    backgroundColor: '#F7F7F7',
    borderRadius: 12,
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  itemImg: {
    height: 25,
    width: 25,
    marginLeft: 15,
  },
  listContainer: {
    width: '100%',
    marginTop: 16,
    marginBottom: 24,
  },
  itemText: {
    color: '#286CE2',
    fontSize: 15,
    marginLeft: 15,
    fontWeight: '600',
  },
  iconLayout: {
    height: 25,
    width: 25,
  },
  scrollViewStyle: {
    width: '100%',
  },
});

export default styles;
