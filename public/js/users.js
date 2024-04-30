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

socket.on("SERVER_RETURN_INFO_ACCEPT_FRIEND", (data) => {
  const dataUserAccept = document.querySelector(
    `[data-users-accept="${data.userId}"]`
  );
  const userId = dataUserAccept.getAttribute("data-users-accept");
  if (dataUserAccept) {
    // vẽ thêm giao diện
    const newBoxUser = document.createElement("div");
    newBoxUser.classList.add("col-6");
    newBoxUser.setAttribute("user-id", data.infoUserA._id);
    newBoxUser.innerHTML = `
      <div class="box-user">
        <div class="inner-avatar">
          <img src="https://robohash.org/hicveldicta.png" alt="${data.infoUserA.fullName}" />
        </div>
        <div class="inner-info">
            <div class="inner-name">
              ${data.infoUserA.fullName}
            </div>
            <div class="inner-buttons">
              <button
                class="btn btn-sm btn-primary mr-1"
                btn-accept-friend="${data.infoUserA._id}"
              >
                Chấp nhận
              </button>
              <button
                class="btn btn-sm btn-secondary mr-1"
                btn-refuse-friend="${data.infoUserA._id}"
              >
                Xóa
              </button>
              <button
                class="btn btn-sm btn-secondary mr-1"
                btn-deleted-friend=""
                disabled=""
              >
                Đã xóa
              </button>
              <button
                class="btn btn-sm btn-primary mr-1"
                btn-accepted-friend=""
                disabled=""
              >
                Đã chấp nhận
              </button>
            </div>
        </div>
      </div>
    `;
    dataUserAccept.appendChild(newBoxUser);
    //Hết vẽ thêm giao diện

    const buttonRefuse = newBoxUser.querySelector("[btn-refuse-friend]");
    buttonRefuse.addEventListener("click", () => {
      buttonRefuse.closest(".box-user").classList.add("refuse");

      const userId = buttonRefuse.getAttribute("btn-refuse-friend");

      socket.emit("CLIENT_REFUSE_FRIEND", userId);
    });
    // Hết Xóa lời mời kết bạn

    // Chấp nhận lời mời kết bạn
    const buttonAccept = newBoxUser.querySelector("[btn-accept-friend]");
    buttonAccept.addEventListener("click", () => {
      buttonAccept.closest(".box-user").classList.add("accepted");

      const userId = buttonAccept.getAttribute("btn-accept-friend");

      socket.emit("CLIENT_ACCEPT_FRIEND", userId);
    });
  }
});

// SERVER_RETURN_USER_ID_CANCEL_FRIEND
socket.on("SERVER_RETURN_USER_ID_CANCEL_FRIEND", (data) => {
  const dataUserAccept = document.querySelector(
    `[data-users-accept="${data.userId}"]`
  );
  if(dataUserAccept){
    const boxUser = dataUserAccept.querySelector(`[user-id="${data.userIdA}"]`);
    if(boxUser){
      dataUserAccept.removeChild(boxUser);
    }
  }
});
// SERVER_RETURN_USER_ID_CANCEL_FRIEND