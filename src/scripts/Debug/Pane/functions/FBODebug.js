export default function (pane, instance, name) {
	const folder = pane.addFolder({ title: name, expanded: true });

	return folder;
}
