import react from "react";
import AWS from 'aws-sdk';
const credentials = new AWS.Credentials({
    accessKeyId: process.env.REACT_APP_ACCESS_KEY_ID,
    secretAccessKey:process.env.REACT_APP_SECRET_ACCESS_KEY
  });
  
  AWS.config.update({
    credentials,
    region: 'us-east-1',
    signatureVersion: 'v4',
  })
  const dynamodb = new AWS.DynamoDB();
  const documentClient = new AWS.DynamoDB.DocumentClient();
  export async function createTableIfNotExists() {
    const tableName = "himalaya";
  
    try {
      await dynamodb.describeTable({ TableName: tableName }).promise();
      console.log(`Table '${tableName}' already exists.`);
    } catch (error) {
      if (error.code === 'ResourceNotFoundException') {
       console.log(`Table '${tableName}' does not exist. Creating...`);
  
        const params = {
          TableName: tableName,
          KeySchema: [
            { AttributeName: 'block', KeyType: 'HASH' },
          ],
          AttributeDefinitions: [
            { AttributeName: 'block', AttributeType: 'S' },
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5,
          },
        };
  
        try {
          await dynamodb.createTable(params).promise();
          console.log(`Table '${tableName}' created.`);
          await dynamodb.waitFor('tableExists', { TableName: tableName }).promise();
          console.log(`Table '${tableName}' is active.`);
        } catch (error) {
          console.error('Error creating table:', error);
        }
      } else {
        console.error('Error describing table:', error);
      }
    }
  }
