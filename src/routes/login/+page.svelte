<script lang="ts">
	import { login } from '$lib/auth.remote';
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';
	import Issues from '$lib/components/Issues.svelte';
</script>

<main>
	<h1>Login</h1>
	<form {...login}>
		<Issues form={login} />
		<label>
			Password:
			<Input {...login.fields.password.as('password')} />
		</label>
		<Button>Login</Button>
	</form>
</main>

<style>
	main {
		display: grid;
		place-items: center;
		background-color: #f0f0f0;
		padding: 1rem;
		padding-bottom: 2rem;
		form {
			display: grid;
			place-items: center;
			gap: 2rem;
		}
	}
</style>
