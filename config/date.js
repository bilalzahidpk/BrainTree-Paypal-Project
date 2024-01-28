const convertDateFormat = (inputDate) => {
  // Split the input date into month and year
  const [month, year] = inputDate.split('/');

  // Get the current century (assumed to be 20 for years 2000-2099)
  const currentCentury = 20;

  // Check if the month and year are valid numbers
  if (!isNaN(month) && !isNaN(year)) {
    // Convert month and year to numbers
    const numericMonth = parseInt(month, 10);
    const numericYear = parseInt(year, 10);

    // Check if the month and year are within valid ranges
    if (
      numericMonth >= 1 &&
      numericMonth <= 12 &&
      numericYear >= 0 &&
      numericYear <= 99
    ) {
      // Use the current century and format the result as "YYYY-MM"
      const formattedDate = `${currentCentury}${numericYear
        .toString()
        .padStart(2, '0')}-${numericMonth.toString().padStart(2, '0')}`;
      return formattedDate;
    }
  }

  // Return null if the input date is not in a valid format
  return null;
};

module.exports = {
  convertDateFormat,
};
