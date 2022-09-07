const appId = "86ae8b0dac6346b6929241a5931107c2";
const channelName = 'test';
const apiToken="NDQ0ODQzY2FlYTQxNDliYThjMzJhMjA3NmFkMTMzYmY6ODQwY2E0NTk5MDU5NDNhNTgxNTllMjFmNzRiZjM1ZWI="

// const token = '00612a7d67b803b4e7f96ec1355192490a3IACnf+/qALdmTwHz+yycY9OACaZRC5kAUcoHxnkL6s+CwsN2C/EAAAAAEAAorRuJ9jxqYgEAAQD1PGpi'
const headers = {
  'Content-Type': 'application/json',
  Authorization:'Basic'+ apiToken
//   Authorization:'Basic YzMwNTEwYzg4Yjc0NGJmNmI5ZTQyN2UwZTlmMmZhOTA6ZjhkMTM2NGUzMmI5NDc5YzhlMWRmOTMzOGJiNDdlMmQ='
}

export async function agoraAcquire(uid:any) {
 
  const url = `https://api.agora.io/v1/apps/${appId}/cloud_recording/acquire`;
  console.log('UIDDD', uid)

  const body = {
    "cname": 'test',
    "uid": uid.toString(),
    "clientRequest":{
      "region": "CN",
        "resourceExpiredHour": 24,
    }
  }
  
  let response = await  fetch(url,{
    method:'POST',
    headers: headers,
    body:JSON.stringify(body)
  })

  
  let result = await response.json();
  if(result){
    console.log('agoraAcquire response', result);
    return result
  }
   
}


export async function agoraVideoStartRecording(resourceId:any,uid:any,testId:any) {
 //console.log(userData,"Data Video Recored")
    const url = `https://api.agora.io/v1/apps/${appId}/cloud_recording/resourceid/${resourceId}/mode/mix/start`;
    console.log('resource URl Video Recored', url)
  
    const body = {
        "cname":channelName,
        "uid":uid.toString(),
        "clientRequest":{
            "token":'86ae8b0dac6346b6929241a5931107c2',
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
                "bucket":'s3-user',
                //"accessKey":'AKIAUQQB7EDFMX6PWAAL',
               // "accessKey":'AKIAROXKPBVFFGDA7L5M',
                //"secretKey":'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',
                "secretKey":'RRX4EdVIXig+ku0YTKBvHLpPmEuorU1yX1hJENXL',
                "fileNamePrefix": [
                  `${testId}${testId}`
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



  export async function agoraGetQuery(resourceId:any,startingId:any) {
    console.log(startingId,resourceId,"mix")
 
    const url = `https://api.agora.io/v1/apps/${appId}/cloud_recording/resourceid/${resourceId}/sid/${startingId}/mode/mix/query`;
  
    let response = await  fetch(url,{
      method:'GET',
      headers: headers
    })
    let result = await response.json();
  
      if (result) {
       return result
      }
  }

  export async function agoraStopVideo(resourceId:any,uid:any,recordingId:any) {
    console.log(recordingId,resourceId,uid,"mix")
 
    const url = `https://api.agora.io/v1/apps/${appId}/cloud_recording/resourceid/${resourceId}/sid/${recordingId}/mode/mix/stop`;
  
    const body = {
        "cname":channelName,
        "uid":uid.toString(),
        "clientRequest":{
                },
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
