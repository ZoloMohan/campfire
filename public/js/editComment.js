function toggleEditForm(element){
    var id = "#"+element.id;
    $(id+"form").toggleClass('d-none');
    $(id+"commentTextDisplay").toggleClass('d-none');
    if ($(id).text() == "Cancel")
       $(id).text("Edit")
    else
       $(id).text("Cancel");
}