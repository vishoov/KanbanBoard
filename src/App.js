import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './App.css';
import List from './Components/List/List';
import Navbar from './Components/Navbar/Navbar';

function App() {
  const [groupValue, setgroupValue] = useState(getStateFromLocalStorage() || 'status');
  const [orderValue, setorderValue] = useState('title');
  const [ticketDetails, setticketDetails] = useState([]);
  
  const statusList = ['In progress', 'Backlog', 'Todo', 'Done', 'Cancelled'];
  const userList = ['Anoop sharma', 'Yogesh', 'Shankar Kumar', 'Ramesh', 'Suresh'];
  const priorityList = [
    { name: 'No priority', priority: 0 },
    { name: 'Low', priority: 1 },
    { name: 'Medium', priority: 2 },
    { name: 'High', priority: 3 },
    { name: 'Urgent', priority: 4 }
  ];

  // Utility functions

  function saveStateToLocalStorage(state) {
    localStorage.setItem('groupValue', JSON.stringify(state));
  }

  function getStateFromLocalStorage() {
    const storedState = localStorage.getItem('groupValue');
    return storedState ? JSON.parse(storedState) : null;
  }

  const orderDataByValue = useCallback(async (cardsArry) => {
    // Sort logic
    // ...
    await setticketDetails(cardsArry);
  }, [setticketDetails]);

  // Handlers

  function handleGroupValue(value) {
    setgroupValue(value);
    console.log(value);
  }

  function handleOrderValue(value) {
    setorderValue(value);
    console.log(value);
  }

  // useEffect for fetching and processing data

  useEffect(() => {
    saveStateToLocalStorage(groupValue);

    async function fetchData() {
      try {
        const response = await axios.get('https://api.quicksell.co/v1/internal/frontend-assignment');
        if (response.status === 200) {
          const ticketArray = [];
          for (let i = 0; i < response.data.tickets.length; i++) {
            for (let j = 0; j < response.data.users.length; j++) {
              if (response.data.tickets[i].userId === response.data.users[j].id) {
                const ticketJson = { ...response.data.tickets[i], userObj: response.data.users[j] };
                ticketArray.push(ticketJson);
              }
            }
          }
          await setticketDetails(ticketArray);
          orderDataByValue(ticketArray);
        }
      } catch (error) {
        // Handle error
        console.error(error);
      }
    }

    fetchData();
  }, [groupValue, orderDataByValue]);

  // JSX structure

  return (
    <>
      <Navbar
        groupValue={groupValue}
        orderValue={orderValue}
        handleGroupValue={handleGroupValue}
        handleOrderValue={handleOrderValue}
      />
      <section className="board-details">
        <div className="board-details-list">
          {(() => {
            if (groupValue === 'status') {
              return statusList.map((listItem) => (
                <List
                  key={listItem}
                  groupValue="status"
                  orderValue={orderValue}
                  listTitle={listItem}
                  listIcon=""
                  statusList={statusList}
                  ticketDetails={ticketDetails}
                />
              ));
            } else if (groupValue === 'user') {
              return userList.map((listItem) => (
                <List
                  key={listItem}
                  groupValue="user"
                  orderValue={orderValue}
                  listTitle={listItem}
                  listIcon=""
                  userList={userList}
                  ticketDetails={ticketDetails}
                />
              ));
            } else if (groupValue === 'priority') {
              return priorityList.map((listItem) => (
                <List
                  key={listItem.priority}
                  groupValue="priority"
                  orderValue={orderValue}
                  listTitle={listItem.priority}
                  listIcon=""
                  priorityList={priorityList}
                  ticketDetails={ticketDetails}
                />
              ));
            }
            return null;
          })()}
        </div>
      </section>
    </>
  );
}

export default App;
