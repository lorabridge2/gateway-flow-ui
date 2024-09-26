<!-- <script lang="ts">
    onMount(() => {
		colorMode = localStorage.getItem('color-theme');
		let iframe = iframeRef(document.getElementById('notifyframe'));
		window.addEventListener(
			'storage',
			function (event) {
				if (event.storageArea === localStorage && event.key === 'color-theme') {
					// It's local storage
					parent.postMessage(
						{
							type: 'preview.compiled',
							other: event.newValue
						},
						'/'
					);
				}
			},
			false
		);
		window.addEventListener('message', function (message) {
			if (message.data.type == 'preview.compiled') {
				colorMode = message.data.other;
			}
		});
	});
</script> -->