var pymChild = pym.Child({ polling: 500 });

var inIframe = function() {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
};

$(document).ready(function(){

	if(inIframe()){
	  $('.iframe-show').show();
	} else {
	  $('.no-iframe-show').show();
	}

});
