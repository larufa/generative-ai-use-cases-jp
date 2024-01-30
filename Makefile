AWS_PROFILE := gen-ai

WORKSPACE := packages/cdk
STACK := --all


deps:
	npm ci

init:
	npx -w $(WORKSPACE) cdk bootstrap --profile $(AWS_PROFILE)

list:
	npx -w $(WORKSPACE) cdk list --profile $(AWS_PROFILE) 

deploy:
	npx -w $(WORKSPACE) cdk deploy --profile $(AWS_PROFILE) $(STACK)

url:
	@aws --profile $(AWS_PROFILE) cloudformation describe-stacks --stack-name $(STACK_NAME) --query 'Stacks[].Outputs[?OutputKey==`WebUrl`].OutputValue' --output text

dev:
	npm run web:devw
