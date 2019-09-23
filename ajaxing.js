

console.log('ajaxing.js is loaded successfully. 3.0.0');

/**
*
* form must have `action` attribute refere to the ajax request url, POST `method` not needed
* 	request must return `json encoded array` with ['success'] key or ['error'] key stored with value `true` or anything equal to true
* 	then the key['response'] is optinal to add the response into the responseId 
*
* response is the selector of the div which recieve the returned response from ajax. the div can be anywhere.
*
* loadingText is optinal. can store html tags too like font awesome icons.
*
* animation is optinal default: false. accepts boolean to decide should we show response with slideDown effect ?.
*
* clearForm is optinal default: false. accepts boolean to decide should we clear form after success ?.
*
* confirmresponse is optional default: false. accepts text that will show in confirmation response.
*
* onSuccess is optional. accepts function that will be executed on success
* 	onSuccess passes the response as an argument.
*
*
*
*/

function ajaxing({
	form, 
	response, 
	loadingText = 'loading...', 
	animation = true, 
	clearForm = false, 
	confirmMessage = false,
	onSuccess = function(){}
}) {

	$(form).on('submit', function(e) {
	  e.preventDefault();

	  if (confirmMessage) if(!confirm(confirmMessage)) return false;

	  var form = $(this);
	  var targetUrl = form.attr('action');
	  var formData = form.serialize();
	  var submitButton = form.find('button[type=submit]');
	  var submitButtonHolder = submitButton.html();

	  var delayLoading;

	  if (submitButton.attr('disabled')) return false;

	  $.ajax({
	    url: targetUrl,
	    type: 'POST',
	    data: new FormData(this),
	    contentType: false,
	    cache: false,
	    processData: false,
	    dataType: 'json',
	    beforeSend: function() {
	      submitButton.attr('disabled', 'disabled');
	      if (response) $(response).html('');
	      delayLoading = setTimeout(_ => submitButton.html(loadingText), 150);
	    },
	    complete: function() {
	    	clearTimeout(delayLoading);
	      submitButton.html(submitButtonHolder);
	      submitButton.removeAttr('disabled');
	    },
	    success: function(json) {
	      if (response) {
	      	$(response).html(json.response);
		    	if (animation) {
		    		$(response).hide();
		    		$(response).slideDown();
		    	} else {
		    		$(response).show();
		    	}
	    	}

	      form.find('input[type=password]').val('');
	      
	      if (json.success) {
		      if (clearForm) {
		      	form.find('input[type=text], input[type=email], input[type=file], textarea').val('');
		      }
		      
	      	onSuccess(json, form);
	      }
	    },
	    error: function(err) {
	      alert('Something went wrong ! ');
	    }
	  });

	});
}
