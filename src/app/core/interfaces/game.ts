
export interface GamePayload {
  name: string;
  genreId?: number;
  genre?: string;
  price: number;
  releaseDate: null | string;
}

export interface Game {
  id: number;
  name: string;
  genreId: number;
  genre: string;
  price: number;
  releaseDate: Date;
}