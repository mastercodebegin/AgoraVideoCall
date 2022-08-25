import React, {Component} from 'react'
import {Platform, ScrollView, Text, TouchableOpacity, View, PermissionsAndroid, Alert} from 'react-native'
// Import the RtcEngine class and view rendering components into your project.
import RtcEngine, {RtcLocalView, RtcRemoteView, VideoRenderMode} from 'react-native-agora'
// Import the UI styles.
import styles from '../Faltu/Style'

interface Props {
   
}

// Define a State interface.
interface State {
    appId: string,
    channelName: string,
    token: string,
    joinSucceed: boolean,
    peerIds: number[],
}


const requestCameraAndAudioPermission = async () =>{
  try {
      const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.CAMERA,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      ])
      if (
          granted['android.permission.RECORD_AUDIO'] === PermissionsAndroid.RESULTS.GRANTED
          && granted['android.permission.CAMERA'] === PermissionsAndroid.RESULTS.GRANTED
      ) {
          console.log('You can use the cameras & mic')
      } else {
          console.log('Permission denied')
      }
  } catch (err) {
      console.warn(err)
  }
}

export default class App extends Component<Props, State> {
  _engine?: RtcEngine
  // Add a constructor，and initialize this.state. You need:
  // Replace yourAppId with the App ID of your Agora project.
  // Replace yourChannel with the channel name that you want to join.
  // Replace yourToken with the token that you generated using the App ID and channel name above.
  constructor(props : Props) {
      super(props)
      this.state = {
          appId: '86ae8b0dac6346b6929241a5931107c2',
          channelName: 'test',
          token: '86ae8b0dac6346b6929241a5931107c2',
          joinSucceed: false,
          peerIds: [],
      }
      if (Platform.OS === 'android') {
          requestCameraAndAudioPermission().then(() => {
              console.log('requested!')
          })
      }
  }
  // Other code. See step 5 to step 10.
  componentDidMount() {
    this.init()
}
// Pass in your App ID through this.state, create and initialize an RtcEngine object.
init = async () => {
    const {appId} = this.state
    this._engine = await RtcEngine.create(appId)
    // Enable the video module.
    await this._engine.enableVideo()

    // Listen for the UserJoined callback.
    // This callback occurs when the remote user successfully joins the channel.
    this._engine.addListener('UserJoined', (uid, elapsed) => {
        console.log('UserJoined', uid, elapsed)
        const {peerIds} = this.state
        if (peerIds.indexOf(uid) === -1) {
            this.setState({
                peerIds: [...peerIds, uid]
            })
            console.log('peerIds1', peerIds);
        }
    })

    // Listen for the UserOffline callback.
    // This callback occurs when the remote user leaves the channel or drops offline.
    this._engine.addListener('UserOffline', (uid, reason) => {
        console.log('UserOffline', uid, reason)
        const {peerIds} = this.state
        this.setState({
            // Remove peer ID from state array
            peerIds: peerIds.filter(id => id !== uid)
        })
    })

    // Listen for the JoinChannelSuccess callback.
    // This callback occurs when the local user successfully joins the channel.
    this._engine.addListener('JoinChannelSuccess', (channel, uid, elapsed) => {
        console.log('JoinChannelSuccess', channel, uid, elapsed)
        this.setState({
            joinSucceed: true
        })
    })
}

startCall = async () => {
  await this._engine?.joinChannel(this.state.token, this.state.channelName, null, 0)
}
render() {
  return (
      <View style={styles.max}>
          <View style={styles.max}>
              <View style={styles.buttonHolder}>
                  <TouchableOpacity
                      onPress={this.startCall}
                      style={styles.button}>
                      <Text style={styles.buttonText}> Start Call </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                      onPress={this.endCall}
                      style={styles.button}>
                      <Text style={styles.buttonText}> End Call </Text>
                  </TouchableOpacity>
              </View>
              {this._renderVideos()}
          </View>
      </View>
  )
}

_renderVideos = () => {
  const {joinSucceed} = this.state
  return joinSucceed ? (
      <View style={styles.fullView}>
          <RtcLocalView.SurfaceView
              style={styles.max}
              channelId={this.state.channelName}
              renderMode={VideoRenderMode.Hidden}/>
          {this._renderRemoteVideos()}
      </View>
  ) : null
}

_renderRemoteVideos = () => {
  const {peerIds} = this.state
  console.log('peerIds', peerIds);
  return (
      <ScrollView
          style={styles.remoteContainer}
          contentContainerStyle={{paddingHorizontal: 2.5}}
          horizontal={true}>
          {peerIds.map((value, index, array) => {
              return (
                  <RtcRemoteView.SurfaceView
                      style={styles.remote}
                      uid={value}
                      channelId={this.state.channelName}
                      renderMode={VideoRenderMode.Hidden}
                      zOrderMediaOverlay={true}/>
              )
          })}
      </ScrollView>
  )
}
endCall = async () => {
  await this._engine?.leaveChannel()
  this.setState({peerIds: [], joinSucceed: false})
}

}