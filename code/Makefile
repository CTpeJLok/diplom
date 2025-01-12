clear:
		clear


restart: down up
restart-build: down up-build


up:
	docker-compose up -d

up-build:
	docker-compose up -d --build

run:
	docker-compose up

run-build:
	docker-compose up --build

down:
	docker-compose down


logs:
	docker-compose logs -f
	

mm:
	docker-compose exec backend python manage.py makemigrations
	
m:
	docker-compose exec backend python manage.py migrate
	
csu:
	docker-compose exec backend python manage.py createsuperuser
	
cs:
	docker-compose exec backend python manage.py collectstatic --no-input


prod-restart: prod-down prod-up
prod-restart-build: prod-down prod-up-build

prod-up:
	docker-compose -f docker-compose.prod.yml up -d

prod-up-build:
	docker-compose -f docker-compose.prod.yml up -d --build

prod-run:
	docker-compose -f docker-compose.prod.yml up

prod-down:
	docker-compose -f docker-compose.prod.yml down

prod-mm:
	docker-compose -f docker-compose.prod.yml exec backend python manage.py makemigrations
	
prod-m:
	docker-compose -f docker-compose.prod.yml exec backend python manage.py migrate
	
prod-csu:
	docker-compose -f docker-compose.prod.yml exec backend python manage.py createsuperuser
	
prod-cs:
	docker-compose -f docker-compose.prod.yml exec backend python manage.py collectstatic --no-input
