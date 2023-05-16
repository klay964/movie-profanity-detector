const sdk = require('microsoft-cognitiveservices-speech-sdk');
const Filter = require('bad-words');
const fs = require('fs');

async function transcribeAudio(audioFile) {
  const speechConfig = sdk.SpeechConfig.fromSubscription(
    process.env.AZURE_API_KEY,
    process.env.AZURE_REGION
  );

  const audioConfig = sdk.AudioConfig.fromWavFileInput(audioFile);
  const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

  let result = '';

  recognizer.recognized = (_, event) => {
    if (event.result.text) {
      result += event.result.text;
      console.log(`Recognized: ${event.result.text}`);
    }
  };

  recognizer.startContinuousRecognitionAsync(
    () => {
      console.log('Recognition started');
    },
    (err) => {
      console.error('Error starting recognition:', err);
    }
  );

  await new Promise((resolve, reject) => {
    recognizer.sessionStopped = (_, event) => {
      if (event.error) {
        reject(new Error(event.error));
      } else {
        resolve();
      }
    };
  });

  recognizer.close();

  return result;
}

function detectCurseWords(text) {
  const filter = new Filter();
  const curseWords = filter.isProfane(text);

  return curseWords;
}

function saveCurseWordsWithTimestamps(curseWords) {
  const curseWordsData = curseWords.map((curseWord) => {
    return {
      word: curseWord.word,
      start: curseWord.timestamp,
      end: curseWord.timestamp,
    };
  });

  const dataToSave = curseWordsData
    .map(
      (curseWordData) =>
        `${curseWordData.start} ${curseWordData.end} ${curseWordData.word}`
    )
    .join('\n');

  fs.writeFile('curse_words.txt', dataToSave, 'utf8', (err) => {
    if (err) {
      console.error('Error saving curse words:', err);
    } else {
      console.log('Curse words saved successfully.');
    }
  });
}

function muteVideoUsingFFmpeg(timestampsFilePath, videoFilePath) {
  const inputVideo = videoFilePath;
  const outputVideo = 'muted_video.mp4';

  const timestamps = fs.readFileSync(timestampsFilePath, 'utf8');

  // Generate FFmpeg command to mute specific sections of the video based on curse word timestamps file
  const ffmpegCommand = `-i ${inputVideo} -af "volume=enable='between(t,${timestamps}):volume=0'" ${outputVideo}`;

  exec(`ffmpeg ${ffmpegCommand}`, (error, stdout, stderr) => {
    if (error) {
      console.error('Error muting video:', error);
    } else {
      console.log('Video muted successfully.');
    }
  });
}

module.exports = {
  transcribeAudio,
  detectCurseWords,
  saveCurseWordsWithTimestamps,
  muteVideoUsingFFmpeg,
};
