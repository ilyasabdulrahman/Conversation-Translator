import React, { useState } from 'react';
import switch_img  from './switch_icon.png';
import './App.css';

// VoiceTranslator component for translating spoken input in real-time
function VoiceTranslator() {
  // state to hold current language code
  const [currentLang, setCurrentLang] = useState('en');
  // state to hold new language code to translate to
  const [newLang, setNewLang] = useState('ar');
  // state to hold current spoken input
  const [transcript, setTranscript] = useState('');
  // state to hold translated text
  const [translatedText, setTranslatedText] = useState('');
  // state to hold array of previous transcripts
  const [transcripts, setTranscripts] = useState([]);

  // array of language options with code and name
  const languageOptions = [
    { code: 'en', name: 'English' },
    { code: 'ar', name: 'Arabic' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'hi', name: 'Hindi' },
    { code: 'it', name: 'Italian' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'es', name: 'Spanish' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ru', name: 'Russian' }
  ];

  // ...


  // const languageOptions = [
  //   { code: 'af', name: 'Afrikaans' },
  //   { code: 'ar', name: 'Arabic' },
  //   { code: 'bn', name: 'Bengali' },
  //   { code: 'bs-Latn', name: 'Bosnian (Latin)' },
  //   { code: 'bg', name: 'Bulgarian' },
  //   { code: 'ca', name: 'Catalan' },
  //   { code: 'zh-Hans', name: 'Chinese Simplified' },
  //   { code: 'zh-Hant', name: 'Chinese Traditional' },
  //   { code: 'hr', name: 'Croatian' },
  //   { code: 'cs', name: 'Czech' },
  //   { code: 'da', name: 'Danish' },
  //   { code: 'nl', name: 'Dutch' },
  //   { code: 'en', name: 'English' },
  //   { code: 'et', name: 'Estonian' },
  //   { code: 'fi', name: 'Finnish' },
  //   { code: 'fr', name: 'French' },
  //   { code: 'de', name: 'German' },
  //   { code: 'el', name: 'Greek' },
  //   { code: 'ht', name: 'Haitian Creole' },
  //   { code: 'he', name: 'Hebrew' },
  //   { code: 'hi', name: 'Hindi' },
  //   { code: 'hu', name: 'Hungarian' },
  //   { code: 'is', name: 'Icelandic' },
  //   { code: 'id', name: 'Indonesian' },
  //   { code: 'it', name: 'Italian' },
  //   { code: 'ja', name: 'Japanese' },
  //   { code: 'km', name: 'Khmer' },
  //   { code: 'ko', name: 'Korean' },
  //   { code: 'lv', name: 'Latvian' },
  //   { code: 'lt', name: 'Lithuanian' },
  //   { code: 'ms', name: 'Malay' },
  //   { code: 'mt', name: 'Maltese' },
  //   { code: 'no', name: 'Norwegian' },
  //   { code: 'fa', name: 'Persian' },
  //   { code: 'pl', name: 'Polish' },
  //   { code: 'pt', name: 'Portuguese' },
  //   { code: 'ro', name: 'Romanian' },
  //   { code: 'ru', name: 'Russian' },
  //   { code: 'sr-Cyrl', name: 'Serbian (Cyrillic)' },
  //   { code: 'sr-Latn', name: 'Serbian (Latin)' },
  //   { code: 'sk', name: 'Slovak' },
  //   { code: 'sl', name: 'Slovenian' },
  //   { code: 'es', name: 'Spanish' },
  //   { code: 'sv', name: 'Swedish' },
  //   { code: 'th', name: 'Thai' },
  //   { code: 'tr', name: 'Turkish' },
  //   { code: 'uk', name: 'Ukrainian' },
  //   { code: 'ur', name: 'Urdu' },
  //   { code: 'vi', name: 'Vietnamese' },
  //   { code: 'cy', name: 'Welsh' },
  //   { code: 'yi', name: 'Yiddish' }
  // ];

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
    // Stops and abort the recognition process if recogntion object exists
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
  }
  

  /**
 * handleTranslate is a function that is called when a user clicks the 'Translate' button to initiate translation.
 * It sends a request to the Microsoft Translator Text API to translate the transcript from the current language
 * to the new language and updates the translatedText state with the translated text. It also uses the
 * Web Speech API's SpeechSynthesisUtterance object to speak the translated text.
 */
   function handleTranslate() {
    // Sets the method/option for the request to the Microsoft Translator Text API
    const options = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'X-RapidAPI-Key': 'c046f96e16mshe7b297b47722d38p123d49jsn2484bd64abd4',
        'X-RapidAPI-Host': 'microsoft-translator-text.p.rapidapi.com'
      },
      body:  `[{"Text": "${transcript}"}]` // Include the transcript in the request body
    };
    
    // Sends a request to the Microsoft Translator Text API to translate the transcript from the current language to the new language
    fetch(`https://microsoft-translator-text.p.rapidapi.com/translate?to%5B0%5D=${newLang}&api-version=3.0&profanityAction=NoAction&fromScript=${currentLang}&textType=plain`, options)
      .then(response => response.json()) // Parse the response as JSON
      .then(response => {
        // Gets the translated text from the response
        const translatedText = response[0].translations[0].text;
        // Updates the translatedText state with the translated text
        setTranslatedText(translatedText);
        // Creates a new SpeechSynthesisUtterance object with the translated text
        const utterance = new window.SpeechSynthesisUtterance(translatedText);
        // Sets the language of the utterance to the new language
        utterance.lang = newLang;
        // Uses the Web Speech API's speechSynthesis object to speak the translated text
        window.speechSynthesis.speak(utterance);
      })
      // Logs any error messages that occur during the execution of the code
      .catch(err => console.error(err));
  }  
   

  return (
    <div className="voice_to_text">
      <h1>Voice Translator</h1>
      
      <textarea className="convert_text" id="convert_text" value={translatedText ? translatedText : transcript} readOnly></textarea>
  
      <button id="click_to_convert" onClick={handleClickToConvert}>
        Input
      </button>
      <button id="translate" onClick={handleTranslate}>
        Translate
      </button>
      <button id="switch_btn" onClick={handleSwitch} style={{ position: 'relative' }}>
        <img src={switch_img} alt="Switch" style={{ height: '50px', width: '50px', position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }} />
      </button>
  
      <div style={{ marginTop: '20px' }}>
  <label>Current Language:</label>
  <select value={currentLang} onChange={(e) => setCurrentLang(e.target.value)}>
    {languageOptions.map((option) => (
      <option key={option.code} value={option.code}>{option.name}</option>
    ))}
  </select>
</div>
<div>
  <label>New Language:</label>
  <select value={newLang} onChange={(e) => setNewLang(e.target.value)}>
    {languageOptions.map((option) => (
      <option key={option.code} value={option.code}>{option.name}</option>
    ))}
  </select>
</div>

    </div>
  );
  
}

export default VoiceTranslator;