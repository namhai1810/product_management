import * as Popper from "https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js";

const upload = new FileUploadWithPreview.FileUploadWithPreview("upload-images", {
  multiple: true,
  maxFileCount: 6,
});

const formDataSocket = document.querySelector(".chat .inner-form");
if (formDataSocket) {
  const contentMessage = formDataSocket.querySelector("input[name='content']");
  formDataSocket.addEventListener("submit", (e) => {
    e.preventDefault();
    const content = contentMessage.value;
    const images = upload.cachedFileArray || [];
    if (content || images.length > 0) {
      socket.emit("CLIENT_SEND_MESSAGE", {
        content: content,
        images: images,
      });
      contentMessage.value = "";
      upload.resetPreviewPanel();
    }
  });
}

// SERVER_RETURN_MESSAGE
socket.on("SERVER_RETURN_MESSAGE", (data) => {
  const myId = document.querySelector("[my-id]").getAttribute("my-id");
  const body = document.querySelector(".chat .inner-body");
  const div = document.createElement("div");

  let htmlFullName = "";
  let htmlContent = "";
  let htmlImages = "";

  if (myId == data.userId) {
    div.classList.add("inner-outgoing");
  } else {
    div.classList.add("inner-incoming");

    htmlFullName = `<div class="inner-name">${data.fullName}</div>`;
  }
  if (data.content) {
    htmlContent = `<div class="inner-content">${data.content}</div>`;
  }

  if (data.images.length > 0) {
    htmlImages += `<div class="inner-images">`;

    for (const image of data.images) {
      htmlImages += `
        <img src="${image}">
      `;
    }

    htmlImages += `</div>`;
  }
  div.innerHTML = `
    ${htmlFullName}
    ${htmlContent}
    ${htmlImages}

  `;
  body.appendChild(div);
  bodyChat.scrollTop = bodyChat.scrollHeight;
});
// END SERVER_RETURN_MESSAGE

// Scroll chat to bottom
const bodyChat = document.querySelector(".chat .inner-body");
if (bodyChat) {
  bodyChat.scrollTop = bodyChat.scrollHeight;
}
// End Scroll chat to bottom

// show Icon typing
const buttonIcon = document.querySelector(".button-icon");
if (buttonIcon) {
  const tooltip = document.querySelector(".tooltip");
  Popper.createPopper(buttonIcon, tooltip);
  buttonIcon.addEventListener("click", () => {
    tooltip.classList.toggle("shown");
  });
}
//End  show Icon typing

// Insert icon to input field
const emojiPicker = document.querySelector("emoji-picker");
const inputChat = document.querySelector("input[name='content']");
emojiPicker.addEventListener("emoji-click", (event) => {
  const icon = event.detail.unicode;
  inputChat.value = inputChat.value + icon;
});
// End Insert icon to input field

// File upload preview
