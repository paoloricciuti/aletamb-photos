<script lang="ts">
	import { resolve } from '$app/paths';
	import { add_password, logout } from '$lib/auth.remote';
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';
	import { delete_photo, get_all_photos, upload_photo } from '$lib/photos.remote.js';
</script>

<h1>Admin Dashboard</h1>
<main>
	<h2>Carica nuova foto</h2>
	<form {...upload_photo} enctype="multipart/form-data">
		<label>
			File
			<Input {...upload_photo.fields.file.as('file')} accept="image/*" />
		</label>
		<label>
			Titolo
			<Input {...upload_photo.fields.title.as('text')} />
		</label>
		<label>
			Descrizione
			<Input {...upload_photo.fields.description.as('text')} />
		</label>
		<Button disabled={upload_photo.pending > 0}>Carica foto</Button>
	</form>

	<h2>Rimuovi o modifica foto</h2>
	<ul>
		{#each await get_all_photos() as photo (photo.id)}
			<li class="row">
				<img style="view-transition-name: img-{photo.id}" src={photo.url} alt={photo.description} />
				<a href={resolve('/admin/edit/[id]', { id: photo.id })}>
					{photo.title}
				</a>
				<form
					{...delete_photo.enhance(async ({ submit }) => {
						const confirmed = confirm('Sicura di voler cancellare la foto?');
						if (confirmed) {
							await submit();
						}
					})}
				>
					<input {...delete_photo.fields.id.as('hidden', photo.id)} />
					<input {...delete_photo.fields.key.as('hidden', photo.key)} />
					<button title="Cancella">
						<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
							><path
								fill="none"
								stroke="currentColor"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4 7h16m-10 4v6m4-6v6M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3"
							/></svg
						>
					</button>
				</form>
			</li>
		{/each}
	</ul>

	<h2>Aggiungi password</h2>

	<form {...add_password} enctype="multipart/form-data">
		<label>
			Nuova Password
			<Input {...add_password.fields.password.as('password')} />
		</label>
		<Button type="submit">Aggiungi Password</Button>
	</form>

	<h2>Logout</h2>
	<form {...logout}>
		<Button>Logout</Button>
	</form>
</main>

<style>
	form {
		display: grid;
		gap: 2rem;
		:global(button) {
			text-align: center;
		}
		label {
			display: grid;
		}
	}
	ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 0.5rem;
	}
	.row {
		display: grid;
		grid-template-columns: min-content 1fr min-content;
		place-items: center;
		img {
			height: 3rem;
		}
		button {
			all: unset;
			cursor: pointer;
		}
	}
</style>
