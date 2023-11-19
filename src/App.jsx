import {useRef, useState} from 'react';
import './App.css';

function App() {
    const [model, setModel] = useState("");
    const [category, setCategory] = useState("");
    const [searchValue, setSearchValue] = useState("");
    const [searchResult, setSearchResult] = useState(null);
    const [error, setError] = useState(null);
    const [isNumber, setIsNumber] = useState(false);

    const modelRef = useRef(null);
    const categoryRef = useRef(null);
    const searchRef = useRef(null);

    const onClearInputs = () => {
        searchRef.current.value = "";
        modelRef.current.value = "";
        categoryRef.current.value = 1;
    };

    const onClear = () => {
        setSearchValue("");
        setError(null);
        setSearchResult(null);
        onClearInputs();
    };

    const handleSearchValue = ({target: {value}}) => {
        setSearchValue(value);
        setIsNumber(!isNaN(value));
        // console.log(value);
    };

    const handleModelValue = ({target: {value}}) => {
        setModel(value);
        //console.log(value);
    };

    const handleCategoryValue = ({target: {value}}) => {
        setCategory(value);
        //console.log(value);
    };

    const handleAddBike = (e) => {
        e.preventDefault();
        const bike = {"modelo": model, "categoria": category};
        //console.log(bike);
        fetch("http://localhost:8080/bike/add", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(bike),
        })
            .then((res) => {
                console.log(res.status);
            })
            .catch(error => {
                setError(error.message);
                //console.log(error);
            })
            .finally(() => {
                onClearInputs();
            });
    };

    const handleGetBike = (e) => {
        e.preventDefault();
        let URL = isNumber ? "http://localhost:8080/bike/getBike/" : "http://localhost:8080/bike/getBikeModel/";
        fetch(URL + searchValue)
            .then((res) => res.json())
            .then((res) => {
                setSearchResult(res);
                setError(null);
                // console.log(res);
            })
            .catch((error) => {
                setError(error.message);
                setSearchResult(null);
                console.log(error.message);
            }).finally(() => {
            onClearInputs();
        });
    };

    return (
        <>
            <h1>Wheels System</h1>
            <div className="card">
                <h2>Add Bike</h2>
                <div>
                    <input
                        type="text"
                        placeholder="Type the bike model"
                        onChange={handleModelValue}
                        ref={modelRef}
                    />
                </div>
                <div>
                    <select defaultValue={1} onChange={handleCategoryValue} ref={categoryRef}>
                        <option value={1} disabled={true}>Select any option</option>
                        <option value="CASUAL">Casual</option>
                        <option value="TRILHA">Trilha</option>
                        <option value="ESPORTES">Esportes</option>
                        <option value="EXTREME">Extreme</option>
                    </select>
                </div>
                <button
                    onClick={handleAddBike}
                    disabled={model === "" || category === ""}
                >
                    Add
                </button>
            </div>
            <div className="card">
                <h2>Search</h2>
                <div>
                    <input type="text"
                           placeholder="Enter the bike id or model"
                           onChange={handleSearchValue}
                           ref={searchRef}
                    />
                </div>
                <button
                    onClick={handleGetBike}
                    disabled={searchValue === ""}
                >
                    Search
                </button>
            </div>
            {error == null && searchResult ? (
                <>
                    <p>
                        Id: {searchResult.id}
                    </p>
                    <p>
                        Modelo: {searchResult.modelo}
                    </p>
                    <p>
                        Categoria: {searchResult.categoria}
                    </p>
                </>
            ) : (
                error && (
                    <p>
                        Error: {error}
                    </p>
                )
            )
            }
            {(searchResult !== null || error !== null) && (
                <button className="clear_btn" onClick={onClear}>
                    Clear
                </button>
            )}
        </>
    );
}

export default App;
