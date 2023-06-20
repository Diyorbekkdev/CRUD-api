let addTeacherBtn = document.querySelector('.add-teacher');
let modal = document.querySelector('.form_wrapper');
addTeacherBtn.addEventListener("click", function(){
    closeModal()    
})


function closeModal(){
    modal.classList.toggle("view");
}

function remove(){
    modal.classList.toggle("view");
}