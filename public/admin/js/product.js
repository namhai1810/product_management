// Change Status
const buttonChangeStatus = document.querySelectorAll("[button-changeStatus]");
if (buttonChangeStatus.length > 0) {
  const formStatusChange = document.querySelector("#form-change-status");
  const path = formStatusChange.getAttribute("data-path");

  buttonChangeStatus.forEach((button) => {
    button.addEventListener("click", () => {
      const status = button.getAttribute("data-status");
      const id = button.getAttribute("data-id");
      let statusChange = status == "active" ? "inactive" : "active";

      const action = path + `/${statusChange}/${id}?_method=PATCH`;
      formStatusChange.action = action;
      formStatusChange.submit();
    });
  });
}

// End Change Status

// Delete button
const deleteButton = document.querySelectorAll("[button-delete]");
if (deleteButton.length > 0) {
  const formDeleteStatus = document.querySelector("#form-delete-status");
  const path = formDeleteStatus.getAttribute("data-path");

  deleteButton.forEach((button) => {
    button.addEventListener("click", () => {
      const isConfirm = confirm("Bạn có chắc muốn xóa sản phẩm này không?");

      if (isConfirm) {
        const id = button.getAttribute("data-id");
        const action = path + `/${id}?_method=DELETE`;
        formDeleteStatus.action = action;
        formDeleteStatus.submit();
      }
    });
  });
}

//End Delete button
