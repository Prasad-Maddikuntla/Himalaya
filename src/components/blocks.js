import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AWS from 'aws-sdk';

const AddBlockPopup = ({ handleClose, handleAdd }) => {
 
  const [blockName, setBlockName] = useState("");
  const [err,setErr]=useState("")

  const handleChange = (event) => {
    setErr("")
    setBlockName(event.target.value);
  };

  const handleSubmit = () => {
    if(blockName.length==0 || blockName==" "){
      setErr("Please enter blockname...")

    }else{
      handleAdd(blockName);
      setBlockName("");
      handleClose();
    }
    
  };

  return (
    <div className="popup">

      <div className="popup-inner">

        <h2>Add Block</h2>
        <label htmlFor="block-name">Block Name:</label>
        <input
          className="popup-input"
          type="text"
          id="block-name"
          value={blockName}
          placeholder="Write new block name here..."
          onChange={handleChange}
        />
        <div className="err">{err}</div>
        <div className="popup-buttons">
        <button className="close-btn" onClick={handleClose}>
          Cancel
        </button>
        <button className="cfn-addblock" onClick={handleSubmit}>Add Block</button>
        </div>
       
      </div>

    </div>
  );
};

const Blocks = ({props}) => {
  console.log(props)
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
  const documentClient = new AWS.DynamoDB.DocumentClient()
  const navigate = useNavigate();
  const [awdata,setAwdata]=useState([])
  const [data, setData] = useState({});
  const [isReady, setIsReady] = useState(true); // initially set to true
  useEffect(() => {
    setData(JSON.parse(localStorage.getItem("blocks")));
  }, []);
// let awdatax=JSON.parse(localStorage.getItem("himalaya"))
useEffect(()=>{
  if(awdata.length===0){
setAwdata(JSON.parse(localStorage.getItem("himalaya")))
  }
},[])

  // console.log(awdata)
async function restoreData(blockName) {
  const tableName = "himalaya";

 

  const params = {
    TableName: tableName,
    Item: {
      block: blockName,
      item:[]
    },
  };
  setAwdata([...awdata,{block: blockName}])
  localStorage.setItem("himalaya",JSON.stringify(awdata))
  documentClient.put(params, (error) => {
    if (error) {
      console.error('Error restoring data to DynamoDB:', error);
    } else {
    console.log(awdata)
      console.log('Data restored successfully:', params.Item);
    }
  });
}
  const handleAddBlock = (blockName) => {
    setIsReady(false);
    restoreData(blockName)
   // set to false when "Add Block" button is clicked
    const blocks = JSON.parse(localStorage.getItem("blocks") ?? "{}");
    const n = Object.keys(blocks).length + 1;
    const newBlockName = blockName.trim() !== "" ? blockName : `B ${n}`;
    blocks[newBlockName] = {};
    localStorage.setItem("blocks", JSON.stringify(blocks));
    
    setData(blocks);
    setIsReady(true); // set to true when new block is successfully added
  };

  const [showAddPopup, setShowAddPopup] = useState(false);

  const handleBlockClick = (blockName) => {
    sessionStorage.setItem('blockName', blockName)
    if (isReady) { // only navigate if the new route is ready
      navigate(`/block/${blockName}`);
    }
  };
  return (
    <div className="blocks-main">
      <div className="butts">
        <button className="butt" style={{backgroundColor: "blue"}} onClick={() => setShowAddPopup(true)}>
          <div className="addblock">Add block</div>
        </button>

        <button className="butt" onClick={() => navigate("/deleteblock")}>
          Delete Block
        </button>
      </div>
      <div>
        {
          awdata.map((data,key)=>{
          //  console.log(data,"dhsj")
            return (
              <div
                key={key}
                className="block"
                onClick={() => handleBlockClick(data.block)}
              >
                {data.block}
              </div>
            );

          })
        }
      </div>
      {/* <div className="blocks">
        {Object.keys(data).map((key) => {
          return (
            <div
              key={key}
              className="block"
              onClick={() => handleBlockClick(key)}
            >
              {key}
            </div>
          );
        })}
      </div> */}
      {showAddPopup && (
        <AddBlockPopup
          handleClose={() => setShowAddPopup(false)}
          handleAdd={handleAddBlock}
        />
      )}
    </div>
  );
};

export default Blocks;

