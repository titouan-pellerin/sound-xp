export default async function () {
	await import('styles/debug/debug.scss');

	const Pane = (await import('./Pane.js')).default;
	const pane = new Pane();
	await pane.load();

	const Stats = (await import('./Stats.js')).default;
	const stats = new Stats();
	await stats.load();

	return {
		pane,
		stats,
	};
}
