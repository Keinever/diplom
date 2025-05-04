build-app:
	sudo docker compose -f ./build/docker-compose.yaml build

stop-app:
	sudo docker compose -f ./build/docker-compose.yaml down

run-app:
	sudo docker compose -f ./build/docker-compose.yaml up -d

app-logs:
	sudo docker compose -f ./build/docker-compose.yaml logs -f

migrations:
	sudo docker compose -f ./build/docker-compose.yaml run django-backend python manage.py makemigrations

migrate:
	sudo docker compose -f ./build/docker-compose.yaml run django-backend python manage.py migrate

merge-migrations:
	sudo docker compose -f ./build/docker-compose.yaml run django-backend python manage.py makemigrations --merge

show-migrations:
	sudo docker compose -f ./build/docker-compose.yaml run django-backend python manage.py showmigrations

superuser:
	sudo docker compose -f ./build/docker-compose.yaml run django-backend python manage.py createsuperuser
