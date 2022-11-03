class gioHang {
    constructor(idsanpham, soluong, price, name, img) {
        this.idSanpham = idsanpham;
        this.soluong = soluong;
        this.price = price;
        this.name = name;
        this.img = img;
    }

    calcPrice() {
        var pri = parseInt(this.price);
        var sl = parseInt(this.soluong);
        return sl * pri;
    }


}