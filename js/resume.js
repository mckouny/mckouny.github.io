/*!
 * Start Bootstrap - Resume v5.0.8 (https://startbootstrap.com/template-overviews/resume)
 * Copyright 2013-2020 Start Bootstrap
 * Licensed under MIT (https://github.com/BlackrockDigital/startbootstrap-resume/blob/master/LICENSE)
 */

(function ($) {
  'use strict'; // Start of use strict

  // Smooth scrolling using jQuery easing
  $('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function () {
    if (
      location.pathname.replace(/^\//, '') ==
      this.pathname.replace(/^\//, '') &&
      location.hostname == this.hostname
    ) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      if (target.length) {
        $('html, body').animate(
          {
            scrollTop: target.offset().top,
          },
          1000,
          'easeInOutExpo',
        );
        return false;
      }
    }
  });

  // Closes responsive menu when a scroll trigger link is clicked
  $('.js-scroll-trigger').click(function () {
    $('.navbar-collapse').collapse('hide');
  });

  // Activate scrollspy to add active class to navbar items on scroll
  $('body').scrollspy({
    target: '#sideNav',
  });

  // Import command list
  var commands_list = new Array();
  $.get('commands_curated.json', function (commands) {
    commands_list = commands;
  });

  //Display alert on file upload
  $(document).on('change','#files' , function(){ 
    document.getElementById('filealert').style.display = "block";
  });

  //Create a new Browse button if there isn't an available one
  $(document).on('change','.fileinput' , function(){ 
    var last = $("#last-created");
    if (((last.prop("files").length) != 0) || last.hasClass("default")){
      last.attr("id", "");
      $('#filesMold').clone().attr("id", "last-created").removeAttr("hidden").insertAfter(last); 
    }
  });

  // Load files, processes them and displays plaintext and hashed histories
  $('#hashbt').click(function () {
    onAnonymizeClicked();
    $('#hashbt').prop('disabled', false);
  });

  var clear_list = [];
  var hashed_list = [];
  var files_number = 0;
  var files = [];

  async function onAnonymizeClicked() {
    $('#cards').remove();
    $('#hashbt').prop('disabled', true);
    $('.fileinput').each(function(){
      var filelst = $(this).prop('files');
      for (var i = 0; i < filelst.length; i++) {
        files.push(filelst[i]);
      }
    })
    var files_number = files.length
    clear_list.length = hashed_list.length = 0; //clears the global arrays if user clicks anonymize again
    for (let i = 0, f; (f = files[i]); i++) {
      const hashed = await readFile(f);
      hashed_list.push(hashed);
    }
    createHeader(files_number);
    createCards(files_number);
  }

  function readFile(fileObject) {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onload = function (e) {
        var res = e.target.result;
        clear_list.push(res);
        hashHistoryFile(res).then(function (hashed) {
          resolve(hashed);
        });
      };
      reader.readAsText(fileObject);
    });
  }

  // Process and hash file
  async function hashHistoryFile(res) {
    var history_string = res.split(/\r?\n/);
    var hashed_string = '';

    for (var i = 0; i < history_string.length; i++) {
      var line = history_string[i];
      line = line.split(' ');

      for (var j = 0; j < line.length; j++) {
        var word = line[j].toLowerCase();
        switch (word) {
          case String(word.match(/^-\w{1,4}$/)): //short flags (-a, -help)
            hashed_string += word;
            break;
          case String(word.match(/^-(-\w{1,10}){1,4}$/)): //long flag (--version, --read-as)s
            hashed_string += word;
            break;
          default:
            if (commands_list.indexOf(word) != -1) {
              hashed_string += word;
            } else {
              var sha_hashed = await sha256(word)
              hashed_string += sha_hashed;
            }
        }
        if (j === line.length - 1) {
          hashed_string += '\n';
        } else {
          hashed_string += ' ';
        }
      }
    }
    return hashed_string;
  }

  //SHA 256 hashing
  async function sha256(message) {
    // encode as UTF-8
    const msgBuffer = new TextEncoder('utf-8').encode(message);

    // hash the message
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);

    // convert to base64
    let base64String = btoa(String.fromCharCode(...new Uint8Array(hashBuffer)));
    return base64String;
  }

  // Create header tabs
  function createHeader(number) {
    var part1 =
      "<div class='card-header'> <ul class='nav nav-tabs card-header-tabs' id='mynav' role='tablist'>";
    var part2 = '';
    for (let i = 0; i < number; i++) {
      var str = '';
      var str = str.concat(
        "<li class='nav-item'> <a class='nav-link' href='#tabpane" + i + "' data-toggle='tab' role='tab' aria-controls='file" + i + "' aria-selected='true' id='tab" + i + "'>File ",
        i + 1,
        ' </a> </li>',
      );
      part2 += str;
    }
    var part3 = '</ul></div>';
    var joint = part1 + part2 + part3;
    $('#tryhere').html(joint);
    $('#tab0').addClass('active');
  }

  // Create cards
  function createCards(files_number) {
    var html_cards = "<div id='cards' class='tab-content h-100'>"; 
    for (let i = 0; i < files_number; i++) {
      html_cards += "\
      <div class='tab-pane' id='tabpane" + i + "' role='tabpanel' aria-labeledby='tab" + i + "'>\
      <div class='row overflow-auto vh-100'>\
       <div class='col-sm-6 '>\
          <div class='card'>\
            <div class='card-body'>\
              <h5 class='card-title'>Original File</h5>\
              <p class='card-text log-col keep-lines overflow-auto' id='original-text'>" + clear_list[i] + "</p>\
            </div>\
          </div>\
        </div>\
        <div class='col-sm-6 '>\
          <div class='card'>\
            <div class='card-body'>\
              <h5 class='card-title'>Anonymized File</h5>\
              <p class='card-text log-col keep-lines overflow-auto' id='anon-text'>" + hashed_list[i] + "</p>\
            </div>\
          </div>\
        </div>\
      </div>\
      </div>"
    }
    html_cards += "</div>";
    $('#tryhere').after(html_cards);
    $('#tabpane0').tab('show');
    }

  //Use tabs for switching between different files  
  $(document).ready(function () {
    $(document).on("click", ".nav-tabs a", function (e) {

      e.preventDefault()
      $(this).tab('show')
    });
  });

  // Submit files
  $(document).ready(function () {
    $("#subbt").click(function () {
      var fd = new FormData();
      fd.append('file', hashed_list);

      $.ajax({
        url: 'https://verdi.cs.ucl.ac.uk/receive-bash-data.php',
        type: 'post',
        data: fd,
        contentType: false,
        processData: false,
        success: function () {
          $('#subsuccess').css("display", "block");
          $('#subbt').prop("disabled", "true");
        },
        error: function() {
          alert('An error occured while submitting the files, please try again.')
        }
      });
    });
  });

})(jQuery); // End of use strict
