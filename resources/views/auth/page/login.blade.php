@extends('auth.layout.auth')
@section('content')
<div class="col-md-12">
<!-- @include('auth.partials.alert') -->
</div>
    <div
		class="wrapper d-flex justify-content-center flex-column align-items-center mt-5 fcolor">
		<div
			class="wrapper d-flex justify-content-center flex-column align-items-center mt-5">
			<div class="logo">
				<img src="{{asset('logo.png')}}" alt="logo" />
			</div>

			<form class="lgform" method="POST" action="{{ route('login') }}">
				<!-- Email input -->
				<div class="form-outline mb-4">
					<label class="form-label" for="form2Example1">Email address</label>
					<input type="email" class="form-control"
						id="exampleInputEmail1" aria-describedby="emailHelp"
						placeholder="Email" name="email" />
				</div>
                @error('email')
                    <small class="text-danger form-text text-muted">{{ $message }}</small>
                @enderror

				<!-- Password input -->
				<div class="form-outline mb-4">
					<label class="form-label" for="form2Example2">Password</label>
					<input type="password" class="form-control"
						id="exampleInputPassword1" placeholder="Password"
						name="password" />
				</div>
                @error('password')
                    <small class="text-danger form-text text-muted">{{ $message }}</small>
                @enderror
				@if (session('status'))
					<small class="text-danger form-text text-muted">{{ session('status') }}</small>
                @endif
				<div class="form-check">
					<input type="checkbox" name="remember" />
					<label for="remember">Remember</label>
				</div>

				<!-- Submit button -->
				<div class="d-flex justify-content-end">
					<button type="submit" class="btn btn-primary mb-4 btn-lg">Sign
						in</button>
				</div>


				<!-- Register buttons -->
				<div class="text-center">
					<p>
						Not a member? <a href="#!">Register</a>
					</p>
					<p>
						<a href="#!">Forgot password?</a>
					</p>
				</div>
                @csrf
			</form>
		</div>
	</div>
@endsection