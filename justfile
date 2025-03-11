start +CONTAINERS="":
	docker compose up --detach --build {{CONTAINERS}}

stop:
	docker compose down

branch BRANCH_NAME:
	# 1. Pull latest changes
	git pull
	# 2. Create a new branch
	git checkout -b {{BRANCH_NAME}} 
	# 2. Set the upstream branch
	git push --set-upstream origin {{BRANCH_NAME}}


clean branches:
	# 1. Make sure we are on the main branch
	git checkout main 
	# 2. Delete all branches except main
	git branch | grep -v "main" | xargs git branch -D