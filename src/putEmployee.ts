import * as DynamoDB from "aws-sdk/clients/dynamodb";
import {
  ICognitoUserWithPassword,
  IEventWithPutEmployeesArguments,
  IPutEmployeesArguments,
} from "./putEmployees.interfaces";
import { DocumentClient } from "aws-sdk/lib/dynamodb/document_client";
import { IDynamoDBEmployee } from "./types";
import { IPutEmployee } from "./putEmployees.interfaces";
import CognitoIdentityServiceProvider, {
  AdminCreateUserRequest,
} from "aws-sdk/clients/cognitoidentityserviceprovider";
import { generate } from "generate-password";

export const putEmployees = async (event: IEventWithPutEmployeesArguments) => {
  const tableName = process.env.TABLE_NAME as string;

  const { employeeItems, employeesWithIds } =
    await createCognitoUsersAndEmployeeItems(event.body);

  const dynamoDb = new DynamoDB.DocumentClient();

  const dynamoFormatItems: { PutRequest: { Item: IDynamoDBEmployee } }[] = [];

  employeeItems.forEach((employeeItem) => {
    dynamoFormatItems.push({
      PutRequest: {
        Item: employeeItem,
      },
    });
  });

  const writeParams: DocumentClient.BatchWriteItemInput = {
    RequestItems: { [tableName]: dynamoFormatItems },
  };

  await dynamoDb.batchWrite(writeParams).promise();

  return employeeItems;
};

interface IEmployeesWithIds extends IPutEmployee {
  id: string;
  encryptedPassword?: string;
}

const createCognitoUsersAndEmployeeItems = async ({
  employees,
  businessUnitId,
  companyId,
}: IPutEmployeesArguments): Promise<{
  employeeItems: IDynamoDBEmployee[];
  employeesWithIds: IEmployeesWithIds[];
}> => {
  const employeeItems: IDynamoDBEmployee[] = [];
  const employeesWithIds: IEmployeesWithIds[] = [];

  for (const employee of employees) {
    const cognitoUser = (await createCognitoEmployeeUser(
      employee
    )) as ICognitoUserWithPassword;
    const id = cognitoUser?.Username as string;

    employeeItems.push({
      PK: `EMPLOYEE#${employee.id}`,
      SK: `EMPLOYEE#${employee.id}`,
      businessUnitId,
      companyId,
      ...employee,
    });
    employeesWithIds.push({ ...employee, id });
  }

  return {
    employeeItems,
    employeesWithIds,
  };
};

const createCognitoEmployeeUser = async (
  employee: IPutEmployee
): Promise<CognitoIdentityServiceProvider.UserType> => {
  const newUser = await createUser(employee, {
    messageAction: "SUPPRESS",
  });
  const groupName = "employees";
  await addUserToGroup(newUser.Username as string, groupName);
  return newUser;
};

type ICustomParams = {
  messageAction?: string;
};
const createUser = async (
  user: { email: string; firstName: string; lastName: string },
  customParams?: ICustomParams
) => {
  const password = generate({
    length: 8,
    numbers: true,
    strict: true,
    excludeSimilarCharacters: true,
  });
  const params: AdminCreateUserRequest = {
    UserPoolId: process.env.USER_POOL_ID!,
    Username: user.email,
    DesiredDeliveryMediums: ["EMAIL"],
    ForceAliasCreation: false,
    TemporaryPassword: password,
    UserAttributes: [
      {
        Name: "given_name",
        Value: user.firstName,
      },
      {
        Name: "family_name",
        Value: user.lastName,
      },
      {
        Name: "email",
        Value: user.email,
      },
      { Name: "email_verified", Value: "true" },
    ],
  };
  if (customParams?.messageAction) {
    params.MessageAction = customParams.messageAction;
  }

  const cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider({
    apiVersion: "2016-04-19",
  });

  const userResult = await cognitoIdentityServiceProvider
    .adminCreateUser(params)
    .promise();

  return {
    ...userResult.User,
    password,
  };
};

const addUserToGroup = async (
  userId: string,
  groupName: string
): Promise<void> => {
  const adminAddUserToGroupParams = {
    GroupName: groupName,
    UserPoolId: process.env.USER_POOL_ID!,
    Username: userId,
  };

  const cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider({
    apiVersion: "2016-04-19",
  });

  await cognitoIdentityServiceProvider
    .adminAddUserToGroup(adminAddUserToGroupParams)
    .promise();
};
