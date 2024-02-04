
// Change Status
const buttonChangeStatus = document.querySelectorAll("[button-changeStatus]");
if(buttonChangeStatus.length > 0){
  const formStatusChange = document.querySelector("#form-change-status");
  const path = formStatusChange.getAttribute("data-path");

  buttonChangeStatus.forEach(button => {
    button.addEventListener("click", ()=>{
      const status = button.getAttribute("data-status");
      const id = button.getAttribute("data-id");
      let statusChange = status == "active" ? "inactive" : "active";
      
      const action = path + `/${statusChange}/${id}?_method=PATCH`;
      formStatusChange.action = action;
      formStatusChange.submit();
    })
  })
}

// End Change Status
