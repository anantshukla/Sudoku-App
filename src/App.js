import React, { useState, useEffect} from 'react';
import './App.css';
import jsonfile from './puzzle.json';
import vals from './value.json'

function App() {
  const [valueMatrix, setValueMatrix] = useState(Array.from({length: 9},()=> Array.from({length: 9}, () => null)));
  const [editableMatrix, setEditableMatrix] = useState(Array.from({length: 9},()=> Array.from({length: 9}, () => false)));
  const [initialRender, setInitialRender] = useState("0")
  useEffect(() => {
    storeMatrixIntoLocalStorage();
  })

  const storeMatrixIntoLocalStorage = () => {
    //var mat = localStorage.getItem('matrix');

    if(localStorage.getItem('matrix')===null)
    {
      PopulateArrayFromJSON();
      console.log("JSON")
    }
    else
    {
      var arrayFromLocalStorage = JSON.parse(localStorage.getItem('matrix'))
      PopulateArrayFromLocalStorage(arrayFromLocalStorage);
      localStorage.removeItem('matrix')
      console.log("LS")
    }
  }
  const SolveSudokuPuzzle = () => {
    console.log(vals)
    localStorage.setItem("matrix", JSON.stringify(vals));
    window.location.reload(false);
  }

  // eslint-disable-next-line
  const SolveTheSudokuPuzzle = () => {
    let board = valueMatrix;
    valueMatrix.map((row, rowIndex) => (
      row.map((column, columnIndex) => (
        board[rowIndex][columnIndex] = jsonfile.sudokugrid[rowIndex][columnIndex].value
      ))
    ))

    //console.log(board)
    var empty_place = FindEmpty(board)
    if (!empty_place) {
      return true;
    }
    else {
      var row = empty_place[0]
      var col = empty_place[1]
    }
    for(var i = 1; i<10; i++)
    {
      if (isValidPosition(board, i, [row, col]))
      {
        board[row][col] = i
        if (SolveSudokuPuzzle(board))
        {
          return true
        }
        board[row][col] = 0
      }
    }
    return false
  }

  const isValidPosition = (board, number, position) => {
    //row
    for(var i = 0; i<9; i++)
    {
  		if ((board[position[0]][i] === number) && (position[1] !== i))
      {
  			return false
      }
    }

  	//col
    for(i = 0; i<9; i++)
    {
  		if((board[i][position[1]] === number)&&(position[0] !== i))
      {
  			return false
      }
    }
    var j=0;
  	//3 by 3 box
  	var box_number_i = (position[0]/3)*3
  	var box_number_j = (position[1]/3)*3

    for(i = box_number_i; i<box_number_i + 3; i++)
    {
      for(j = box_number_j; j<box_number_j + 3; j++)
      {
  			if((board[i][j] === number) && ((i,j)!==position))
        {
  				return false
        }
      }
    }

  	return true
  }

  const FindEmpty = (board) => {
    for(var i = 0; i < 9; i++)
    {
      for(var j = 0; j < 9; j++)
      {
        if (board[i][j] === null)
          return [i,j]
      }
    }
  }

  const ResetMatrix = () => {
    window.location.reload(false);
  }

  const PopulateArrayFromJSON = () => {
    //console.log("JSON file:", jsonfile.sudokugrid)
    //console.log("State Value Matrix:", valueMatrix)
    //copying the matrix with values into memory
    let copymatrix = valueMatrix;
    valueMatrix.map((row, rowIndex) => (
      row.map((column, columnIndex) => (
        copymatrix[rowIndex][columnIndex] = jsonfile.sudokugrid[rowIndex][columnIndex].value
      ))
    ))

    //copying the matrix with editable or not values into local memory
    let copyEditableMatrix = editableMatrix;
    editableMatrix.map((row, rowIndex) => (
      row.map((column, columnIndex) => (
        copyEditableMatrix[rowIndex][columnIndex] = jsonfile.sudokugrid[rowIndex][columnIndex].editable
      ))
    ))

    //console.log("New Copymatrix", copymatrix)

    setValueMatrix(copymatrix);
    setEditableMatrix(copyEditableMatrix);
    //console.log(copymatrix)
    //igit start
    var ir = initialRender;
    ir = true;
    setInitialRender(ir)
    //igit end
  }

  const PopulateArrayFromLocalStorage = (arrayFromLocalStorage) => {
    console.log("LocalStorageValue", arrayFromLocalStorage)

    let copymatrix = arrayFromLocalStorage;

    setValueMatrix(copymatrix)
    //console.log("VM",valueMatrix)

  }

  const handleChange = (event) => {
    console.log(valueMatrix)
    var val = null;
    if(isNaN(event.target.value)){
      event.target.value = null;
    }
    if (event.target.value.length > 1){
      val = event.target.value[event.target.value.length -1];
      event.target.value = null
      event.target.value = val;
    }
    else {
      val = event.target.value
      val = parseInt(val)
    }

    //console.log("Value: " + event.target.value, "Name: " + event.target.name)
    var rowval = parseInt(event.target.name[0]);
    var colval = parseInt(event.target.name[1]);
    checkRowCondition(event, val, rowval, colval);
  }

  const checkRowCondition = (event, val, rowval, colval) => {
    val = parseInt(val)
    //console.log(rowval, colval);
    var errorstat = false;
    for(var i = 0; i < 9; i++) {
      if(i===rowval)
      {
        ;
      }
      else
      {
        if(valueMatrix[rowval][i] === val) {
          event.target.style.color = 'red';
          errorstat = true;
          break;
        }
        else {
          event.target.style.color = '#B8B8B8';
        }
      }
    }
    if(errorstat === false)
    {
      checkColumnCondition(event, val, rowval, colval);
    }
  }

  const checkColumnCondition = (event, val, rowval, colval) => {
    val = parseInt(val)
    //console.log(rowval, colval);
    var errorstat = false;
    for(var i = 0; i < 9; i++) {
      if(i===rowval) {
        //console.log("ignore")
      }
      else
      {
        if(valueMatrix[i][colval] === val) {
            event.target.style.color = 'red';
            errorstat = true;
            break;
        }
        else {
          event.target.style.color = '#B8B8B8';
        }
      }
    }
    if(errorstat === false)
    {
      checkBoxCondition(event, val, rowval, colval);
    }
  }

  const checkBoxCondition = (event, val, rowval, colval) => {
    var errorstat = false;
    val = parseInt(val)
    rowval = parseInt(rowval)
    colval = parseInt(colval)
    var rowbox = (Math.floor(rowval / 3))*3
    var colbox = (Math.floor(colval / 3))*3
    for(var i = rowbox; i < (rowbox+3); i++)
    {
      for(var j = colbox; j< (colbox+3); j++)
      {
        if(valueMatrix[i][j] === val) {
          //console.log(i, j)
          if((i===rowval)&&(j===colval))
          {
            //console.log("ignore")
          }
          else
          {
            event.target.style.color = 'red';
            errorstat = true;
            break;
          }
        }
        else {
          //console.log("ELSE", i, j)
          event.target.style.color = '#B8B8B8';
        }
      }
      if(errorstat===true)
      {
        break;
      }
      else {
        if(Number.isInteger(val))
        {
          let copyUpdatedMatrix = valueMatrix;
          copyUpdatedMatrix[rowval][colval] = val;
          setValueMatrix(copyUpdatedMatrix);
          //console.log("Updated?", rowval, colval, val)
        }
        else
        {
          let copyUpdatedMatrix = valueMatrix;
          copyUpdatedMatrix[rowval][colval] = null;
          setValueMatrix(copyUpdatedMatrix);
          //console.log("Empty?")
        }
      }
    }
  }


  return (
    <div className="App">
    <div className="AppHeading">
      Sudoku Solver
    </div>
      <div className="Outergrid">
        <div className="FirstBoxRow">
          <div className="NineDigitBox">
            <div className="FirstRowInaBox">
              <div className="IndividualCell">
              {
                valueMatrix[0][0]==null
                ?<input autoComplete="off" name="00" className="IndividualInputCell" onChange={handleChange}></input>
                :<input autoComplete="off" className="IndividualInputCell" onChange={handleChange} readOnly="readonly" defaultValue={valueMatrix[0][0]}></input>
              }
              </div>
              <div className="IndividualCell">
              {
                valueMatrix[0][1]==null
                ?<input autoComplete="off" name="01" className="IndividualInputCell" onChange={handleChange}></input>
                :<input autoComplete="off" className="IndividualInputCell" onChange={handleChange} readOnly="readonly" defaultValue={valueMatrix[0][1]}></input>
              }
              </div>
              <div className="IndividualCell">
              {
                valueMatrix[0][2]==null
                ?<input autoComplete="off" name="02" className="IndividualInputCell" onChange={handleChange}></input>
                :<input autoComplete="off" className="IndividualInputCell" onChange={handleChange} readOnly="readonly" defaultValue={valueMatrix[0][2]}></input>
              }
              </div>
            </div>
            <div className="SecondRowInaBox">
              <div className="IndividualCell">
              {
                valueMatrix[1][0]==null
                ?<input autoComplete="off" name="10" className="IndividualInputCell" onChange={handleChange}></input>
                :<input autoComplete="off" className="IndividualInputCell" onChange={handleChange} readOnly="readonly" defaultValue={valueMatrix[1][0]}></input>
              }
              </div>
              <div className="IndividualCell">
              {
                valueMatrix[1][1]==null
                ?<input autoComplete="off" name="11" className="IndividualInputCell" onChange={handleChange}></input>
                :<input autoComplete="off" className="IndividualInputCell" onChange={handleChange} readOnly="readonly" defaultValue={valueMatrix[1][1]}></input>
              }
              </div>
              <div className="IndividualCell">
              {
                valueMatrix[1][2]==null
                ?<input autoComplete="off" name="12" className="IndividualInputCell" onChange={handleChange}></input>
                :<input autoComplete="off" className="IndividualInputCell" onChange={handleChange} readOnly="readonly" defaultValue={valueMatrix[1][2]}></input>
              }
              </div>
            </div>
            <div className="ThirdRowInaBox">
              <div className="IndividualCell">
              {
                valueMatrix[2][0]==null
                ?<input autoComplete="off" name="20" className="IndividualInputCell" onChange={handleChange}></input>
                :<input autoComplete="off" className="IndividualInputCell" onChange={handleChange} readOnly="readonly" defaultValue={valueMatrix[2][0]}></input>
              }
              </div>
              <div className="IndividualCell">
              {
                valueMatrix[2][1]==null
                ?<input autoComplete="off" name="21" className="IndividualInputCell" onChange={handleChange}></input>
                :<input autoComplete="off" className="IndividualInputCell" onChange={handleChange} readOnly="readonly" defaultValue={valueMatrix[2][1]}></input>
              }
              </div>
              <div className="IndividualCell">
              {
                valueMatrix[2][2]==null
                ?<input autoComplete="off" name="22" className="IndividualInputCell" onChange={handleChange}></input>
                :<input autoComplete="off" className="IndividualInputCell" onChange={handleChange} readOnly="readonly" defaultValue={valueMatrix[2][2]}></input>
              }
              </div>
            </div>
          </div>

          <div className="NineDigitBox">
            <div className="FirstRowInaBox">
              <div className="IndividualCell">
              {
                valueMatrix[0][3]==null
                ?<input autoComplete="off" name="03" className="IndividualInputCell" onChange={handleChange}></input>
                :<input autoComplete="off" className="IndividualInputCell" onChange={handleChange} readOnly="readonly" defaultValue={valueMatrix[0][3]}></input>
              }
              </div>
              <div className="IndividualCell">
              {
                valueMatrix[0][4]==null
                ?<input autoComplete="off" name="04" className="IndividualInputCell" onChange={handleChange}></input>
                :<input autoComplete="off" className="IndividualInputCell" onChange={handleChange} readOnly="readonly" defaultValue={valueMatrix[0][4]}></input>
              }
              </div>
              <div className="IndividualCell">
              {
                valueMatrix[0][5]==null
                ?<input autoComplete="off" name="05" className="IndividualInputCell" onChange={handleChange}></input>
                :<input autoComplete="off" className="IndividualInputCell" onChange={handleChange} readOnly="readonly" defaultValue={valueMatrix[0][5]}></input>
              }
              </div>
            </div>
            <div className="SecondRowInaBox">
              <div className="IndividualCell">
              {
                valueMatrix[1][3]==null
                ?<input autoComplete="off" name="13" className="IndividualInputCell" onChange={handleChange}></input>
                :<input autoComplete="off" className="IndividualInputCell" onChange={handleChange} readOnly="readonly" defaultValue={valueMatrix[1][3]}></input>
              }
              </div>
              <div className="IndividualCell">
              {
                valueMatrix[1][4]==null
                ?<input autoComplete="off" name="14" className="IndividualInputCell" onChange={handleChange}></input>
                :<input autoComplete="off" className="IndividualInputCell" onChange={handleChange} readOnly="readonly" defaultValue={valueMatrix[1][4]}></input>
              }
              </div>
              <div className="IndividualCell">
              {
                valueMatrix[1][5]==null
                ?<input autoComplete="off" name="15" className="IndividualInputCell" onChange={handleChange}></input>
                :<input autoComplete="off" className="IndividualInputCell" onChange={handleChange} readOnly="readonly" defaultValue={valueMatrix[1][5]}></input>
              }
              </div>
            </div>
            <div className="ThirdRowInaBox">
              <div className="IndividualCell">
              {
                valueMatrix[2][3]==null
                ?<input autoComplete="off" name="23" className="IndividualInputCell" onChange={handleChange}></input>
                :<input autoComplete="off" className="IndividualInputCell" onChange={handleChange} readOnly="readonly" defaultValue={valueMatrix[2][3]}></input>
              }
              </div>
              <div className="IndividualCell">
              {
                valueMatrix[2][4]==null
                ?<input autoComplete="off" name="24" className="IndividualInputCell" onChange={handleChange}></input>
                :<input autoComplete="off" className="IndividualInputCell" onChange={handleChange} readOnly="readonly" defaultValue={valueMatrix[2][4]}></input>
              }
              </div>
              <div className="IndividualCell">
              {
                valueMatrix[2][5]==null
                ?<input autoComplete="off" name="25" className="IndividualInputCell" onChange={handleChange}></input>
                :<input autoComplete="off" className="IndividualInputCell" onChange={handleChange} readOnly="readonly" defaultValue={valueMatrix[2][5]}></input>
              }
              </div>
            </div>
          </div>

          <div className="NineDigitBox">
            <div className="FirstRowInaBox">
              <div className="IndividualCell">
              {
                valueMatrix[0][6]==null
                ?<input autoComplete="off" name="06" className="IndividualInputCell" onChange={handleChange}></input>
                :<input autoComplete="off" className="IndividualInputCell" onChange={handleChange} readOnly="readonly" defaultValue={valueMatrix[0][6]}></input>
              }
              </div>
              <div className="IndividualCell">
              {
                valueMatrix[0][7]==null
                ?<input autoComplete="off" name="07" className="IndividualInputCell" onChange={handleChange}></input>
                :<input autoComplete="off" className="IndividualInputCell" onChange={handleChange} readOnly="readonly" defaultValue={valueMatrix[0][7]}></input>
              }
              </div>
              <div className="IndividualCell">
              {
                valueMatrix[0][8]==null
                ?<input autoComplete="off" name="08" className="IndividualInputCell" onChange={handleChange}></input>
                :<input autoComplete="off" className="IndividualInputCell" onChange={handleChange} readOnly="readonly" defaultValue={valueMatrix[0][8]}></input>
              }
              </div>
            </div>
            <div className="SecondRowInaBox">
              <div className="IndividualCell">
              {
                valueMatrix[1][6]==null
                ?<input autoComplete="off" name="16" className="IndividualInputCell" onChange={handleChange}></input>
                :<input autoComplete="off" className="IndividualInputCell" onChange={handleChange} readOnly="readonly" defaultValue={valueMatrix[1][6]}></input>
              }
              </div>
              <div className="IndividualCell">
              {
                valueMatrix[1][7]==null
                ?<input autoComplete="off" name="17" className="IndividualInputCell" onChange={handleChange}></input>
                :<input autoComplete="off" className="IndividualInputCell" onChange={handleChange} readOnly="readonly" defaultValue={valueMatrix[1][7]}></input>
              }
              </div>
              <div className="IndividualCell">
              {
                valueMatrix[1][8]==null
                ?<input autoComplete="off" name="18" className="IndividualInputCell" onChange={handleChange}></input>
                :<input autoComplete="off" className="IndividualInputCell" onChange={handleChange} readOnly="readonly" defaultValue={valueMatrix[1][8]}></input>
              }
              </div>
            </div>
            <div className="ThirdRowInaBox">
              <div className="IndividualCell">
              {
                valueMatrix[2][6]==null
                ?<input autoComplete="off" name="26" className="IndividualInputCell" onChange={handleChange}></input>
                :<input autoComplete="off" className="IndividualInputCell" onChange={handleChange} readOnly="readonly" defaultValue={valueMatrix[2][6]}></input>
              }
              </div>
              <div className="IndividualCell">
              {
                valueMatrix[2][7]==null
                ?<input autoComplete="off" name="27" className="IndividualInputCell" onChange={handleChange}></input>
                :<input autoComplete="off" className="IndividualInputCell" onChange={handleChange} readOnly="readonly" defaultValue={valueMatrix[2][7]}></input>
              }
              </div>
              <div className="IndividualCell">
              {
                valueMatrix[2][8]==null
                ?<input autoComplete="off" name="28" className="IndividualInputCell" onChange={handleChange}></input>
                :<input autoComplete="off" className="IndividualInputCell" onChange={handleChange} readOnly="readonly" defaultValue={valueMatrix[2][8]}></input>
              }
              </div>
            </div>
          </div>
        </div>

        <div className="SecondBoxRow">
          <div className="NineDigitBox">
            <div className="FirstRowInaBox">
              <div className="IndividualCell">
              {
                valueMatrix[3][0]==null
                ?<input autoComplete="off" name="30" className="IndividualInputCell" onChange={handleChange}></input>
                :<input autoComplete="off" className="IndividualInputCell" onChange={handleChange} readOnly="readonly" defaultValue={valueMatrix[3][0]}></input>
              }
              </div>
              <div className="IndividualCell">
              {
                valueMatrix[3][1]==null
                ?<input autoComplete="off" name="31" className="IndividualInputCell" onChange={handleChange}></input>
                :<input autoComplete="off" className="IndividualInputCell" onChange={handleChange} readOnly="readonly" defaultValue={valueMatrix[3][1]}></input>
              }
              </div>
              <div className="IndividualCell">
              {
                valueMatrix[3][2]==null
                ?<input autoComplete="off" name="32" className="IndividualInputCell" onChange={handleChange}></input>
                :<input autoComplete="off" className="IndividualInputCell" onChange={handleChange} readOnly="readonly" defaultValue={valueMatrix[3][2]}></input>
              }
              </div>
            </div>
            <div className="SecondRowInaBox">
              <div className="IndividualCell">
              {
                valueMatrix[4][0]==null
                ?<input autoComplete="off" name="33" className="IndividualInputCell" onChange={handleChange}></input>
                :<input autoComplete="off" className="IndividualInputCell" onChange={handleChange} readOnly="readonly" defaultValue={valueMatrix[4][0]}></input>
              }
              </div>
              <div className="IndividualCell">
              {
                valueMatrix[4][1]==null
                ?<input autoComplete="off" name="41" className="IndividualInputCell" onChange={handleChange}></input>
                :<input autoComplete="off" className="IndividualInputCell" onChange={handleChange} readOnly="readonly" defaultValue={valueMatrix[4][1]}></input>
              }
              </div>
              <div className="IndividualCell">
              {
                valueMatrix[4][2]==null
                ?<input autoComplete="off" name="42" className="IndividualInputCell" onChange={handleChange}></input>
                :<input autoComplete="off" className="IndividualInputCell" onChange={handleChange} readOnly="readonly" defaultValue={valueMatrix[4][2]}></input>
              }
              </div>
            </div>
            <div className="ThirdRowInaBox">
              <div className="IndividualCell">
              {
                valueMatrix[5][0]==null
                ?<input autoComplete="off" name="50" className="IndividualInputCell" onChange={handleChange}></input>
                :<input autoComplete="off" className="IndividualInputCell" onChange={handleChange} readOnly="readonly" defaultValue={valueMatrix[5][0]}></input>
              }
              </div>
              <div className="IndividualCell">
              {
                valueMatrix[5][1]==null
                ?<input autoComplete="off" name="51" className="IndividualInputCell" onChange={handleChange}></input>
                :<input autoComplete="off" className="IndividualInputCell" onChange={handleChange} readOnly="readonly" defaultValue={valueMatrix[5][1]}></input>
              }
              </div>
              <div className="IndividualCell">
              {
                valueMatrix[5][2]==null
                ?<input autoComplete="off" name="52" className="IndividualInputCell" onChange={handleChange}></input>
                :<input autoComplete="off" className="IndividualInputCell" onChange={handleChange} readOnly="readonly" defaultValue={valueMatrix[5][2]}></input>
              }
              </div>
            </div>
          </div>

          <div className="NineDigitBox">
            <div className="FirstRowInaBox">
              <div className="IndividualCell">
              {
                valueMatrix[3][3]==null
                ?<input autoComplete="off" name="33" className="IndividualInputCell" onChange={handleChange}></input>
                :<input autoComplete="off" className="IndividualInputCell" onChange={handleChange} readOnly="readonly" defaultValue={valueMatrix[3][3]}></input>
              }
              </div>
              <div className="IndividualCell">
              {
                valueMatrix[3][4]==null
                ?<input autoComplete="off" name="34" className="IndividualInputCell" onChange={handleChange}></input>
                :<input autoComplete="off" className="IndividualInputCell" onChange={handleChange} readOnly="readonly" defaultValue={valueMatrix[3][4]}></input>
              }
              </div>
              <div className="IndividualCell">
              {
                valueMatrix[3][5]==null
                ?<input autoComplete="off" name="35" className="IndividualInputCell" onChange={handleChange}></input>
                :<input autoComplete="off" className="IndividualInputCell" onChange={handleChange} readOnly="readonly" defaultValue={valueMatrix[3][5]}></input>
              }
              </div>
            </div>
            <div className="SecondRowInaBox">
              <div className="IndividualCell">
              {
                valueMatrix[4][3]==null
                ?<input autoComplete="off" name="43" className="IndividualInputCell" onChange={handleChange}></input>
                :<input autoComplete="off" className="IndividualInputCell" onChange={handleChange} readOnly="readonly" defaultValue={valueMatrix[4][3]}></input>
              }
              </div>
              <div className="IndividualCell">
              {
                valueMatrix[4][4]==null
                ?<input autoComplete="off" name="44" className="IndividualInputCell" onChange={handleChange}></input>
                :<input autoComplete="off" className="IndividualInputCell" onChange={handleChange} readOnly="readonly" defaultValue={valueMatrix[4][4]}></input>
              }
              </div>
              <div className="IndividualCell">
              {
                valueMatrix[4][5]==null
                ?<input autoComplete="off" name="45" className="IndividualInputCell" onChange={handleChange}></input>
                :<input autoComplete="off" className="IndividualInputCell" onChange={handleChange} readOnly="readonly" defaultValue={valueMatrix[4][5]}></input>
              }
              </div>
            </div>
            <div className="ThirdRowInaBox">
              <div className="IndividualCell">
              {
                valueMatrix[5][3]==null
                ?<input autoComplete="off" name="53" className="IndividualInputCell" onChange={handleChange}></input>
                :<input autoComplete="off" className="IndividualInputCell" onChange={handleChange} readOnly="readonly" defaultValue={valueMatrix[5][3]}></input>
              }
              </div>
              <div className="IndividualCell">
              {
                valueMatrix[5][4]==null
                ?<input autoComplete="off" name="54" className="IndividualInputCell" onChange={handleChange}></input>
                :<input autoComplete="off" className="IndividualInputCell" onChange={handleChange} readOnly="readonly" defaultValue={valueMatrix[5][4]}></input>
              }
              </div>
              <div className="IndividualCell">
              {
                valueMatrix[5][5]==null
                ?<input autoComplete="off" name="55" className="IndividualInputCell" onChange={handleChange}></input>
                :<input autoComplete="off" className="IndividualInputCell" onChange={handleChange} readOnly="readonly" defaultValue={valueMatrix[5][5]}></input>
              }
              </div>
            </div>
          </div>

          <div className="NineDigitBox">
            <div className="FirstRowInaBox">
              <div className="IndividualCell">
              {
                valueMatrix[3][6]==null
                ?<input autoComplete="off" name="36" className="IndividualInputCell" onChange={handleChange}></input>
                :<input autoComplete="off" className="IndividualInputCell" onChange={handleChange} readOnly="readonly" defaultValue={valueMatrix[3][6]}></input>
              }
              </div>
              <div className="IndividualCell">
              {
                valueMatrix[3][7]==null
                ?<input autoComplete="off" name="37" className="IndividualInputCell" onChange={handleChange}></input>
                :<input autoComplete="off" className="IndividualInputCell" onChange={handleChange} readOnly="readonly" defaultValue={valueMatrix[3][7]}></input>
              }
              </div>
              <div className="IndividualCell">
              {
                valueMatrix[3][8]==null
                ?<input autoComplete="off" name="38" className="IndividualInputCell" onChange={handleChange}></input>
                :<input autoComplete="off" className="IndividualInputCell" onChange={handleChange} readOnly="readonly" defaultValue={valueMatrix[3][8]}></input>
              }
              </div>
            </div>
            <div className="SecondRowInaBox">
              <div className="IndividualCell">
              {
                valueMatrix[4][6]==null
                ?<input autoComplete="off" name="46" className="IndividualInputCell" onChange={handleChange}></input>
                :<input autoComplete="off" className="IndividualInputCell" onChange={handleChange} readOnly="readonly" defaultValue={valueMatrix[4][6]}></input>
              }
              </div>
              <div className="IndividualCell">
              {
                valueMatrix[4][7]==null
                ?<input autoComplete="off" name="47" className="IndividualInputCell" onChange={handleChange}></input>
                :<input autoComplete="off" className="IndividualInputCell" onChange={handleChange} readOnly="readonly" defaultValue={valueMatrix[4][7]}></input>
              }
              </div>
              <div className="IndividualCell">
              {
                valueMatrix[4][8]==null
                ?<input autoComplete="off" name="48" className="IndividualInputCell" onChange={handleChange}></input>
                :<input autoComplete="off" className="IndividualInputCell" onChange={handleChange} readOnly="readonly" defaultValue={valueMatrix[4][8]}></input>
              }
              </div>
            </div>
            <div className="ThirdRowInaBox">
              <div className="IndividualCell">
              {
                valueMatrix[5][6]==null
                ?<input autoComplete="off" name="56" className="IndividualInputCell" onChange={handleChange}></input>
                :<input autoComplete="off" className="IndividualInputCell" onChange={handleChange} readOnly="readonly" defaultValue={valueMatrix[5][6]}></input>
              }
              </div>
              <div className="IndividualCell">
              {
                valueMatrix[5][7]==null
                ?<input autoComplete="off" name="57" className="IndividualInputCell" onChange={handleChange}></input>
                :<input autoComplete="off" className="IndividualInputCell" onChange={handleChange} readOnly="readonly" defaultValue={valueMatrix[5][7]}></input>
              }
              </div>
              <div className="IndividualCell">
              {
                valueMatrix[5][8]==null
                ?<input autoComplete="off" name="58" className="IndividualInputCell" onChange={handleChange}></input>
                :<input autoComplete="off" className="IndividualInputCell" onChange={handleChange} readOnly="readonly" defaultValue={valueMatrix[5][8]}></input>
              }
              </div>
            </div>
          </div>
        </div>

        <div className="ThirdBoxRow">
          <div className="NineDigitBox">
            <div className="FirstRowInaBox">
              <div className="IndividualCell">
              {
                valueMatrix[6][0]==null
                ?<input autoComplete="off" name="60" className="IndividualInputCell" onChange={handleChange}></input>
                :<input autoComplete="off" className="IndividualInputCell" onChange={handleChange} readOnly="readonly" defaultValue={valueMatrix[6][0]}></input>
              }
              </div>
              <div className="IndividualCell">
              {
                valueMatrix[6][1]==null
                ?<input autoComplete="off" name="61" className="IndividualInputCell" onChange={handleChange}></input>
                :<input autoComplete="off" className="IndividualInputCell" onChange={handleChange} readOnly="readonly" defaultValue={valueMatrix[6][1]}></input>
              }
              </div>
              <div className="IndividualCell">
              {
                valueMatrix[6][2]==null
                ?<input autoComplete="off" name="62" className="IndividualInputCell" onChange={handleChange}></input>
                :<input autoComplete="off" className="IndividualInputCell" onChange={handleChange} readOnly="readonly" defaultValue={valueMatrix[6][2]}></input>
              }
              </div>
            </div>
            <div className="SecondRowInaBox">
              <div className="IndividualCell">
              {
                valueMatrix[7][0]==null
                ?<input autoComplete="off" name="70" className="IndividualInputCell" onChange={handleChange}></input>
                :<input autoComplete="off" className="IndividualInputCell" onChange={handleChange} readOnly="readonly" defaultValue={valueMatrix[7][0]}></input>
              }
              </div>
              <div className="IndividualCell">
              {
                valueMatrix[7][1]==null
                ?<input autoComplete="off" name="71" className="IndividualInputCell" onChange={handleChange}></input>
                :<input autoComplete="off" className="IndividualInputCell" onChange={handleChange} readOnly="readonly" defaultValue={valueMatrix[7][1]}></input>
              }
              </div>
              <div className="IndividualCell">
              {
                valueMatrix[7][2]==null
                ?<input autoComplete="off" name="72" className="IndividualInputCell" onChange={handleChange}></input>
                :<input autoComplete="off" className="IndividualInputCell" onChange={handleChange} readOnly="readonly" defaultValue={valueMatrix[7][2]}></input>
              }
              </div>
            </div>
            <div className="ThirdRowInaBox">
              <div className="IndividualCell">
              {
                valueMatrix[8][0]==null
                ?<input autoComplete="off" name="80" className="IndividualInputCell" onChange={handleChange}></input>
                :<input autoComplete="off" className="IndividualInputCell" onChange={handleChange} readOnly="readonly" defaultValue={valueMatrix[8][0]}></input>
              }
              </div>
              <div className="IndividualCell">
              {
                valueMatrix[8][1]==null
                ?<input autoComplete="off" name="81" className="IndividualInputCell" onChange={handleChange}></input>
                :<input autoComplete="off" className="IndividualInputCell" onChange={handleChange} readOnly="readonly" defaultValue={valueMatrix[8][1]}></input>
              }
              </div>
              <div className="IndividualCell">
              {
                valueMatrix[8][2]==null
                ?<input autoComplete="off" name="82" className="IndividualInputCell" onChange={handleChange}></input>
                :<input autoComplete="off" className="IndividualInputCell" onChange={handleChange} readOnly="readonly" defaultValue={valueMatrix[8][2]}></input>
              }
              </div>
            </div>
          </div>

          <div className="NineDigitBox">
            <div className="FirstRowInaBox">
              <div className="IndividualCell">
              {
                valueMatrix[6][3]==null
                ?<input autoComplete="off" name="63" className="IndividualInputCell" onChange={handleChange}></input>
                :<input autoComplete="off" className="IndividualInputCell" onChange={handleChange} readOnly="readonly" defaultValue={valueMatrix[6][3]}></input>
              }
              </div>
              <div className="IndividualCell">
              {
                valueMatrix[6][4]==null
                ?<input autoComplete="off" name="64" className="IndividualInputCell" onChange={handleChange}></input>
                :<input autoComplete="off" className="IndividualInputCell" onChange={handleChange} readOnly="readonly" defaultValue={valueMatrix[6][4]}></input>
              }
              </div>
              <div className="IndividualCell">
              {
                valueMatrix[6][5]==null
                ?<input autoComplete="off" name="65" className="IndividualInputCell" onChange={handleChange}></input>
                :<input autoComplete="off" className="IndividualInputCell" onChange={handleChange} readOnly="readonly" defaultValue={valueMatrix[6][5]}></input>
              }
              </div>
            </div>
            <div className="SecondRowInaBox">
              <div className="IndividualCell">
              {
                valueMatrix[7][3]==null
                ?<input autoComplete="off" name="73" className="IndividualInputCell" onChange={handleChange}></input>
                :<input autoComplete="off" className="IndividualInputCell" onChange={handleChange} readOnly="readonly" defaultValue={valueMatrix[7][3]}></input>
              }
              </div>
              <div className="IndividualCell">
              {
                valueMatrix[7][4]==null
                ?<input autoComplete="off" name="74" className="IndividualInputCell" onChange={handleChange}></input>
                :<input autoComplete="off" className="IndividualInputCell" onChange={handleChange} readOnly="readonly" defaultValue={valueMatrix[7][4]}></input>
              }
              </div>
              <div className="IndividualCell">
              {
                valueMatrix[7][5]==null
                ?<input autoComplete="off" name="75" className="IndividualInputCell" onChange={handleChange}></input>
                :<input autoComplete="off" className="IndividualInputCell" onChange={handleChange} readOnly="readonly" defaultValue={valueMatrix[7][5]}></input>
              }
              </div>
            </div>
            <div className="ThirdRowInaBox">
              <div className="IndividualCell">
              {
                valueMatrix[8][3]==null
                ?<input autoComplete="off" name="83" className="IndividualInputCell" onChange={handleChange}></input>
                :<input autoComplete="off" className="IndividualInputCell" onChange={handleChange} readOnly="readonly" defaultValue={valueMatrix[8][3]}></input>
              }
              </div>
              <div className="IndividualCell">
              {
                valueMatrix[8][4]==null
                ?<input autoComplete="off" name="84" className="IndividualInputCell" onChange={handleChange}></input>
                :<input autoComplete="off" className="IndividualInputCell" onChange={handleChange} readOnly="readonly" defaultValue={valueMatrix[8][4]}></input>
              }
              </div>
              <div className="IndividualCell">
              {
                valueMatrix[8][5]==null
                ?<input autoComplete="off" name="85" className="IndividualInputCell" onChange={handleChange}></input>
                :<input autoComplete="off" className="IndividualInputCell" onChange={handleChange} readOnly="readonly" defaultValue={valueMatrix[8][5]}></input>
              }
              </div>
            </div>
          </div>

          <div className="NineDigitBox">
            <div className="FirstRowInaBox">
              <div className="IndividualCell">
              {
                valueMatrix[6][6]==null
                ?<input autoComplete="off" name="66" className="IndividualInputCell" onChange={handleChange}></input>
                :<input autoComplete="off" className="IndividualInputCell" onChange={handleChange} readOnly="readonly" defaultValue={valueMatrix[6][6]}></input>
              }
              </div>
              <div className="IndividualCell">
              {
                valueMatrix[6][7]==null
                ?<input autoComplete="off" name="67" className="IndividualInputCell" onChange={handleChange}></input>
                :<input autoComplete="off" className="IndividualInputCell" onChange={handleChange} readOnly="readonly" defaultValue={valueMatrix[6][7]}></input>
              }
              </div>
              <div className="IndividualCell">
              {
                valueMatrix[6][8]==null
                ?<input autoComplete="off" name="68" className="IndividualInputCell" onChange={handleChange}></input>
                :<input autoComplete="off" className="IndividualInputCell" onChange={handleChange} readOnly="readonly" defaultValue={valueMatrix[6][8]}></input>
              }
              </div>
            </div>
            <div className="SecondRowInaBox">
              <div className="IndividualCell">
              {
                valueMatrix[7][6]==null
                ?<input autoComplete="off" name="76" className="IndividualInputCell" onChange={handleChange}></input>
                :<input autoComplete="off" className="IndividualInputCell" onChange={handleChange} readOnly="readonly" defaultValue={valueMatrix[7][6]}></input>
              }
              </div>
              <div className="IndividualCell">
              {
                valueMatrix[7][7]==null
                ?<input autoComplete="off" name="77" className="IndividualInputCell" onChange={handleChange}></input>
                :<input autoComplete="off" className="IndividualInputCell" onChange={handleChange} readOnly="readonly" defaultValue={valueMatrix[7][7]}></input>
              }
              </div>
              <div className="IndividualCell">
              {
                valueMatrix[7][8]==null
                ?<input autoComplete="off" name="78" className="IndividualInputCell" onChange={handleChange}></input>
                :<input autoComplete="off" className="IndividualInputCell" onChange={handleChange} readOnly="readonly" defaultValue={valueMatrix[7][8]}></input>
              }
              </div>
            </div>
            <div className="ThirdRowInaBox">
              <div className="IndividualCell">
              {
                valueMatrix[8][6]==null
                ?<input autoComplete="off" name="86" className="IndividualInputCell" onChange={handleChange}></input>
                :<input autoComplete="off" className="IndividualInputCell" onChange={handleChange} readOnly="readonly" defaultValue={valueMatrix[8][6]}></input>
              }
              </div>
              <div className="IndividualCell">
              {
                valueMatrix[8][7]==null
                ?<input autoComplete="off" name="87" className="IndividualInputCell" onChange={handleChange}></input>
                :<input autoComplete="off" className="IndividualInputCell" onChange={handleChange} readOnly="readonly" defaultValue={valueMatrix[8][7]}></input>
              }
              </div>
              <div className="IndividualCell">
              {
                valueMatrix[8][8]==null
                ?<input autoComplete="off" name="88" className="IndividualInputCell" onChange={handleChange}></input>
                :<input autoComplete="off" className="IndividualInputCell" onChange={handleChange} readOnly="readonly" defaultValue={valueMatrix[8][8]}></input>
              }
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="BottomButtons">
        <button className="button button1" onClick = {() => SolveSudokuPuzzle()}>Solve Board</button>
        <button className="button button2" onClick = {() => ResetMatrix()}>Reset Board</button>
      </div>
      <div className="BottomtText1">
        For Python Solver, <a href="https://github.com/anantshukla/Sudoku-App/Python-Solver/sudokusolver.py">Please click here</a>
      </div>
      <div className="BottomtText2">
        I'll add more Sudoku Puzzles to this as soon I get time :3
      </div>
    </div>
  );
}

export default App;
