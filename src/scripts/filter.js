/**
 * @description Applies filters to album
 */

var filter = {};

filter.currentState = {
	star: 0,
	tags: ''
};

filter.setFilter = function() {

	const action = function() {

		filter.currentState.star = 0;
		if ($('#filter_star').prop('checked'))
		{
			filter.currentState.star = 1;
		}

		filter.currentState.tags = '';
		if ($('#filter_tags').val() !== 'undefined')
		{
			filter.currentState.tags = $('#filter_tags').val().trim();
		}

		basicModal.close();

		albums.refresh();
		if (album.json !== null)
		{
			album.load(album.json.id, true);
		}
		else
		{
			albums.load();
		}
	};

	let msg = `
	          <p>
	              <span style="width: 33%">Starred:</span>
	              <input type="checkbox" class="checkbox" id="filter_star">
	          </p>
	          <p>
	              <span style="width: 33%">Tags match:</span>
	              <input type="text" class="text" id="filter_tags">
	          </p>
	          `;

	basicModal.show({
		body: msg,
		buttons: {
			action: {
				title: 'Apply Filter',
				fn: action
			},
			cancel: {
				title: 'Cancel',
				fn: basicModal.close
			}
		}
	});


	if (filter.currentState.star)
	{
		$('#filter_star').prop ('checked', true);
	}
	$('#filter_tags').val(filter.currentState.tags);

}

filter.checkPhoto = function(p) 
{
	if (filter.currentState.star === 1)
	{
		if (p.star !== "1")
		{
			return false;
		}
	}

	if (filter.currentState.tags !== '')
	{
		if (!p.tags.includes (filter.currentState.tags))
		{
			return false;
		}
	}

	return true;
}

filter.isFilterActive = function ()
{
	if (filter.currentState.star)
	{
		return true;
	}

	if (filter.currentState.tags !== '')
	{
		return true;
	}

	return false;
}


filter.getFilterParams = function ()
{
	if (!filter.isFilterActive())
	{
		return null;
	}

	return filter.currentState;
}	
