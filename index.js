

let ListProducts = [];

const GetListProducts = async () => {
    try {
        const res = await axios({
            url: "https://6336fcae5327df4c43cdc470.mockapi.io/Products",
            method: "get",
        });
        ListProducts = mapdata(res.data);
        console.log(ListProducts)
        renderListProduct(ListProducts);

    } catch (error) {
        console.log(error)
    }
}

const renderListProduct = (data) => {
    let html = "";
    for (const item of data) {
        html += `
        <tr>
                    <td>${item.id}</td>
                    <td>${item.name}</td>
                    <td>${item.price}</td>
                    <td>${item.screen}</td>
                    <td>${item.backCamera}</td>
                    <td>${item.frontCamera}</td>
                    <td> <img class="w-50" src="${item.img}" alt=""></td>
                    <td>${item.des}</td>
                    <td>${item.type}</td>
                    <td>
                    <button class="btn btn-danger" onclick="DeleteProduct('${item.id}')">Xóa</button>
                  
                    </td>
                    <td>
                    <button data-bs-toggle="modal" data-bs-target="#exampleModal" class="btn btn-success" onclick="getProductList(${item.id})">Sữa</button>
                  
                    </td >

        </tr >
    `
    }
    document.getElementById("tableProduts").innerHTML = html;
}

const mapdata = (dataAPI) => {
    let result = [];

    dataAPI.forEach((item) => {
        let { id, name, price, screen, backCamera, frontCamera, img, des, type } = item;

        result.push(new Products(id, name, price, screen, backCamera, frontCamera, img, des, type));
    });
    return result;
}

window.onload = () => {
    GetListProducts();

}

const creatListProducts = async () => {

    if (!valiadForm()) return;

    let txtid = document.getElementById("txtid").value;
    let txtname = document.getElementById("txtname").value;
    let txtprice = document.getElementById("txtprice").value;
    let txtscreen = document.getElementById("txtscreen").value;
    let txtbackcamera = document.getElementById("txtbackcamera").value;
    let txtfontcamera = document.getElementById("txtfontcamera").value;
    let txtimg = document.getElementById("txtimg").value;
    let txtdes = document.getElementById("txtdes").value;
    let txttype = document.getElementById("txttype").value;


    for (const item of ListProducts) {
        if (item.id === txtid) return alert("Sản phẩm đã tồn tại!");
    }

    let product = new Products(txtid, txtname, txtprice, txtscreen, txtbackcamera, txtfontcamera, txtimg, txtdes, txttype);


    try {
        let res = await axios({
            url: "https://6336fcae5327df4c43cdc470.mockapi.io/Products",
            method: "post",
            data: product,
        })
        GetListProducts();
    } catch (error) {
        console.log(error)
    }
}

const DeleteProduct = async (id) => {
    try {
        let res = await axios({
            url: "https://6336fcae5327df4c43cdc470.mockapi.io/Products/" + id,
            method: "delete",
        })
        GetListProducts();
    } catch (error) {
        console.log(error);
    }
}

const getProductList = async (idd) => {
    try {
        let res = await axios({
            url: "https://6336fcae5327df4c43cdc470.mockapi.io/Products/" + idd,
            method: "get",
        });

        var product = res.data;

        let { id, name, price, screen, backCamera, frontCamera, img, des, type } = product;

        document.getElementById("txtid").value = id;
        document.getElementById("txtname").value = name;
        document.getElementById("txtprice").value = price;
        document.getElementById("txtscreen").value = screen;
        document.getElementById("txtbackcamera").value = backCamera;
        document.getElementById("txtfontcamera").value = frontCamera;
        document.getElementById("txtimg").value = img;;
        document.getElementById("txtdes").value = des;
        document.getElementById("txttype").value = type;
        //hien nut update
        document.getElementById("btnUpdateProduct").style.display = "inline-block";
        //disable id
        document.getElementById("txtid").disabled = true;
        document.getElementById("btnAddproduct").style.display = "none"
    } catch (error) {

    }
}
//update sản phẩm
const updateProduct = async () => {

    try {
        if (!valiadForm()) return;

        var id = document.getElementById("txtid").value;
        var name = document.getElementById("txtname").value;
        var price = + document.getElementById("txtprice").value;
        var screen = document.getElementById("txtscreen").value;
        var backCamera = document.getElementById("txtbackcamera").value;
        var frontCamera = document.getElementById("txtfontcamera").value;
        var img = document.getElementById("txtimg").value;
        var des = document.getElementById("txtdes").value;
        var type = document.getElementById("txttype").value;

        var newproduct = new Products(id, name, price, screen, backCamera, frontCamera, img, des, type);

        let res = await axios({
            url: "https://6336fcae5327df4c43cdc470.mockapi.io/Products/" + id,
            method: "put",
            data: newproduct,
        })
        renderListProduct();
    } catch (error) {
        console.log(error);
    }
}
//thiết lập laif form
const resetform = () => {
    //thiết lập laif form
    document.getElementById("resetform").reset();
    document.getElementById("btnUpdateProduct").style.display = "none";
    document.getElementById("txtid").disabled = false;
    document.getElementById("btnAddproduct").style.display = "inline-block";

}
// tìm kiếm sản phẩm theo tên
const searchProduct = () => {
    let keyword = document.getElementById("searchProducts").value.toLowerCase().trim();
    var arr = [];
    for (const item of ListProducts) {
        if (item.name.toLowerCase().includes(keyword)) {

            arr.push(item);

        }
    }

    renderListProduct(arr);
}
//valida funcion

const valiadForm = () => {

    var txtid = document.getElementById("txtid").value;
    let txtname = document.getElementById("txtname").value;
    let txtprice = document.getElementById("txtprice").value;
    let txtscreen = document.getElementById("txtscreen").value;
    let txtbackcamera = document.getElementById("txtbackcamera").value;
    let txtfontcamera = document.getElementById("txtfontcamera").value;
    let txtimg = document.getElementById("txtimg").value;
    let txtdes = document.getElementById("txtdes").value;
    let txttype = document.getElementById("txttype").value;

    var isVlidate = true;

    isVlidate &= required(txtid, "spanid");
    isVlidate &= required(txtname, "spanname");
    isVlidate &= required(txtprice, "spanprice") && checkNumber(txtprice, "spanprice");
    isVlidate &= required(txtscreen, "spanscreen");
    isVlidate &= required(txtbackcamera, "spanbackcamera");
    isVlidate &= required(txtfontcamera, "spanfontcamera");
    isVlidate &= required(txtimg, "spanimg");
    isVlidate &= required(txtdes, "spandes");
    isVlidate &= required(txttype, "spantype");


    return isVlidate;

}


const required = (val, spanID) => {
    if (val.length === 0) {
        document.getElementById(spanID).innerHTML = "*Trường này ko đc trống !";
        return false
    }
    document.getElementById(spanID).innerHTML = "";
    return true;
}

const checkNumber = (val, spanID) => {
    var pattern = /^[0-9]+$/g;
    if (pattern.test(val)) {
        document.getElementById(spanID).innerHTML = "";
        return true;
    }
    document.getElementById(spanID).innerHTML = "*Trường này nhập số";
    return false;
}
