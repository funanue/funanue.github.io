// global variables
var lang_datatable = {
  "decimal": "-",
  "thousands": ".",
  'emptyTable': 'Sin Datos',
  'info': 'mostranto _END_ de _TOTAL_ registros',
  'infoEmpty': '0-0 de 0',
  'infoFiltered': '',
  'infoPostFix': '',
  'lengthMenu': '_MENU_',
  'loadingRecords': 'Cargando...',
  'processing': 'Procesando...',
  'search': '',
  'searchPlaceholder': 'Buscar',
  'zeroRecords': 'No se encontraron registros',
  'paginate': {
    'first': 'Primero',
    'last': 'Último',
    'next': 'Próximo',
    'previous': 'Anterior'
  }
};

var COLOR_PURPLE_TRANSPARENT_7 = 'rgba(114, 124, 182, 0.7)';
var COLOR_GREEN_TRANSPARENT_7 = 'rgba(0, 172, 172, 0.7)';
var COLOR_BLUE_TRANSPARENT_7 = 'rgba(35, 113, 191, 0.7)';
var COLOR_GREY_TRANSPARENT_7 = 'rgba(182, 194, 201, 0.7)';
var COLOR_BLACK_TRANSPARENT_7 = 'rgba(45, 53, 60, 0.7)';
var COLOR_YELLOW_TRANSPARENT_7="rgba(255, 217, 0, 0.7)";
var COLOR_RED_TRANSPARENT_7="rgba(223,70,58, 0.7)";
var COLOR_SILVER_TRANSPARENT_7="rgba(240, 243, 244, 0.7)";
var COLOR_AQUA_TRANSPARENT_7="rgba(73, 182, 214, 0.7)";
var COLOR_ORANGE_TRANSPARENT_7 = 'rgba(240, 149, 29, 0.7)';
var COLOR_AQUA="#5AC8FA"
var COLOR_PURPLE		= '#727cb6';
var COLOR_BLUE			= '#348fe2';
var COLOR_GREEN			= '#00ACAC';
var COLOR_GREY			= '#b6c2c9';
var COLOR_BLACK			= '#2d353c';
var COLOR_YELLOW="#ffd900"
var COLOR_RED="#ff5b57"
var COLOR_SILVER="#f0f3f4"
var COLOR_ORANGE		= '#f59c1a';
var FONT_COLOR = "#2d353c"
  , FONT_FAMILY = "Open Sans, Helvetica Neue,Helvetica,Arial,sans-serif"
  , FONT_WEIGHT = "600"
  , FONT_SIZE = "12px"
  , COLOR_BLUE = "#348fe2"
  , COLOR_BLUE_LIGHTER = "#5da5e8"
  , COLOR_BLUE_DARKER = "#2a72b5"
  , COLOR_BLUE_TRANSPARENT_1 = "rgba(52, 143, 226, 0.1)"
  , COLOR_BLUE_TRANSPARENT_2 = "rgba(52, 143, 226, 0.2)"
  , COLOR_BLUE_TRANSPARENT_3 = "rgba(52, 143, 226, 0.3)"
  , COLOR_BLUE_TRANSPARENT_4 = "rgba(52, 143, 226, 0.4)"
  , COLOR_BLUE_TRANSPARENT_5 = "rgba(52, 143, 226, 0.5)"
  , COLOR_BLUE_TRANSPARENT_6 = "rgba(52, 143, 226, 0.6)"
  , COLOR_BLUE_TRANSPARENT_8 = "rgba(52, 143, 226, 0.8)"
  , COLOR_BLUE_TRANSPARENT_9 = "rgba(52, 143, 226, 0.9)"
  , COLOR_AQUA = "#5AC8FA"
  , COLOR_AQUA_LIGHTER = "#6dc5de"
  , COLOR_AQUA_DARKER = "#3a92ab"
  , COLOR_AQUA_TRANSPARENT_1 = "rgba(73, 182, 214, 0.1)"
  , COLOR_AQUA_TRANSPARENT_2 = "rgba(73, 182, 214, 0.2)"
  , COLOR_AQUA_TRANSPARENT_3 = "rgba(73, 182, 214, 0.3)"
  , COLOR_AQUA_TRANSPARENT_4 = "rgba(73, 182, 214, 0.4)"
  , COLOR_AQUA_TRANSPARENT_5 = "rgba(73, 182, 214, 0.5)"
  , COLOR_AQUA_TRANSPARENT_6 = "rgba(73, 182, 214, 0.6)"
  , COLOR_AQUA_TRANSPARENT_7 = "rgba(73, 182, 214, 0.7)"
  , COLOR_AQUA_TRANSPARENT_8 = "rgba(73, 182, 214, 0.8)"
  , COLOR_AQUA_TRANSPARENT_9 = "rgba(73, 182, 214, 0.9)"
  , COLOR_GREEN = "#00ACAC"
  , COLOR_GREEN_LIGHTER = "#33bdbd"
  , COLOR_GREEN_DARKER = "#008a8a"
  , COLOR_GREEN_TRANSPARENT_1 = "rgba(0, 172, 172, 0.1)"
  , COLOR_GREEN_TRANSPARENT_2 = "rgba(0, 172, 172, 0.2)"
  , COLOR_GREEN_TRANSPARENT_3 = "rgba(0, 172, 172, 0.3)"
  , COLOR_GREEN_TRANSPARENT_4 = "rgba(0, 172, 172, 0.4)"
  , COLOR_GREEN_TRANSPARENT_5 = "rgba(0, 172, 172, 0.5)"
  , COLOR_GREEN_TRANSPARENT_6 = "rgba(0, 172, 172, 0.6)"
  , COLOR_GREEN_TRANSPARENT_7 = "rgba(0, 172, 172, 0.7)"
  , COLOR_GREEN_TRANSPARENT_8 = "rgba(0, 172, 172, 0.8)"
  , COLOR_GREEN_TRANSPARENT_9 = "rgba(0, 172, 172, 0.9)"
  , COLOR_YELLOW = "#ffd900"
  , COLOR_YELLOW_LIGHTER = "#fde248"
  , COLOR_YELLOW_DARKER = "#bfa300"
  , COLOR_YELLOW_TRANSPARENT_1 = "rgba(255, 217, 0, 0.1)"
  , COLOR_YELLOW_TRANSPARENT_2 = "rgba(255, 217, 0, 0.2)"
  , COLOR_YELLOW_TRANSPARENT_3 = "rgba(255, 217, 0, 0.3)"
  , COLOR_YELLOW_TRANSPARENT_4 = "rgba(255, 217, 0, 0.4)"
  , COLOR_YELLOW_TRANSPARENT_5 = "rgba(255, 217, 0, 0.5)"
  , COLOR_YELLOW_TRANSPARENT_6 = "rgba(255, 217, 0, 0.6)"
  , COLOR_YELLOW_TRANSPARENT_7 = "rgba(255, 217, 0, 0.7)"
  , COLOR_YELLOW_TRANSPARENT_8 = "rgba(255, 217, 0, 0.8)"
  , COLOR_YELLOW_TRANSPARENT_9 = "rgba(255, 217, 0, 0.9)"
  , COLOR_ORANGE = "#f59c1a"
  , COLOR_ORANGE_LIGHTER = "#f7b048"
  , COLOR_ORANGE_DARKER = "#c47d15"
  , COLOR_ORANGE_TRANSPARENT_1 = "rgba(245, 156, 26, 0.1)"
  , COLOR_ORANGE_TRANSPARENT_2 = "rgba(245, 156, 26, 0.2)"
  , COLOR_ORANGE_TRANSPARENT_3 = "rgba(245, 156, 26, 0.3)"
  , COLOR_ORANGE_TRANSPARENT_4 = "rgba(245, 156, 26, 0.4)"
  , COLOR_ORANGE_TRANSPARENT_5 = "rgba(245, 156, 26, 0.5)"
  , COLOR_ORANGE_TRANSPARENT_6 = "rgba(245, 156, 26, 0.6)"
  , COLOR_ORANGE_TRANSPARENT_8 = "rgba(245, 156, 26, 0.8)"
  , COLOR_ORANGE_TRANSPARENT_9 = "rgba(245, 156, 26, 0.9)"
  , COLOR_PURPLE = "#727cb6"
  , COLOR_PURPLE_LIGHTER = "#8e96c5"
  , COLOR_PURPLE_DARKER = "#5b6392"
  , COLOR_PURPLE_TRANSPARENT_1 = "rgba(114, 124, 182, 0.1)"
  , COLOR_PURPLE_TRANSPARENT_2 = "rgba(114, 124, 182, 0.2)"
  , COLOR_PURPLE_TRANSPARENT_3 = "rgba(114, 124, 182, 0.3)"
  , COLOR_PURPLE_TRANSPARENT_4 = "rgba(114, 124, 182, 0.4)"
  , COLOR_PURPLE_TRANSPARENT_5 = "rgba(114, 124, 182, 0.5)"
  , COLOR_PURPLE_TRANSPARENT_6 = "rgba(114, 124, 182, 0.6)"
  , COLOR_PURPLE_TRANSPARENT_7 = "rgba(114, 124, 182, 0.7)"
  , COLOR_PURPLE_TRANSPARENT_8 = "rgba(114, 124, 182, 0.8)"
  , COLOR_PURPLE_TRANSPARENT_9 = "rgba(114, 124, 182, 0.9)"
  , COLOR_RED = "#ff5b57"
  , COLOR_RED_LIGHTER = "#ff7c79"
  , COLOR_RED_DARKER = "#cc4946"
  , COLOR_RED_TRANSPARENT_1 = "rgba(255, 91, 87, 0.1)"
  , COLOR_RED_TRANSPARENT_2 = "rgba(255, 91, 87, 0.2)"
  , COLOR_RED_TRANSPARENT_3 = "rgba(255, 91, 87, 0.3)"
  , COLOR_RED_TRANSPARENT_4 = "rgba(255, 91, 87, 0.4)"
  , COLOR_RED_TRANSPARENT_5 = "rgba(255, 91, 87, 0.5)"
  , COLOR_RED_TRANSPARENT_6 = "rgba(255, 91, 87, 0.6)"
  , COLOR_RED_TRANSPARENT_8 = "rgba(255, 91, 87, 0.8)"
  , COLOR_RED_TRANSPARENT_9 = "rgba(255, 91, 87, 0.9)"
  , COLOR_GREY = "#b6c2c9"
  , COLOR_GREY_LIGHTER = "#c5ced4"
  , COLOR_GREY_DARKER = "#929ba1"
  , COLOR_GREY_TRANSPARENT_1 = "rgba(182, 194, 201, 0.1)"
  , COLOR_GREY_TRANSPARENT_2 = "rgba(182, 194, 201, 0.2)"
  , COLOR_GREY_TRANSPARENT_3 = "rgba(182, 194, 201, 0.3)"
  , COLOR_GREY_TRANSPARENT_4 = "rgba(182, 194, 201, 0.4)"
  , COLOR_GREY_TRANSPARENT_5 = "rgba(182, 194, 201, 0.5)"
  , COLOR_GREY_TRANSPARENT_6 = "rgba(182, 194, 201, 0.6)"
  , COLOR_GREY_TRANSPARENT_7 = "rgba(182, 194, 201, 0.7)"
  , COLOR_GREY_TRANSPARENT_8 = "rgba(182, 194, 201, 0.8)"
  , COLOR_GREY_TRANSPARENT_9 = "rgba(182, 194, 201, 0.9)"
  , COLOR_SILVER = "#f0f3f4"
  , COLOR_SILVER_LIGHTER = "#f4f6f7"
  , COLOR_SILVER_DARKER = "#b4b6b7"
  , COLOR_SILVER_TRANSPARENT_1 = "rgba(240, 243, 244, 0.1)"
  , COLOR_SILVER_TRANSPARENT_2 = "rgba(240, 243, 244, 0.2)"
  , COLOR_SILVER_TRANSPARENT_3 = "rgba(240, 243, 244, 0.3)"
  , COLOR_SILVER_TRANSPARENT_4 = "rgba(240, 243, 244, 0.4)"
  , COLOR_SILVER_TRANSPARENT_5 = "rgba(240, 243, 244, 0.5)"
  , COLOR_SILVER_TRANSPARENT_6 = "rgba(240, 243, 244, 0.6)"
  , COLOR_SILVER_TRANSPARENT_7 = "rgba(240, 243, 244, 0.7)"
  , COLOR_SILVER_TRANSPARENT_8 = "rgba(240, 243, 244, 0.8)"
  , COLOR_SILVER_TRANSPARENT_9 = "rgba(240, 243, 244, 0.9)"
  , COLOR_BLACK = "#2d353c"
  , COLOR_BLACK_LIGHTER = "#575d63"
  , COLOR_BLACK_DARKER = "#242a30"
  , COLOR_BLACK_TRANSPARENT_1 = "rgba(45, 53, 60, 0.1)"
  , COLOR_BLACK_TRANSPARENT_2 = "rgba(45, 53, 60, 0.2)"
  , COLOR_BLACK_TRANSPARENT_3 = "rgba(45, 53, 60, 0.3)"
  , COLOR_BLACK_TRANSPARENT_4 = "rgba(45, 53, 60, 0.4)"
  , COLOR_BLACK_TRANSPARENT_5 = "rgba(45, 53, 60, 0.5)"
  , COLOR_BLACK_TRANSPARENT_6 = "rgba(45, 53, 60, 0.6)"
  , COLOR_BLACK_TRANSPARENT_7 = "rgba(45, 53, 60, 0.7)"
  , COLOR_BLACK_TRANSPARENT_8 = "rgba(45, 53, 60, 0.8)"
  , COLOR_BLACK_TRANSPARENT_9 = "rgba(45, 53, 60, 0.9)"
  , COLOR_WHITE = "#FFFFFF"
  , COLOR_WHITE_TRANSPARENT_1 = "rgba(255, 255, 255, 0.1)"
  , COLOR_WHITE_TRANSPARENT_2 = "rgba(255, 255, 255, 0.2)"
  , COLOR_WHITE_TRANSPARENT_3 = "rgba(255, 255, 255, 0.3)"
  , COLOR_WHITE_TRANSPARENT_4 = "rgba(255, 255, 255, 0.4)"
  , COLOR_WHITE_TRANSPARENT_5 = "rgba(255, 255, 255, 0.5)"
  , COLOR_WHITE_TRANSPARENT_6 = "rgba(255, 255, 255, 0.6)"
  , COLOR_WHITE_TRANSPARENT_7 = "rgba(255, 255, 255, 0.7)"
  , COLOR_WHITE_TRANSPARENT_8 = "rgba(255, 255, 255, 0.8)"
  , COLOR_WHITE_TRANSPARENT_9 = "rgba(255, 255, 255, 0.9)";

// funciones globales

// cargar tabla
function loadDataTable(config){
  if ($(config.id).length !== 0) {
    $(config.id).DataTable({
      language: lang_datatable, // lenguaje
      order: config.order == null ? [[0, 'asc']] : config.order, // columna a ordenar
      responsive: config.responsive == null ? true : config.responsive, // responsive,
      columns: config.columns == null ? [] : config.columns, // columnas
      columnDefs: config.columnDefs == null ? [] : config.columnDefs,
      data: config.data == null  ? false : config.data, // filas
      paginate: config.paginate == null  ? true : config.paginate, // paginador
      pageLength: config.pageLength == null ? 10 : config.pageLength, // elementos a mostar por defecto
      bLengthChange: config.bLengthChange == null  ? true : config.bLengthChange, // elementos a mostrar
      searching: config.searching == null ? true : config.searching, // buscar
      ordering: config.ordering == null  ? true : config.ordering, // ordenar
      pagingType: config.pagingType == null ? 'simple_numbers' : config.pagingType,
    });
  }
}


// Functions
// object.watch
if (!Object.prototype.watch) {
	Object.defineProperty(Object.prototype, "watch", {
		  enumerable: false
		, configurable: true
		, writable: false
		, value: function (prop, handler) {
			var
			  oldval = this[prop]
			, newval = oldval
			, getter = function () {
				return newval;
			}
			, setter = function (val) {
				oldval = newval;
				return newval = handler.call(this, prop, oldval, val);
			}
			;

			if (delete this[prop]) { // can't watch constants
				Object.defineProperty(this, prop, {
					  get: getter
					, set: setter
					, enumerable: true
					, configurable: true
				});
			}
		}
	});
}

// object.unwatch
if (!Object.prototype.unwatch) {
	Object.defineProperty(Object.prototype, "unwatch", {
		  enumerable: false
		, configurable: true
		, writable: false
		, value: function (prop) {
			var val = this[prop];
			delete this[prop]; // remove accessors
			this[prop] = val;
		}
	});
}

// get cookie by name
function getCookie(name){
  var cookieValue = null;
  if (document.cookie && document.cookie != '') {
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
      var cookie = jQuery.trim(cookies[i]);
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) == (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

function calculateDivider() {
	var dividerValue = 4;
	if ($(this).width() <= 480) {
		dividerValue = 1;
	} else if ($(this).width() <= 767) {
		dividerValue = 2;
	} else if ($(this).width() <= 980) {
		dividerValue = 3;
	}
	return dividerValue;
}
var handleIsotopesGallery = function() {
	"use strict";
	var container = $('#gallery');
	var dividerValue = calculateDivider();
	var containerWidth = $(container).width();
	var columnWidth = containerWidth / dividerValue;
	$(container).isotope({
		resizable: true,
		masonry: {
			columnWidth: columnWidth
		}
	});

	$(window).smartresize(function() {
		var dividerValue = calculateDivider();
		var containerWidth = $(container).width();
		var columnWidth = containerWidth / dividerValue;
		$(container).isotope({
			masonry: {
				columnWidth: columnWidth
			}
		});
	});

	var $optionSets = $('#options .gallery-option-set'),
	$optionLinks = $optionSets.find('a');

	$optionLinks.click( function(){
		var $this = $(this);
		if ($this.hasClass('active')) {
			return false;
		}
		var $optionSet = $this.parents('.gallery-option-set');
		$optionSet.find('.active').removeClass('active');
		$this.addClass('active');

		var options = {};
		var key = $optionSet.attr('data-option-key');
		var value = $this.attr('data-option-value');
			value = value === 'false' ? false : value;
			options[ key ] = value;
		$(container).isotope( options );
		return false;
	});
};


var GaleriaNoticias = function () {
	"use strict";
	return {
		//main function
		init: function () {
			handleIsotopesGallery();
		}
	};
}();


var GalleryV2 = function () {
	"use strict";
    return {
        //main function
        init: function () {
            $('.superbox.gallery').SuperBox({
        		background : '#242a30',
        		border : 'rgba(0,0,0,0.1)',
        		xColor : '#a8acb1',
        		xShadow : 'embed'
        	});

          $('.superbox.toolkit').SuperBox({
        		background : '#242a30',
        		border : 'rgba(0,0,0,0.1)',
        		xColor : '#a8acb1',
        		xShadow : 'embed'
        	});
        }
    };
}();


var GalleryProductClients = function () {
	"use strict";
    return {
        //main function
        init: function () {
            $('.superbox.clientes').SuperBox({
                background : '#242a30',
                border : 'rgba(0,0,0,0.1)',
                xColor : '#a8acb1',
                xShadow : 'embed'
            });
        }
    };
}();

function getAllUrlParams(url) {

 
  // get query string from url (optional) or window
  var queryString = url ? url.split('?')[1] : window.location.search.slice(1);

  // we'll store the parameters here
  var obj = {};

  // if query string exists
  if (queryString) {

    // stuff after # is not part of query string, so get rid of it
    queryString = queryString.split('#')[0];

    // split our query string into its component parts
    var arr = queryString.split('&');

    for (var i = 0; i < arr.length; i++) {
      // separate the keys and the values
      var a = arr[i].split('=');

      // set parameter name and value (use 'true' if empty)
      var paramName = a[0];
      var paramValue = typeof (a[1]) === 'undefined' ? true : decodeURIComponent(a[1]);

      // (optional) keep case consistent
      //paramName = paramName.toLowerCase();
      //if (typeof paramValue === 'string') paramValue = paramValue.toLowerCase();
      
      // if the paramName ends with square brackets, e.g. colors[] or colors[2]
      if (paramName.match(/\[(\d+)?\]$/)) {
        
        // create key if it doesn't exist
        var key = paramName.replace(/\[(\d+)?\]/, '');
        if (!obj[key]) obj[key] = [];
        // if it's an indexed array e.g. colors[2]
        if (paramName.match(/\[\d+\]$/)) {
          // get the index value and add the entry at the appropriate position
          var index = /\[(\d+)\]/.exec(paramName)[1];
          obj[key][index] = paramValue;
        } else {
          // otherwise add the value to the end of the array
          obj[key].push(paramValue);
        }
      } else {
        // we're dealing with a string
        if (!obj[paramName]) {
          // if it doesn't exist, create property
          obj[paramName] = paramValue;
        } else if (obj[paramName] && typeof obj[paramName] === 'string'){
          // if property does exist and it's a string, convert it to an array
          obj[paramName] = [obj[paramName]];
          obj[paramName].push(paramValue);
        } else {
          // otherwise add the property
          obj[paramName].push(paramValue);
        }
      }
    }
  }

  return obj;
}


/**************************************mantenedor blog - cuenta empresa******************************/
function deleteblogintable(id_blog){
  $('#content_blogs_pend').find("div#" + id_blog).remove();

}

/**************************************mantenedor webinar - cuenta empresa******************************/
function deletewebintable(id_web){
  $('#content_webs_pend').find("div#" + id_web).remove();
}

/****************************************Reseñas cuenta cliente************************************/
function deletereviewintable(id_review){
  $('#content_reviews_pend').find("div#" + id_review).remove();

}

function deletereviewcintable(id_reviewc){
  $('#content_reviewsc_pend').find("div#" + id_reviewc).remove();

}

function deletecomparepintable(id_comparep){
  $('#content_comparepartners').find("div#" + id_comparep).remove();
}

/*****************************reviews notification at profiles *****************************************/
function newreview_notification(html_message = 'Tu reseña esta siendo revisada por el team DP. <a href="/user/profile/reviews" class="alert-link"> Puedes revisar tu reseña aquí.</a>'){
  prepend_notification("#reviews_company", html_message)
}

function newreviewp_notification(html_message = 'Tu reseña esta siendo revisada por el team DP. <a href="/user/profile/reviews" class="alert-link"> Puedes revisar tu reseña aquí.</a>'){
  //var template = $('#reviews_product').html();
  prepend_notification("#reviews_product", html_message)
}

function prepend_notification(jquery_selector, html_message = 'Tu reseña esta siendo revisada por el team DP. <a href="/user/profile/reviews" class="alert-link"> Puedes revisar tu reseña aquí.</a>'){
  //var template = $(jquery_selector).html();
  template = '<div class="alert alert-purple fade show"><span class="close" data-dismiss="alert">×</span> '+html_message+'</div>';
  console.log("jquery_selector", jquery_selector)
  console.log("template", template)
  $(jquery_selector).prepend(template);

}



function validateView(){
  getUserProfile(function (response) {
    if (response){
    }
    else{
      window.location = '/'
    }
  });
}


function updateViewedNotification(){ }

$(document).ready(function() {

  $('[data-action="view-notification"]').click(function(e) {
    updateViewedNotification();
  });
	
  $('.custom-file-input').change(function(){
        $(this).closest('.custom-file').find('.custom-file-label').text($(this).val())
  })

  // select
  $(".default-select2").select2({ placeholder: "Seleccionar" });
  $(".multiple-select2").select2({ placeholder: "Seleccionar" });

  //buscador
  $("#search").keypress(function(e){
    if(e.keyCode == 13){
      var value = $("#search").val()
      window.location.href = "/search/?search="+value;
    }
  });


	$('#home').height($(window).height());
	$(window).on('resize', function() {
		$('#home').height($(window).height());
	});

  // plugins
  $("div .rating-readonly").rate({
    initial_value: 0,
    max_value: 5,
    step_size: 1,
    symbols: {
      fontawesome_star: {
        base: '<i class="fa fa-star"></i>',
        hover: '<i class="fa fa-star" style="color: rgb(255, 153, 0);"></i>',
        selected: '<i class="fa fa-star" style="color: rgb(255, 153, 0);"></i>',
      },
    },
    selected_symbol_type: 'fontawesome_star',
  });

  /*
  $(".rating-product").rate({
    initial_value: 0,
    max_value: 5,
    step_size: 1,
    symbols: {
        fontawesome_star: {
            base: '<i class="fa fa-star"></i>',
            hover: '<i class="fa fa-star" style="color: rgb(255, 153, 0);"></i>',
            selected: '<i class="fa fa-star" style="color: rgb(255, 153, 0);"></i>',
        },
    },
    selected_symbol_type: 'fontawesome_star',
    readonly: true,
  });
  */

  $(".rating-readonly").rate({
    initial_value: 0,
    max_value: 5,
    step_size: 1,
    symbols: {
      fontawesome_star: {
        base: '<i class="fa fa-star"></i>',
        hover: '<i class="fa fa-star" style="color: rgb(255, 153, 0);"></i>',
        selected: '<i class="fa fa-star" style="color: rgb(255, 153, 0);"></i>',
      },
    },
    selected_symbol_type: 'fontawesome_star',
    readonly: true,
  });

  $(".rating-general-evaluation").rate({
    initial_value: 0,
    max_value: 5,
    step_size: 1,
    symbols: {
        fontawesome_star: {
            base: '<i class="fa fa-star"></i>',
            hover: '<i class="fa fa-star" style="color: rgb(255, 153, 0);"></i>',
            selected: '<i class="fa fa-star" style="color: rgb(255, 153, 0);"></i>',
        },
    },
    selected_symbol_type: 'fontawesome_star',
    readonly: true,
  });
});



function calculateDivider() {
	var dividerValue = 4;
	if ($(this).width() <= 480) {
		dividerValue = 1;
	} else if ($(this).width() <= 767) {
		dividerValue = 2;
	} else if ($(this).width() <= 980) {
		dividerValue = 3;
	}
	return dividerValue;
}
/* 25. Handle Toggle Navbar Profile - added in V4.0
------------------------------------------------ */
var handleToggleNavProfile = function() {
  var expandTime = ($('.sidebar').attr('data-disable-slide-animation')) ? 0 : 250;
  
  $('[data-toggle="nav-profile"]').click(function(e) {
      e.preventDefault();
      
      var targetLi = $(this).closest('li');
      var targetProfile = $('.sidebar .nav.nav-profile');
      var targetClass = 'active';
      var targetExpandingClass = 'expanding';
      var targetExpandClass = 'expand';
      var targetClosingClass = 'closing';
      var targetClosedClass = 'closed';
      
      if ($(targetProfile).is(':visible')) {
          $(targetLi).removeClass(targetClass);
          $(targetProfile).removeClass(targetClosingClass);
      } else {
          $(targetLi).addClass(targetClass);
          $(targetProfile).addClass(targetExpandingClass);
      }
      $(targetProfile).slideToggle(expandTime, function() {
        if (!$(targetProfile).is(':visible')) {
      $(targetProfile).addClass(targetClosedClass);
      $(targetProfile).removeClass(targetExpandClass);
    } else {
      $(targetProfile).addClass(targetExpandClass);
      $(targetProfile).removeClass(targetClosedClass);
    }
    $(targetProfile).removeClass(targetExpandingClass + ' ' + targetClosingClass);
      });
  });
};
/* 26. Handle Sidebar Scroll Memory - added in V4.0
------------------------------------------------ */
var handleSidebarScrollMemory = function() {
	if (!(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))) {
		$('.sidebar [data-scrollbar="true"]').slimScroll().bind('slimscrolling', function(e, pos) {
			localStorage.setItem('sidebarScrollPosition', pos + 'px');
		});
	
		var defaultScroll = localStorage.getItem('sidebarScrollPosition');
		if (defaultScroll) {
			$('.sidebar [data-scrollbar="true"]').slimScroll({ scrollTo: defaultScroll });
		}
	}
};
/* 22. Handle Clear Sidebar Selection & Hide Mobile Menu - added in V1.9
------------------------------------------------ */
var handleClearSidebarSelection = function() {
  $('.sidebar .nav > li, .sidebar .nav .sub-menu').removeClass('expand').removeAttr('style');
};
var handleClearSidebarMobileSelection = function() {
  $('#page-container').removeClass('page-sidebar-toggled');
};

var handleSidebarMinifyFloatMenu = function() {
	$(document).on('click', '#float-sub-menu li.has-sub > a', function(e) {
		var target = $(this).next('.sub-menu');
		var targetLi = $(target).closest('li');
		var close = false;
		var expand = false;
		if ($(target).is(':visible')) {
			$(targetLi).addClass('closing');
			close = true;
		} else {
			$(targetLi).addClass('expanding');
			expand = true;
		}
		$(target).slideToggle({
			duration: 250,
			progress: function() {
				var targetMenu = $('#float-sub-menu');
				var targetHeight = $(targetMenu).height();
				var targetOffset = $(targetMenu).offset();
				var targetOriTop = $(targetMenu).attr('data-offset-top');
				var targetMenuTop = $(targetMenu).attr('data-menu-offset-top');
				var targetTop 	 = targetOffset.top - $(window).scrollTop();
				var windowHeight = $(window).height();
				if (close) {
					if (targetTop > targetOriTop) {
						targetTop = (targetTop > targetOriTop) ? targetOriTop : targetTop;
						$('#float-sub-menu').css({ 'top': targetTop + 'px', 'bottom': 'auto' });
						$('#float-sub-menu-arrow').css({ 'top': '20px', 'bottom': 'auto' });
						$('#float-sub-menu-line').css({ 'top': '20px', 'bottom': 'auto' });
					}
				}
				if (expand) {
					if ((windowHeight - targetTop) < targetHeight) {
						var arrowBottom = (windowHeight - targetMenuTop) - 22;
						$('#float-sub-menu').css({ 'top': 'auto', 'bottom': 0 });
						$('#float-sub-menu-arrow').css({ 'top': 'auto', 'bottom': arrowBottom + 'px' });
						$('#float-sub-menu-line').css({ 'top': '20px', 'bottom': arrowBottom + 'px' });
					}
				}
			},
			complete: function() {
				if ($(target).is(':visible')) {
          console.log("visible...");
					$(targetLi).addClass('expand');
				} else {
					$(targetLi).addClass('closed');
				}
				$(targetLi).removeClass('closing expanding');
			}
		});
	});
	
  $('.sidebar .nav > li.has-sub > a').hover(function() {
    console.log("hover...");
		if ($('#page-container').hasClass('page-sidebar-minified')) {
			clearTimeout(floatSubMenuTimeout);
      
			var targetMenu = $(this).closest('li').find('.sub-menu').first();
			if (targetFloatMenu == this && $('#float-sub-menu').length !== 0) {
				return;
			} else {
				targetFloatMenu = this;
			}
			var targetMenuHtml = $(targetMenu).html();
			if (targetMenuHtml) {
				var sidebarOffset = $('#sidebar').offset();
				var sidebarX = (!$('#page-container').hasClass('page-with-right-sidebar')) ? (sidebarOffset.left + 60) : ($(window).width() - sidebarOffset.left);
				var targetHeight = $(targetMenu).height();
				var targetOffset = $(this).offset();
				var targetTop = targetOffset.top - $(window).scrollTop();
				var targetLeft = (!$('#page-container').hasClass('page-with-right-sidebar')) ? sidebarX : 'auto';
				var targetRight = (!$('#page-container').hasClass('page-with-right-sidebar')) ? 'auto' : sidebarX;
				var windowHeight = $(window).height();
        
				if ($('#float-sub-menu').length == 0) {
					targetMenuHtml = ''+
					'<div class="float-sub-menu-container" id="float-sub-menu" data-offset-top="'+ targetTop +'" data-menu-offset-top="'+ targetTop +'" onmouseover="handleMouseoverFloatSubMenu(this)" onmouseout="handleMouseoutFloatSubMenu(this)">'+
					'	<div class="float-sub-menu-arrow" id="float-sub-menu-arrow"></div>'+
					'	<div class="float-sub-menu-line" id="float-sub-menu-line"></div>'+
					'	<ul class="float-sub-menu">'+ targetMenuHtml + '</ul>'+
					'</div>';
					$('#page-container').append(targetMenuHtml);
				} else {
					$('#float-sub-menu').attr('data-offset-top', targetTop);
					$('#float-sub-menu').attr('data-menu-offset-top', targetTop);
					$('.float-sub-menu').html(targetMenuHtml);
				}
				
				if ((windowHeight - targetTop) > targetHeight) {
					$('#float-sub-menu').css({
						'top': targetTop,
						'left': targetLeft,
						'bottom': 'auto',
						'right': targetRight
					});
					$('#float-sub-menu-arrow').css({ 'top': '20px', 'bottom': 'auto' });
					$('#float-sub-menu-line').css({ 'top': '20px', 'bottom': 'auto' });
				} else {
					$('#float-sub-menu').css({
						'bottom': 0,
						'top': 'auto',
						'left': targetLeft,
						'right': targetRight
					});
					var arrowBottom = (windowHeight - targetTop) - 21;
					$('#float-sub-menu-arrow').css({ 'top': 'auto', 'bottom': arrowBottom + 'px' });
					$('#float-sub-menu-line').css({ 'top': '20px', 'bottom': arrowBottom + 'px' });
				}
			} else {
				$('#float-sub-menu').remove();
				targetFloatMenu = '';
			}
		}
	}, function() {
		if ($('#page-container').hasClass('page-sidebar-minified')) {
			floatSubMenuTimeout = setTimeout(function() {
				$('#float-sub-menu').remove();
				targetFloatMenu = '';
			}, 250);
		}
	});
};

/* 02. Handle Sidebar - Menu
------------------------------------------------ */
var handleSidebarMenu = function() {
  "use strict";

  var expandTime = ($('.sidebar').attr('data-disable-slide-animation')) ? 0 : 250;
  $('.sidebar .nav > .has-sub > a').click(function() {
      var target = $(this).next('.sub-menu');
      var otherMenu = $('.sidebar .nav > li.has-sub > .sub-menu').not(target);
  
      if ($('.page-sidebar-minified').length === 0) {
        $(otherMenu).closest('li').addClass('closing');
          $(otherMenu).slideUp(expandTime, function() {
              $(otherMenu).closest('li').addClass('closed').removeClass('expand closing');
          });
          if ($(target).is(':visible')) {
            $(target).closest('li').addClass('closing').removeClass('expand');
          } else {
            $(target).closest('li').addClass('expanding').removeClass('closed');
          }
          $(target).slideToggle(expandTime, function() {
              var targetLi = $(this).closest('li');
              if (!$(target).is(':visible')) {
                  $(targetLi).addClass('closed');
                  $(targetLi).removeClass('expand');
              } else {
                  $(targetLi).addClass('expand');
                  $(targetLi).removeClass('closed');
              }
              $(targetLi).removeClass('expanding closing');
          });
      }
  });

  $('.sidebar .nav > .has-sub .sub-menu li.has-sub > a').click(function() {
      if ($('.page-sidebar-minified').length === 0) {
          var target = $(this).next('.sub-menu');
          if ($(target).is(':visible')) {
            $(target).closest('li').addClass('closing').removeClass('expand');
          } else {
            $(target).closest('li').addClass('expanding').removeClass('closed');
          }
          $(target).slideToggle(expandTime, function() {
              var targetLi = $(this).closest('li');
              if (!$(target).is(':visible')) {
                  $(targetLi).addClass('closed');
                  $(targetLi).removeClass('expand');
              } else {
                  $(targetLi).addClass('expand');
                  $(targetLi).removeClass('closed');
              }
              $(targetLi).removeClass('expanding closing');
          });
      }
  });
};

/* 29. Handle Float Navbar Search - added in V4.0
------------------------------------------------ */
var handleToggleNavbarSearch = function() {
  $('[data-toggle="navbar-search"]').click(function(e) {
      e.preventDefault();
      $('.header').addClass('header-search-toggled');
  });
  
  $('[data-dismiss="navbar-search"]').click(function(e) {
      e.preventDefault();
      $('.header').removeClass('header-search-toggled');
  });
};

/* 03. Handle Sidebar - Mobile View Toggle
------------------------------------------------ */
var handleMobileSidebarToggle = function() {
  var sidebarProgress = false;

  $('.sidebar').bind('click touchstart', function(e) {
      if ($(e.target).closest('.sidebar').length !== 0) {
          sidebarProgress = true;
      } else {
          sidebarProgress = false;
          e.stopPropagation();
      }
  });
  
  $(document).bind('click touchstart', function(e) {
      if ($(e.target).closest('.sidebar').length === 0) {
          sidebarProgress = false;
      }
      if ($(e.target).closest('#float-sub-menu').length !== 0) {
          sidebarProgress = true;
      }
      
      if (!e.isPropagationStopped() && sidebarProgress !== true) {
          if ($('#page-container').hasClass('page-sidebar-toggled')) {
              sidebarProgress = true;
              $('#page-container').removeClass('page-sidebar-toggled');
          }
          if ($(window).width() <= 767) {
              if ($('#page-container').hasClass('page-right-sidebar-toggled')) {
                  sidebarProgress = true;
                  $('#page-container').removeClass('page-right-sidebar-toggled');
              }
          }
      }
  });
  
  $('[data-click=right-sidebar-toggled]').click(function(e) {
      e.stopPropagation();
      console.log("right-sidebar-toggled...");
      var targetContainer = '#page-container';
      var targetClass = 'page-right-sidebar-collapsed';
          targetClass = ($(window).width() < 979) ? 'page-right-sidebar-toggled' : targetClass;
      if ($(targetContainer).hasClass(targetClass)) {
          $(targetContainer).removeClass(targetClass);
      } else if (sidebarProgress !== true) {
          $(targetContainer).addClass(targetClass);
      } else {
          sidebarProgress = false;
      }
      if ($(window).width() < 480) {
          $('#page-container').removeClass('page-sidebar-toggled');
      }
      $(window).trigger('resize');
  });
  
  $('[data-click=sidebar-toggled]').click(function(e) {
      e.stopPropagation();
      console.log("sidebar-toggled...");
      var sidebarClass = 'page-sidebar-toggled';
      var targetContainer = '#page-container';
      
      if ($(targetContainer).hasClass(sidebarClass)) {
          $(targetContainer).removeClass(sidebarClass);
      } else if (sidebarProgress !== true) {
          $(targetContainer).addClass(sidebarClass);
      } else {
          sidebarProgress = false;
      }
      if ($(window).width() < 480) {
          $('#page-container').removeClass('page-right-sidebar-toggled');
      }
  });
};

/* 04. Handle Sidebar - Minify / Expand
------------------------------------------------ */
var handleSidebarMinify = function() {
  var sidebarClass = 'page-sidebar-minified';
  var targetContainer = '#page-container';
  
  $("#sidebar").find("a").not(".sidebar-minify-btn").hover(function(e){
    e.preventDefault();
    console.log("hover!!...", $(this), $(this).hasClass(sidebarClass), e);
    if ($(targetContainer).hasClass(sidebarClass))
      $(".sidebar-minify-btn").click();
  });
  
  /*$("#sidebar").find("li").mouseleave(function(e) {
    e.preventDefault();
    console.log("leave...", e);
    if (!$("#sidebar").hasClass(sidebarClass))
      $(".sidebar-minify-btn").click();
  });*/
  
  $(document).on('click', '[data-click=sidebar-minify]', function(e) {
    e.preventDefault();
    console.log("toggle-sidebar-minimization...");

    //Expand
    if ($(targetContainer).hasClass(sidebarClass)) {
      $(targetContainer).removeClass(sidebarClass);
      localStorage.setItem(sidebarClass, false);
    } else { //Minimization
      $(targetContainer).addClass(sidebarClass);
      localStorage.setItem(sidebarClass, true);
      if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        $('#sidebar [data-scrollbar="true"]').css('margin-top','0');
        $('#sidebar [data-scrollbar="true"]').css('overflow-x', 'scroll');
      }
    }
    $(window).trigger('resize');
  });
  
  $('.content.content-section').hover(function(){
    console.log("here content-section...");
    if (!$(targetContainer).hasClass(sidebarClass))
      window.mytimeout = setTimeout(function(){
        console.log("timeout...");
        if (!$(targetContainer).hasClass(sidebarClass))
          $(".sidebar-minify-btn").click();
      }, 5000); //1000 === 1seg
  }, function(){
      clearTimeout(window.mytimeout);    
  });
  
  let hide_sidebar = localStorage.getItem(sidebarClass);
  console.log("hide_sidebar: ", hide_sidebar, $(targetContainer).hasClass(sidebarClass));
  if (hide_sidebar == "true" && !$(targetContainer).hasClass(sidebarClass))
    $(".sidebar-minify-btn").click();
};

function hideSideBar(sidebarClass = 'page-sidebar-minified', targetContainer = '#page-container'){
  console.log("$(targetContainer).hasClass(sidebarClass): ", $(targetContainer), $(targetContainer).hasClass(sidebarClass));
  if (!$(targetContainer).hasClass(sidebarClass)){
    $(".sidebar-minify-btn").click();
    console.log("sidebar-minimization...");
  }
}

var Gallery = function () {
	"use strict";
	return {
		//main function
		init: function () {
			handleIsotopesGallery();
		}
	};
}();


/*************************compare partners*******************************/


function calculate_mosthigher_li(){
  var mostheight_desc = 0;
  var mostheight_score = 0;
  var mostheight_busi = 0;
  var mostheight_coun = 0;
  var mostheight_rev = 0;
  var mostheight_ind = 0;
  var mostheight_cli = 0;
  var mostheight_exp = 0;
  var mostheight_tech  = 0;
  var mostcardheight_exp = 0;
  var mostcardheight_tech = 0;
  var mostcardheight_cli = 0;
  
  
  $('.list-group-item').each(function(index, value){
      //console.log(value.classList[1])
      //if(value.classList[1] == 'clients'){
          //console.log(value.child())
          //console.log($(this))
      //}
      //console.log(value.style.height)
      
      if(value.classList[1] == 'description' && $(this).height() > mostheight_desc){
          mostheight_desc = $(this).height();
      }
      if(value.classList[1] == 'scoring' && $(this).height() > mostheight_score){
          mostheight_score = $(this).height();
      }
      if(value.classList[1] == 'businessdata' && $(this).height() > mostheight_busi){
          mostheight_busi = $(this).height();
      }
      if(value.classList[1] == 'countries' && $(this).height() > mostheight_coun){
          mostheight_coun = $(this).height();
      }
      if(value.classList[1] == 'reviews' && $(this).height() > mostheight_rev){
          mostheight_rev = $(this).height();
      }
      if(value.classList[1] == 'industries' && $(this).height() > mostheight_ind){
          //console.log($(this).height())
          mostheight_ind = $(this).height();
      }
      if(value.classList[1] == 'clients' && $(this).height() > mostheight_cli){
          //console.log($(this))
          //console.log($(this).height())
          //console.log(value.style.height)
          mostheight_cli = $(this).height();
          console.log(mostheight_cli)
      }
      $('.card-block.expertise').each(function(index, value){
          if($(this).height() > mostcardheight_exp){
              mostcardheight_exp = $(this).height();
          }
      });

      if(value.classList[1] == 'expertise' && $(this).height() > mostheight_exp){
          mostheight_exp = $(this).height();
      }

      $('.card-block.tech').each(function(index, value){
          if($(this).height() > mostcardheight_tech){
              mostcardheight_tech = $(this).height();
              //console.log('mostcardheight_tech',mostcardheight_tech)
          }
      });

      if(value.classList[1] == 'tech' && $(this).height() > mostheight_tech){
          mostheight_tech = $(this).height();
      }
  
      //console.log($('.list-group-item.description').height());

  });
  
  
  console.log('alta li',mostheight_cli);
  
  
  $('.list-group-item.description').height(mostheight_desc)
  
  $('.list-group-item.scoring').height(mostheight_score)
  $('.list-group-item.businessdata').height(mostheight_busi)
  $('.list-group-item.countries').height(mostheight_coun)
  //$('.card-block.industries').height(mostcardheight_ind)
  $('.list-group-item.industries').height(mostheight_ind)
  //$('.card-block.clients').height(mostcardheight_cli)
  $('.list-group-item.clients').height(mostheight_cli)
  $('.list-group-item.reviews').height(mostheight_rev)
  $('.card-block.expertise').height(mostcardheight_exp)
  $('.list-group-item.expertise').height(mostheight_exp)
  $('.card-block.tech').height(mostcardheight_tech)
  $('.list-group-item.tech').height(mostheight_tech)
  
  
}

function cargando(status){
  if(status){
    $.blockUI({
      message: `
      <div class="sk-chase">
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
      </div>
      `,
      css: {
        backgroundColor: 'transparent',
        border: 'none',
        textAlign: 'center',
        width: '80px',
        left: '40%',
        color: '#fff'
      }
    });
  }else{
    $.unblockUI();
  }
}

// funcions

var handleIsotopesGallery = function() {
	"use strict";
	var container = $('#gallery');
	var dividerValue = calculateDivider();
	var containerWidth = $(container).width();
	var columnWidth = containerWidth / dividerValue;
	$(container).isotope({
		resizable: true,
		masonry: {
			columnWidth: columnWidth
		}
	});
	
	$(window).smartresize(function() {
		var dividerValue = calculateDivider();
		var containerWidth = $(container).width();
		var columnWidth = containerWidth / dividerValue;
		$(container).isotope({
			masonry: { 
				columnWidth: columnWidth 
			}
		});
	});
	
	var $optionSets = $('#options .gallery-option-set'),
	$optionLinks = $optionSets.find('a');
	
	$optionLinks.click( function(){
		var $this = $(this);
		if ($this.hasClass('active')) {
			return false;
		}
		var $optionSet = $this.parents('.gallery-option-set');
		$optionSet.find('.active').removeClass('active');
		$this.addClass('active');
	
		var options = {};
		var key = $optionSet.attr('data-option-key');
		var value = $this.attr('data-option-value');
			value = value === 'false' ? false : value;
			options[ key ] = value;
		$(container).isotope( options );
		return false;
	});
};

var handleClipboard = function() {
	var clipboard = new ClipboardJS('.btn');
	clipboard.on('success', function(e) {
		$(e.trigger).tooltip({
			title: 'Copied',
			placement: 'top'
		});
		$(e.trigger).tooltip('show');
		setTimeout(function() {
			var bootstrapVersion = handleCheckBootstrapVersion();
			if (bootstrapVersion >= 3 && bootstrapVersion < 4) {
				$(e.trigger).tooltip('destroy');
			} else if (bootstrapVersion >= 4 && bootstrapVersion < 5) {
				$(e.trigger).tooltip('dispose');
			}
		}, 500);
	});
};

var AppDigitalParnters = function () {
	"use strict";
  var setting;

	return {
		//main function
		init: function (option) {
            if (option) {
              setting = option;
            }
            handleIsotopesGallery();
            handleClipboard();
            this.initSidebar();
            $(window).trigger('load');
            //
		},
		initSidebar: function() {
			handleSidebarMenu();
			handleMobileSidebarToggle();
			handleSidebarMinify();
			handleSidebarMinifyFloatMenu();
      handleToggleNavProfile();
      handleToggleNavbarSearch();
			if (!setting || (setting && !setting.disableSidebarScrollMemory)) {
				handleSidebarScrollMemory();
			}
		},
		initSidebarSelection: function() {
		    handleClearSidebarSelection();
		},
		initSidebarMobileSelection: function() {
		    handleClearSidebarMobileSelection();
		}
	};
}();

$(function() {
	AppDigitalParnters.init();
  //AppDigitalParnters.initSidebar();
  
});

function decodeHtmlSpecialChar(str){
  if (!str) { return str; }
  
  str = str.replace(/&amp;/g, "&");
  str = str.replace(/&gt;/g, ">");
  str = str.replace(/&lt;/g, "<");
  str = str.replace(/&quot;/g, '"');
  str = str.replace(/&#039;/g, "'");
  return str;
}

console.log("script from assets-dp...")


function hasClickListener(element) {
  var listeners;
  if (element instanceof jQuery || $(element).length) {
    listeners = $._data(element[0], 'events')?.click;
  } else {
    element = element.includes("#") ? element.replace("#", "") : element;
    listeners = getEventListeners(element)?.click;
  }
  return listeners && listeners.length > 0;
}

function hasSubmitListener(element) {  
  var listeners;
  if (element instanceof jQuery || $(element).length) {
    listeners = $._data(element[0], 'events')?.submit;
  } else {
    element = element.includes("#") ? element.replace("#", "") : element;
    listeners = getEventListeners(element)?.submit;
  }
  return listeners && listeners.length > 0;
}

// Clear the POST data by replacing the current state
function clearPostData(get_params = false) {
  var url = window.location.href; //.split('?')[0]; // Remove query parameters if any
  history.replaceState(null, '', url);
}

//TODO: DEPRECATED: DOES NOT WORK?
function reorderObjectKeys(obj, keyIndexOrder) {
  const keyArray = Object.keys(obj);
  const reorderedObj = {};
  /*keyIndexOrder.sort(function(a, b) {
    return a - b;
  });*/
  // Iterate over the array of key positions
  for (let i = 0; i < keyIndexOrder.length; i++) {
    const position = keyIndexOrder[i];
    
    // Retrieve the key at the desired position
    const key = keyArray[position];
    
    // Retrieve the corresponding value from the original object
    if (obj.hasOwnProperty(key)) {
      console.log("position: ", position, key, obj[key])
      reorderedObj[key] = obj[key];
    }
  }

  return reorderedObj;
}

function getScoreByPresence(ref_values, values_2, any_option=false) {
  console.log("***getScoreByPresence - ref_values: ", ref_values, ref_values.length, values_2, any_option);
  let score_ = 0;
  ref_values = Array.isArray(ref_values) ? ref_values : [ref_values];
  values_2 = Array.isArray(values_2) ? values_2 : [values_2];
  
  if (!ref_values.length) {
    console.log("+res null: ", ref_values, ref_values.length);
    return null;
  }
  
  for (let i = 0; i < ref_values.length; i++) {
    const value = ref_values[i];
    
    if (values_2.includes(value)) {
      score_ += 1;
      if (any_option){
        console.log("+res any_option null: ", any_option, value, values_2, score_);
        return 1;
      }
    } else if (typeof value === 'number' && values_2.includes(value.toString())) {
      score_ += 1;
    }
    
    console.log("value:", value, values_2.includes(value), values_2.includes(value.toString()), score_);
  }
  
  const score = any_option ? score_ : score_ / ref_values.length;
  console.log("+res score:", score_, score, ref_values.length);
  
  return score;
}

function removeAccents(word) {
  return word.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}


function deleteAttribute(obj, attr) {
  if (obj.hasOwnProperty(attr)) {
    delete obj[attr];
    return true;
  }
  return false;
}

function createVueComponent(templateString, data, mount_jq_selector = null){
  
  const compiledTemplate = Vue.compile(templateString, customMethod = null);
  
  const app = new Vue({
      data() {
        return data;
      },
      methods: {
        customMethod(element) {
          // Custom logic using the element
          console.log('Custom method invoked by element:', element);
          
          // Example: Setting a data attribute on the element
          element.setAttribute('data-custom-attribute', 'custom value');
        },
      },
      computed: {
        compiledTemplate() {
          return compiledTemplate;
        },
      },
      render: compiledTemplate.render,
      staticRenderFns: compiledTemplate.staticRenderFns,
    }
  );
  
  if (mount_jq_selector)
    app.$mount(mount_jq_selector);
  return app;
}

function varInit(object, var_name, default_value = null, col_options = {}, return_lists = false){
  if (var_name.includes("."))
    value = getDeepValue(object, var_name, default_value, return_lists = return_lists);
  else{
    value = typeof object === "object" && Object.keys(object).includes(var_name) ? object[var_name] : default_value;
    value = typeof col_options === "object" && Object.keys(col_options).includes(var_name) ? col_options[var_name] : value; 
  }
  console.log("object: ", object, var_name, value, default_value);
  return value;
}

/* //USE:
const mergedOptions = dinamicFunctionParams(options, defaultOptions);
createVariables(defaultOptions, mergedOptions);*/
function dinamicFunctionParams(options, defaultOptions){
  const mergedOptions = { ...defaultOptions, ...options };

  // Extract required parameters from defaultOptions
  const requiredParams = Object.keys(defaultOptions).filter(param => defaultOptions[param] === undefined);

  // Check if any required parameters are missing
  const missingParams = requiredParams.filter(param => !(param in mergedOptions));

  if (missingParams.length > 0) {
    throw new Error(`Missing required parameters: ${missingParams.join(', ')}`);
  }

  return mergedOptions;
}

function createVariables(defaultOptions, mergedOptions) {
  const mergedParams = { ...defaultOptions, ...mergedOptions };
  const variableMap = {};

  Object.keys(mergedParams).forEach((param) => {
    let variableName = param;
    let index = 1;

    while (variableMap[variableName]) {
      variableName = `${param}_${index}`;
      index++;
    }

    variableMap[variableName] = true;
    window[variableName] = mergedParams[param];
  });
}

function applyPrecision(value, precision, error = false) {
  // Check if the value is a valid numeric value
  if (!/^\d+(\.\d+)?$/.test(value)) {
    if (error) {
      throw new Error('Invalid numeric value');
    } else {
      return value; // Return the value as is without rounding
    }
  }

  // Round the value to the specified precision
  const roundedValue = Number(value).toFixed(precision);

  return roundedValue;
}

function checkAndImportMethod(object, method, callback = null, libraryScriptPath = null, styleSheetPath = null) {
  if (object && method && typeof object[method] === 'function') {
    // The method exists, you can call it
    //object[method]();
    return false;
  } else {
    
    var libraries = {
      "rateCircle": {
        "css": 'assets-dp/plugins/rate/rate.css',
        "js": 'assets-dp/plugins/rate/jquery.rate.js',
      }
    }
    
    libraryScriptPath = !libraryScriptPath && Object.keys(libraries).includes(method) && Object.keys(libraries[method]).includes("js") ? libraries[method]["js"] : libraryScriptPath;
    libraryScriptPath = libraryScriptPath && !libraryScriptPath.includes("/static/") ? "/static/"+libraryScriptPath.replace("//", "/") : libraryScriptPath;
    styleSheetPath = !styleSheetPath && Object.keys(libraries).includes(method) && Object.keys(libraries[method]).includes("css") ? libraries[method]["css"] : styleSheetPath;
    styleSheetPath = styleSheetPath && !styleSheetPath.includes("/static/") ? "/static/"+styleSheetPath.replace("//", "/") : styleSheetPath;
    
    // The method doesn't exist, import the library dynamically
    if (libraryScriptPath){
      const script = document.createElement('script');
      script.src = libraryScriptPath;
      
      script.onload = function() {
        // The library script is loaded, you can use it here
        if (callback && typeof callback === "function")
          callback();
      };
      
      script.onerror = function() {
        // Handle any errors that occurred during the library script import
      };
      
      document.head.appendChild(script);
      console.log("document.head append script...", script);
    }
    
    // Now import the CSS style sheet
    if (styleSheetPath){
      const styleSheet = document.createElement('link');
      styleSheet.rel = 'stylesheet';
      styleSheet.href = styleSheetPath;
      
      styleSheet.onload = function() {
        // The CSS style sheet is loaded, you can use the styles here
      };
      styleSheet.onerror = function() {
        // Handle any errors that occurred during the style sheet import
      };
      document.head.appendChild(styleSheet);
      console.log("document.head append styleSheet...", styleSheet);
    };
  }
  return true;
}

// Function to copy the provided text to the clipboard
function copyToClipboard(text) {
  console.log("***copyToClipboard: ", text)
  var textarea = document.createElement('textarea');
  // Set the style to hide the textarea
  textarea.style.display = 'none';
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
}

function prependObjectAttr(object_, key, value){
  console.log("***prependObjectAttr: ", object_, key, value);
  /*let map = new Map();
  // Add a key-value pair as the first entry
  map.set(key, value);
  // Add other entries to the map
  for (let [key_, value_] of Object.entries(object_))
    map.set(key_, value_);
  console.log("+res map: ", map, typeof map);
  return map;*/
  return {...{key, value}, ...object_};
}


function strCountCharOccurrences(str, char) {
  let count = 0;
  for (let i = 0; i < str.length; i++) {
    if (str.charAt(i) === char) {
      count++;
    }
  }
  return count;
}

function calculateAverage(list) {
  var sum = 0;
  var count = 0;

  for (var i = 0; i < list.length; i++) {
    if (typeof list[i] === 'number') {
      sum += list[i];
      count++;
    }
  }

  if (count === 0) {
    return 0; // To handle the case when the list is empty or contains no numeric values
  }

  return sum / count;
}

function createTableFromObject(obj, columnNames) {
  console.log("***createTableFromObject - obj: ", obj, columnNames);
  const table = document.createElement('table');
  
  // Insert a row for the table header
  const headerRow = table.insertRow();
  const headerCell1 = document.createElement("th");
  headerCell1.textContent = "Columna";
  //headerCell1.style.textAlign = "center"; // Apply center alignment style
  headerRow.appendChild(headerCell1);
  const headerCell2 = document.createElement("th");
  headerCell2.textContent = "Valor";
  headerCell2.style.textAlign = "center"; // Apply center alignment style
  headerRow.appendChild(headerCell2);
  
  // Insert rows for the table body
  for (var i = 0; i < columnNames.length; i++) {
    const row = table.insertRow();
    
    let column = columnNames[i];
    const cell1 = row.insertCell();
    cell1.textContent = column;
    
    let value = obj[i] && typeof obj[i] === "object" && obj[i].display ? obj[i].display : obj[i];
    const cell2 = row.insertCell();
    // Set the HTML string as innerHTML
    if (isHTMLString(value))
      cell2.innerHTML = value;
    else
      cell2.textContent = value;
    cell2.style.textAlign = "center"; // Apply center alignment style
  }

  return table;
}

/*function isHTMLString(str) {
  if (!str || typeof str !== "string" || !str.toString().trim().startsWith("<"))
    return false
  return /^<([a-z]+)\b[^>]*>(?:(.*?)<\/\1>)?$/.test(str);
  //return /^<([a-z]+)(\s+[^>]+)*?>[\s\S]*?<\/\1>$/.test(str.replace(/"/g, '\\"'));
}*/
function isHTMLString(str) {
  if (!str || typeof str !== "string" || !str.toString().trim().startsWith("<"))
    return false;

  const htmlRegex = /<([a-z]+)((\s+[a-z\-]+(="[^"]*")?)*)\s*>[\s\S]*?<\/\1>/i;
  return htmlRegex.test(str) || /^<([a-z]+)\b[^>]*>(?:(.*?)<\/\1>)?$/.test(str);;
}


if (!RegExp.escape) {
  RegExp.escape = function (text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
  };
}
function strReplaceChars(str, replacements) {
  if (!str) {return str;}
  for (var char in replacements) {
    if (replacements.hasOwnProperty(char)) {
      var escapedChar = RegExp.escape(char);
      var regex = new RegExp(escapedChar, 'g');
      try {
        str = str.replace(regex, replacements[char]);
      } catch (error) {
        console.error("str: ", str);
        return;
      }
    }
  }
  return str;
}


function createHTMLElement(tag, attributes, as_str = false) {
  var element = $('<' + tag + '>');
  
  for (const attr in attributes) {
    const value = attributes[attr];
    console.log("attr: ", attr, value);
    
    if (attr === 'selected' && value) { //tag === 'select' && 
      element.prop('selected', true);
    } else if (attr === 'disabled' && value) {
      element.prop('disabled', true);
    } else if (attr === 'class') {
      element.addClass(value);
    } else if (attr === 'text') {
      console.log("text: ", value);
      if (tag === 'option')
        element.text(value);
      else
        element.innerText = value;
    } else if (attr === 'content') {
      element.innerHTML = value;
    } else {
      element.attr(attr, value);
    }
  }
  
  element = element.get(0);
  //console.log("+res createHTMLElement: ", element, element.outerHTML.split("</")[0], element.outerHTML.replace(/^<[^>]+>/, ''))
  if (as_str)
    return element.outerHTML.split("</")[0]; //element.outerHTML.replace(/^<[^>]+>/, '');
  else
    return element;
}


function strReplaceData(value, row, exceptions = [], special_char = "%%"){
  const regex = /%%([\w\d_\.]+)%%/g;
  const vars = value.match(regex);
  console.log("vars: ", vars);
  if (vars) {
    for (var j = 0; j < vars.length; j++) {
      if (!exceptions.includes(vars[j])){
        let value_ = getDeepValue(row, vars[j].replace("%%", "").replace("%%", ""));
        console.log("value_: ", value_, typeof value_);
        value_ = value_ ? value_.toString() : value_;
        console.log("value_-2: ", value_, typeof value_);
        value = value_ ? value.replace(vars[j], value_) : value;
      }
    }
  }
  return value
}

function list_to_dict(data, field = "id"){
  if (!data)
    data = []
  var data_ = {}
  for (var i = 0; i < data.length; i++) {
    data_[data[i][field]] = data[i];
  }
  return data_
}

function refreshPageWithParams(params, url = null) {
  loadSpinWheel();
  // Get the current URL
  url = url ? url : window.location.href;
  
  // Extract the current query string from the URL
  var currentQueryString = url.split('?')[1] || '';
  
  // Parse the current query parameters into an object
  var queryParams = {};
  currentQueryString.split('&').forEach(function(param) {
    var parts = param.split('=');
    var key = decodeURIComponent(parts[0]);
    var value = decodeURIComponent(parts[1]);
    queryParams[key] = value;
  });
  
  // Merge the input params with the current query parameters
  var mergedParams = { ...queryParams, ...params };
  
  // Build the new query string
  var queryString = Object.keys(mergedParams).map(function(key) {
    return encodeURIComponent(key) + '=' + encodeURIComponent(mergedParams[key]);
  }).join('&');
  
  // Append the query string to the current URL
  var newUrl = url.split('?')[0] + '?' + queryString;
  
  // Refresh the webpage with the new URL
  window.location.href = newUrl;
}

function orderObjList(dataList, field, order = 'asc', try_uncamelize = false, nullLast = true, add_newObj = false) {
  console.log("***orderObjList: ", field, order, nullLast, add_newObj);
  order = order === -1 ? 'desc' : order;
  order = order === 1 ? 'asc' : order;
  
  if (!dataList.some(obj => obj.hasOwnProperty(field))) {
    console.log("field.includes(.): ", field.includes("."));
    if (field.includes("."))
      return sortByNestedField(dataList, field, order);
    else if (try_uncamelize)
      field = toUncamelize(field);
    //console.log("dataList: ", dataList);
    let reg = dataList.length != 0 ? dataList[0] : dataList;
    console.log("reg: ", reg);
    if (!dataList.some(obj => obj.hasOwnProperty(field))) {
      console.warn(`Field "${field}" not found in any dictionary of the list.`);
      return dataList;
    }
  }

  const orderedList = dataList.slice().sort((a, b) => {
    const valueA = a[field] ?? null;
    const valueB = b[field] ?? null;
    console.log("valueA-B: ", valueA, valueB);
    
    if (valueA === null && valueB === null) {
      return 0; // Null values are considered equal
    }
    if (valueA === null) {
      return order === 'asc' ? (nullLast ? 1 : -1) : (nullLast ? 1 : -1); // Control null placement in ascending order
    }
    if (valueB === null) {
      return order === 'asc' ? (nullLast ? -1 : 1) : (nullLast ? -1 : 1); // Control null placement in descending order
    }
    if (typeof valueA === 'string' && typeof valueB === 'string') {
      return order === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
    }
    return order === 'asc' ? valueA - valueB : valueB - valueA; // Numeric comparison
  });
  console.log("dataList[0][field]: ", dataList[0][field], orderedList[0][field], dataList[0][field] == orderedList[0][field])
  
  if (add_newObj){
    const newObj = {};
    for (let i = 0; i < dataList.length; i++) {
      const record = dataList[i];
      const index = orderedList.findIndex(item => item[field] === record[field]);
      newObj[i] = index + 1;
    }
    return [orderedList, newObj];
  }
  else
    return orderedList;
}

function sortByNestedField(arr, field, order = 'asc') {
  return arr.sort((a, b) => {
    const keys = field.split('.'); // Split the field string into keys
    let aValue = a;

    // Traverse the nested keys to access the value
    for (const key of keys) {
      aValue = aValue[key];
    }

    let bValue = b;

    // Traverse the nested keys to access the value
    for (const key of keys) {
      bValue = bValue[key];
    }

    // Compare the values based on the sort order
    if (order === 'asc') {
      if (aValue < bValue) {
        return -1;
      }
      if (aValue > bValue) {
        return 1;
      }
      return 0;
    } else if (order === 'desc') {
      if (aValue > bValue) {
        return -1;
      }
      if (aValue < bValue) {
        return 1;
      }
      return 0;
    }

    // Default to no change in order
    return 0;
  });
}

function num2Label(value, labels = ["1-low", "2-medium", "3-high"], scale=100) {
  console.log("***num2Label: ", value, labels, scale);
  //if ()
  if (!Array.isArray(value) && !isNumeric(value) && (typeof value === "string" || typeof value === "object"))
    return value;
  else if (Array.isArray(value)) {value = value.length;}
  var interval = scale * (1 / labels.length);
  var lowerBound = 0;
  var upperBound = interval;
  
  for (var i = 0; i < labels.length; i++) {
    console.log("n2l-value: ", value, lowerBound, upperBound, value >= lowerBound, value < upperBound);
    if (value >= lowerBound && value < upperBound) {
      return labels[i];
    }
    
    lowerBound += interval;
    upperBound += interval;
  }
  
  return labels[labels.length - 1];  // Default label if value is outside the defined ranges
}

function handleScroll(jqSelector) {
  var isMouseDown = false;
  var startX;
  var scrollLeft;

  $(jqSelector).on('mousedown', function(event) {
    console.log("mousedown...");
    if (event.which === 3) { // Check if right-click (button 2) is pressed
      console.log("second btn...");
      event.preventDefault(); 
      isMouseDown = true;
      startX = event.clientX;
      scrollLeft = $(jqSelector).scrollLeft();
    }
  });

  $(jqSelector).on('mousemove', function(event) {
    if (isMouseDown) {
      var x = event.clientX - startX;
      $(jqSelector).scrollLeft(scrollLeft - x);
    }
  });

  $(document).on('mouseup', function(event) {
    if (event.which === 3) { // Check if right-click (button 2) is released
      event.preventDefault();
      isMouseDown = false;
    }
  });
}

function negateValue(value) {
  let result = value;
  if (typeof value === "boolean") {
    return !result;
  }
  else if (typeof value === "number") {
    return result === 0 ? 1 : 0;
  }
  else if (typeof value === "string" && (value === "0" || value === "1")) {
    return result === "0" ? "1" : "0";
  }
  console.log("+res negateValue: ", value, result)
  // Return the value as it is for other cases
  return result;
}

function JsonStr2Obj(value){
  var value_ = value
  console.log("***JsonStr2Obj: ", value, typeof value, value.toString().startsWith("["), value.toString().endsWith("]"));
  if (typeof value === "string" && value.toString().startsWith("[") && value.toString().endsWith("]")){
    try{
      value_ = JSON.parse(value.toString());
    } catch (error_){
      console.log("error_: ", error_, value);
      if (value.includes("'")){
        value_ = JSON.parse(strReplaceChars(value.toString(), {"'":'"'}));
      }
      else { value_ = value; }
    }
  }
  console.log("+res value_: ", value_);
  return value_;
}

function convertCategoricalValues(value_, categorical_values_dict){
  console.log("***convertCategoricalValues: ", value_, categorical_values_dict);
  var value = null;
  if (value_ == null)
    value = value_;
  if (typeof value_ !== "object" || !Array.isArray(value_))
    value = categorical_values_dict[value_];
  else
    value = [];
    for (var j = 0; j < value_.length; j++) {
      let value__ = value_[j] ? value_[j].toString() : value_[j];
      console.log("it-value_: ", value__, value__.toString (), Object.keys(categorical_values_dict), Object.keys(categorical_values_dict).includes(value__.toString()));
      if (Object.keys(categorical_values_dict).includes(value__))
        value.push(categorical_values_dict[value__]);
      else if (Object.keys(categorical_values_dict).includes(value__.toString()))
        value.push(categorical_values_dict[value__.toString()]);
      console.log("value-set-2: ", value, value__.toString());
    }
    console.log("+res value: ", value)
  return value;
}

function formatCategoricalValue(key, categorical_values_dict){
  console.log("formatCategoricalValue: ", key);
  key = typeof key === "string" && key.startsWith("A_") ? key.replace("A_", "") : key;
  return categorical_values_dict[key];
}

REG_EXP_CAMELIZE = /\-[a-z]/g;
function camelize(str) {
  return str.replace(REG_EXP_CAMELIZE, function(match) {
    return match.charAt(1).toUpperCase();
  });
}