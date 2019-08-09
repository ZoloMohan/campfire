function validate() {
	if (!($('#password').val() === $('#confirmPassword').val())) {
		$('body').toast({
			title   : 'Error',
			message : "Passwords Don't Match",
			class   : 'error'
		});
		return false;
	} else {
		return true;
	}
}
