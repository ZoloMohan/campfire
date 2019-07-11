$('.nav-link').click(function(){
    document.querySelectorAll('.nav-link').forEach(function(el){
        if(el.classList.contains('active'))
        el.classList.remove('active');
    })
    this.className += " active";
})