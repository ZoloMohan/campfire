function validate(){
    if(!($('#password').val() === $('#confirmPassword').val())){
        $('#dontMatch').removeClass('d-none');
        $('#password').val('');
        $('#confirmPassword').val('');
        return false;
    }
    else{
        return true;
    }
}
