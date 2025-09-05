import { SpeechConfig, AudioConfig, SpeechSynthesizer, SpeechRecognizer } from "microsoft-cognitiveservices-speech-sdk";

// Load Azure key and region from environment variables
const AZURE_KEY = process.env.AZURE_KEY;
const AZURE_REGION = process.env.AZURE_REGION;

// Function for Text-to-Speech
export async function textToSpeech(text: string) {
    const speechConfig = SpeechConfig.fromSubscription(AZURE_KEY, AZURE_REGION);
    const audioConfig = AudioConfig.fromDefaultSpeakerOutput();
    const synthesizer = new SpeechSynthesizer(speechConfig, audioConfig);
    
    return new Promise<void>((resolve, reject) => {
        synthesizer.speakTextAsync(
            text,
            result => {
                synthesizer.close();
                resolve();
            },
            error => {
                synthesizer.close();
                reject(error);
            }
        );
    });
}

// Function for Speech-to-Text
export async function speechToText() {
    const speechConfig = SpeechConfig.fromSubscription(AZURE_KEY, AZURE_REGION);
    const audioConfig = AudioConfig.fromDefaultMicrophoneInput();
    const recognizer = new SpeechRecognizer(speechConfig, audioConfig);

    return new Promise<string>((resolve, reject) => {
        recognizer.recognizeOnceAsync(
            result => {
                recognizer.close();
                resolve(result.text);
            },
            error => {
                recognizer.close();
                reject(error);
            }
        );
    });
}
