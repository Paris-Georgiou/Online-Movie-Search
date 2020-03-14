$(document).ready(function(){

	//setup before functions
	let typingTimer;                //timer identifier
	const doneTypingInterval = 500;  //time in ms (0.5 seconds)

	//on keyup, start the countdown
	$('#search-input').keyup(function(){
		clearTimeout(typingTimer);
		if ($('#search-input').val()) {
			typingTimer = setTimeout(doneTyping, doneTypingInterval);
		}
	});

	//user is "finished typing," do something
	function doneTyping () {
		let searchText = $('#search-input').val();
		counter = 1;
		MovieArray.length = 0;
		$('.results').empty()
		$('.footer').hide()
		$('.footer').empty()
		$.ajax(
			`http://www.omdbapi.com/?apikey=f79921be&s=${searchText}&type=movie&page=${counter}`,
			{
				success: successfulResults,
				error: onResultsError
			}
		)
		counter++;
		$('.footer').append(`<p> Scroll For More Results! </p>`)
	}

	function successfulResults(data) {
		$.each(data.Search, function(_index, value) {
			getMovieData(value.imdbID, gotMovieData)
		});
	}

	function onResultsError () {
		console.err("shiet")
	}

	function getMovieData (imdbID, callback){
		$.ajax(
			`http://www.omdbapi.com/?apikey=f79921be&i=${imdbID}&plot=short`,
			{
				success: function(data){
					callback(data);
				},

				error: function(){
					console.err(`no data for movie :${imdbID}`)
				},
			}
		)
	}

	function gotMovieData(movieData){
		MovieArray[MovieArray.length] = movieData
		$('.results').append(`	<div class="result"> 
									<div class="image">
										<img src=${MovieArray[MovieArray.length-1].Poster} onError="this.onerror=null;this.src='ImageNotFound.jpg';" />
									</div>
									<div id="tag-${MovieArray[MovieArray.length-1].imdbID}" class="content">
										<dl>
											<dd> <span class="info"> Title: </span> ${MovieArray[MovieArray.length-1].Title} </dd>
											<dd> <span class="info"> Genre: </span> ${MovieArray[MovieArray.length-1].Genre} </dd>
											<dd> <span class="info"> Released: </span> ${MovieArray[MovieArray.length-1].Released} </dd>
											<dd> <span class="info"> Duration: </span> ${MovieArray[MovieArray.length-1].Runtime} </dd>
											<dd> <span class="info"> Imdb Rating: </span> ${MovieArray[MovieArray.length-1].imdbRating} </dd>
											<dd> <span class="info"> Short Plot: </span> ${MovieArray[MovieArray.length-1].Plot} </dd>
										</dl>
										<a id="${MovieArray[MovieArray.length-1].imdbID}" href="#" onclick="ShowMoreFunction(event);">Show More</a>
									</div>
								</div>`
							) 
		$('.footer').show()
		//console.log(MovieArray.length) 
	}

	$(window).scroll(function() {
		if($(window).scrollTop() == $(document).height() - $(window).height()) {
			let searchText = $('#search-input').val();
			$.ajax(
				`http://www.omdbapi.com/?apikey=f79921be&s=${searchText}&type=movie&page=${counter}`,
				{
					success: successfulResults,
					error: onResultsError
				}
			)
			//console.log(counter)
			//console.log(MovieArray.length)  
			counter++;
		}
	});

});

var MovieArray = [];
let counter = 1;

function ShowMoreFunction(e){
	event.preventDefault();
	let movieId = e.target.id
	let count
	for(count=0; count<MovieArray.length; count++){
		if(movieId == MovieArray[count].imdbID){
			break
		}
	}

	$(`#tag-${MovieArray[count].imdbID} dl dd:nth-child(6)`).remove()
	$(`#tag-${MovieArray[count].imdbID} dl`).append(`<dd> <span class="info"> Director: </span> ${MovieArray[count].Director} </dd>`)
	$(`#tag-${MovieArray[count].imdbID} dl`).append(`<dd> <span class="info"> Writers: </span> ${MovieArray[count].Writer} </dd>`)
	$(`#tag-${MovieArray[count].imdbID} dl`).append(`<dd> <span class="info"> Actors: </span> ${MovieArray[count].Actors} </dd>`)

	$.ajax(
		`http://www.omdbapi.com/?apikey=f79921be&i=${MovieArray[count].imdbID}&plot=full`,
		{
			success: function(data){
				$(`#tag-${MovieArray[count].imdbID} dl`).append(`<dd> <span class="info"> Full Plot: </span> ${data.Plot} </dd>`)
			},

			error: function(){
				console.err(`no data for movie : ${MovieArray[count].imdbID}`)
			},
		}
	)

	$(`#${MovieArray[count].imdbID}`).remove()
	$(`#tag-${MovieArray[count].imdbID}`).append(`<a id="${MovieArray[count].imdbID}" href="#" onclick="ShowLessFunction(event);">Show Less</a>`)

};

function ShowLessFunction(e){
	event.preventDefault();
	let movieId = e.target.id
	let count
	for(count=0; count<MovieArray.length; count++){
		if(movieId == MovieArray[count].imdbID){
			break
		}
	}

	$(`#tag-${MovieArray[count].imdbID} dl dd:nth-child(6)`).remove()
	$(`#tag-${MovieArray[count].imdbID} dl dd:nth-child(6)`).remove()
	$(`#tag-${MovieArray[count].imdbID} dl dd:nth-child(6)`).remove()
	$(`#tag-${MovieArray[count].imdbID} dl dd:nth-child(6)`).remove()
	$(`#tag-${movieId} dl`).append(`<dd> <span class="info"> Short Plot: </span> ${MovieArray[count].Plot} </dd>`)
	$(`#${MovieArray[count].imdbID}`).remove()
	$(`#tag-${MovieArray[count].imdbID}`).append(`<a id="${MovieArray[count].imdbID}" href="#" onclick="ShowMoreFunction(event);">Show More</a>`)
	
};