export type Genre = {
  id: number;
  name: string;
  emoji: string;
};

export const genreLabel = ({ emoji, name }: Genre) => `${emoji} ${name}`;
