//Update number product
const tableCart = document.querySelectorAll('input[name="quantity"]');
if(tableCart.length > 0){
  tableCart.forEach((input) => {
    input.addEventListener('change', (e)=>{
      const quantity = e.target.value;
      const productId = input.getAttribute("item-id");
      if(quantity >=1){
        window.location.href = `/cart/update/${productId}/${quantity}`
      }
    })
  })
}
//End Update number product
