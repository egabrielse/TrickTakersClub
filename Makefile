up:
	docker compose up --detach --build

down:
	docker compose down

play-cache:
	docker compose up --detach --build play-cache