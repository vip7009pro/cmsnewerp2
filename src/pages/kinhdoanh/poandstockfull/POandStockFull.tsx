import { useState } from 'react';
import Swal from 'sweetalert2';
import { generalQuery } from '../../../api/Api';
import './POandStockFull.scss'
const axios = require('axios').default;

const POandStockFull = () => {    
  const [file, setFile] = useState<any>();
  const saveFile = (e: any) => {
    setFile(e.target.files[0]); 
  };

  const uploadFile = async (e:any) => {
    const formData = new FormData();
    formData.append("banve", file);
    try {
      const res = await axios.post(
        "http://14.160.33.94:3007/upload",
        formData
      );
      console.log(res);
    } catch (ex) {
      console.log(ex);
    }
  };

  return (
    <div>
      <div className="App">          
            <input type="file" onChange={saveFile} />
            <button onClick={uploadFile}>Upload</button>   
      </div>     
    </div>
  );
}

export default POandStockFull