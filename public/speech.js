// This script handles the speech synthesis of the italian words


let synth = speechSynthesis, 
    isSpeaking = true;

// starts utterance of text
function textToSpeech(text) {
    // get utterance element
    const utterance = new SpeechSynthesisUtterance(text)

    // get languages. For some reason, this still does not work on some mobile browser
    const voicesList = window.speechSynthesis.getVoices()
    const lang = 'it-IT'
    utterance.voice = voicesList.find((voice) => voice.lang === lang)
    utterance.lang = lang

    // actually play sound
    speechSynthesis.speak(utterance)
}

// handle speak button call
function Speak(id)
{
    // select correct text to speak
    var div = document.getElementById('word-card-' + String(id)).children[0];
    text = div.innerHTML

    // only speak if there is text
    if (text !== "") {

        // only speak if not speaking other
        if (!synth.speaking) {
            textToSpeech(text);
        }
        // if text is long, speak for a while
        if (text.length > 80) {
            setInterval(() => {
                if (!synth.speaking && !isSpeaking) {
                    isSpeaking = true;
                }}, 500);
            if (isSpeaking) {
                synth.resume();
                isSpeaking = false;
            } else {
                synth.pause();
                isSpeaking = true;
            }
        } 
    }
}