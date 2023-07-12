import React, {useEffect, useState} from "react";



function App() {
  const [records, setRecords] = useState("This doesn't work");  
  
  useEffect(()=> {
    async function getRecords() {
      const response = await fetch(`http://localhost:5050/record/`);
      console.log("database called started")
      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        window.alert(message);
        return;
      }
    
      const records = await response.json();
      console.log(records[0]);
      
      const jsonStr = JSON.stringify(records[0].test)
      console.log(jsonStr);
      setRecords(jsonStr);
    }
    getRecords();
    return;
  }, []); 


  return (
    <div className="App">
      <header>
        Hello World. {records}
      </header>
    </div>
  );
}

export default App;
