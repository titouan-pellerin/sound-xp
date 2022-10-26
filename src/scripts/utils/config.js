const debug = import.meta.env.VITE_DEBUG === 'true';
const env = import.meta.env.MODE;
const url = new URLSearchParams(window.location.search);

const DEBUG = env === 'development' ? url.has('debug') && debug : debug;

const BREAKPOINTS = {
	tablet: 768,
	desktop: 1025,
	large: 1441,
};

const CUBES = {
	countSqrt: 512,
	// bounds: 10,
};

export { DEBUG, BREAKPOINTS, CUBES };
