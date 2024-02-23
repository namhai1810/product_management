//Permissions
const tablePermissions = document.querySelector("[table-permissions]"); 
if(tablePermissions){
  const buttonSumit = document.querySelector("[button-submit]");
  buttonSumit.addEventListener("click",() => {
    const rows = tablePermissions.querySelectorAll("[data-name]");
    permissions = [];

    rows.forEach((row) => {
      const name = row.getAttribute("data-name");
        if(name == "id"){
          const property = row.querySelectorAll("input");
            property.forEach((input) => {
              permissions.push({
                id: input.value,
                permissions: []
              })
          })
        }else{
          const property = row.querySelectorAll("input");
          property.forEach((input, index) => {
            if(input.checked){
              permissions[index].permissions.push(name);
            }
          });
        }
      });

    const formChangePermissions = document.querySelector('[form-change-permissions]');
    const inputPermissions = formChangePermissions.querySelector('input[name="permissions"]');
    inputPermissions.value = JSON.stringify(permissions);
    formChangePermissions.submit();
  });
}
//End permissions

//Permissions default
const divRecords = document.querySelector("[data-records]");
if(divRecords){
  const records = divRecords.getAttribute("data-records");
  const data = JSON.parse(records)
  data.forEach( (input, index) => {
    const rows = document.querySelector("[table-permissions]");
    input.permissions.forEach( permission => {
      const row = rows.querySelector(`[data-name="${permission}"]`);
      const checkBox = row.querySelectorAll("input");
      
      checkBox[index].checked = true;
      
    });

  });

}
//End Permissions default
