import {Dimensions, StyleSheet} from 'react-native'

const dimensions = {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
}

export default StyleSheet.create({
    max: {
        flex: 1,
    },
    buttonHolder: {
        height: 100,
        alignItems: 'center',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    button: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#0093E9',
        borderRadius: 25,
    },
    buttonText: {
        color: '#fff',
    },
    fullView: {
        width: dimensions.width,
        height: dimensions.height - 100,
    },
    remoteContainer: {
        width: '100%',
        height: 150,
        position: 'absolute',
        top: 5
    },
    remote: {
        width: 150,
        height: 150,
        marginHorizontal: 2.5
    },
    noUserText: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        color: '#0093E9',
    },

    btnDefault: {
        width: 48,
        height: 48,
        backgroundColor: '#fff',
        borderRadius: 24,
        borderWidth: 4,
        borderStyle: 'solid',
        borderColor: '#212121',
      },
      btnActive: {
        width: 26,
        height: 26,
        backgroundColor: 'red',
        borderRadius: 8,
      },
      btnWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 50,
        height: 50,
        backgroundColor: '#fff',
        borderRadius: 30,
      },
      btnContainer: {
        alignItems: 'center',
        padding:5,
        justifyContent:'center',
        backgroundColor: '#212121',
      },
})