

console.log('ajaxing.js is loaded successfully. 2.0.1');

/**
*
* formId must have `action` attribute refere to the ajax request url and POST `method`
* 	request must return `json encoded array` with ['success'] key or ['error'] key stored with value `true` or anything equal to true
* 	then the key['message'] is optinal to add the message into the messageId 
*
* message is the selector of the div which recieve the returned message from ajax. the div can be anywhere.
* loadingText is optinal. can store html tags too like font awesome icons.
* animation is optinal default: false. accepts boolean to decide should we show message with slideDown effect ?.
* clearForm is optinal default: false. accepts boolean to decide should we clear form after success ?.
*	confirmMessage is optional default: false. accepts text that will show in confirmation message.
* onSuccess is optional. accepts function that will be executed on success
* onSuccess pass the response as an argument.
*
*
* Example:
*
	ajaxForm({
	    form: '#loginForm', 
	    message: '#loginMessage',
	    loadingText: '<i class="fa fa-spinner fa-spin"></i> loading',
	    onSuccess: function() {
	        $('#loginMessage').hide();
	        $('#loginMessage').slideDown();
	        $('#loginBox').slideUp();
	        setTimeout(_ => window.location.href = 'admin/index.php', 3000);
	    }
  	});
*
*
* Example 2:
*
	ajaxForm({
	    form: '#myForm', 
	    message: '#alertMessage',
	    loadingText: '<i class="fa fa-spinner fa-spin"></i> loading',
	    onSuccess: function(json) {
	      $('#commentList').prepend(json.result);
	      $('#commentCount').html(+$('#commentCount').html()+1);
	      $([document.documentElement, document.body]).animate({scrollTop: $("#comments").offset().top }, 500);    
	    }
	});
*
*/

function ajaxForm({
	form, 
	message, 
	loadingText = 'loading...', 
	animation = false, 
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
	      if (message) $(message).html('');
	      delayLoading = setTimeout(_ => submitButton.html(loadingText), 150);
	    },
	    complete: function() {
	    	clearTimeout(delayLoading);
	      submitButton.html(submitButtonHolder);
	      submitButton.removeAttr('disabled');
	    },
	    success: function(json) {
	      if (message) {
	      	$(message).html(json.message);
		    	if (animation) {
		    		$(message).hide();
		    		$(message).slideDown();
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
