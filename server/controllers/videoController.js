const catchAsync = require('../utils/catchAsync');
const { exec } = require('child_process');
const sdk = require('microsoft-cognitiveservices-speech-sdk');
const fs = require('fs');

exports.getVideo = catchAsync(async (req, res, next) => {
  const command = `ffmpeg -i curses.mp4 -vn -c:a libmp3lame audio.wav`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      console.error(`stderr: ${stderr}`);
      return;
    }
    console.log(`Audio saved`);
  });
  console.log('dlskdsld');
  const apiKey = '3a015525cf8145969e4c10bf06acfab6';
  const region = 'eastus';
  const speechConfig = sdk.SpeechConfig.fromSubscription(apiKey, region);

  const audioConfig = sdk.AudioConfig.fromStreamInput('audio.wav');
  speechConfig.enableDictation();
  speechConfig.speechRecognitionLanguage = 'en-US';
  const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);
  processmsg = '.';
  recognizer.recognizing = (s, e) => {
    processmsg = processmsg + '.';
    console.log('processing .' + processmsg);
  };
  const outputmsg = '';
  recognizer.recognized = (s, e) => {
    outputmsg = outputmsg + e.result.text;
    console.log('Output : ', outputmsg);
    if (e.result.reason == ResultReason.RecognizedSpeech) {
      console.log(`RECOGNIZED: Text=${e.result.text}`);
    } else if (e.result.reason == ResultReason.NoMatch) {
      console.log('NOMATCH: Speech could not be recognized.');
    }
  };
  // Response
  // res.status(200).json({
  //   status: 'success',
  //   data: 'hi',
  // });
});
