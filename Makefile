# ----------------------------
#       CONFIGURATION
# ----------------------------

# Set gitlab-ci variables if not in a CI context
ifndef CI_REGISTRY_IMAGE
	CI_REGISTRY_IMAGE := $(DOCKER_REGISTRY)/misakey/cookie-plugin
endif
DOCKER_IMAGE := $(CI_REGISTRY_IMAGE)
ifndef CI_COMMIT_REF_NAME
	CI_COMMIT_REF_NAME := $(shell git rev-parse --abbrev-ref HEAD)
endif

REV := $(shell git rev-parse --short HEAD)
RELEASE := "$(CI_COMMIT_REF_NAME)"

# remove `/` & `SERVICE_TAG_METADATA` from commit ref name
ifneq (,$(findstring /,$(CI_COMMIT_REF_NAME)))
	CI_COMMIT_REF_NAME := $(shell echo $(CI_COMMIT_REF_NAME) |  sed -n "s/^.*\/\(.*\)$$/\1/p")
	RELEASE := "$(CI_COMMIT_REF_NAME)"
endif

ifneq (,$(findstring master,$(CI_COMMIT_REF_NAME)))
	RELEASE := "$(CI_COMMIT_REF_NAME)-$(REV)"
endif


# Set default goal (`make` without command)
.DEFAULT_GOAL := help

# ----------------------------
#          COMMANDS
# ----------------------------

.PHONY: echo
echo:
	@echo "CI_COMMIT_REF_NAME=$(CI_COMMIT_REF_NAME)"
	@echo "RELEASE=$(RELEASE)"

.PHONY: help
help:
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

.PHONY: dep
dep: ## Install all dependencies in the node_modules folder
	@yarn install

.PHONY: lint
lint: strict-lint ## Lint project code with eslint

.PHONY: strict-lint
strict-lint: ## Lint project code with eslint, return error if there is any suggestion
	@yarn lint

.PHONY: start
start: ## Launch plugin in development mode with hot reload 
	@yarn start

.PHONY: build
start: ## Generate plugin output for production (use TARGET_BROWSER=[firefox, chrome]) 
	@yarn build

.PHONY: build-zip
build-zip: ## Generate zip folders for production for both chrome and firefox, use VERSION=<version> to include version in zip name
	@docker build -f Dockerfile -t plugin --build-arg plugin_version=${VERSION} .
	@docker run -d --name plugin plugin
	# Copy files in /build
	@docker cp plugin:/app/artifacts/. ./build
	# Stop plugin container
	@docker stop plugin
	# Remove plugin container
	@docker rm plugin
	@zip build/source_code.zip -r -FS . -x 'build/*' 'node_modules/*' '.git/*'

.PHONY: zip-plugin-source-code
zip-plugin-source-code: ## Generate a clean zip of the source code for review
	@zip build/source_code.zip -r -FS . -x 'build/*' 'node_modules/*' '.git/*'

.PHONY: clean
clean: ## Remove all images related to the project
	@docker images | grep $(DOCKER_IMAGE) | tr -s ' ' | cut -d ' ' -f 2 | xargs -I {} docker rmi $(CI_REGISTRY_IMAGE):{}
