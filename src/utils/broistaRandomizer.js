export const broistaRandomizer = (broistaArr) => {
  const randomIndex = Math.floor(Math.random() * broistaArr.length);
  return broistaArr[randomIndex];
};

export const assignBroistasToPositons = (broistaArr, positionsArr) => {
  const shuffledBroistas = [...broistaArr].sort(() => Math.random() - 0.5);

  const assignments = positionsArr.map((position, idx) => ({
    position: position,
    broista: shuffledBroistas[idx % shuffledBroistas.length],
  }));
  return assignments;
};
