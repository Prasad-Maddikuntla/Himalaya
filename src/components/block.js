
import React, { useEffect, useState } from "react";
import homeButton from "../images/homeButton.png";
import { useNavigate } from "react-router-dom";
import AWS from 'aws-sdk';
const Block = () => {
  const [block, setBlock] = useState("");
  const [value, setValue] = useState([]);
  const [bool, setBool] = useState(true);
  const [data, setData] = useState({});
  const [rooms, setRooms] = useState({});
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const credentials = new AWS.Credentials({
    accessKeyId: process.env.REACT_APP_ACCESS_KEY_ID,
    secretAccessKey:process.env.React_APP_SECRET_ACCESS_KEY,
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
  
  

  useEffect(() => {
    setBlock(sessionStorage.getItem("blockName"));
  }, []);

  useEffect(() => {
    setRooms(JSON.parse(localStorage.getItem("blocks"))[block]);
  }, [block]);

  const navigate = useNavigate();

  useEffect(() => {
    setData(JSON.parse(localStorage.getItem("blocks")));
    
  }, []);
  useEffect(() => {
    if (data[block] && Object.keys(data[block]).length === 0) {
      setBool(false);
    } else {
      setBool(true);
      setRooms(data[block]);
    }
  }, [data, block]);
  

  useEffect(() => {
    if (rooms) {
     let temp=Object.keys(rooms).sort()
      setValue(
        temp.map((butt, i) => (
          <div key={i} className={`room ${selectedRooms.includes(butt) ? "selected" : ""}`}>
            <div
              
              draggable
              onDragStart={(e) => handleDragStart(e, butt)}
              onClick={() => handleRoomSelection(butt)}
            >
              {butt}
              
            </div>
            <div>{rooms[butt].length}</div>
          </div>
        ))
      );
    }
  }, [rooms, selectedRooms]);
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
  
        console.log('Backup created:', backupData);
      }
    });
  }
  async function restoreData() {
    const tableName = "himalaya";
  
    await createTableIfNotExists();
  
    const params = {
      TableName: tableName,
      Item: {
        block: block,
        rooms: data[block], // Replace 'rooms' with the actual attribute name in your DynamoDB table
      },
    };
  
    documentClient.put(params, (error) => {
      if (error) {
        console.error('Error restoring data to DynamoDB:', error);
      } else {
        console.log('Data restored successfully:', params.Item);
      }
    });
  }
  
  
    

  function handleDragStart(e, butt) {
    e.dataTransfer.setData("butt", butt);
  }

  function goToRoom(block, butt) {
    sessionStorage.setItem("room", butt);
    navigate(`/block/${block}/${butt}`);
  }

  function handleRoomSelection(roomNumber) {
    if (isDeleteMode) {
      if (selectedRooms.includes(roomNumber)) {
        setSelectedRooms(selectedRooms.filter((room) => room !== roomNumber));
      } else {
        setSelectedRooms([...selectedRooms, roomNumber]);
      }
    } else {
      goToRoom(block, roomNumber);
    }
  }

  function deleteSelectedRooms() {
    const updatedRooms = { ...rooms };
    selectedRooms.forEach((room) => {
      delete updatedRooms[room];
    });
    setRooms(updatedRooms);
    data[block] = updatedRooms;
    localStorage.setItem("blocks", JSON.stringify(data));
    setSelectedRooms([]);
    setIsDeleteMode(false);
    if (Object.keys(updatedRooms).length === 0) {
      setBool(false);
    }
  }

  function toggleDeleteMode() {
    setIsDeleteMode(!isDeleteMode);
    setSelectedRooms([]);
  }

  function generateRoomNumbers() {
    const numFloors = parseInt(prompt("Please enter the number of floors:"));
    const numRooms = parseInt(prompt("Please enter the number of rooms in each floor:"));
    const roomNumbers = [];

    for (let i = 0; i < numFloors; i++) {
      for (let j = 1; j <= numRooms; j++) {
        const floorNumber = i.toString().padStart(1, "0");
        const roomNumber = j.toString().padStart(2, "0");
        roomNumbers.push(`${floorNumber}${roomNumber}`);
      }
    }

    let updatedData = { ...data };
    updatedData[block] = {};

    roomNumbers.forEach((roomNumber) => {
      updatedData[block][roomNumber] = [];
    });

    localStorage.setItem("blocks", JSON.stringify(updatedData));
    setData(updatedData);
    setRooms(updatedData[block]);
    setSelectedRooms([]);
    setIsDeleteMode(false);
    setBool(true);
    alert(`The room numbers are: ${roomNumbers.join(", ")}`);
  }

  return (
    <div className="blocks-main">
      <div className="rmhead">
        <h1 className="head">{block}</h1>
        <img
          className="home-button"
          onClick={() => {
            navigate("/blocks");
          }}
          src={homeButton}
          alt="home-button"
        />
      </div>
      {!bool && (
        <button onClick={generateRoomNumbers}>Generate Room Numbers</button>
      )}
      {bool && (
        <div className="rooms">
          <button onClick={toggleDeleteMode}>
            {isDeleteMode ? "Cancel" : "Delete Room"}
          </button>
          {value}
          {isDeleteMode && selectedRooms.length > 0 && (
            <button onClick={deleteSelectedRooms}>Delete</button>
          )}
        </div>
      )}
      <div>
      <button onClick={backupData}>Backup</button>
      <button onClick={restoreData}>Restore</button>
    </div>
    </div>
  );
};

export default Block;
