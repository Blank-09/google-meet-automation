export function validateDayOrder(input: string) {
  // parse the input as a number
  var num = parseInt(input);

  if (isNaN(num)) {
    return "Day order must be a number";
  }

  if (num >= 1 && num <= 5) {
    return true;
  }

  return "Day order must be between 1 and 5";
}
