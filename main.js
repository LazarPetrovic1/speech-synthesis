// Init speechSynthesis API
const synth = speechSynthesis

// Cache the DOM
const textForm = document.querySelector('form')
const textInput = document.querySelector('#text-input')
const voiceSelect = document.querySelector('#voice-select')
const rate = document.querySelector('#rate')
const rateValue = document.querySelector('#rate-value')
const pitch = document.querySelector('#pitch')
const pitchValue = document.querySelector('#pitch-value')
const body = document.querySelector('body')
/* _________________________________________________________ */

// Init voices array
let voices = []

const getVoices = () => {
  voices = synth.getVoices()

  // Loop through voices and create an option for each one
  voices.forEach((voice) => {
    // Create an option element
    const option = document.createElement('option')
    // Fill the option with the voice and language
    option.textContent = `${voice.name} (${voice.lang})`
    // Set needed option attributes
    option.setAttribute('data-name', voice.name)
    option.setAttribute('data-lang', voice.lang)
    voiceSelect.appendChild(option)
  })
}

getVoices()

if (synth.onvoiceschanged !== undefined) {
  synth.onvoiceschanged = getVoices
}

// Speak
const speak = () => {
  // check if speaking
  if (synth.speaking) {
    console.error('The API is currently speaking')
    return
  }
  if (textInput.value !== '') {
    // add background animation
    body.style.background = `#141414 url("imgs/wave.gif")`
    body.style.backgroundRepeat = 'repeat-x'
    body.style.backgroundSize = '100% 100%'
    // get speak text
    const speakText = new SpeechSynthesisUtterance(textInput.value)
    // Speak end
    speakText.onend = (e) => {
      console.log('Done speaking...')
      body.style.background = '#141414'
    }
    // on error
    speakText.onerror = (e) => {
      console.error(`Something went wrong:\n${e.message}`)
    }
    // selected voice
    const selectedVoice = voiceSelect.selectedOptions[0].getAttribute('data-name')
    // loop through voices
    voices.forEach((voice) => {
      if (voice.name === selectedVoice) {
        speakText.voice = voice
      }
    })
    // set pitch and rate
    speakText.rate = rate.value
    speakText.pitch = pitch.value
    // speak
    synth.speak(speakText)
  }
}

// EVENT LISTENERS
textForm.addEventListener('submit', (e) => {
  e.preventDefault()
  speak()
  textInput.blur()
})

rate.addEventListener('change', (e) => rateValue.textContent = rate.value)
pitch.addEventListener('change', (e) => pitchValue.textContent = pitch.value)
voiceSelect.addEventListener('change', (e) => speak())
