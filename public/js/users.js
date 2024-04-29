// Chức năng gửi yêu cầu kết bạn

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

// Kết thúc chức năng gửi yêu cầu kết bạn

// Chức năng hủy yêu cầu kết bạn

const listBtnCancelFriend = document.querySelectorAll('[btn-cancel-friend]');
if(listBtnCancelFriend.length >0) {
  listBtnCancelFriend.forEach(btn => {
    btn.addEventListener("click", () =>{
      const userId = btn.getAttribute('btn-cancel-friend');
      btn.closest(".box-user").classList.remove("add");
      socket.emit("CLIENT_CANCEL_FRIEND", userId);
    })
  });

}

// Kết thúc chức năng hủy yêu cầu kết bạn

