$('#passwordHide').click(function(){
    $('.eye.icon').toggleClass('slash');
    if($('#password').attr('type') === 'password')
    $('#password').attr('type', 'text');
    else
    $('#password').attr('type', 'password')
})