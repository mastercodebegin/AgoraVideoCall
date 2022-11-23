const appId = "1bd345b940a64d218b83193e61758508";
const channelName = 'test';
const apiToken = "NDQ0ODQzY2FlYTQxNDliYThjMzJhMjA3NmFkMTMzYmY6ODQwY2E0NTk5MDU5NDNhNTgxNTllMjFmNzRiZjM1ZWI="

const token = '007eJxTYMgQe9ks9yv9XIr99g6Jee/bWFw/Xp4X3+nEdejFnPtCdwwUGEwszAzMLdIMDAySTEyMzZITjVKNLC2SE1ON0gyNTYyM7m2pSW4IZGRQk+ZjZWSAQBCfhaEktbiEgQEAXRYe/Q=='
const headers = {
  'Content-Type': 'application/json',
  Authorization: 'Basic' + apiToken
}

export async function agoraAcquire(uid: any) {
console.log(uid,'first')
  const url = `https://api.agora.io/v1/apps/${appId}/cloud_recording/acquire`;

  const body = {
    "cname": 'test',
    "uid": uid.toString(),
    "clientRequest": {}
  }

  let response = await fetch(url, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(body)
  })


  let result = await response.json();
  if (result) {
    console.log('agoraAcquire response', result);
    return result
  }

}


export async function agoraVideoStartRecording(resourceId:any,uid:any,testId:any) {
    const url = `https://api.agora.io/v1/apps/${appId}/cloud_recording/resourceid/${resourceId}/mode/mix/start`;
    console.log('resource URl Video Recored', uid)
  
    const body = {
        "cname":channelName,
        "uid":uid.toString(),
        "clientRequest":{
            "token":token,
            "recordingConfig": {
              "maxIdleTime": 100,
              "streamTypes": 2,
              "channelType": 0,
              "transcodingConfig": {
                  "height": 640,
                  "width": 360,
                  "bitrate": 500,
                  "fps": 15,
                  "mixedVideoLayout": 1
              },
              "subscribeUidGroup": 0
          },
          "recordingFileConfig": {
              "avFileType": [
                  "hls","mp4"
              ]
          },
            "storageConfig":{
                "vendor":1,
                "region":14,
                "bucket":'danial-recording',
                "accessKey":'AKIARXNPZ45EUC65TTE2',
               // "accessKey":'AKIAROXKPBVFFGDA7L5M',
                //"secretKey":'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',
                "secretKey":'nD8rpSTLCSUUK/alp9HlPKdSpdqT6t9YC6tIM5Ja',
                "fileNamePrefix": [
                  `testing`
              ]
            }	
        }
    }
    let response = await  fetch(url,{
      method:'POST',
      headers: headers,
      body:JSON.stringify(body)
    })
    let result = await response.json();
  
      if (result) {
       return result
      }
    }



export async function agoraGetQuery(resourceId: any, startingId: any) {

  const url = `https://api.agora.io/v1/apps/${appId}/cloud_recording/resourceid/${resourceId}/sid/${startingId}/mode/mix/query`;

  let response = await fetch(url, {
    method: 'GET',
    headers: headers
  })
  let result = await response.json();

  if (result) {
    return result
  }
}

export async function agoraStopVideoApi(resourceId: any, uid: any, recordingId: any) {
  console.log('resourceId------', resourceId, 'recordingId------------', recordingId, 'uid----------', uid)

  const url = `https://api.agora.io/v1/apps/${appId}/cloud_recording/resourceid/${resourceId}/sid/${recordingId}/mode/mix/stop`;

  const body = {
    "cname": channelName,
    "uid": uid.toString(),
    "clientRequest": {
    },
  }
  let response = await fetch(url, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(body)
  })
  let result = await response.json();

  if (result) {
    return result
  }
}
