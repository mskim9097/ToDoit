function addItem() {
    let itemList = document.getElementById("itemList");
    let li = document.createElement("li");
    li.innerHTML = '<input type="radio"> New Item';
    itemList.appendChild(li);
}

writeaddItem();


