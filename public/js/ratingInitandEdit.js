var editId;

// $('#bookingBtn').click(function(){
//    $('.toast-container')
//   .toast({
//       displayTime: 2000,
//       message: 'I am a toast !'
//   });
// })

$('.ui.rating').rating('disable');
$('.ui.rating.interactable').rating();

$('.ui.rating.interactable')
  .rating('setting', 'onRate', function(value) {
      $('#ratingField').val(value);
});

$('.ui.rating.interactable.edit')
  .rating('setting', 'onRate', function(value) {
      console.log(value);
      $(editId+'editRatingField').val(value);
});

function toggleEditForm(element){
   var id = "#"+element.id;
   editId = "#"+element.id;
   $(id+"form").toggleClass('d-none');
   $(id+"reviewTextDisplay").toggleClass('d-none');
   $(id+"displayRating").toggleClass('d-none');
   $(id+"editRating").toggleClass('d-none');
   
   if ($(id).text() == "Cancel")
      $(id).text("Edit")
   else
      $(id).text("Cancel");
}