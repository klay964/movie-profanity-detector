const catchAsync = require('../utils/catchAsync');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const fs = require('fs');
const {
  transcribeAudio,
  detectCurseWords,
  saveCurseWordsWithTimestamps,
} = require('../utils/helpers');

exports.getVideo = catchAsync(async (req, res, next) => {
  const command = `ffmpeg -i curses.mp4 -vn -acodec pcm_s16le -ar 16000 -ac 1 audio.wav`;
  exec(command, async (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      console.error(`stderr: ${stderr}`);
      return;
    }

    const audioFileName = '../audio.wav';
    const audioFilePath = path.join(__dirname, audioFileName);

    // Check if the file exists before transcribing
    if (fs.existsSync(audioFilePath)) {
      const transcribedText = await transcribeAudio(audioFilePath);
      const badWords = detectCurseWords(transcribedText);
      saveCurseWordsWithTimestamps(badWords);
      muteVideoUsingFFmpeg('curse_words.txt', 'audio.wav');
      // Response
      res.sendFile('muted_video.mp4');
    } else {
      console.error('Audio file does not exist:', audioFilePath);
    }
  });
});
