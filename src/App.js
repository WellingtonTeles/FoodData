import './App.css';
import React, { useState } from 'react'; 
import axios from "axios";

function App() {
  const API_KEY = 'JOfoIlnhHbr6ZyWa3tlCbkFe6e8UdNSQWXtKSiV2';
  const [footName, setFoodName] = useState("");
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(0);

  const getFoodInformation = async () => {
    try {
      setLoading(-1);
      const response = await axios.get(
        "https://api.nal.usda.gov/fdc/v1/foods/search",
        { 
          params: { api_key: API_KEY, query: footName },
          headers: {
            "Content-Type": "application/json",
          }
        }
      );
      const { data } = response;
      for(let i = 0; i < data.foods.length; i ++) {
        const second_response = await axios.get(
          `https://api.nal.usda.gov/fdc/v1/food/${data.foods[i].fdcId}`,
          { 
            params: { api_key: API_KEY },
            headers: {
              "Content-Type": "application/json",
            }
          }
        );
        console.log("ddd")
        setFoods(prevFoods => [...prevFoods, second_response.data])
      }
      setLoading(1);
      console.log("...")
      const blob = new Blob([JSON.stringify(foods)], { type: 'application/json' });
      // Generate a download link
      const downloadLink = document.createElement('a');
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.download = 'data.json';
      downloadLink.click();
    } catch (error) {
      console.error(error);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    getFoodInformation();
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="foodName">Enter Food name: </label>
        <input
          id="foodName"
          name="foodName"
          value={footName}
          onChange={(e) => setFoodName(e.target.value)}
          required
        />
        <button type="submit">Search</button>
      </form>
      {loading === -1 && <p>Loading...</p>}
      {foods.length > 0 && loading === 1 && (
          <pre>{JSON.stringify(foods, null, 2)}</pre>
      )}
      {foods.length === 0 && loading === 1 && <p>There is no result.</p>}
    </div>
  );
}

export default App;
