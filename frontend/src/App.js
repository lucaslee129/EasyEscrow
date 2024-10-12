import logo from './logo.svg';
import './App.css';
import PDFUploader from './PDFUploader';
import React, { useState } from 'react';
import CreateEscrow from './CreateEscrow';

function App() {

  const [data, setData] = useState(null);

  console.log(data);

  return (
    <div className="relative m-auto flex h-screen">
      {
        data == null ? <PDFUploader setData={setData} /> : <CreateEscrow data={data} />
      }

    </div>
    // <div className="relative m-auto flex h-screen">
    //   {
    //     <CreateEscrow data={data} />
    //   }

    // </div>
  );
}

export default App;
