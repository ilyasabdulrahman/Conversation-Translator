import React, { useEffect, useState } from 'react';
import switch_img  from './switch_icon.png';
import './App.css';
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import AWS from 'aws-sdk';

AWS.config.update({
  accessKeyId: 'key',
  secretAccessKey: 'key',
  region: 'location' 
});

const polly = new AWS.Polly();

const params = {
  OutputFormat: 'mp3',
  Text: 'Hello, welcome to the Conversation Translator. To start using the app, click the "Input" button and allow your microphone to be enabled. You will then be given a chance to say any phrase you would like in your selected language. Then click the "Translate" button to translate your input to the new language of your choice. The button on the far right will allow you to swap the specified languages. Enjoy.',
  VoiceId: 'Joanna'
};

polly.synthesizeSpeech(params, (err, data) => {
  if (err) {
    console.log(err);
  } else {
    const audioElement = document.getElementById('audio');
    audioElement.src = `data:audio/mp3;base64,${data.AudioStream.toString('base64')}`;
    audioElement.play();
  }
});

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "Key",
  authDomain: "domain",
  projectId: "projectid",
  storageBucket: "storage",
  messagingSenderId: "messageid",
  appId: "appid",
  measurementId: "measurementid"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// VoiceTranslator component for translating spoken input in real-time
function VoiceTranslator() {
  const [currentLang, setCurrentLang] = useState('en');
  const [newLang, setNewLang] = useState('es');
  const [transcript, setTranscript] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [transcripts, setTranscripts] = useState([]);
  const [isFirstLoad, setIsFirstLoad] = useState(true); // Added isFirstLoad state variable

  // array of language options with code and name
  const languageOptions = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'it', name: 'Italian' },
    { code: 'ar', name: 'Arabic' },
    { code: 'de', name: 'German' },
    { code: 'hi', name: 'Hindi' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'zh', name: 'Chinese' },
    { code: 'nl', name: 'Dutch' },
    { code: 'pl', name: 'Polish' },
    { code: 'tr', name: 'Turkish' },
    { code: 'ru', name: 'Russian' }
  ];

  function getVoiceIdFromLanguageCode(languageCode) {
    switch (languageCode) {
      case 'en':
        return 'Joanna';
      case 'es':
        return 'Miguel';
      case 'fr':
        return 'Mathieu';
      case 'it':
        return 'Carla';
      case 'ar':
        return 'Zeina';
      case 'de':
        return 'Vicki';
      case 'hi':
        return 'Aditi';
      case 'ja':
        return 'Mizuki';
      case 'ko':
        return 'Seoyeon';
      case 'pt':
        return 'Ricardo';
      case 'zh':
        return 'Zhiyu';
      case 'nl':
        return 'Lotte';
      case 'pl':
        return 'Ewa';
      case 'tr':
        return 'Filiz';
      case 'ru':
        return 'Tatyana';
      default:
        return 'Joanna'; // Default to Joanna if the language code is not found
    }
  }
  

    /**
   * handleSwitch is a function to handle switching of languages for translation
   *
   * This function is called when the user clicks the switch button. It swaps
   * the current language and new language codes, which updates the languages
   * used for translation.
   */
  function handleSwitch() {
  // swaps current language and new language codes
  setCurrentLang(newLang);
  setNewLang(currentLang);
  }
  

  let recognition;

  /**
 * handleClickToConvert is a function that is called when a user clicks the 'Input' button to initiate speech recognition.
 * It first starts the speech recognition process, then sets the language for the recognition to the current language,
 * and sets interimResults to true so that the recognition can process intermediate results before the
 * user has finished speaking. It also sets an onresult event handler that updates the transcript state
 * with the latest transcript and adds it to the transcripts state array.
 *
 */
   function handleClickToConvert() {
    // Resets the user's input and translations
    setTranslatedText('');
    setTranscript('');
  
    // Stops and aborts the recognition process if the recognition object exists
    if (recognition) {
      recognition.stop();
      recognition.abort();
    }
  
    // Checks if the speechRecognition API is available in the current browser
    if ('speechRecognition' in window) {
      recognition = new window.SpeechRecognition();
    } else {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition = new SpeechRecognition();
    }
  
    // Sets the language for the recognition to the current language
    recognition.lang = currentLang;
    // Sets interimResults to true so that the recognition can process intermediate results before the user has finished speaking
    recognition.interimResults = true;
  
    // Sets an onresult event handler that updates the transcript state with the latest transcript
    // and adds it to the transcripts state array
    recognition.onresult = (e) => {
      const latestTranscript = Array.from(e.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join('');
      setTranscript(latestTranscript);
      setTranscripts((prevTranscripts) => [...prevTranscripts, latestTranscript]);
    };
  
    // Sets an onend event handler that stops the recognition process when the user stops speaking
    recognition.onend = () => {
      recognition.stop();
    };
  
    // Starts the recognition process
    recognition.start();
  }
  

  /**
 * handleTranslate is a function that is called when a user clicks the 'Translate' button to initiate translation.
 * It sends a request to the Microsoft Translator Text API to translate the transcript from the current language
 * to the new language and updates the translatedText state with the translated text. It also uses the
 * AWS Polly to speak the translated text.
 */
   function handleTranslate() {
    const { v4: uuidv4 } = require('uuid');
  
    let key = "key";
    let endpoint = "endpoint";
    let location = "region";
  
    let requestBody = JSON.stringify([{
      'text': transcript
    }]);
  
    let requestParams = new URLSearchParams({
      'api-version': '3.0',
      'from': currentLang,
      'to': newLang
    }).toString();
  
    fetch(`${endpoint}/translate?${requestParams}`, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': key,
        'Ocp-Apim-Subscription-Region': location,
        'Content-Type': 'application/json',
        'X-ClientTraceId': uuidv4().toString()
      },
      body: requestBody
    })
      .then(response => response.json())
      .then(data => {
        const translatedText = data[0].translations[0].text;
        // Updates the translatedText state with the translated text
        setTranslatedText(translatedText);
  
        // Use AWS Polly to speak the translated text
        const pollyParams = {
          OutputFormat: 'mp3',
          Text: translatedText,
          VoiceId: getVoiceIdFromLanguageCode(newLang)
        };
  
        polly.synthesizeSpeech(pollyParams, (err, data) => {
          if (err) {
            console.log(err);
          } else {
            const audioElement = document.getElementById('audio');
            audioElement.src = `data:audio/mp3;base64,${data.AudioStream.toString('base64')}`;
            audioElement.play();
          }
        });
      })
      .catch(error => console.error(error));
  }
  
  useEffect(() => {
    // Code to run when isFirstLoad changes
    if (isFirstLoad) {
      polly.synthesizeSpeech(params, (err, data) => {
        if (err) {
          console.log(err);
        } else {
          const audioElement = document.getElementById('audio');
          audioElement.src = `data:audio/mp3;base64,${data.AudioStream.toString('base64')}`;
          audioElement.play();
        }
      });
      setIsFirstLoad(false); // Set isFirstLoad to false after playing audio
    }
  }, [isFirstLoad]); // Added isFirstLoad as a dependency for the useEffect hook


// responsiveVoice.speak("Hello, how are you?", "UK English Male");


return (
  <div className="voice_to_text">
    <h1>Conversation Translator</h1>

    <textarea
      className="convert_text"
      id="convert_text"
      value={translatedText ? translatedText.toLowerCase() : transcript.toLowerCase()}
      readOnly
    ></textarea>

    <button id="click_to_convert" onClick={handleClickToConvert}>
      Input
    </button>
    <button id="translate" onClick={handleTranslate}>
      Translate
    </button>
    <button id="switch_btn" onClick={handleSwitch} style={{ position: 'relative' }}>
      <img
        src={switch_img}
        alt="Switch"
        style={{
          height: '50px',
          width: '50px',
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      />
    </button>

    <div style={{ marginTop: '20px', justifyContent: 'space-between' }}>
      <label>Current Language: </label>
      <select value={currentLang} onChange={(e) => setCurrentLang(e.target.value)}>
        {languageOptions.map((option) => (
          <option key={option.code} value={option.code}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
    <div>
      <label>New Language: </label>
      <select value={newLang} onChange={(e) => setNewLang(e.target.value)}>
        {languageOptions.map((option) => (
          <option key={option.code} value={option.code}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
    <div>
    <audio id="audio" controls style={{ marginTop: '30px' }}></audio>
    </div>
  </div>
);
}

export default VoiceTranslator;

