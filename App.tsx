import React, { Component } from 'react'
import { Platform, ScrollView, Text, TouchableOpacity, View, PermissionsAndroid, Alert, Image, TouchableHighlight } from 'react-native'
// Import the RtcEngine class and view rendering components into your project.
import RtcEngine, {
    RtcLocalView,
    RtcRemoteView,
    VideoRenderMode,
    LocalVideoStreamState,
    LocalVideoStreamError,
} from 'react-native-agora'
// Import the UI styles.
import styles from './Style'
import {
    agoraAcquire,
    agoraGetQuery,
    agoraStopVideoApi,
    agoraVideoStartRecording,
} from "./agora-Apis";
import { Calendar, CalendarList } from 'react-native-calendars';
//import DatepickerRange from 'react-native-range-datepicker';
import moment from 'moment';
var RNFS = require('react-native-fs');


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
    token: any,
    joinSucceed: boolean,
    isRecording: boolean,
    peerIds: any,
    resourceId: any,
    startingId: any,
    selectedDate: any,
    markedDates: any,
    startDate: any;
    endDate: any;
    startScreenCaptureBool: any;
}

var testTump = 1;
const requestCameraAndAudioPermission = async () => {
    try {
        const granted = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.CAMERA,
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        ])
        if (
            granted['android.permission.RECORD_AUDIO'] === PermissionsAndroid.RESULTS.GRANTED
            && granted['android.permission.CAMERA'] === PermissionsAndroid.RESULTS.GRANTED
            && granted['android.permission.WRITE_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED
            && granted['android.permission.READ_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED
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
            appId: '1bd345b940a64d218b83193e61758508',
            channelName: 'test',
            //token: '007eJxTYGg98d8vcFPqkYIJyQ1v9u+6o2T/dUfLhqZ9frwiLzZrXoxUYDCxMDMwt0gzMDBIMjExNktONEo1srRITkw1SjM0NjEy2vejNLkhkJEhKiWQmZEBAkF8FoaS1OISBgYA9TMhOw==',
            // token: "007eJxTYMgQe9ks9yv9XIr99g6Jee/bWFw/Xp4X3+nEdejFnPtCdwwUGEwszAzMLdIMDAySTEyMzZITjVKNLC2SE1ON0gyNTYyM7m2pSW4IZGRQk+ZjZWSAQBCfhaEktbiEgQEAXRYe/Q==",
            token: "007eJxTYBCYOoF31XfxY74F/T0cpqcbzSYEWB1bs+PomXfXTktMuv1QgcHEwszA3CLNwMAgycTE2Cw50SjVyNIiOTHVKM3Q2MTI6Mq81uSGQEaG+08cmBgZIBDEZ2EoSS0uYWAAAKEzIVI=",
            joinSucceed: false,
            peerIds: [],
            resourceId: '',
            startingId: '',
            selectedDate: "",
            markedDates: {},
            startDate: '',
            endDate: '',
            startScreenCaptureBool: false,
            isRecording: false,
        }
        if (Platform.OS === 'android') {
            requestCameraAndAudioPermission().then(() => {
                console.log('requested!')
            })
        }
    }
    // Other code. See step 5 to step 10.
    componentDidMount() {
        console.log('help')
        this.init()
    }
    // Pass in your App ID through this.state, create and initialize an RtcEngine object.
    init = async () => {
        const { appId, token } = this.state
        this._engine = await RtcEngine.create(appId)
       // const newToken = this._engine.renewToken(token)
        // Enable the video module.
        await this?._engine.enableVideo()

        // Listen for the UserJoined callback.
        // This callback occurs when the remote user successfully joins the channel.
        this?._engine.addListener('Warning', (warn) => {
            // console.log('Warning', warn);
        });

        this?._engine.addListener('Error', (err) => {
            console.log('Error', err);
        });


        this?._engine.addListener('UserJoined', (uid, elapsed) => {
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
        this?._engine.addListener('UserOffline', (uid, reason) => {
            console.log('UserOffline', uid, reason)
            const { peerIds } = this.state
            this.setState({
                // Remove peer ID from state array
                peerIds: peerIds.filter((id: number) => id !== uid)
            })
        })

        // Listen for the JoinChannelSuccess callback.
        // This callback occurs when the local user successfully joins the channel.
        this?._engine.addListener('JoinChannelSuccess', (channel, uid, elapsed) => {
            console.log('JoinChannelSuccess-----------------', channel, uid, elapsed)
            this.setState({
                joinSucceed: true
            })

            // const responce = await agoraAcquire(uid)
            // if (responce) {
            //     console.log('resourceId-------------', responce)
            //       this.agoraStartVideoRecordingApi(responce)

            // }

        });

        // this._engine?.startScreenCapture



    }

    enableRecording = () => {
        this.setState({ isRecording: true })
        const albumPath = `${RNFS.PicturesDirectoryPath}/${'Faltu'}`;

        const fileName = `${new Date().getTime()}.mp4`;
        const filePathInCache = `${RNFS.CachesDirectoryPath}/${fileName}`;
        const filePathInAlbum = `${albumPath}/${fileName}`;

        var config = {
            storagePath: filePathInAlbum,
            containerFormat: 1,
            streamType: 0x3,
            maxDurationMs: 9000000,
            recorderInfoUpdateInterval: 10000,
        }
        if (this.state.joinSucceed) {
            console.log("Recording started!!")
            this._engine?.startRecording(config)
                .catch((e) => console.log("errorrrr", e))

        } else {
            console.log("Please join first")
        }
        return RNFS.mkdir(albumPath)
            .then(() => {
                RNFS.writeFile(filePathInCache, 'base64').then(() => RNFS.copyFile(filePathInCache, filePathInAlbum)
                    // Next step to show album without the need to re-boot your device:
                    .then(() => RNFS.scanFile(filePathInAlbum))
                    .then(() => {
                        console.log('File Saved Successfully!');
                    }));
            })
            .catch((error:any) => {
                console.log('Could not create dir', error);
            });

      
        // this._engine?.startScreenCapture(config).then((result)=> {
        //     console.log("result", result);
        //     }).catch((e) => console.log("errorrrr",e))
    }

    stopRecording = () => {
        this.setState({ isRecording: false })
        if (this.state.joinSucceed) {
            console.log("Recording stopped!!")
            this._engine?.stopRecording()
        }
        // this._engine?.stopScreenCapture()
    }

    startCall = async () => {
        try {
            await this?._engine?.joinChannel(this.state.token, this.state.channelName, null, 0)
            console.log("this.state.channelName", this.state.channelName);
            console.log("this.state.token", this.state.token);
        } catch (error) {
            console.log("error", error);
        }
        // setTimeout(() => {
        //     this.agoraSavedvideoApi()
        // }, 3000);
    }

    agoraSavedvideoApi = async () => {
        let uid = this.state.peerIds.length > 0 && this.state.peerIds[0]

        console.log('start-video ID------------------------', uid);
        console.log('peerIds------------------------', this.state.peerIds);

        //"calling  agoraAcquire For resourceId"
        const responce = await agoraAcquire(uid)
        if (responce) {
            console.log('resourceId-------------', responce)
            this.agoraStartVideoRecordingApi(responce)

        }
    }

    agoraStartVideoRecordingApi = async (resourceId: any) => {
        let uid = this.state.peerIds.length > 0 && this.state.peerIds[0]
        console.log('agoraStartVideoRecordingApi peerIds----------', uid);

        const responseStartVideo = await agoraVideoStartRecording(resourceId.resourceId, uid, 'test')
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
        console.log('--------', date);
        let markedDates = {};
        //@ts-ignore
        markedDates[date] = { startingDay: true, color: 'lightgreen', endingDay: true };
        let serviceDate = moment(date);
        //@ts-ignore

        serviceDate = serviceDate.format("DD.MM.YYYY");
        this.setState({
            selectedDate: serviceDate,
            markedDates: markedDates
        });
    };

    render() {
        console.log(this.state.startDate, this.state.endDate);
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
                        {this.state.joinSucceed &&
                            <View style={styles.btnContainer}>
                                <TouchableHighlight onPress={this.state.isRecording ? this.stopRecording : this.enableRecording} >
                                    <View style={styles.btnWrapper}>
                                        <View style={this.state.isRecording ? styles.btnActive : styles.btnDefault} />
                                    </View>
                                </TouchableHighlight>
                            </View>
                        }
                    </View>
                    {this._renderVideos()}

                </View>
                {/* <DatepickerRange
                  monthProps={{
                    titleStyle: { fontSize: 10, padding: 10 },
                }}
                    startDate={this.state.startDate}
                    dayHeadings={['SUN', 'MON', 'TUE', 'WED', 'THUR', 'FRI', 'SAT']}
                    closeButtonText='Help'
                    dayHeaderDividerColor={"red"}
                    buttonColor={'green'}
                    onSelect={() => {this.setState({startDate:'',endDate:''})}}
                    todayColor={'red'}
                    showReset={true}
                    showClose={false}
                    chosenDateTextColor={'red'}
                    untilDate={this.state.endDate}
                    onConfirm={(startDate: any, untilDate: any) => startDate && untilDate ?  this.setState({ startDate :moment(new Date(startDate?.$d.toString().substr(0, 16))).format("DD/MMM/YYYY"), endDate:moment(new Date(untilDate?.$d.toString().substr(0, 16))).format("DD/MMM/YYYY") }) : Alert.alert('Please Select start date and End date')}
                /> */}
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
                {peerIds.map((value: number, index: any, array: any) => {
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
        if (this.state.joinSucceed) {
            console.log("Recording stopped!!")
            this._engine?.stopRecording()
        }
        this.agoraStopVideo()
        this.setState({ peerIds: [], joinSucceed: false })
        await this?._engine?.leaveChannel()
    }


}