const catchAsync = require('../utils/catchAsync');
const { exec } = require('child_process');
const ffmpeg = require('fluent-ffmpeg');

exports.getVideo = catchAsync(async (req, res, next) => {
  const inputFilePath = '../videos/curses.mp4';
  const outputDirectory = '../audios/';
  const outputFileName = 'audio';

  ffmpeg(inputFilePath)
    .noVideo()
    .audioCodec('libmp3lame')
    .save(`${outputDirectory}${outputFileName}.mp3`)
    .on('end', () => {
      console.log(`Audio saved to ${outputDirectory}${outputFileName}.mp3`);
    })
    .on('error', (err) => {
      console.error('Error:', err.message);
    });
  // Response
  res.status(200).json({
    status: 'success',
    data: 'hi',
  });
});
