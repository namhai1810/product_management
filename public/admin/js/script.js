
// Button status
const buttonsStatus = document.querySelectorAll("[button-status]");

if(buttonsStatus.length > 0) {
    let url = new URL(window.location.href);
    
    buttonsStatus.forEach(button => {
        button.addEventListener("click", () => {
            const status = button.getAttribute("button-status");
            if(status){
                url.searchParams.set("status", status);
            }else{
                url.searchParams.delete("status");
            }
            window.location.href = url.href;
        });
    })

}

// End button status

// Form search
const formSearch = document.querySelector("#form-search");
if(formSearch){
    let url = new URL(window.location.href);

    formSearch.addEventListener("submit", (e) =>{
        e.preventDefault();
        const keyword = e.target.elements.keyword.value;
        
        if(keyword){
            url.searchParams.set("keyword", keyword);
        }else{
            url.searchParams.delete("keyword");

        }
        window.location.href = url.href;

    });

}

// end Form search

// pagination
const buttonPagination = document.querySelectorAll("[button-pagination]");
if(buttonPagination){
    let url = new URL(window.location.href);

    buttonPagination.forEach(button => {
        button.addEventListener("click",() =>{
            const page = button.getAttribute("button-pagination");
            url.searchParams.set("page", page);
            window.location.href = url.href;
        });
        
    })
}
//End pagination

//check box multi
const checkboxMulti = document.querySelector("[checkbox-multi]");
if(checkboxMulti) {
    const inputCheckAll = checkboxMulti.querySelector("input[name='checkall']");
    const inputsId = checkboxMulti.querySelectorAll("input[name='ids']");
    inputCheckAll.addEventListener("click",() => {
        if(inputCheckAll.checked){
            inputsId.forEach(item => item.checked = true);
        }else{
            inputsId.forEach(item => item.checked = false);

        }
    });

    inputsId.forEach(input => {
        input.addEventListener("click", () =>{
            const countChecked = checkboxMulti.querySelectorAll("input[name='ids']:checked");
            if(countChecked.length == inputsId.length){
                inputCheckAll.checked=true;
            }else{
                inputCheckAll.checked=false;
            }
        });
    });
}

//End check box multi

//Form change multi
const formChangeMulti = document.querySelector("[form-change-multi]");
if(formChangeMulti){
    formChangeMulti.addEventListener("submit",(e) => {
        e.preventDefault();
        const checkboxMulti = document.querySelector("[checkbox-multi]");
        const checkedbox = checkboxMulti.querySelectorAll("input[name='ids']:checked");

        const  typeChange = e.target.elements.type.value;
        if(typeChange=="delete-all"){
            const isConfirm = confirm("Bạn có chắc muốn xóa sản phẩm này không?");
            if(!isConfirm) return;
        }

        if(checkedbox.length > 0){
            const inputIds = formChangeMulti.querySelector("input[name='ids']");
            let ids = [];
            checkedbox.forEach(input => {
                const id = input.value;
                if(typeChange == "change-position"){
                    const position = input
                    .closest("tr").
                    querySelector("input[name='position']").value;
                    ids.push(`${id}-${position}`)
                }else{
                    ids.push(id);
                }
            });

            inputIds.value = ids.join(", ");
            formChangeMulti.submit();

        }else{
            alert("Hãy chọn 1 sản phẩm bất kì để thực hiện chức năng.")
        }
    });

}

//End Form change multi
