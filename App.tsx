import React, { Component } from 'react'
import { Platform, ScrollView, Text, TouchableOpacity, View, PermissionsAndroid, Alert } from 'react-native'
// Import the RtcEngine class and view rendering components into your project.
import RtcEngine, { RtcLocalView, RtcRemoteView, VideoRenderMode } from 'react-native-agora'
// Import the UI styles.
import styles from './Style'
import { agoraAcquire, agoraGetQuery, agoraStopVideo, agoraVideoStartRecording } from "./agora-Apis";

const appId = "86ae8b0dac6346b6929241a5931107c2";
const channelName = 'Video';
const token = '00612a7d67b803b4e7f96ec1355192490a3IACnf+/qALdmTwHz+yycY9OACaZRC5kAUcoHxnkL6s+CwsN2C/EAAAAAEAAorRuJ9jxqYgEAAQD1PGpi'
const headers = {
    'Content-Type': 'application/json',
    Authorization: 'Basic YzMwNTEwYzg4Yjc0NGJmNmI5ZTQyN2UwZTlmMmZhOTA6ZjhkMTM2NGUzMmI5NDc5YzhlMWRmOTMzOGJiNDdlMmQ='
}

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

var testTump = 1;
const requestCameraAndAudioPermission = async () => {
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
    constructor(props: Props) {
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
        const { appId } = this.state
        this._engine = await RtcEngine.create(appId)
        // Enable the video module.
        await this._engine.enableVideo()

        // Listen for the UserJoined callback.
        // This callback occurs when the remote user successfully joins the channel.
        this._engine.addListener('UserJoined', (uid, elapsed) => {
            console.log('UserJoined', uid, elapsed)
            const { peerIds } = this.state
            if (peerIds.indexOf(uid) === -1) {
                this.setState({
                    peerIds: [...peerIds, uid]
                })
                console.log('updated peerids---------', peerIds);
                console.log('---------', peerIds);
            }
        })

        // Listen for the UserOffline callback.
        // This callback occurs when the remote user leaves the channel or drops offline.
        this._engine.addListener('UserOffline', (uid, reason) => {
            console.log('UserOffline', uid, reason)
            const { peerIds } = this.state
            this.setState({
                // Remove peer ID from state array
                peerIds: peerIds.filter(id => id !== uid)
            })
        })

        // Listen for the JoinChannelSuccess callback.
        // This callback occurs when the local user successfully joins the channel.
        this._engine.addListener('JoinChannelSuccess', (channel, uid, elapsed) => {
            console.log('JoinChannelSuccess-----------------', channel, uid, elapsed)
            this.setState({
                joinSucceed: true
            })
            const data = async () => {

                const responce = await agoraAcquire(uid)
                if (responce) {
                    console.log('resourceId-------------', responce)
                    //   this.agoraStartVideoRecordingApi(responce)

                }
            }
            data();
        })
    }

    startCall = async () => {
        await this._engine?.joinChannel(null, this.state.channelName, null, 0)
        setTimeout(() => {

            // this.agoraSavedvideoApi()
        }, 3000);
    }

    agoraSavedvideoApi = async () => {
        let uid = this.state.peerIds.length > 0 && this.state.peerIds[0]
        console.log('start-video ID', uid);
        console.log('peerIds--', this.state.peerIds);

        console.log('start-video ID2', this.state.peerIds[0]);
        //"calling  agoraAcquire For resourceId"
        const responce = await agoraAcquire(uid)
        if (responce) {
            console.log('resourceId-------------', responce)
            //   this.agoraStartVideoRecordingApi(responce)

        }
    }

    agoraStartVideoRecordingApi = async (responce: any) => {
        testTump = testTump + 1;
        let uid = this.state.peerIds.length > 0 && this.state.peerIds[0]
        const responce1 = await agoraVideoStartRecording(responce.resourceId, uid, testTump)
        if (responce1) {
            console.log(responce1, "start-video")
            const responce2 = await agoraGetQuery(responce1.resourceId, responce1.sid)
            if (responce2) {
                console.log(responce2, "query-data")
            }
            //this.setState({ resourceId: responce1.resourceId, startingId: responce1.sid })
        }
    }

    //   agoraStopvideoApi = async () => {
    //     let uid = this.state.peerIds.length > 0 && this.state.peerIds[0]
    //     const responce = await agoraStopVideo(this.state.resourceId, uid, this.state.startingId)
    //     if (responce) {
    //       console.log(responce, "stop-video")
    //     }
    //   }

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
        const { joinSucceed } = this.state
        return joinSucceed ? (
            <View style={styles.fullView}>
                <RtcLocalView.SurfaceView
                    style={styles.max}
                    channelId={this.state.channelName}
                    renderMode={VideoRenderMode.Hidden} />
                {this._renderRemoteVideos()}
            </View>
        ) : null
    }

    _renderRemoteVideos = () => {
        const { peerIds } = this.state
        console.log('peerIds', peerIds);
        return (
            <ScrollView
                style={styles.remoteContainer}
                contentContainerStyle={{ paddingHorizontal: 2.5 }}
                horizontal={true}>
                {peerIds.map((value, index, array) => {
                    return (
                        <RtcRemoteView.SurfaceView
                            style={styles.remote}
                            uid={value}
                            channelId={this.state.channelName}
                            renderMode={VideoRenderMode.Hidden}
                            zOrderMediaOverlay={true} />
                    )
                })}
            </ScrollView>
        )
    }
    endCall = async () => {
        await this._engine?.leaveChannel()
        this.setState({ peerIds: [], joinSucceed: false })
    }


}