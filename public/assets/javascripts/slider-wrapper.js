var slides = document.getElementsByClassName('slide');

var cycleSlides = function() {
	for (var i=0; i<slides.length; i++) {
		slides[i].classList.remove('out');
	}
	var current = document.getElementsByClassName('in')[0];
	var next = current.nextElementSibling;
	if (!next) {
		next = slides[0];
	}
	current.classList.add('out');
	current.classList.remove('in');
	next.classList.add('in');
};

var sliderTimer = window.setInterval(cycleSlides, 5000);

