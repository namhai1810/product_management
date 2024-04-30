// Chức năng gửi yêu cầu kết bạn

const listBtnAddFriend = document.querySelectorAll("[btn-add-friend]");
if (listBtnAddFriend.length > 0) {
  listBtnAddFriend.forEach((btn) => {
    btn.addEventListener("click", () => {
      const userId = btn.getAttribute("btn-add-friend");
      btn.closest(".box-user").classList.add("add");
      socket.emit("CLIENT_ADD_FRIEND", userId);
    });
  });
}

// Kết thúc chức năng gửi yêu cầu kết bạn

// Chức năng hủy yêu cầu kết bạn

const listBtnCancelFriend = document.querySelectorAll("[btn-cancel-friend]");
if (listBtnCancelFriend.length > 0) {
  listBtnCancelFriend.forEach((btn) => {
    btn.addEventListener("click", () => {
      const userId = btn.getAttribute("btn-cancel-friend");
      btn.closest(".box-user").classList.remove("add");
      socket.emit("CLIENT_CANCEL_FRIEND", userId);
    });
  });
}

// Kết thúc chức năng hủy yêu cầu kết bạn

// Từ chối kb
const listBtnRefuseFriend = document.querySelectorAll("[btn-refuse-friend]");
if (listBtnRefuseFriend.length > 0) {
  listBtnRefuseFriend.forEach((btn) => {
    btn.addEventListener("click", () => {
      const userId = btn.getAttribute("btn-refuse-friend");
      btn.closest(".box-user").classList.add("refuse");
      socket.emit("CLIENT_REFUSE_FRIEND", userId);
    });
  });
}
// Từ chối kb

// Đồng ý kb

const listBtnAcceptFriend = document.querySelectorAll("[btn-accept-friend]");
if (listBtnAcceptFriend.length > 0) {
  listBtnAcceptFriend.forEach((btn) => {
    btn.addEventListener("click", () => {
      const userId = btn.getAttribute("btn-accept-friend");
      btn.closest(".box-user").classList.add("accepted");
      socket.emit("CLIENT_ACCEPT_FRIEND", userId);
    });
  });
}

// SERVER_RETURN_LENGTH_ACCEPT_FRIEND
socket.on("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", (data) => {
  const badgeUsersAccept = document.querySelector("[badge-users-accept]");
  const userId = badgeUsersAccept.getAttribute("badge-users-accept");
  if (userId == data.userId) {
    badgeUsersAccept.innerHTML = data.lengthAcceptFriends;
  }
});

// END SERVER_RETURN_LENGTH_ACCEPT_FRIEND
