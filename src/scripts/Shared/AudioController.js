import app from 'scripts/App.js';
import state from 'scripts/State.js';
import Audio from 'Shared/Audio.js';
import musicUniforms from 'utils/musicUniforms.js';

export default class AudioController {
	constructor() {
		state.register(this);
		this.music = null;
	}

	onAttach() {
		app.debug.pane.add(this, 'Audio', 0);
	}

	playMusic() {
		if (this.music) return this.music.audio.play();

		this.music = new Audio();
		this.music.start({ onBeat: this._onBeat, analyze: true, live: false, src: '/assets/music.wav' });
	}

	pauseMusic() {
		this.music.audio.pause();
	}

	_onBeat = () => {
		// console.log('beat');
	};

	onTick() {
		if (!this.music) return;

		this.music?.update();

		// console.log(this.music.values);
		musicUniforms.uMusicVolume.value = this.music.volume;
		musicUniforms.uFrenquencyRange1.value = this.music.values[0];
		musicUniforms.uFrenquencyRange2.value = this.music.values[1];
		musicUniforms.uFrenquencyRange3.value = this.music.values[2];
		musicUniforms.uFrenquencyRange4.value = this.music.values[3];
		musicUniforms.uFrenquencyRange5.value = this.music.values[4];
		musicUniforms.uFrenquencyRange6.value = this.music.values[5];
		musicUniforms.uFrenquencyRange7.value = this.music.values[6];
		musicUniforms.uFrenquencyRange8.value = this.music.values[7];
		// console.log(this.music?.freqByteData);
	}
}
