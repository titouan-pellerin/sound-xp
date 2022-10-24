import Mouse from './Mouse.js';
import Viewport from './Viewport.js';

export default function () {
	const mouse = new Mouse();
	const viewport = new Viewport();

	return {
		mouse,
		viewport,
	};
}
