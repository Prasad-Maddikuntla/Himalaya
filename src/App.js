import "./styles.css";

import React, { useEffect, useState } from "react";
import Home from "./components/home";
import Blocks from "./components/blocks";
import DelBlock from "./components/deleteblock";
import Room from "./components/room";

import Block from "./components/block";
import Addtenant from "./components/addtenant";
import Edittenant from "./components/editTenant";
import FixedFooterTable from "./components/table";
// import TenantDetails from './components/tenant_details';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AWS from 'aws-sdk';


function App() {
  const [data,setData]=useState([])
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
  async function createTableIfNotExists() {
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
  async function backupData() {
    const tableName = "himalaya";
  
    // Create the table if it doesn't exist
    await createTableIfNotExists();
  
    const params = {
      TableName: tableName,
    };
  
    documentClient.scan(params, (error, data) => {
      if (error) {
        console.error('Error scanning DynamoDB table:', error);
      } else {
        const backupData = data.Items.map((item) => ({
          block: item.block, // Replace 'partitionKey' with your actual partition key attribute name
          data: item,
        }));
        // Use the backupData as per your application's requirements
        localStorage.setItem("himalaya",JSON.stringify(backupData))
        setData(backupData)
        console.log('Backup created:',backupData);
      }
    });
  }
  useEffect(()=>{
    backupData()

  },[])
  const [blocks, setBlocks] = useState({});
  useEffect(() => {
    setBlocks(JSON.parse(window.localStorage.getItem("blocks")));
  }, []);

  return (
    <Router>
      <Routes>
      
        <Route path="/" element={<Home />} />
        <Route path="/addtenant" element={<Addtenant/>}/>
        <Route path="/blocks" element={<Blocks props={data} />} />
        <Route path='/deleteblock' element={<DelBlock props={data}/>}/>
        <Route path='/editTenant' element={<Edittenant/>}/>
        <Route path="/table" element={<FixedFooterTable/>}/>
     
        {/* <Route path="/addtenant" element={<Addtenant />} /> */}
        {blocks && Object.keys(blocks).map((key) => {
          let rot = "/block/" + key;
          return (
            <Route
              path={rot}
              element={<Block block={key}/>}
            />
          );
        })} 
        <Route path="/block/:blockId" element={<Block />} />
        <Route path="/block/:blockId/:roomID" element={<Room />} />
      </Routes>
    </Router>
  );
}

export default App;


