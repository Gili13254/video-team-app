import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

let ffmpeg: FFmpeg | null = null;

export const getFFmpeg = async () => {
  if (ffmpeg) return ffmpeg;

  ffmpeg = new FFmpeg();

  if (!ffmpeg.loaded) {
    try {
      const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.10/dist/umd';
      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      });
    } catch (error) {
      console.error('Error loading FFmpeg:', error);
      throw error;
    }
  }

  return ffmpeg;
};

export const analyzeAudio = async (videoFile: File) => {
  const ffmpeg = await getFFmpeg();
  
  try {
    // Write the file to FFmpeg's virtual file system
    await ffmpeg.writeFile('input.mp4', await fetchFile(videoFile));
    
    // Run FFmpeg command to analyze audio and get LUFS values
    // -i input.mp4: input file
    // -af ebur128: EBU R128 loudness measurement filter
    // -f null -: output to null device
    await ffmpeg.exec([
      '-i', 'input.mp4',
      '-af', 'ebur128=peak=true:meter=18:dualmono=true',
      '-f', 'null', '-'
    ]);
    
    // Get the log output which contains the LUFS measurements
    const logData = await ffmpeg.readStderr();
    
    // Parse the log to extract LUFS values
    const integratedMatch = /I:\s*([-\d.]+)\s*LUFS/.exec(logData);
    const shortTermMatch = /S:\s*([-\d.]+)\s*LUFS/.exec(logData);
    
    const result = {
      integrated: integratedMatch ? parseFloat(integratedMatch[1]) : null,
      shortTerm: shortTermMatch ? parseFloat(shortTermMatch[1]) : null,
      rawLog: logData
    };
    
    return result;
  } catch (error) {
    console.error('Error analyzing audio:', error);
    throw error;
  }
};

export const isLoudnessWithinPreset = (loudness: number, preset: { target: number, tolerance: number }) => {
  if (loudness === null) return false;
  return Math.abs(loudness - preset.target) <= preset.tolerance;
};
