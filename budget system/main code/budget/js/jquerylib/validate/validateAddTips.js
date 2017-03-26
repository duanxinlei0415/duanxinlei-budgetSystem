function addTips(form){
	$("#"+form).validate({
		errorClass: "errormessage",  
        onkeyup: false,  
        errorClass: 'error',  
        validClass: 'valid',  
        errorPlacement: function(error, element)  
        {  
            var elem = $(element),  
                corners = ['center right' ,'left center'],  
                flipIt = elem.parents('span.right').length > 0;  
  
            // Check we have a valid error message  
            if(!error.is(':empty')) {  
                // Apply the tooltip only if it isn't valid  
                elem.first().qtip({  
                    overwrite: false,  
                    content: error,  
                    position: {  
                        my: corners[ flipIt ? 0 : 1 ],  
                        at: corners[ flipIt ? 1 : 0 ],  
                        viewport: $(window)  
                    },  
                    show: {  
                        event: false,  
                        ready: true  
                    },  
                    hide: false,  
                    style: {  
                        classes: 'qtip-blue' // Make it red  
                    }  
                })  
  
                // If we have a tooltip on this element already, just update its content  
                .qtip('option', 'content.text', error);  
            }  
  
            // If the error is empty, remove the qTip  
            else { elem.qtip('destroy'); }  
        },  
        success: $.noop,  
        submitHandler:  function(form){  
            form.submit();  
        }
	});
};