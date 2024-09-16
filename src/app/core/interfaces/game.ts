
export interface GamePayload {
  name: string;
  genreId: number;
  price: number;
  releaseDate: null | string;
}

export interface Game {
  id: number;
  name: string;
  genre: string;
  price: number;
  releaseDate: Date;
}