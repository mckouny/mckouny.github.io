(function($) {
  "use strict"; // Start of use strict

  // Smooth scrolling using jQuery easing
  $('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function() {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      if (target.length) {
        $('html, body').animate({
          scrollTop: (target.offset().top)
        }, 1000, "easeInOutExpo");
        return false;
      }
    }
  });

  // Closes responsive menu when a scroll trigger link is clicked
  $('.js-scroll-trigger').click(function() {
    $('.navbar-collapse').collapse('hide');
  });

  // Activate scrollspy to add active class to navbar items on scroll
  $('body').scrollspy({
    target: '#sideNav'
  });
  
  // Handle fileuploads
  $('#hashbt').click(function () {
    var files = $('#files').prop('files');

    for (var i = 0, f; f = files[i]; i++) {
      var reader = new FileReader();
      reader.readAsText(f);
      reader.onload = function(e) {
        var res = reader.result;
        alert ('Hashed file preview:\ni'+ hashHistory(res).substr(1,1000))
      }
      $('#subbt').prop('disabled', false);
    }
  });

  // Process and hash file
  
	function hashHistory(res){
		var commands = ["ping", "sudo", "apt-get"];
		var history_string = res.split("\r\n")
		var hashed_string = "";
		for (var i = 0; i < history_string.length; i++) {
		    var line = history_string[i];
		    line = line.split(" ");
		    for (var j = 0; j < line.length; j++){
			var word = line[j]
			switch (word) {
				case String(word.match(/^b'\$2b\$.{56}('$)/)):
					hashed_string += word;
					break;		
				case String(word.match(/^-\w{1,4}$/)):
					hashed_string += word;
					break;		
				case String(word.match(/^-(-\w{1,10}){1,4}$/)):
					hashed_string += word;
					break;		
				default:
					if (commands.indexOf(word) != -1){
						hashed_string += word;
					} else {
					hashed_string += 'hashed';	
					}
			}
			if (j === (line.length - 1)) {
				hashed_string += "\n";
			} else{
			hashed_string += " ";
			}
		}
		}
		return hashed_string;
	}

  // Trying to protect email from crawlers
	function displayEmail(){var s='@',n='antonin.kanat.17',k='ucl.ac.uk',e=n+s+k,l='<a href=mailto:{{spam@agrofert.cz}}>{{spam@agrofert.cz}}</a>'.replace(/{{.+?(}})/g,e);document.write(l)}
	
})(jQuery); // End of use strict
