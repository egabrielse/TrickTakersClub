####################################
####### APPLICATION SCRIPTS ########
####################################

# Starts dockerized services. By default, starts all services.
# To specify which services to start, list them as arguments.
# Usage: `just up` for all service or `just up service1 service2` for specific services.
up +SERVICES="":
	docker-compose up --detach --build {{SERVICES}}


# Restarts dockerized services. By default, restarts all services.
# To specify which services to restart, list them as arguments.
# Note: Restarting a service will restart dependent services as well.
# Usage: `just restart` for all services or `just restart service1 service2` for specific services.
restart +SERVICES="":
	docker-compose restart {{SERVICES}}

# Stops only the specified docker services.
# Usage: `just stop` for all services or `just stop service1 service2` for specific services.
stop +SERVICES="":
	docker-compose stop {{SERVICES}}

# Stops, tears down and removes docker containers and prunes unused images.
# By default, tears down all services.
# To specify which services to tear down, list them as arguments.
# Usage: `just down` for all services or `just down service1 service2` for specific services.
down +SERVICES="":
	docker-compose down {{SERVICES}}
	docker image prune -f

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