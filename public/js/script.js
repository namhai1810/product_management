// Show Alert
const showAlert = document.querySelector("[show-alert]");
if(showAlert) {
  const time = parseInt(showAlert.getAttribute("data-time"));
  setTimeout(() => {
    showAlert.classList.add("alert-hidden");
  }, time);

  const closeAlert = showAlert.querySelector("[close-alert]");
  closeAlert.addEventListener("click", () => {
    showAlert.classList.add("alert-hidden");
  });
}
// End Show Alert

//Button go back
const buttonGoBack = document.querySelectorAll("[button-go-back]");
if (buttonGoBack.length > 0) {
  buttonGoBack.forEach((item) => {
    item.addEventListener("click",() =>{
      history.back();
    })
  });
}

//End Button go back
