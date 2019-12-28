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
  
  // Import command list
  var commands_list = new Array
    $.get('commands_curated.json', function (commands) {
      commands_list = commands;
      })
  // Handle hashing 
  var clear_list = []
  var hashed_list = []
  $('#hashbt').click(function () {
    var files = $('#files').prop('files');
    var files_num = files.length;
    for (let i = 0, f; f = files[i]; i++) {
      var reader = new FileReader();
      reader.onload = function(e) {
        var res = e.target.result;
        clear_list.push(res);
        var hashed = hashHistory(res)
        setTimeout(hashed_list.push(hashed),2000);
      }

      reader.readAsText(f);
    }

    $('#subbt').prop('disabled', false);
    $('#hashbt').prop('disabled', true);
    createHeader(3);
    createCards();
  });
  

  // Create cards
  function createCards() {
    $('#tryhere').after("<div class='row overflow-auto vh-100'>\
 <div class='col-sm-6'>\
    <div class='card'>\
      <div class='card-body'>\
        <h5 class='card-title'>Original File</h5>\
        <p class='card-text overflow-auto' id='original-text'>With supporting text below as a natural lead-in to additional content.</p>\
      </div>\
    </div>\
  </div>\
  <div class='col-sm-6'>\
    <div class='card'>\
      <div class='card-body'>\
        <h5 class='card-title'>Anonymized File</h5>\
        <p class='card-text overflow-auto' id='anon-text'>With supporting text below as a natural lead-in to additional content.</p>\
      </div>\
    </div>\
  </div>\
</div>");

setTimeout(console.log("woof", clear_list[0]), 2000)
   $('#original-text').text(clear_list[0]);
   $('#anon-text').text(hashed_list[0]);
    };

  // Create header tabs
  function createHeader(number) {
      var part1 = "<div class='card-header'> <ul class='nav nav-tabs card-header-tabs' id='mynav'>"
      var part2 = "";
      for (let i = 0; i < number; i++){
      var str = ""
      var str= str.concat("<li class='nav-item'> <a class='nav-link'>File ", i+1, " </a> </li>")
        part2 += str
      }
      var part3 = "</ul>"
      var joint = part1 + part2 + part3
     $('#tryhere').html(joint)
      };
      
  // Process and hash file
  function hashHistory(res){
      var history_string = res.split("\r\n");
      var hashed_string = "";

      for (var i = 0; i < history_string.length; i++) {
        var line = history_string[i];
        line = line.split(" ");

        for (var j = 0; j < line.length; j++){
          var word = line[j];
          switch (word) {
            case String(word.match(/^b'\$2b\$.{56}('$)/)): //regex for bcrypt output to prevent hashing twice
              hashed_string += word;
              break;		
            case String(word.match(/^-\w{1,4}$/)): //short flags (-a, -help)
              hashed_string += word;
              break;		
            case String(word.match(/^-(-\w{1,10}){1,4}$/)): //long flag (--version, --read-as)s
              hashed_string += word;
              break;		
            default:
              if (commands_list.indexOf(word) != -1){
                hashed_string += word;
                  } else {
                  hashed_string += 'hashed'; //actual hashing yet to be implemented	
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
	
})(jQuery); // End of use strict
