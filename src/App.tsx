import { useState, useEffect } from 'react'

class Node {
  isNodeActive: number;
  constructor(isNodeActive: number) {
    this.isNodeActive = isNodeActive;
  }
}

type GridType = Node[][];

function App() {
  const [numOfRows, setNumOfRows] = useState<number>(28);
  const [numOfCols, setNumOfCols] = useState<number>(28);
  const [grid, setGrid] = useState<GridType>([]);

  const [isUserDrawing, setIsUserDrawing] = useState<boolean>(false);
  const [resultNum, setResultNum] = useState<number | null>(null);
  const [emptyGrid, setEmptyGrid] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    createGrid();
  }, [])

  const createGrid = (): void => {
    const tempGrid: GridType = [];
    for (let i = 0; i < numOfCols; i++){
      tempGrid[i] = [];
      for (let j = 0; j < numOfRows; j++) {
        tempGrid[i][j] = new Node(0);
      }
    }
    setGrid(tempGrid)
  };

  const onMouseDownEvent = (): void => {
    setIsUserDrawing(true);
  };

  const onMouseUpEvent = (): void => {
    setIsUserDrawing(false);
  };

  const onMouseEnterEvent = (i: number, j: number): void => {
    if (isUserDrawing) {
      if (emptyGrid) setEmptyGrid(false);
      
      setGrid(prevGrid => {
        const newGrid = [...prevGrid];
        newGrid[i] = [...newGrid[i]];
        newGrid[i][j] = new Node(255);
        
        const nodeElement = document.getElementById(`node-${i}-${j}`);
        if (nodeElement) {
          nodeElement.className = "w-5 bg-[#F7F7F7] aspect-square border border-[#353840]";
        }
        
        return newGrid;
      });
    }
  };

  const sendNumber = async (): Promise<void> => {
    if (!emptyGrid) {
      setIsLoading(true);
      const numArr: number[] = [];
      for (let i = 0; i < numOfRows; i++) {
        for (let j = 0; j < numOfCols; j++) {
          numArr.push(grid[j][i].isNodeActive);
        }
      }
      try {
        const response = await fetch("http://localhost:5000/", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json; charset=UTF-8',
          },
          body: JSON.stringify(numArr),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json(); 
        setResultNum(data);
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false);
    }
  };

  const clearGrid = (): void => {
    createGrid();
    setEmptyGrid(true);
    setResultNum(null);
  };

  return (
    <div className="flex h-screen bg-[#1a1c1f]">
      <div className="flex flex-col items-center w-1/2 h-full p-4 box-border border-r-2 border-dashed border-r-[#353840]">
        <div className="w-full flex flex-col items-center">
          <h1 className="text-xl text-[#f7f7f7] text-center mb-4">Dibuja un número (0 - 9)</h1>
          <div className="flex flex-col items-center border border-[#353840] p-2 bg-[#222428] rounded">
            {grid.map((row, i) => (
              <div key={i} className="flex">
                {row.map((col, j) => (
                  <div
                    key={`${i}-${j}`}
                    className={`w-5 h-5 border border-[#353840] hover:cursor-pointer ${col.isNodeActive === 255 ? 'bg-[#F7F7F7]' : ''}`}
                    id={`node-${i}-${j}`}
                    onMouseDown={() => onMouseDownEvent()}
                    onMouseUp={() => onMouseUpEvent()}
                    onMouseEnter={() => onMouseEnterEvent(i, j)}
                  />
                ))}
              </div>
            ))}
          </div>
          <div className="w-full flex justify-center gap-4 pt-6">
            <button 
              className="bg-[#254362] border border-[#353840] text-white text-center px-4 py-2 rounded text-md font-bold hover:bg-[#1e3549] transition-colors cursor-pointer"
              onClick={() => sendNumber()}
            >
              ENVIAR
            </button>
            <button 
              className="bg-[#353840] border border-[#353840] text-white text-center px-4 py-2 rounded text-md font-bold hover:bg-[#2a2f35] transition-colors cursor-pointer"
              onClick={() => clearGrid()}
            >
              LIMPIAR
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center w-1/2 h-full p-4">
        <h1 className="text-xl text-[#f7f7f7] text-center mb-4">El número dibujado es:</h1>
        <div className="w-full h-145 flex justify-center items-center text-4xl rounded-lg bg-[#222428] border-2 border-[#353840]">
          {isLoading ? (
            <div className="inline-block w-12 h-12 border-4 border-[#f7f7f7] border-t-transparent rounded-full animate-spin" />
          ) : (
            <span className="text-7xl font-bold text-[#f7f7f7]">
              {resultNum !== null ? resultNum : "-"}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default App