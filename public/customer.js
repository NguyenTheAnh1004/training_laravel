let search = false;
let name = '';
let email = '';
let address = '';
let status = true;
let currentPage = 1;
let pageNumberIndex = 0;
let limitsize = 5;


getCustomersByPage(1,limitsize)


async function getCustomers(page = 1, size = limitsize) {
	var data = await $.ajax({
		type: 'GET',
		url: '/api/customers',
		success: function(data) {
			// loadDataCustomer(data);
		},
	});
	return data;
}

async function getCustomersByPage(page = 1, size = limitsize) {
	$.ajax({
		type: 'GET',
		url: '/api/getCustomersByPage',
		data: 'page=' + page + '&size=' + size,
		success: function(data) {
			loadDataCustomer(data);
		},
	});
}

$("#btnSaveCustomer").click(async function() {
	var name = $('#addCustomerModal input[name="name"]').val();
	var email = $('#addCustomerModal input[name="email"]').val();
	var phone = $('#addCustomerModal input[name="phone"]').val();
	var address = $('#addCustomerModal input[name="address"]').val();
	var status = $('#addCustomerModal input[name="status"]').is(':checked');
	await Validation();
	if (boolean == true){
		$.ajax({
			headers: {
				'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
			},
			url: '/api/customers/create',
			method: 'post',
			data: 'name=' + name
				+ '&email=' + email
				+ '&phone=' + phone
				+ '&address=' + address
				+ '&status=' + status,
			success: function(response) {
				if (response) {
					// getUsers();
					// getUsersByPage(currentPage,5);
					// getUsersByPage(pageNumberIndex+1,5);
					// location.reload()
				}
				else {
					showToast('Oops!', ' Failed! :D :D :D', 0);
				}
			}
		});
		$('#addCustomerModal').modal('hide')
	}
	// alert(name+email+password+repassword+status)
});

// set error message
function setError(id, data) {
	document.getElementById(id).innerHTML = data;
}

async function Validation() {
	var name = $('#addCustomerModal input[name="name"]').val();
	var email = $('#addCustomerModal input[name="email"]').val();
	var phone = $('#addCustomerModal input[name="phone"]').val();
	var address = $('#addCustomerModal input[name="address"]').val();
	boolean = true;
	// validate name

	if (name.length < 6) {
		setError("errorName", 'Tên không được để trống và phải trên 5 ký tự');
		boolean = false;
	}
	else {
		setError("errorName", '');
	}
	// validate mail
	var regexmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
	// let user = await getUserByMail(email);
	// alert(user)
	if (email == "") {
		setError("errorEmail", 'Vui lòng nhập email');
		boolean = false;
	}
	else if (regexmail.test(email) == false) {
		setError("errorEmail", 'Mail sai định dạng - phải có @ và không có ký tự đặc biệt');
		boolean = false;
	}
	// else if (user.length > 0) {
	// 	setError("errorEmail", 'Mail này đã được đăng ký vui lòng đăng ký mail khác');
		
	// 	boolean = false;
	// }
	else {
		setError("errorEmail", '');
	}


	var regexphone = /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
	if (phone == "") {
		setError("errorPhone", 'Vui lòng nhập sdt');
		boolean = false;
	}
	else if (regexphone.test(phone) == false) {
		setError("errorPhone", 'sdt gom 10 so');
		boolean = false;
	}
	else {
		setError("errorPhone", '');
	}

	return boolean;
}

//loaddata
async function loadDataCustomer(data) {
	var users = data;
	var userData = '';
	// var pagination = '';
	if(data.length <= 0){
		userData += `<p>khong co du lieu ...</p>`;
	}
	for (var i = 0; i < data.length; i++) {
		userData += `
		<tr>
							<td class="nowrap">${pageNumberIndex*limitsize+i+1}</td>
							<td class="nowrap">${users[i].name ? users[i].name : ''}</td>
							<td class="nowrap">${users[i].email ? users[i].email : ''}</td>
							<td class="nowrap">${users[i].address ? users[i].address : ''}</td>
							<td class="nowrap">${users[i].phone ? users[i].phone : ''}</td>
							<td class="nowrap">${
                                users[i].status == true
                                    ? '<span class="text-success">Đang hoạt động</span>'
                                    : '<span class="text-danger">Tạm khóa</span>'
                            }
							<td class="nowrap d-flex justify-content-center">
								<button type="button" class="btn btn-primary mr-2"
									data-toggle="modal" data-target="#editCustomerModal"
									class="btn-primary btn"
									onclick="passDataEditCustomer(
										${users[i].id},
								'${users[i].name}',
								'${users[i].email}',
								'${users[i].address}',
								'${users[i].phone}',
								${users[i].status})">Sửa</button>
							</td>

						</tr>
		`;
	}

	
	$('#tbody').html(userData);

	var pagination;
	if(search == true ){
		pagination = `				
		<li class="page-item"><a class="page-link" href="#" onclick="getSearchCustomers(${pageNumberIndex},${limitsize}, '${this.name}','${this.email}','${this.address}',${this.status}), activeNumber(${pageNumberIndex-1})">Previous</a></li>
		<li class="page-item"><a class="page-link" href="#" onclick="getSearchCustomers(${0},${limitsize}, '${this.name}','${this.email}','${this.address}',${this.status}), activeNumber(${0})">First</a></li>
		`;
	}
	else{
		pagination = `				
		<li class="page-item"><a class="page-link" href="#" onclick="getCustomersByPage(${pageNumberIndex},${limitsize}), activeNumber(${pageNumberIndex >= 0 ? pageNumberIndex-1 : 0})">Previous</a></li>
		<li class="page-item"><a class="page-link" href="#" onclick="getCustomersByPage(${0},${limitsize}), activeNumber(${0})">First</a></li>
		`;
	}

	let totalusers = search == true ? await getAllCustomersSearch() : await getCustomers();
	// let totalusers = await getCustomers();
	console.log('search'+search)
	// let totalusers = await getUsers();
	// console.log('totalpage'+Math.ceil(totalusers.length/limitsize)+totalusers.length)
	for (var i = 0; i < Math.ceil(totalusers/limitsize); i++){
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
				<li class="page-item" active><a class="page-link" href="#" onclick="getSearchCustomers(${i+1},${limitsize}, '${this.name}','${this.email}','${this.address}',${this.status}), activeNumber(${i})">${i+1}</a></li>
				`;
			} 
			else{
				pagination += `				
				<li class="page-item" active><a class="page-link" href="#" onclick="getCustomersByPage(${i+1},${limitsize}), activeNumber(${i})">${i+1}</a></li>
				`;
			}
		}
		
		
	}
	if(search == true ){
		pagination += `	
		<li class="page-item"><a class="page-link" href="#" onclick="getSearchCustomers(${Math.ceil(totalusers/limitsize)},${limitsize}, '${this.name}','${this.email}','${this.address}',${this.status}), activeNumber(${Math.ceil(totalusers/limitsize)-1})">Last</a></li>			
		<li class="page-item"><a class="page-link" href="#" onclick="getSearchCustomers(${pageNumberIndex+2 <= Math.ceil(totalusers/limitsize) ? pageNumberIndex+2:Math.ceil(totalusers/limitsize)},${limitsize}, '${this.name}','${this.email}','${this.address}',${this.status}), activeNumber(${pageNumberIndex+1 <= Math.ceil(totalusers/limitsize)-1 ? pageNumberIndex+1 :pageNumberIndex})">Next</a></li>
		`;
	}
	else{
		pagination += `	
		<li class="page-item"><a class="page-link" href="#" onclick="getCustomersByPage(${Math.ceil(totalusers/limitsize)  },${limitsize}), activeNumber(${Math.ceil(totalusers/limitsize)-1})">Last</a></li>			
		<li class="page-item"><a class="page-link" href="#" onclick="getCustomersByPage(${pageNumberIndex+2 <= Math.ceil(totalusers/limitsize) ? pageNumberIndex+2:Math.ceil(totalusers/limitsize)  },${limitsize}), activeNumber(${pageNumberIndex+1 <= Math.ceil(totalusers/limitsize)-1 ? pageNumberIndex+1 :pageNumberIndex})">Next</a></li>
		`;
	}

	$('#list-pagination').html(pagination);
	console.log(pagination)

	var headtb;
	headtb = `
	<p class="font-monospace ml-2 font-weight-bold">hiển thị ${pageNumberIndex*limitsize+1} - ${pageNumberIndex*limitsize+data.length} trên tổng ${totalusers} user</p>
	`;
	$('#headtb').html(headtb);

}

function passDataEditCustomer(id, name, email, address, phone, stt) {
	$('#editCustomerModal input[name="id-edit"]').val(id);
	$('#editCustomerModal input[name="name"]').val(name);
	$('#editCustomerModal input[name="email"]').val(email);
	$('#editCustomerModal input[name="phone"]').val(phone);
	$('#editCustomerModal input[name="address"]').val(address);
	stt == true ? $('#editCustomerModal input[name="status"]').prop('checked', true) : $('#editCustomerModal input[name="status"]').prop('checked', false);
}

$("#btnEditCustomer").click(async function() {
	var name = $('#editCustomerModal input[name="name"]').val();
	var email = $('#editCustomerModal input[name="email"]').val();
	var phone = $('#editCustomerModal input[name="phone"]').val();
	var address = $('#editCustomerModal input[name="address"]').val();
	var id = $('#editCustomerModal input[name="id-edit"]').val();
	var status = $('#editCustomerModal input[name="status"]').is(':checked');
	await ValidationEdit()
	if (boolean == true){
		$.ajax({
			headers: {
				'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
			},
			url: '/api/customers/update',
			method: 'post',
			data: 'name=' + name
				+ '&email=' + email
				+ '&phone=' + phone
				+ '&address=' + address
				+ '&id=' + id
				+ '&status=' + status,
			success: function(response) {
				if (response) {
					// getUsers();
					// if(search == true){
					// 	location.reload();
					// }
					// else{
					// 	getCustomersByPage(pageNumberIndex+1,limitsize);
					// }
					// location.reload()
					// console.log(response)
				}
				else {
					showToast('Oops!', ' Failed! :D :D :D', 0);
				}
			}
		});
	
		$('#editCustomerModal').modal('hide')
	}

});

async function ValidationEdit() {
	var name = $('#editCustomerModal input[name="name"]').val();
	var email = $('#editCustomerModal input[name="email"]').val();
	boolean = true;

	// validate name

	if (name.length < 6) {
		setError("errorEditName", 'Tên không được để trống và phải trên 5 ký tự');
		boolean = false;
	}
	else {
		setError("errorEditName", '');
	}
	// validate mail
	var regexmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
	// let user = await getUserByMail(email);
	if (email == "") {
		setError("errorEditEmail", 'Vui lòng nhập email');
		boolean = false;
	}
	else if (regexmail.test(email) == false) {
		setError("errorEditEmail", 'Mail sai định dạng - phải có @ và không có ký tự đặc biệt');
		boolean = false;
	}
	// else if (user.length > 0 && email != mailEdit) {
	// 	setError("errorEditEmail", 'Mail này đã được đăng ký vui lòng đăng ký mail khác');
	// 	boolean = false;
	// }
	else {
		setError("errorEditEmail", '');
	}
	return boolean;
}

function activeNumber(pageIndex = 0) {
	// console.log('page'+pageNumberIndex);
	if(pageIndex < 0){
		pageNumberIndex = 0;
	}
	else{
		pageNumberIndex = pageIndex;
	}

} 

$("#btnSearchCustomer").click(function() {
	this.name = $('#searchForm input[name="name"]').val();
	this.email = $('#searchForm input[name="email"]').val();
	this.address = $('#searchForm input[name="address"]').val();
	this.status = $('#searchForm select[name="status"] option:selected').val();
	search = true;
	activeNumber(0);
	console.log('data'+this.name,this.email,this.address,this.status)
	getSearchCustomers(1,limitsize,this.name,this.email,this.address,this.status);
	
});

async function getAllCustomersSearch() {
	this.name = $('#searchForm input[name="name"]').val();
	this.email = $('#searchForm input[name="email"]').val();
	this.address = $('#searchForm input[name="address"]').val();
	this.status = $('#searchForm select[name="status"] option:selected').val();
	if(this.status == ''){
		var data = await $.ajax({
			type: 'GET',
			url: '/api/getAllCustomersSearch',
			data: 'name=' + this.name
			+ '&email=' + this.email
			+ '&address=' + this.address,
			success: function(data) {
				// loadDataUser(data.users);
				// console.log(data.users)
			},
		});  
	}
	else{
		var data = await $.ajax({
			type: 'GET',
			url: '/api/getAllCustomersSearch',
			data: 'name=' + this.name
			+ '&email=' + this.email
			+ '&address=' + this.address
			+ '&status=' + this.status,
			success: function(data) {
				// loadDataUser(data.users);
				// console.log(data.users)
			},
		});  
	}
	
	return data;
}

function getSearchCustomers(page = 1, size = limitsize, name = '', email = '', address = '', status) {
	this.name = $('#searchForm input[name="name"]').val();
	this.email = $('#searchForm input[name="email"]').val();
	this.address = $('#searchForm input[name="address"]').val();
	this.status = $('#searchForm select[name="status"] option:selected').val();
	// alert('status là' + status )
	if(typeof(status) === "undefined" || status.length == 0){
		$.ajax({
			type: 'GET',
			url: '/api/getCustomersSearchByPage',
			data: 'name=' + name
			+ '&email=' + email
			+ '&address=' + address
			+ '&page=' + page 
			+ '&size=' + size,
			success: function(data) {
				console.log(data);
				loadDataCustomer(data);
			},
		});
	}
	else{
		$.ajax({
			type: 'GET',
			url: '/api/getCustomersSearchByPage',
			data: 'name=' + name
			+ '&email=' + email
			+ '&address=' + address
			+ '&status=' + status
			+ '&page=' + page 
			+ '&size=' + size,
			success: function(data) {
				console.log(data);
				loadDataCustomer(data);
			},
		});
	}

}

function resetForm() {
	pageNumberIndex = 0;
	$('#searchForm').trigger('reset');
	search = false;
	getCustomersByPage(1,limitsize);
}

function logout() {
	window.location.href = '/logout';
}