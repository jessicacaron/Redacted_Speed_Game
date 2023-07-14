import React, {useEffect, useState} from "react";
import './App.css';
import Card from './components/Card';



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
        <div className="game">
          <div className="table-container">
            <img src="/assets/table/Table1.jpg" alt="Table" className="table-image" />
            <div className="card-container">
              <div className="card-column">
                <Card rank="12" suit="HEART" isFaceUp={true} />
              </div>
              <div className="card-column">
                <Card rank="2" suit="HEART" isFaceUp={false} />
              </div>
              <div className="card-column">
                <Card rank="13" suit="DIAMOND" isFaceUp={true} />
              </div>
              <div className="card-column">
                <Card rank="7" suit="CLUB" isFaceUp={true} />
              </div>
              <div className="card-column">
                <Card rank="1" suit="JOKER" isFaceUp={true} />
              </div>
              <div className="card-column">
                <Card rank="3" suit="SPADE" isFaceUp={true} />
              </div>
            </div>
          </div>
        </div>
      </div>
  );

}

export default App;
