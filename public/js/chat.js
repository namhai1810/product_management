const formDataSocket = document.querySelector(".chat .inner-form");
if(formDataSocket){
  const contentMessage = formDataSocket.querySelector("input[name='content']");
  formDataSocket.addEventListener("submit", (e) => {
    e.preventDefault();
    const content = contentMessage.value;
    socket.emit("CLIENT_SEND_MESSAGE", content);
    contentMessage.value = "";
  })
};