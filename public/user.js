let search = false;
let name = '';
let email = '';
let role = '';
let status = true;
let currentPage = 1;
let pageNumberIndex = 0;
let limitsize = 5;
getUsersByPage(1,limitsize)
async function getUsers(page = 1, size = 10) {
	var data = await $.ajax({
		type: 'GET',
		url: '/api/users',
		success: function(data) {
			console.log(data);
            // loadDataUser(data);
		},
	});
	return data;
}

function getUsersByPage(page = 1, size = 5) {
	$.ajax({
		type: 'GET',
		url: '/api/getUserByPage',
		data: 'page=' + page + '&size=' + size,
		success: function(data) {
			loadDataUser(data);
		},
	});
}

function logout() {
	alert('logout')
	window.location.href = '/logout';
}

async function getUserByMail(email) {
	var data = await $.ajax({
		type: 'GET',
		url: '/api/getuserbymail',
		data: 'email=' + email,
		success: function(data) {
			console.log('respones'+data);
			// console.log(data.userBean.name);
		},
	});
	console.log('data'+data);
	return data;
}
//loaddata
async function loadDataUser(data) {
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
							<td class="nowrap">${users[i].id ? users[i].id : ''}</td>
							<td class="nowrap">${users[i].name ? users[i].name : ''}</td>
							<td class="nowrap">${users[i].email ? users[i].email : ''}</td>
							<td class="nowrap">${users[i].group_role ? users[i].group_role : ''}</td>
							<td class="nowrap">${
                                users[i].status == true
                                    ? '<span class="text-success">Đang hoạt động</span>'
                                    : '<span class="text-danger">Tạm khóa</span>'
                            }
							<td class="nowrap d-flex justify-content-center">
								<button type="button" class="btn btn-primary mr-2"
									data-toggle="modal" data-target="#editModal"
									class="btn-primary btn"
									onclick="passDataEditUser(
										${users[i].id},
								'${users[i].name}',
								'${users[i].email}',
								'${users[i].group_role}',
								${users[i].status})">Sửa</button>

								<button type="button" class="btn btn-primary mr-2"
									data-toggle="modal" data-target="#deleteModal"
									class="btn-primary btn"
									onclick="passDataRemove(
										${users[i].id},
								'${users[i].email}',)">xóa</button>

								<button type="button" class="btn btn-primary mr-2"
									data-toggle="modal" data-target="#changeSttModal"
									class="btn-primary btn"
									onclick="passDataChangeStt(
										${users[i].id},
									'${users[i].email}',
									${users[i].status})">Khóa/Mở Khóa</button>
							</td>

						</tr>
		`;
	}

	
	$('#tbody').html(userData);
	// console.log('pageNumberIndex'+pageNumberIndex)

	var pagination;
	if(search == true ){
		pagination = `				
		<li class="page-item"><a class="page-link" href="#" onclick="getSearchUsers(${pageNumberIndex},${limitsize}, '${this.name}','${this.email}','${this.role}',${this.status}), activeNumber(${pageNumberIndex-1})">Previous</a></li>
		<li class="page-item"><a class="page-link" href="#" onclick="getSearchUsers(${0},${limitsize}, '${this.name}','${this.email}','${this.role}',${this.status}), activeNumber(${0})">First</a></li>
		`;
	}
	else{
		pagination = `				
		<li class="page-item"><a class="page-link" href="#" onclick="getUsersByPage(${pageNumberIndex},${limitsize}), activeNumber(${pageNumberIndex >= 0 ? pageNumberIndex-1 : 0})">Previous</a></li>
		<li class="page-item"><a class="page-link" href="#" onclick="getUsersByPage(${0},${limitsize}), activeNumber(${0})">First</a></li>
		`;
	}

	let totalusers = search == true ? await getAllUsersSearch() : await getUsers();
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
				<li class="page-item" active><a class="page-link" href="#" onclick="getSearchUsers(${i+1},${limitsize}, '${this.name}','${this.email}','${this.role}',${this.status}), activeNumber(${i})">${i+1}</a></li>
				`;
			} 
			else{
				pagination += `				
				<li class="page-item" active><a class="page-link" href="#" onclick="getUsersByPage(${i+1},${limitsize}), activeNumber(${i})">${i+1}</a></li>
				`;
			}
		}
		
		
	}
	if(search == true ){
		pagination += `	
		<li class="page-item"><a class="page-link" href="#" onclick="getSearchUsers(${Math.ceil(totalusers/limitsize)},${limitsize}, '${this.name}','${this.email}','${this.role}',${this.status}), activeNumber(${Math.ceil(totalusers/limitsize)-1})">Last</a></li>			
		<li class="page-item"><a class="page-link" href="#" onclick="getSearchUsers(${pageNumberIndex+2 <= Math.ceil(totalusers/limitsize) ? pageNumberIndex+2:Math.ceil(totalusers/limitsize)},${limitsize}, '${this.name}','${this.email}','${this.role}',${this.status}), activeNumber(${pageNumberIndex+1 <= Math.ceil(totalusers/limitsize)-1 ? pageNumberIndex+1 :pageNumberIndex})">Next</a></li>
		`;
	}
	else{
		pagination += `	
		<li class="page-item"><a class="page-link" href="#" onclick="getUsersByPage(${Math.ceil(totalusers/limitsize)  },${limitsize}), activeNumber(${Math.ceil(totalusers/limitsize)-1})">Last</a></li>			
		<li class="page-item"><a class="page-link" href="#" onclick="getUsersByPage(${pageNumberIndex+2 <= Math.ceil(totalusers/limitsize) ? pageNumberIndex+2:Math.ceil(totalusers/limitsize)  },${limitsize}), activeNumber(${pageNumberIndex+1 <= Math.ceil(totalusers/limitsize)-1 ? pageNumberIndex+1 :pageNumberIndex})">Next</a></li>
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

let totalItems;
let boolean;
$("#btnSave").click(async function() {
	
	var name = $('#addModal input[name="name"]').val();
	var email = $('#addModal input[name="email"]').val();
	var password = $('#addModal input[name="password"]').val();
	var repassword = $('#addModal input[name="repassword"]').val();
	var role = $('#addModal select[name="role"] option:selected').val();
	var status = $('#addModal input[name="status"]').is(':checked');
	await Validation();
	if (boolean == true){
		$.ajax({
			headers: {
				'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
			},
			url: '/api/user/create',
			method: 'post',
			data: 'name=' + name
				+ '&email=' + email
				+ '&password=' + password
				+ '&role=' + role
				+ '&status=' + status,
			success: function(response) {
				if (response) {
					// getUsers();
					// getUsersByPage(currentPage,5);
					// getUsersByPage(pageNumberIndex+1,5);
					location.reload()
				}
				else {
					showToast('Oops!', ' Failed! :D :D :D', 0);
				}
			}
		});
		$('#addModal').modal('hide')
	}
	// alert(name+email+password+repassword+status)

	

});

let mailEdit;
function passDataEditUser(id, name, email, role, stt) {
	// getUsers();
	mailEdit = email;
	$('#editModal input[name="id-edit"]').val(id);
	$('#editModal input[name="name"]').val(name);
	$('#editModal input[name="email"]').val(email);
	$('#editModal select').val(role);
	stt == true ? $('#editModal input[name="status"]').prop('checked', true) : $('#editModal input[name="status"]').prop('checked', false);
}

$("#btnEdit").click(async function() {
	var name = $('#editModal input[name="name"]').val();
	var email = $('#editModal input[name="email"]').val();
	var role = $('#editModal select[name="role"] option:selected').val();
	var id = $('#editModal input[name="id-edit"]').val();
	var status = $('#editModal input[name="status"]').is(':checked');
	await ValidationEdit()
	if (boolean == true){
		$.ajax({
			headers: {
				'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
			},
			url: '/api/user/update',
			method: 'post',
			data: 'name=' + name
				+ '&email=' + email
				+ '&role=' + role
				+ '&id=' + id
				+ '&status=' + status,
			success: function(response) {
				if (response) {
					// getUsers();
					if(search == true){
						location.reload();
					}
					else{
						getUsersByPage(pageNumberIndex+1,limitsize);
					}
					// location.reload()
					// console.log(response)
				}
				else {
					showToast('Oops!', ' Failed! :D :D :D', 0);
				}
			}
		});
	
		$('#editModal').modal('hide')
	}

});

// delete
function passDataRemove(id, email) {
	$('#deleteModal input[name="id-remove"]').val(id);
	$('#deleteModal label').html(email);
}
$("#btnRemove").click(async function() {
	var id = $('#deleteModal input[name="id-remove"]').val();
	$.ajax({
		headers: {
			'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
		},
		url: '/api/user/delete',
		method: 'post',
		data: 'id=' + id,
		success: function(response) {
			if (response) {
				// loadPage();
				// getUsersByPage(pageNumberIndex+1,5);
				location.reload();
			}
			else {
				showToast('Oops!', ' Failed! :D :D :D', 0);
			}
		}
		
	});
	$('#deleteModal').modal('hide')
});

// change stt
function passDataChangeStt(id, email, stt) {
	$('#changeSttModal input[name="id-stt"]').val(id);
	$('#changeSttModal input[name="stt"]').val(stt);
	$('#changeSttModal label').html(email);
}

$("#btnChangeStt").click(function() {
	var id = $('#changeSttModal input[name="id-stt"]').val();
	var stt = $('#changeSttModal input[name="stt"]').val();
	$.ajax({
		headers: {
			'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
		},
		url: '/api/user/changestt',
		method: 'post',
		data: 'id=' + id
			+ '&status=' + stt,
		success: function(response) {
			if (response) {
				if(search == true){
					location.reload();
				}
				else{
					getUsersByPage(pageNumberIndex+1,limitsize);
				}
				
				
			}
			else {
				showToast('Oops!', ' Failed! :D :D :D', 0);
			}
		}
	});
	// loadPage();
	$('#changeSttModal').modal('hide')
});


// set error message
function setError(id, data) {
	document.getElementById(id).innerHTML = data;
}
// Validation add
async function Validation() {
	var name = $('#addModal input[name="name"]').val();
	var email = $('#addModal input[name="email"]').val();
	var password = $('#addModal input[name="password"]').val();
	var repassword = $('#addModal input[name="repassword"]').val();
	var role = $('#addModal select[name="role"] option:selected').val();
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
	let user = await getUserByMail(email);
	// console.log(user);
	console.log('daatafgdf'+user);
	console.log('leg'+user.length);
	// alert(user)
	if (email == "") {
		setError("errorEmail", 'Vui lòng nhập email');
		boolean = false;
	}
	else if (regexmail.test(email) == false) {
		setError("errorEmail", 'Mail sai định dạng - phải có @ và không có ký tự đặc biệt');
		boolean = false;
	}
	else if (user.length > 0) {
		setError("errorEmail", 'Mail này đã được đăng ký vui lòng đăng ký mail khác');
		
		boolean = false;
	}
	else {
		setError("errorEmail", '');
	}

	// validate pass
	var regexpass = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/;
	if (password == "") {
		setError("errorPassword", 'Vui lòng nhập password');
		boolean = false;
	}
	else if (regexpass.test(password) == false) {
		setError("errorPassword", 'pass phải từ 6 ký tự, có chữ in chữ thường và số');
		boolean = false;
	}
	else {
		setError("errorPassword", '');
	}

	//validate repass
	if (repassword != password) {
		setError("errorRePassword", 'Mật khẩu xác nhận không khớp với mật khẩu');
		boolean = false;
	} else {
		setError("errorRePassword", '');
	}

	return boolean;
}

// Validation edit
async function ValidationEdit() {
	var name = $('#editModal input[name="name"]').val();
	var email = $('#editModal input[name="email"]').val();
	var role = $('#editModal  select[name="role"] option:selected').val();
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
	let user = await getUserByMail(email);
	if (email == "") {
		setError("errorEditEmail", 'Vui lòng nhập email');
		boolean = false;
	}
	else if (regexmail.test(email) == false) {
		setError("errorEditEmail", 'Mail sai định dạng - phải có @ và không có ký tự đặc biệt');
		boolean = false;
	}
	else if (user.length > 0 && email != mailEdit) {
		setError("errorEditEmail", 'Mail này đã được đăng ký vui lòng đăng ký mail khác');
		boolean = false;
	}
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

async function getAllUsersSearch() {
	this.name = $('#searchForm input[name="name"]').val();
	this.email = $('#searchForm input[name="email"]').val();
	this.role = $('#searchForm select[name="role"] option:selected').val();
	this.status = $('#searchForm select[name="status"] option:selected').val();
	if(this.status == ''){
		var data = await $.ajax({
			type: 'GET',
			url: '/api/getAllUserSearch',
			data: 'name=' + this.name
			+ '&email=' + this.email
			+ '&role=' + this.role,
			success: function(data) {
				// loadDataUser(data.users);
				// console.log(data.users)
			},
		});  
	}
	else{
		var data = await $.ajax({
			type: 'GET',
			url: '/api/getAllUserSearch',
			data: 'name=' + this.name
			+ '&email=' + this.email
			+ '&role=' + this.role
			+ '&status=' + this.status,
			success: function(data) {
				// loadDataUser(data.users);
				// console.log(data.users)
			},
		});  
	}
	
	return data;
}

function getSearchUsers(page = 1, size = limitsize, name = '', email = '', role = '', status) {
	this.name = $('#searchForm input[name="name"]').val();
	this.email = $('#searchForm input[name="email"]').val();
	this.role = $('#searchForm select[name="role"] option:selected').val();
	this.status = $('#searchForm select[name="status"] option:selected').val();
	// alert('status là' + status )
	if(typeof(status) === "undefined" || status.length == 0){
		$.ajax({
			type: 'GET',
			url: '/api/getUserSearchByPage',
			data: 'name=' + name
			+ '&email=' + email
			+ '&role=' + role
			+ '&page=' + page 
			+ '&size=' + size,
			success: function(data) {
				console.log(data);
				loadDataUser(data);
			},
		});
	}
	else{
		$.ajax({
			type: 'GET',
			url: '/api/getUserSearchByPage',
			data: 'name=' + name
			+ '&email=' + email
			+ '&role=' + role
			+ '&status=' + status
			+ '&page=' + page 
			+ '&size=' + size,
			success: function(data) {
				console.log(data);
				loadDataUser(data);
			},
		});
	}

}

$("#btnSearch").click(function() {
	this.name = $('#searchForm input[name="name"]').val();
	this.email = $('#searchForm input[name="email"]').val();
	this.role = $('#searchForm select[name="role"] option:selected').val();
	this.status = $('#searchForm select[name="status"] option:selected').val();
	search = true;
	console.log('sear' + search);
	activeNumber(0);
	console.log('data'+this.name+this.email+this.role+this.status)
	getSearchUsers(1,limitsize,this.name,this.email,this.role,this.status);
	
});

function resetForm() {
	pageNumberIndex = 0;
	$('#searchForm').trigger('reset');
	search = false;
	console.log(search);
	getUsersByPage(1,limitsize);
	// getUsers();
}