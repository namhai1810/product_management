const listBtnAddFriend = document.querySelectorAll('[btn-add-friend]');
if(listBtnAddFriend.length >0) {
  listBtnAddFriend.forEach(btn => {
    btn.addEventListener("click", () =>{
      const userId = btn.getAttribute('btn-add-friend');
      btn.closest(".box-user").classList.add("add");
      socket.emit("CLIENT_ADD_FRIEND", userId);
    })
  });

}