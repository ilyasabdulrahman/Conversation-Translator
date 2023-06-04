# Conversation Translator
Try it here! https://translator-1c80f.web.app/
<br />
This is the frontend web application for the Conversation Translator, a powerful tool that translates up to 15 of the world's most popular languages in real-time. With this application, you can easily convert spoken input into text and translate it into a new language of your choice. It provides a seamless and user-friendly experience for multilingual conversations. <br />

## Features
Speech-to-text conversion: The application utilizes the browser's SpeechRecognition API to convert spoken input into text. Simply click the "Input" button and start speaking to see your words transcribed on the screen. <br />
Language translation: The translated text is obtained by sending the spoken input to the Microsoft Translator Text API. Click the "Translate" button to initiate the translation process from the current language to the selected new language. <br />
Language switching: The application allows you to switch between the current language and the new language by clicking the switch button. This feature enables smooth communication between different language speakers. <br />
Language selection: You can choose the current and new languages from a list of available options. The supported languages include English, Spanish, French, Italian, Arabic, German, Hindi, Japanese, Korean, Portuguese, Chinese, Dutch, Polish, Turkish, and Russian. <br />
Text-to-speech synthesis: The translated text can be pronounced using AWS Polly's text-to-speech synthesis. The spoken translation is played through the integrated audio player, providing an immersive experience. <br />

## Technologies
React - Frontend <br />
AWS - Utilized AWS SDK to access AWS Polly for Speech Synthesis <br />
Azure - Handle Translations using Microsoft Translator Text API <br />
Web Speech API - Specech Recognition
JSX - Used in React component for rendering HTML-like syntax
Firebase - Hosting Service

## Usage
1. On the Conversation Translator web app, select the current language and the language you want to translate to from the respective dropdown menus. <br />
2. Click the "Input" button to enable speech recognition. Start speaking, and your words will be transcribed in real-time in the text area. <br >
3. Once you finish speaking, click the "Translate" button to initiate the translation process. The translated text will appear in the text area. <br />
4. To switch between the current and new languages, click the switch button. This allows you to change the language settings on the fly.
5. You can listen to the translated text by playing the audio through the integrated audio player.

