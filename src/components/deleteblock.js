import react, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AWS from 'aws-sdk';

const DelBlock=({props})=>{
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
  const dynamoDB = new AWS.DynamoDB.DocumentClient()
    const [delb,setDelb]=useState([])
    const navigate=useNavigate()
    const [blocks,setBlocks]=useState({})
    const [awdata,setAwdata]=useState(props)
    useEffect(()=>{
      if(awdata.length==0){
      setAwdata(JSON.parse(localStorage.getItem("himalaya")))
      }
      // console.log(awdata)
    },[])
    const [istoogle, setIstoggle] = useState(Object.keys(blocks).reduce((acc, key) => {
        acc[key] = false;
        return acc;
      }, {}));
    
    useEffect(()=>{
        setBlocks(JSON.parse(localStorage.getItem('blocks')))
    },[])
    function removeItemOnce(arr, value) {
        var index = arr.indexOf(value);
        if (index > -1) {
          arr.splice(index, 1);
        }
        return arr;
      }
    
      const deleteItemsFromDynamoDB = (itemIds) => {
        console.log(itemIds)
        const params = {
          RequestItems: {
            'himalaya': itemIds.map(itemId => ({
              DeleteRequest: {
                Key: {
                  block: itemId,
                },
              },
            })),
          },
        };
      
        dynamoDB.batchWrite(params, (error, data) => {
          if (error) {
            console.error('Error deleting items:', error);
          } else {
            console.log('Items deleted successfully:', data);
            // Perform any necessary UI updates after successful deletion
          }
        });
      };
      
    function handleBlock(block) {
        const newIstoogle = { ...istoogle };
        if (newIstoogle[block] === "selected") {
          let arr = delb;
          arr = removeItemOnce(arr, block);
          setDelb(arr);
          newIstoogle[block] = false;
        } else if (!newIstoogle[block]) {
          setDelb([...delb, block]);
          newIstoogle[block] = "selected";
        }
        setIstoggle(newIstoogle);
      }
      useEffect(() => {
        console.log(istoogle);
      }, [istoogle]);
      
      function handleDelete() {
        if (delb.length === 0) {
          return; // no blocks selected to delete
        }
      
        const confirmMsg = `Are you sure you want to delete ${delb.length} block(s)?`;
        const confirmed = window.confirm(confirmMsg);
      
        if (confirmed) {
            const newBlocks = {...blocks};
            deleteItemsFromDynamoDB(delb)
             // create a copy of the blocks object
            for (let i = 0; i < delb.length; i++) {
              delete newBlocks[delb[i]];
            }
            let newdata=awdata
            awdata.map((data,i)=>{
              if(delb.includes(data.block)){
                delete awdata[i]
              }
            })
            newdata=newdata.filter(element => element)
            // console.log(awdata,"jdjfhdj")
            setAwdata(newdata)
            setBlocks(newBlocks)
            localStorage.setItem('blocks', JSON.stringify(newBlocks)); // convert to JSON before saving
            localStorage.setItem('himalaya',JSON.stringify(newdata))
          } else {
            setDelb([]);
            setIstoggle(Object.keys(blocks).reduce((acc, key) => {
              acc[key] = false;
              return acc;
            }, {}));
          }
        
      }



    return(
        <div className="blocks-main">
            <div className="butts">
                <button className="butt" onClick={()=>{navigate('/blocks')}}>CANCEL</button>
                <button className="butt" onClick={handleDelete}>DELETE</button>
            </div>
            <div>{awdata.map((data,i)=>{
                  return(<div key={i} onClick={()=>handleBlock(data.block)} style={delb.includes(data.block)?{BackgroundColor:'yellow'}:{color: "blue"}} className={"block"}>{data.block}</div>)
                })}</div>
            {/* <div className="blocks">
                {Object.keys(blocks).map((block,i)=>{
                  return(<div key={i} onClick={()=>handleBlock(block)} style={delb.includes(block)?{color:'yellow'}:{color: "blue"}} className={"block"}>{block}</div>)
                })}

            </div> */}
        </div>
    )

}
export default DelBlock
