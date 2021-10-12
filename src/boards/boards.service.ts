import { Injectable } from '@nestjs/common';
import { Board, BoardStatus } from './board.model';
import { v4 as uuid } from 'uuid';
import { CreateBoardDto } from './dto/create-board.dto';

@Injectable()
export class BoardsService {
  private boards: Board[] = [];

  // GET ALL Boards
  getAllBoards(): Board[] {
    return this.boards;
  }

  // Create a Board
  createBoard({ title, description }: CreateBoardDto): Board {
    const board: Board = {
      id: uuid(),
      title,
      description,
      status: BoardStatus.PUBLIC,
    };
    this.boards.push(board);
    return board;
  }

  // GET a Board by ID
  getBoardById(id: string): Board {
    return this.boards.find((board) => board.id === id);
  }

  // Delete a Board by ID
  deleteBoard(id: string) {
    this.boards = this.boards.filter((board) => board.id !== id);
  }

  // Update a Board by ID
  updaeteBoardStatus(id: string, status: BoardStatus): Board {
    const board = this.getBoardById(id);
    board.status = status;
    return board;
  }
}
