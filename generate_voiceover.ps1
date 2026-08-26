Add-Type -AssemblyName System.Speech
$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer

Write-Output "--- Installed Voices ---"
foreach ($v in $synth.GetInstalledVoices()) {
    Write-Output ($v.VoiceInfo.Name + " (" + $v.VoiceInfo.Gender + ", " + $v.VoiceInfo.Culture + ")")
}

# Select Microsoft David (Natural Male Voice) or any male voice
$maleVoice = $synth.GetInstalledVoices() | Where-Object { $_.VoiceInfo.Gender -eq 'Male' } | Select-Object -First 1
if ($maleVoice) {
    $synth.SelectVoice($maleVoice.VoiceInfo.Name)
    Write-Output ("Selected Voice: " + $maleVoice.VoiceInfo.Name)
}

$synth.Rate = 0 # Natural speech rate
$synth.Volume = 100

$audioPath = "C:\Users\Suresh\.gemini\antigravity-ide\scratch\omni_api_studio\voiceover.wav"
$synth.SetOutputToWaveFile($audioPath)

# Generate the 25s product narration
$speechText = @"
I wanted to test an API without opening heavy desktop software. So I built Vantage Point API Studio.
Over 1,600 public APIs in one browser, with zero backend code.
Test live crypto tickers, weather forecasts, and even Google Gemini AI in one click.
Raw JSON instantly transforms into interactive visual cards and generates ready-to-use code in Python, JavaScript, cURL, Go, and Flutter.
100% free, open source, and runs entirely in your browser.
Try it live at the link in the comments and star the repo on GitHub!
"@

$synth.Speak($speechText)
$synth.Dispose()

Write-Output ("Voiceover generated successfully at: " + $audioPath)
