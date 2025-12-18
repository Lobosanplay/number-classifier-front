import { useState, useEffect } from 'react'
import { HelpCircle, X } from 'lucide-react' 

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
  const [isErasing, setIsErasing] = useState<boolean>(false);
  const [resultNum, setResultNum] = useState<number | null>(null);
  const [emptyGrid, setEmptyGrid] = useState<boolean>(true);
  const [helpButton, setHelpButton] = useState<boolean>(false);
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

  const onMouseDownEvent = (e: React.MouseEvent, i?: number, j?: number): void => {
    if (e.button === 2 || e.ctrlKey || e.shiftKey) {
      setIsErasing(true);
    } else {
      setIsUserDrawing(true);
    }
    
    if (i !== undefined && j !== undefined) {
      handleNodeInteraction(i, j, e.button === 2 || e.ctrlKey || e.shiftKey);
    }
  };

  const onMouseUpEvent = (): void => {
    setIsUserDrawing(false);
    setIsErasing(false);
  };

  const onMouseEnterEvent = (i: number, j: number): void => {
    if (isUserDrawing || isErasing) {
      handleNodeInteraction(i, j, isErasing);
    }
  };

  const handleNodeInteraction = (i: number, j: number, isErasingAction: boolean): void => {
    setGrid(prevGrid => {
      const newGrid = [...prevGrid];
      newGrid[i] = [...newGrid[i]];
      
      if (isErasingAction) {
        newGrid[i][j] = new Node(0);
      } else {
        newGrid[i][j] = new Node(255);
      }
      
      const nodeElement = document.getElementById(`node-${i}-${j}`);
      if (nodeElement) {
        if (isErasingAction) {
          nodeElement.className = "w-5 h-5 border border-[#353840] hover:cursor-pointer";
        } else {
          nodeElement.className = "w-5 h-5 border border-[#353840] hover:cursor-pointer bg-[#F7F7F7]";
        }
      }
      
      if (!isErasingAction && emptyGrid) {
        setEmptyGrid(false);
      }
      
      if (isErasingAction) {
        const allEmpty = newGrid.every(row => 
          row.every(node => node.isNodeActive === 0)
        );
        setEmptyGrid(allEmpty);
      }
      
      return newGrid;
    });
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
        const response = await fetch("http://localhost:8000/", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ numbers: numArr }),
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

  const handleHelpButton = () => {
    setHelpButton(!helpButton)
  }

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  return (
    <div className="flex h-screen bg-[#1a1c1f]">
      <div className="flex flex-col items-center w-1/2 h-full p-5 box-border border-r-2 border-dashed border-r-[#353840]">
        <div className="w-full flex flex-col items-center">
          <h1 className="text-3xl text-[#f7f7f7] text-center mb-4">Dibuja un número (0 - 9)</h1>
          <div 
            className="flex flex-col items-center border border-[#353840] p-3 bg-[#222428] rounded"
            onContextMenu={handleContextMenu}
          >
            {grid.map((row, i) => (
              <div key={i} className="flex">
                {row.map((col, j) => (
                  <div
                    key={`${i}-${j}`}
                    className={`w-5 h-5 border border-[#353840] hover:cursor-pointer ${col.isNodeActive === 255 ? 'bg-[#F7F7F7]' : ''}`}
                    id={`node-${i}-${j}`}
                    onMouseDown={(e) => onMouseDownEvent(e, i, j)}
                    onMouseUp={() => onMouseUpEvent()}
                    onMouseEnter={() => onMouseEnterEvent(i, j)}
                  />
                ))}
              </div>
            ))}
          </div>
          <div className="w-full flex justify-center gap-4 pt-4">
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
      <div className="flex flex-col w-1/2 h-full p-10 relative">
        <h2 className="text-3xl text-[#f7f7f7] text-center mb-4">El número dibujado es:</h2>
        <div className="w-full h-100 flex justify-center items-center text-4xl rounded-lg bg-[#222428] border-2 border-[#353840]">
          {isLoading ? (
            <div className="inline-block w-12 h-12 border-4 border-[#f7f7f7] border-t-transparent rounded-full animate-spin" />
          ) : (
            <span className="text-7xl font-bold text-[#f7f7f7]">
              {resultNum !== null ? resultNum : "-"}
            </span>
          )}
        </div>
        
        {/* Botón de ayuda mejorado */}
        <div className="mt-10 flex flex-col items-start">
          <button
            onClick={handleHelpButton}
            className="flex items-center gap-2 bg-gradient-to-r from-[#254362] to-[#3a5f7e] hover:from-[#1e3549] hover:to-[#2d4a63] text-white px-4 py-3 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 border border-[#4a728f] cursor-pointer"
          >
            {helpButton ? (
              <>
                <X size={20} />
                <span>Cerrar Ayuda</span>
              </>
            ) : (
              <>
                <HelpCircle size={20} />
                <span>¿Cómo usar?</span>
              </>
            )}
          </button>
          
          {/* Panel de ayuda mejorado */}
          <div className={`mt-4 bg-[#222428] border border-[#353840] rounded-lg p-6 shadow-xl transition-all duration-300 overflow-hidden ${
            helpButton ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}>
            <h3 className="text-xl font-bold text-[#f7f7f7] mb-4 flex items-center gap-2">
              <HelpCircle size={24} />
              Instrucciones
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <span className="text-blue-400 font-bold">1</span>
                </div>
                <div>
                  <p className="text-[#f7f7f7] font-semibold">Para pintar:</p>
                  <p className="text-gray-400">Haz <span className="text-blue-400 font-bold">clic izquierdo</span> y arrastra sobre los cuadrados</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
                  <span className="text-red-400 font-bold">2</span>
                </div>
                <div>
                  <p className="text-[#f7f7f7] font-semibold">Para borrar:</p>
                  <p className="text-gray-400">Usa <span className="text-red-400 font-bold">clic derecho</span> o mantén <span className="text-red-400 font-bold">Ctrl/Shift</span> mientras haces clic</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                  <span className="text-green-400 font-bold">3</span>
                </div>
                <div>
                  <p className="text-[#f7f7f7] font-semibold">Cuando termines:</p>
                  <p className="text-gray-400">Presiona <span className="text-green-400 font-bold">ENVIAR</span> para que el modelo identifique tu número</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center">
                  <span className="text-yellow-400 font-bold">4</span>
                </div>
                <div>
                  <p className="text-[#f7f7f7] font-semibold">Reiniciar:</p>
                  <p className="text-gray-400">Usa <span className="text-yellow-400 font-bold">LIMPIAR</span> para empezar de nuevo</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-[#353840]">
              <p className="text-sm text-gray-400 italic">
                💡 Tip: Dibuja el número centrado y lo más claro posible para mejores resultados
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-auto pt-6 border-t border-[#353840]">
          <p className="text-gray-400 text-sm">
            Modelo de reconocimiento de dígitos MNIST • 28x28 píxeles
          </p>
        </div>
      </div>
    </div>
  )
}

export default App