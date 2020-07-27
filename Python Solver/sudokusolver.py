SudokuBoard = [
    [7,8,0,4,0,0,1,2,0],
    [6,0,0,0,7,5,0,0,9],
    [0,0,0,6,0,1,0,7,8],
    [0,0,7,0,4,0,2,6,0],
    [0,0,1,0,5,0,9,3,0],
    [9,0,4,0,6,0,0,0,5],
    [0,7,0,3,0,0,0,1,2],
    [1,2,0,0,0,7,4,0,0],
    [0,4,9,2,0,6,0,0,7]
]

def solve_puzzle(board):
	empty_place = find_empty(board)
	if not empty_place:
		return True
	else:
		row, col = empty_place

	for i in range(1, 10):
		if is_valid(board, i, (row, col)):
			board[row][col] = i

			if solve_puzzle(board):
				return True

			board[row][col] = 0

	return False

def is_valid(board, number, position):
	#row validation
	for i in range(len(board[0])):
		if board[position[0]][i] == number and position[1] != i:
			return False

	#column validation
	for i in range(len(board[0])):
		if board[i][position[1]] == number and position[0] != i:
			return False

	#3 by 3 box
	box_number_i = (position[0]//3)*3
	box_number_j = (position[1]//3)*3

	for i in range(box_number_i, box_number_i + 3):
		for j in range(box_number_j, box_number_j + 3):
			if board[i][j] == number and (i,j)!=position:
				return False

	return True

def print_board(board):
	for i in range(len(board)):
		if i % 3 == 0 and i!=0:
			print("-------------------")
		for j in range(len(board[0])):
			if j %3 ==0 and j!=0:
				print("|", end="")
			if j == 8:
				print(board[i][j])
			else:
				print(str(board[i][j]) + " ", end="")

def find_empty(board):
	for i in range(len(board)):
		for j in range(len(board[0])):
			if board[i][j] == 0:
				return(i,j)


print_board(SudokuBoard)
solve_puzzle(SudokuBoard)
print("\n------------------SOLVED------------------\n")
print_board(SudokuBoard)
