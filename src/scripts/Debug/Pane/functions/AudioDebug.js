import musicUniforms from 'utils/musicUniforms.js';

export default function (pane, instance, name) {
	const folder = pane.addFolder({ title: name, expanded: true });
	folder.addButton({ title: 'Play' }).on('click', () => {
		instance.playMusic();
	});
	folder.addButton({ title: 'Pause' }).on('click', () => {
		instance.pauseMusic();
	});

	folder.addMonitor(musicUniforms.uMusicVolume, 'value', { label: 'Volume' });
	folder.addMonitor(musicUniforms.uFrenquencyRange1, 'value', { label: 'Frenquency1' });
	folder.addMonitor(musicUniforms.uFrenquencyRange2, 'value', { label: 'Frenquency2' });
	folder.addMonitor(musicUniforms.uFrenquencyRange3, 'value', { label: 'Frenquency3' });
	folder.addMonitor(musicUniforms.uFrenquencyRange4, 'value', { label: 'Frenquency4' });
	folder.addMonitor(musicUniforms.uFrenquencyRange5, 'value', { label: 'Frenquency5' });
	folder.addMonitor(musicUniforms.uFrenquencyRange6, 'value', { label: 'Frenquency6' });
	folder.addMonitor(musicUniforms.uFrenquencyRange7, 'value', { label: 'Frenquency7' });
	folder.addMonitor(musicUniforms.uFrenquencyRange8, 'value', { label: 'Frenquency8' });

	return folder;
}
