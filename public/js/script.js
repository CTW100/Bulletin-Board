// public/js/script.js

$(function () {
	var search = window.location.search; // 1
	var params = {};

	if (search) {
		// 2
		$.each(search.slice(1).split('&'), function (index, param) {
			var index = param.indexOf('=');
			if (index > 0) {
				var key = param.slice(0, index);
				var value = param.slice(index + 1);

				if (!params[key]) params[key] = value;
			}
		});
	}

	if (params.searchText && params.searchText.length >= 3) {
		// 3
		$('[data-search-highlight]').each(function (index, element) {
			var $element = $(element);
			var searchHighlight = $element.data('search-highlight');
			var index = params.searchType.indexOf(searchHighlight);

			if (index >= 0) {
				var decodedSearchText = params.searchText.replace(/\+/g, ' '); //  3-1
				decodedSearchText = decodeURI(decodedSearchText);

				var regex = new RegExp(`(${decodedSearchText})`, 'ig'); // 3-2
				$element.html(
					$element
						.html()
						.replace(regex, '<span class="highlighted">$1</span>')
				);
			}
		});
	}
});
