start +CONTAINERS="":
	docker compose up --detach --build {{CONTAINERS}}

stop:
	docker compose down

clean branches:
	# 1. Make sure we are on the main branch
	git checkout main 
	# 2. Delete all branches except main
	git branch | grep -v "main" | xargs git branch -D