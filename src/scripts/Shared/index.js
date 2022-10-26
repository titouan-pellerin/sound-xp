import AudioController from './AudioController.js';

export default function () {
	const audioController = new AudioController();

	return {
		audioController,
	};
}
