module.exports =  (query) => {
    const filterStatus = [
        {
            name:"Tất cả",
            status:"",
            class: "",
        }, 
        {
            name:"Hoạt động",
            status:"active",
            class: "",
        },
        {
            name:"Dừng hoạt động",
            status:"inactive",
            class: "",
        }
    ]
    if (query){
        const index = filterStatus.findIndex(item => item.status === query); 
        filterStatus[index].class = "active";
    }else{
        const index = filterStatus.findIndex(item => item.status === ""); 
        filterStatus[index].class = "active";
    }
    return filterStatus;
}