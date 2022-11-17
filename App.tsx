import React, { Component } from 'react'
import { Platform, ScrollView, Text, TouchableOpacity, View, PermissionsAndroid, Alert } from 'react-native'
// Import the RtcEngine class and view rendering components into your project.
import RtcEngine, { RtcLocalView, RtcRemoteView, ScreenVideoParameters, VideoRenderMode } from 'react-native-agora'
// Import the UI styles.
import styles from './Style'
import { agoraAcquire, agoraGetQuery, agoraStopVideoApi, agoraVideoStartRecording } from "./agora-Apis";
import { Calendar, CalendarList } from 'react-native-calendars';
import moment from 'moment';

// const appId = "86ae8b0dac6346b6929241a5931107c20";
const channelName = 'Video';
const token = '00612a7d67b803b4e7f96ec1355192490a3IACnf+/qALdmTwHz+yycY9OACaZRC5kAUcoHxnkL6s+CwsN2C/EAAAAAEAAorRuJ9jxqYgEAAQD1PGpi'
const headers = {
    'Content-Type': 'application/json',
    Authorization: 'Basic YzMwNTEwYzg4Yjc0NGJmNmI5ZTQyN2UwZTlmMmZhOTA6ZjhkMTM2NGUzMmI5NDc5YzhlMWRmOTMzOGJiNDdlMmQ='
}
const tempToken = "007eJxTYNji0SXfcvCLQ/CGST/SRQVrfKa/+GJ0con9BtvXcUk3hH4oMFiYJaZaJBmkJCabGZuYJZlZGlkamRgmmloaGxoamCcbMUfkJTcEMjI84qljZGSAQBCfhaEktbiEgQEAeRsfPQ=="
interface Props {

}

// Define a State interface.
interface State {
    appId: string,
    channelName: string,
    token: string,
    joinSucceed: boolean,
    peerIds: number[],
    resourceId: any,
    startingId: any,
    selectedDate:any,
    markedDates:any

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
            resourceId: '',
            startingId: '',
            
                selectedDate: "",
                markedDates: {}
            
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

            // const responce = await agoraAcquire(uid)
            // if (responce) {
            //     console.log('resourceId-------------', responce)
            //       this.agoraStartVideoRecordingApi(responce)

            // }

        })
    }

    startCall = async () => {

        await this._engine?.joinChannel(tempToken, this.state.channelName, null, 0)
        setTimeout(() => {
            this._engine?.startScreenCapture({ videoParams: { bitrate: 200, frameRate: 100 } })
            // this.agoraSavedvideoApi()
        }, 3000);
    }

    agoraSavedvideoApi = async () => {
        let uid = this.state.peerIds.length > 0 && this.state.peerIds[0]

        console.log('start-video ID------------------------', uid);
        console.log('peerIds------------------------', this.state.peerIds);

        console.log('start-video ID2', this.state.peerIds[0]);
        //"calling  agoraAcquire For resourceId"
        const resourceId = await agoraAcquire(uid)
        if (resourceId) {
            console.log('Aquire resourceId-------------', resourceId)
            this.agoraStartVideoRecordingApi(resourceId)

        }
    }

    agoraStartVideoRecordingApi = async (resourceId: any) => {
        let uid = this.state.peerIds.length > 0 && this.state.peerIds[0]
        console.log('agoraStartVideoRecordingApi peerIds----------', uid);

        const responseStartVideo = await agoraVideoStartRecording(resourceId.resourceId, uid,)
        if (responseStartVideo) {
            console.log('agoraVideoStartRecording-----------------------', responseStartVideo,)
            const responce2 = await agoraGetQuery(responseStartVideo.resourceId, responseStartVideo.sid)
            if (responce2) {
                console.log("query-data Recording status--------------", responce2)
            }
            this.setState({ resourceId: responseStartVideo.resourceId, startingId: responseStartVideo.sid })
        }
    }

    agoraStopVideo = async () => {
        let uid = this.state.peerIds.length > 0 && this.state.peerIds[0]
        console.log('agoraStopvideoApi------------', uid);

        const stopVideoResponce = await agoraStopVideoApi(this.state.resourceId, uid, this.state.startingId)
        if (stopVideoResponce) {
            console.log("stop-video-------------", stopVideoResponce)
        }
    }
//@ts-ignore
    getSelectedDayEvents = date => {
        console.log('--------',date);
        
        let markedDates = {};
        //@ts-ignore

        markedDates[date]= { selected: true, color: '#00B0BF', textColor: '#FFFFFF' };
        let serviceDate = moment(date);
                //@ts-ignore

        serviceDate = serviceDate.format("DD.MM.YYYY");
        this.setState({
            selectedDate: serviceDate,
            markedDates: markedDates
        });
    };

    render() {
        return (
            <View style={styles.max}>
                {/* <View style={styles.max}>
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
                </View> */}
               <Calendar
  style={{ height: 300, width: "90%", justifyContent: "center" }}
  theme={{
    backgroundColor: "#ffffff",
    calendarBackground: "#ffffff",
    todayTextColor: "#57B9BB",
    dayTextColor: "#222222",
    textDisabledColor: "#d9e1e8",
    monthTextColor: "#57B9BB",
    arrowColor: "#57B9BB",
    textDayFontWeight: "300",
    textMonthFontWeight: "bold",
    textDayHeaderFontWeight: "500",
    textDayFontSize: 16,
    textMonthFontSize: 18,
    selectedDayBackgroundColor: "#57B9BB",
    selectedDayTextColor: "white",
    textDayHeaderFontSize: 8
  }}
  minDate={"1996-05-10"}
  maxDate={"2030-05-30"}
  monthFormat={"MMMM yyyy "}
  markedDates={this.state.markedDates}
  scrollEnabled={true}
  horizontal={true}
  showScrollIndicator={true}
  disableMonthChange={true}
  onDayPress={day => {
    this.getSelectedDayEvents(day.dateString);
  }}
/>
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
        this.agoraStopVideo()
        this.setState({ peerIds: [], joinSucceed: false })
        await this._engine?.leaveChannel()
    }


}