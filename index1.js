var ListProducts = [];

function getListProducts() {
    axios({
        url: "https://6336fcae5327df4c43cdc470.mockapi.io/Products",
        method: "GET",
    }).then(function (res) {
        console.log(res);
        ListProducts = mapdata(res.data);
        renderListProducts();
    }).catch(function (err) {
        console.log(err)
    })
}

window.onload = function () {
    getListProducts();
    getListgiohang();

}

function renderListProducts(data) {
    if (!data) data = ListProducts;

    var tablehtml = "";
    for (let i = 0; i < data.length; i++) {
        var currentProduct = data[i];
        tablehtml += `
        <div class="item">
        <div class="thumb">
            <img src="${currentProduct.img}" alt="">
        </div>
        <div class="infor">
            <div><span>ID:</span> ${currentProduct.id}</div>
            <div><span>Name:</span> ${currentProduct.name}</div>
            <div><span>Price:</span> ${currentProduct.price}</div>
            <div><span>Screen:</span> ${currentProduct.screen}</div>
            <div><span>BackCamera:</span> ${currentProduct.backCamera}</div>
            <div><span>FrontCamera:</span> ${currentProduct.frontCamera}</div>
            <div><span>Des:</span> ${currentProduct.des}</div>
            <div><span>Type:</span> ${currentProduct.type}</div>
            
            <button onclick="AddListCart('${currentProduct.id}')" class="btn btn-primary mt-2">Đưa vào giỏ hàng</button>
        </div>
    </div>
            `

    }
    document.getElementById("showProducts").innerHTML = tablehtml;

}

function mapdata(data) {
    var result = [];
    for (let i = 0; i < data.length; i++) {
        var oldProduct = data[i];
        var newProduct = new Products(
            oldProduct.id,
            oldProduct.name,
            oldProduct.price,
            oldProduct.screen,
            oldProduct.backCamera,
            oldProduct.frontCamera,
            oldProduct.img,
            oldProduct.des,
            oldProduct.type,
        )
        result.push(newProduct);

    }
    return result;
}


function ChoiceProducts() {
    var keyname = document.getElementById("selectProducts").value.toLowerCase().trim();
    console.log(keyname);
    var result = [];
    for (let i = 0; i < ListProducts.length; i++) {

        if (ListProducts[i].type.toLowerCase() === keyname) {
            result.push(ListProducts[i]);
        }

    }

    renderListProducts(result);
    if (keyname === "") {
        renderListProducts(ListProducts);
    }
}

var ListGiohang = [];
var keyListCart = "danhsachgiohang";
//lay danh sach gio hang luu o local
function getListgiohang() {
    var ListCartJON = localStorage.getItem(keyListCart);
    if (!ListCartJON) return;
    ListGiohang = mapdataCart(JSON.parse(ListCartJON));
}
//luu danh sach gio hang vo local

function setListgiohang(Listgiohanglocal) {
    var ListCartJON = JSON.stringify(Listgiohanglocal);

    localStorage.setItem(keyListCart, ListCartJON);
}

function mapdataCart(data) {
    var result = [];
    for (let i = 0; i < data.length; i++) {
        var cartOld = data[i];
        var cartNew = new gioHang(
            cartOld.idSanpham,
            cartOld.soluong,
            cartOld.price,
            cartOld.name,
            cartOld.img,
        )
        result.push(cartNew);
    }
    return result;
}
function AddListCart(id) {
    alert("Đã thêm sản phãm vào giỏ hàng" + id);

    var isVald = false;//kiem tra giỏ hàng đã có san phẩm id này chưa 
    //có rồi thì la true và +số lượng lên 1
    for (let i = 0; i < ListGiohang.length; i++) {
        if (ListGiohang[i].idSanpham === id) {
            ListGiohang[i].soluong++;
            isVald = true;

        }

    }
    //giỏ hàng chưa có sản phẩm thì thêm sản phẩm vào giỏ hàng

    if (!isVald) {
        var price;
        var name;
        var img;

        for (let i = 0; i < ListProducts.length; i++) {
            if (ListProducts[i].id === id) {
                price = ListProducts[i].price;
                name = ListProducts[i].name;
                img = ListProducts[i].img;
            }

        }
        var cart = new gioHang(id, 1, price, name, img);
        ListGiohang.push(cart);

    }

    setListgiohang(ListGiohang);
    document.getElementById("imgCart").innerHTML = ":" + calcAmountCart();
}
// 
const calcAmountCart = () => {
    return ListGiohang.reduce((total, item) => {
        return total + item.soluong;
    }, 0)
}
function renderListCart(data) {
    if (!data) data = ListGiohang;

    var tablehtml = "";
    for (let i = 0; i < data.length; i++) {
        var cartCurrent = data[i];
        tablehtml += `
        <tr>
        <td>${i + 1}</td>
        <td>${cartCurrent.name}</td>
        <td class="w-25"><img class="w-50" src="${cartCurrent.img}" alt=""></td>
        <td>${cartCurrent.price}</td>
        <td> <input type="number" oninput="calcInput('${cartCurrent.idSanpham}')" value="${cartCurrent.soluong}" id="${cartCurrent.idSanpham}"></td>
        <td>${cartCurrent.calcPrice()}</td>
        <td><button onclick="DeleteCart('${cartCurrent.idSanpham}')" class="btn btn-danger">Xóa</button></td>
       
        </tr>
        
        `
    }
    document.getElementById("tableGioHang").innerHTML = tablehtml;
    var total = calsTotalPrice();
    document.getElementById("totalPrice").innerHTML = total;
}
//oniput thay đổi input số lượng
const calcInput = (id) => {
    let sl = +document.getElementById(id).value;
    if (sl === 0) {
        DeleteCart(id);
    }
    for (const item of ListGiohang) {
        if (item.idSanpham === id) {
            item.soluong = sl;
        }
    }
    setListgiohang(ListGiohang);
    renderListCart();
    // for (const item of ListGiohang) {
    //     if (item.idSanpham === id) {
    //         item.soluong = sl;
    //     }
    //     renderListCart();
    // }
}
//tinh tong tien đơn giá
function calsTotalPrice() {
    var total = 0;
    for (let i = 0; i < ListGiohang.length; i++) {
        total += ListGiohang[i].calcPrice();
    }
    return total;
}
// xóa sản phẩm trong giỏ hàng
const DeleteCart = (id) => {
    for (const i in ListGiohang) {
        if (ListGiohang[i].idSanpham === id) {
            ListGiohang.splice(i, 1);
        }
    }
    setListgiohang(ListGiohang);
    renderListCart();
}

const clearListCart = () => {
    ListGiohang = [];
    document.getElementById("imgCart").innerHTML = "";
    setListgiohang(ListGiohang);
    renderListCart();
}
