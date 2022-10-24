import Loader from './Loader.js';
import Store from './Store.js';
import Ticker from './Ticker.js';

export default function () {
	const loader = new Loader();
	const ticker = new Ticker();
	const store = new Store();

	return {
		loader,
		ticker,
		store,
	};
}
