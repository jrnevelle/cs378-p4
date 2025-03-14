import './App.css';
import {useState} from 'react';

async function fetchAPIdata(longitude, latitude) {
  const json = {};
  try {
    console.log({longitude, latitude});
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m`;
    const response = await fetch(url);
    const json = await response.json();
    return json.hourly;
  } catch (err) {
    alert("API Error");
    return "";
  } 
}

function App() {
  const [locations, setLocations] = useState([
    { name: "Dallas",
      longitude: 96.8,
      latitude: 32.78
    },
    { name: "Houston",
      longitude: 95.37,
      latitude: 29.76
    },
    { name: "Austin",
      longitude: 97.74,
      latitude: 30.27
    }
  ]);
  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");
  const [name, setName] = useState("");
  const [data, setData] = useState({});

  const displayData = async (currLong, currLat) => {
    const result = await fetchAPIdata(currLong, currLat);
    if (result === "") return;
    setData(result);
  }

  const submit = async () => {
    if (name === "" || longitude === "" || latitude === "") return;
    setLocations([...locations, { name, longitude, latitude }]);
    await displayData(longitude, latitude);
    setName("");
    setLongitude("");
    setLatitude("");
  }

  return (
    <div>
      <div>
        {locations.map((item) => (
            <button onClick={() => displayData(item.longitude, item.latitude)}>{item.name}</button>
          ))}
      </div>
      <div>
        <input
          placeholder="Latitude"
          value={latitude}
          onChange={(input) => setLatitude(input.target.value.trim())}
        />
        <input
          placeholder="Longitude"
          value={longitude}
          onChange={(input) => setLongitude(input.target.value.trim())}
        />
        <input
          placeholder="Name"
          value={name}
          onChange={(input) => setName(input.target.value.trim())}
        />
        <button onClick={() => submit()}>Add</button>
      </div>
      <div>
        {data && data.time && data.temperature_2m && (
          <div>
            <h3 style={{ display: "flex", justifyContent: "space-between", width: "300px", margin: "20px 20px 0px 20px" }}>
              <span>Time:</span>
              <span>Temperature:</span>
            </h3>
            {data.time.map((time, index) => {
              const temp = data.temperature_2m[index];
              return (
                <p style={{ display: "flex", justifyContent: "space-between", width: "300px", margin: "20px 20px 0px 20px" }}>
                  <span>{time}</span>
                  <span>{temp} C</span>
                </p>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
