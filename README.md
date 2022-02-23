## vTail Serverless Nodejs/Typescript Programming Task

Thank you for considering vTail! We are building a next-generation telehealth platform for healthcare professionals and would love for you to join our engineering team.

In order to be considered for role, we invite you to complete the following task.

_Note: You should aim to spend only 60-90 mins at most on this task._

### In this task, please use:

- Typescript
- Serverless Framework
- Your favourite OSS modules / npm libs to help with common tasks
- The internet, including Google, Stackoverflow etc to help with the task!

### The Task

Included in the repo is a lambda REST API to add a batch of employees to the vTail platform. This API is already written but is not the best code quality.
Your task is to:

1. Rewrite it in the way you'd design it, and include unit tests.
   1. You can either refactor it in place, or create a new directory and start from scratch to implement the same functionality.
   2. Feel free to comment your code liberally to let us understand how you were thinking when writing it.
   3. Some 'good hygiene' elements may be missing from the current functionality. Do add them if you think relevant. What else is included in a 'healthy' lamdba function or general typescript code? Please include any of your favourite Nodejs OSS libs to help with common tasks.
   4. Do not worry about the whole api/lambda being executable in a cloud environment, a set of passing unit tests will suffice.
2. After that we want you to make preperations for provisioning it as a Rest API into an AWS environment using a new Serverless Framework project.
   1. A basic Serverless Framework project is included.
   2. Complete the `serverless.yml` code to provision your new lambda.
   3. Please include any lambda config attributes you think would be best practice in this circumstance. Consider that this lambda may be used as a template to copy/paste for many future lambdas - what do you want to make future developers think about when adding a new lambda?
   4. Please include any serverless plugins that you think would be smart to use at scale.
   5. Do not worry about provisioning infra for the DynamoDB table or Cognito instance.
   6. Do not worry about the project actually being deployable to a real AWS environment

You may also ask us any general questions (mark@vtail.co) you might have about the task.

### Once done

1. Commit and Push your code to a new public Github repository
2. Send us the link
3. Your code will be reviewed by one of our senior technical team and we will get back to you!

### Review interview

In the follow-up interview you may be asked to extend this solution given a small new requirement, for a pair-programming exercise.
