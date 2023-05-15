import React, { useState } from 'react';
import switch_img  from './switch_icon.png';
import './App.css';
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "key",
  authDomain: "domain",
  projectId: "proj_id",
  storageBucket: "storage_bucket",
  messagingSenderId: "msg_id",
  appId: "app_id",
  measurementId: "measurement_id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


// VoiceTranslator component for translating spoken input in real-time
function VoiceTranslator() {
  // state to hold current language code
  const [currentLang, setCurrentLang] = useState('en');
  // state to hold new language code to translate to
  const [newLang, setNewLang] = useState('es');
  // state to hold current spoken input
  const [transcript, setTranscript] = useState('');
  // state to hold translated text
  const [translatedText, setTranslatedText] = useState('');
  // state to hold array of previous transcripts
  const [transcripts, setTranscripts] = useState([]);

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
    { code: 'ru', name: 'Russian' },
    { code: 'nl', name: 'Dutch' },
    { code: 'pl', name: 'Polish' },
    { code: 'tr', name: 'Turkish' },
    { code: 'ru', name: 'Russian' }
  ];

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
  
    // Starts the recognition process
    recognition.start();
  
    // Stops the recognition process after 5 seconds
    setTimeout(() => {
      recognition.stop();
    }, 5000);
  }

  /**
 * handleTranslate is a function that is called when a user clicks the 'Translate' button to initiate translation.
 * It sends a request to the Microsoft Translator Text API to translate the transcript from the current language
 * to the new language and updates the translatedText state with the translated text. It also uses the
 * Web Speech API's SpeechSynthesisUtterance object to speak the translated text.
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
    // .then(data => console.log(JSON.stringify(data, null, 4)))
    .then(data => {
      const translatedText = data[0].translations[0].text;
      // Updates the translatedText state with the translated text
      setTranslatedText(translatedText);
      // Creates a new SpeechSynthesisUtterance object with the translated text
      const utterance = new window.SpeechSynthesisUtterance(translatedText);
      // Sets the language of the utterance to the new language
      utterance.lang = newLang;
      // Uses the Web Speech API's speechSynthesis object to speak the translated text
      let voices = window.speechSynthesis.getVoices();
      for (var i = 0; i < voices.length; i++) {
        if (voices[i].lang.includes(newLang)) {
          utterance.voice = voices[i];
          console.log(utterance.voice);
          console.log('ok');
          break;
        }
      console.log(voices);
    } 
    window.speechSynthesis.speak(utterance);
    })
    .catch(error => console.error(error));
  }
   
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
    </div>
  );
}

export default VoiceTranslator;
