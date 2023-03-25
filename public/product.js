let pageNumberIndex = 0;
let boolean;
let search = false;
let productname = '';
let	active;
let	priceFrom;
let	priceTo;
let limitsize = 5;
getProductsByPage(1,limitsize)

function activeNumber(pageIndex = 0) {
	if(pageIndex < 0){
		pageNumberIndex = 0;
	}
	else{
		pageNumberIndex = pageIndex;
	}
	// alert(pageNumberIndex)
}

async function getProductsByPage(page = 1, size = limitsize) {
	$.ajax({
		type: 'GET',
		url: '/api/product/getProductByPage',
		data: 'page=' + page + '&size=' + size,
		success: function(data) {
			loadDataProduct(data);
		},
	});
}

async function getAllProducts() {
	var data = await $.ajax({
		type: 'GET',
		url: 'api/products',
		success: function(data) {
			// loadDataProduct(data.products);
		},
	});
	// console.log('data'+data.products)
	return data;
}

$("#btnSearchProduct").click(function() {
	this.productname = $('#searchProductForm input[name="productName"]').val();
	this.active = $('#searchProductForm select[name="product-active"] option:selected').val();
	this.priceFrom = $('#searchProductForm input[name="priceFrom"]').val();
	this.priceTo = $('#searchProductForm input[name="priceTo"]').val();
	search = true;
	// alert(productname + active + priceFrom + priceTo);
	getSearchProducts(page = 1 , size = limitsize, this.productname, this.active, this.priceFrom, this.priceTo)
	// console.log('sear' + search);
	activeNumber(0);
	// console.log('data'+this.name+this.email+this.role+this.status)
	// getSearchUsers(1,5,this.name,this.email,this.role,this.status);

	
});

function getSearchProducts(page = 1, size = limitsize, productname = '', active = 1, priceFrom = 0, priceTo = 500) {
	$.ajax({
		type: 'GET',
		url: '/api/product/getUserSearchByPage',
		data: 'name=' + productname
		+ '&stt=' + active
		+ '&princeFrom=' + priceFrom
		+ '&princeTo=' + priceTo
		+ '&page=' + page 
		+ '&size=' + size,
		success: function(data) {
			console.log(data);
			loadDataProduct(data);
		},
	});
}

async function getAllProductsSearch() {
	this.productname = $('#searchProductForm input[name="productName"]').val();
	this.active = $('#searchProductForm select[name="product-active"] option:selected').val();
	this.priceFrom = $('#searchProductForm input[name="priceFrom"]').val();
	this.priceTo = $('#searchProductForm input[name="priceTo"]').val();
	var data = await $.ajax({
		type: 'GET',
		url: '/api/product/getAllUserSearch',
		data: 'name=' + this.productname
		+ '&stt=' + this.active
		+ '&princeFrom=' + this.priceFrom
		+ '&princeTo=' + this.priceTo,
		success: function(data) {
			console.log('res:' + data.products);
			// loadDataProduct(data.products);
		},
	});
	console.log('data'+ data)
	return data;
}

async function loadDataProduct(data) {
    console.log(data);
	var products = data;
	var productData = '';
	// var pagination = '';
	if(data.length <= 0){
		productData += `<p>khong co du lieu ...</p>`;
	}
	for (var i = 0; i < products.length; i++) {
		productData += `
		<tr>
							<td class="nowrap">${pageNumberIndex*limitsize+i+1}</td>
							<td class="nowrap">${products[i].id ? products[i].id : ''}</td>
							<td class="nowrap">${products[i].name ? products[i].name : ''}</td>
							<td class="nowrap">${products[i].short_description ? products[i].short_description : ''}</td>
							<td class="nowrap">${products[i].prince ? products[i].prince : ''}</td>
							<td class="nowrap">${
                            (products[i].active == 3) ?
								'<span class="text-danger">Hết hàng</span>'
                                : products[i].active == 1
								? '<span class="text-success">Đang bán</span>'
								: '<span class="text-danger">Ngưng bán</span>'
                            }
							<td class="nowrap d-flex justify-content-center">
								<button type="button" class="btn btn-primary mr-2"
									data-toggle="modal" data-target="#editProductModal"
									class="btn-primary btn"
									onclick="passDataEditProduct(
										${products[i].id},
										'${products[i].name}',
										'${products[i].prince}',
										'${products[i].short_description}',
										'${products[i].active}',
										'${products[i].image}'
									)">Sửa</button>

								<button type="button" class="btn btn-primary mr-2"
									data-toggle="modal" data-target="#deleteProductModal"
									class="btn-primary btn"
									onclick="passDataRemoveProduct(
										${products[i].id},
										'${products[i].name}',
										)">xóa</button>
							</td>

						</tr>
		`;
	}

	
	$('#tproductbody').html(productData);

	var pagination;
	if(search == true ){
		pagination = `				
		<li class="page-item"><a class="page-link" href="#" onclick="getSearchProducts(${pageNumberIndex},${limitsize}, '${this.productname}', '${this.active}', '${this.priceFrom}', '${this.priceTo}'), activeNumber(${pageNumberIndex-1})">Previous</a></li>
		<li class="page-item"><a class="page-link" href="#" onclick="getSearchProducts(${0},${limitsize}, '${this.productname}', '${this.active}', '${this.priceFrom}', '${this.priceTo}'), activeNumber(${0})">First</a></li>
		`;
	}
	else{
		pagination = `				
		<li class="page-item"><a class="page-link" href="#" onclick="getProductsByPage(${pageNumberIndex},${limitsize}), activeNumber(${pageNumberIndex-1})">Previous</a></li>
		<li class="page-item"><a class="page-link" href="#" onclick="getProductsByPage(${0},${limitsize}), activeNumber(${0})">First</a></li>
		`;
	}
	// let totalusers = search == true ? await getAllUsersSearch() : await getUsers();
	// console.log('totalpage'+Math.ceil(totalusers.length/5)+totalusers.length)
	let totalProducts = (search == true) ? await getAllProductsSearch() :await getAllProducts();
	// let totalProducts = await getAllProducts();
	console.log('totalpage '+ totalProducts.length)
	for (var i = 0; i < Math.ceil(totalProducts/limitsize) ; i++){
		if( i == pageNumberIndex){
			pagination += `				
			<li class="page-item active">
			<a class="page-link" href="#">${i+1} <span class="sr-only">(current)</span></a>
			</li>
			`;
		}
		else{
			if(search == true){
				pagination += `				
				<li class="page-item" active><a class="page-link" href="#" onclick="getSearchProducts(${i+1},${limitsize}, '${this.productname}', '${this.active}', '${this.priceFrom}', '${this.priceTo}'), activeNumber(${i})">${i+1}</a></li>
				`;
			} 
			else{
				pagination += `				
				<li class="page-item" active><a class="page-link" href="#" onclick="getProductsByPage(${i+1},${limitsize}), activeNumber(${i})">${i+1}</a></li>
				`;
			}
		}
		
		
	}
	if(search == true ){
		pagination += `	
		<li class="page-item"><a class="page-link" href="#" onclick="getSearchProducts(${Math.ceil(totalProducts/limitsize)},${limitsize}, '${this.productname}', '${this.active}', '${this.priceFrom}', '${this.priceTo}'), activeNumber(${Math.ceil(totalProducts/limitsize)-1})">Last</a></li>			
		<li class="page-item"><a class="page-link" href="#" onclick="getSearchProducts(${pageNumberIndex+2 <= Math.ceil(totalProducts/limitsize) ? pageNumberIndex+2:Math.ceil(totalProducts/limitsize)},${limitsize}, '${this.productname}', '${this.active}', '${this.priceFrom}', '${this.priceTo}'), activeNumber(${pageNumberIndex+1 <= Math.ceil(totalProducts/limitsize)-1 ? pageNumberIndex+1 :pageNumberIndex})">Next</a></li>
		`;
	}
	else{
		pagination += `	
		<li class="page-item"><a class="page-link" href="#" onclick="getProductsByPage(${Math.ceil(totalProducts/limitsize)  },${limitsize}), activeNumber(${Math.ceil(totalProducts/limitsize)-1})">Last</a></li>			
		<li class="page-item"><a class="page-link" href="#" onclick="getProductsByPage(${pageNumberIndex+2 <= Math.ceil(totalProducts/limitsize) ? pageNumberIndex+2:Math.ceil(totalProducts/limitsize)  },${limitsize}), activeNumber(${pageNumberIndex+1 <= Math.ceil(totalProducts/limitsize)-1 ? pageNumberIndex+1 :pageNumberIndex})">Next</a></li>
		`;
	}

	$('#listproduct-pagination').html(pagination);

	var headtb;
	headtb = `
	<p class="font-monospace ml-2 font-weight-bold">hiển thị ${pageNumberIndex*limitsize+1} - ${pageNumberIndex*limitsize+data.length} trên tổng ${totalProducts} user</p>
	`;
	$('#headtbproduct').html(headtb);
}

$("#btnProductSave").click(async function() {
	var name = $('#addProductModal input[name="name"]').val();
	var prince = $('#addProductModal input[name="prince"]').val();
	var description = $('#addProductModal #modalDes').val();
	var stt = $('#addProductModal select[name="stt"] option:selected').val();
	var file_data = $('#fileID').prop('files')[0];
	var formData = new FormData();
	formData.append('file', file_data);
	formData.append('name', name);
	formData.append('prince', prince);
	formData.append('description', description);
	formData.append('stt', stt);
	// for (var pair of formData.entries()) {
	// 	console.log(pair[0]+ ', ' + pair[1]); 
	// }
	await Validation(name, prince);
	// alert(name)
	if (boolean == true) {
		$.ajax({
			headers: {
				'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
			},
			url: '/api/product/create',
			method: 'post',
			data: formData,
			contentType: false,
			processData: false,
			dataType: 'json',
			success: function(response) {
				if (response) {
					location.reload()
				}
				else {
					showToast('Oops!', ' Failed! :D :D :D', 0);
				}
			}
		});
		$('#addProductModal').modal('hide')
	}

});

function passDataEditProduct(id, name, prince, des, stt, image) {
	$('#editProductModal input[name="id-edit"]').val(id);
	$('#editProductModal input[name="name"]').val(name);
	$('#editProductModal input[name="prince"]').val(prince);
	$('#editProductModal #modaleditDes').val(des);
	$('#editProductModal select').val(stt);
	$('#editImage').attr('src', 'https://anh-nguyen.net/uploads/'+image);
	document.getElementById('editFileID').value=''
}

$("#btnProductEdit").click(async function() {
	// alert('a;lo')
	var id = $('#editProductModal input[name="id-edit"]').val();
	var name = $('#editProductModal input[name="name"]').val();
	var prince = $('#editProductModal input[name="prince"]').val();
	var description = $('#editProductModal #modaleditDes').val();
	var stt = $('#editProductModal select[name="stt"] option:selected').val();
	var file_data = $('#editFileID').prop('files')[0];
	var cur_img = $('#editProductModal #editImage').attr('src');
	var formData = new FormData();
	formData.append('id', id);
	formData.append('file', file_data);
	formData.append('name', name);
	formData.append('prince', prince);
	formData.append('description', description);
	formData.append('stt', stt);
	formData.append('cur_img', cur_img);
	await ValidationEdit(name, prince);
	if (boolean == true) {
		$.ajax({
			headers: {
				'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
			},
			url: '/api/product/update',
			method: 'post',
			data: formData,
			contentType: false,
			processData: false,
			dataType: 'json',
			success: function(response) {
				if (response) {
					if(search == true){
						location.reload();
					}else{
						getProductsByPage(pageNumberIndex+1,limitsize)
					}
				}
				else {
					showToast('Oops!', ' Failed! :D :D :D', 0);
				}
			}
		});
		$('#editProductModal').modal('hide')
	}

});

function passDataRemoveProduct(id, name) {
	$('#deleteProductModal input[name="id-remove"]').val(id);
	$('#deleteProductModal label').html(name);
}

$("#btnProductRemove").click(async function() {
	var id = $('#deleteProductModal input[name="id-remove"]').val();

		$.ajax({
			headers: {
				'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
			},
			url: '/api/product/delete',
			method: 'post',
			data: 'id=' + id,
			success: function(response) {
				if (response) {
					location.reload()
					console.log(response)
				}
				else {
					showToast('Oops!', ' Failed! :D :D :D', 0);
				}
			}
		});
		$('#deleteProductModal').modal('hide')
});

// Validation add
function setError(id, data) {
	document.getElementById(id).innerHTML = data;
}
async function Validation(name, prince) {
	// var name = $('#addProductModal input[name="name"]').val();
	// var prince = $('#addProductModal input[name="prince"]').val();
	// var description = $('#addProductModal #modalDes').val();
	// var stt = $('#addProductModal select[name="stt"] option:selected').val();
	boolean = true;

	// validate name

	if (name.length <= 0) {
		setError("errorProductName", 'Tên không được để trống');
		boolean = false;
	}
	else {
		setError("errorProductName", '');
	}

	//prince

	if(prince <= 0 || prince.length < 0 ){
		setError("errorProductPrince", 'giá phải lớn hơn 0');
		boolean = false;
	}
	else {
		setError("errorProductPrince", '');
	}

	return boolean;
}

async function ValidationEdit(name, prince) {
	boolean = true;
	// validate name

	if (name.length <= 0) {
		setError("errorEditProductName", 'Tên không được để trống');
		boolean = false;
	}
	else {
		setError("errorEditProductName", '');
	}

	//prince

	if(prince <= 0 || prince.length < 0 ){
		setError("errorEditProductPrince", 'giá phải lớn hơn 0');
		boolean = false;
	}
	else {
		setError("errorEditProductPrince", '');
	}

	return boolean;
}

// logout
function logout() {
	window.location.href = '/logout';
}

function resetForm() {
	pageNumberIndex = 0;
	$('#searchProductForm').trigger('reset');
	search = false;
	console.log(search);
	getProductsByPage(1,limitsize);
	// getUsers();
}

function readURL(input) {
	if (input.files && input.files[0]) {
		var reader = new FileReader();
		
		reader.onload = function (e) {
			$('#editImage').attr('src', e.target.result);
		}
		
		reader.readAsDataURL(input.files[0]);
	}
}

$("#editFileID").change(function(){
	readURL(this);
});

$("#removeEditFileID").click(function() {
	$('#editImage').attr('src', '');
	// $('#editFileID').value(null);
	document.getElementById('editFileID').value=''
});

function readAddURL(input) {
	if (input.files && input.files[0]) {
		var reader = new FileReader();
		
		reader.onload = function (e) {
			$('#addImage').attr('src', e.target.result);
		}
		
		reader.readAsDataURL(input.files[0]);
	}
}

$("#fileID").change(function(){
	readAddURL(this);
});

$("#removeFileID").click(function() {
	$('#addImage').attr('src', '');
	// $('#editFileID').value(null);
	document.getElementById('fileID').value=''
});