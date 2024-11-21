const dayRemaining = (borrowDate: number, daysRegistered: number) => {
  const returnDateObj = new Date(
    borrowDate + daysRegistered * 24 * 60 * 60 * 1000,
  );
  const currentDate = new Date().getTime() / 1000;

  return Math.floor(
    (returnDateObj.getTime() - currentDate) / (24 * 60 * 60 * 1000),
  );
};

export default dayRemaining;
