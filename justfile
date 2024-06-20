start +CONTAINERS="":
	docker compose up --detach --build {{CONTAINERS}}

stop:
	docker compose down

