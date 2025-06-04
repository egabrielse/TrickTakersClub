# Start all or a specific set of containers using Docker Compose
start +CONTAINERS="":
	docker-compose up --detach --build {{CONTAINERS}}

# Stop specific containers
stop +CONTAINERS:
	docker-compose stop {{CONTAINERS}}

# Stop all containers
halt:
	docker-compose down

# Create a new branch from the current branch
branch BRANCH_NAME:
	# 1. Pull latest changes
	git pull
	# 2. Create a new branch
	git checkout -b {{BRANCH_NAME}} 
	# 2. Set the upstream branch
	git push --set-upstream origin {{BRANCH_NAME}}

# Clean up local branches
clean:
	# 1. Make sure we are on the main branch
	git checkout main 
	# 2. Pull latest changes
	git pull
	# 3. Delete all branches except main
	git branch | grep -v "main" | xargs git branch -D