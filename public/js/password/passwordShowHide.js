$('#passwordHide').click(function() {
	$('.eye').toggleClass('fa-eye-slash');
	$('.eye').toggleClass('fa-eye');
	if ($('#password').attr('type') === 'password') $('#password').attr('type', 'text');
	else $('#password').attr('type', 'password');
});
