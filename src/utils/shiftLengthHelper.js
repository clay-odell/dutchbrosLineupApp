export const shiftLengthBreakCalculator = (startTime, endTime) => {
    const parseTime = (time) => {
      const [timePart, modifier] = time.split(" ");
      let [hours, minutes] = timePart.split(":").map(Number);
  
      if (modifier === "PM" && hours !== 12) hours += 12;
      if (modifier === "AM" && hours === 12) hours = 0;
  
      return hours * 60 + minutes; // Convert to total minutes since midnight
    };
  
    const formatTime = (totalMinutes) => {
      const hours = Math.floor(totalMinutes / 60) % 24;
      const minutes = totalMinutes % 60;
      const modifier = hours >= 12 ? "PM" : "AM";
      const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
      const formattedMinutes = minutes.toString().padStart(2, "0");
      return `${formattedHours}:${formattedMinutes} ${modifier}`;
    };
  
    const startMinutes = parseTime(startTime);
    const endMinutes = parseTime(endTime);
  
    const shiftLengthMinutes = endMinutes - startMinutes;
    const breakStartMinutes = startMinutes + shiftLengthMinutes / 2;
    const breakStartTime = formatTime(breakStartMinutes);
  
    return {
      shiftLength: shiftLengthMinutes / 60, // Return shift length in hours
      breakStartTime,
    };
  };
  export const shiftLengthHelper = (startTime, endTime) => {
    const parseTime = (time) => {
      const [timePart, modifier] = time.split(" ");
      let [hours, minutes] = timePart.split(":").map(Number);
  
      if (modifier === "PM" && hours !== 12) hours += 12;
      if (modifier === "AM" && hours === 12) hours = 0;
  
      return hours * 60 + minutes; // Convert to total minutes
    };
  
    const startMinutes = parseTime(startTime);
    const endMinutes = parseTime(endTime);
  
    const shiftLengthMinutes = endMinutes - startMinutes;
    return shiftLengthMinutes / 60; // Shift length in hours
  };
  