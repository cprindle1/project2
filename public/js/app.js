
var $openModal= $("#openModal");
var $modal = $("#modal");
var $closeModal = $("#closeModal");

var $deleteButton = $('.openModal');

var openModal = function() {
  $modal.css("display", "block");
};
var closeModal = function() {
  $modal.css("display", "none");
};
var openDeleteModal= function(){
  console.log(this);

  $modal.css("display", "block");
  console.log(this);
  var $deleteIt= $('#deleteForm');
  console.log($deleteIt.attr('action'));
  // /code/<%=user.codes._id%>?_method=DELETE
  var action=("/code/"+this.id+"?_method=DELETE");
  $deleteIt.attr('action', action);
};


$openModal.on("click", openModal);
$closeModal.on("click", closeModal);
$deleteButton.on("click", openDeleteModal);
