import { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { broistasData, shiftTypeLineupHours, positions } from "./DataForDutch";
import { assignBroistasToPositons } from "./utils/broistaRandomizer";
import LineupTable from "./LineupTable";

const LineupRandomizer = ({ shop, shiftType, handleSelectChange }) => {
  const [dynamicBroistas, setDynamicBroistas] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [finalizedAssignments, setFinalizedAssignments] = useState([]); 
  const [addedBroistas, setAddedBroistas] = useState([]);
  const [selectedBroista, setSelectedBroista] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");

  useEffect(() => {
    const broistaList = broistasData[shop] || [];
    setDynamicBroistas(broistaList);

    const shiftTimeSlots =
      shiftTypeLineupHours.find((shift) => shift.shiftType === shiftType)
        ?.times || [];
    setTimeSlots(shiftTimeSlots);

    setSelectedTimeSlot("");
  }, [shop, shiftType]);

  const handleAddBroista = () => {
    if (selectedBroista && !addedBroistas.includes(selectedBroista)) {
      setAddedBroistas((prev) => [...prev, selectedBroista]);
      setSelectedBroista("");
    }
  };

  const handleRandomizeAssignments = () => {
    if (!selectedTimeSlot) {
      alert("Please select a time slot before randomizing!");
      return;
    }

    const limitedPositions = positions.slice(0, addedBroistas.length); // Limit positions
    const randomizedAssignments = assignBroistasToPositons(
      addedBroistas,
      limitedPositions
    );
    const updatedAssignments = [
      ...assignments,
      { timeSlot: selectedTimeSlot, assignments: randomizedAssignments },
    ];
    setAssignments(updatedAssignments);
  };

  const handlePushToTable = () => {
    if (assignments.length === 0) {
      alert("No assignments to push to the table!");
      return;
    }
  
    setFinalizedAssignments([...assignments]);
    
  };
  

  const handleUndoLast = () => {
    if (assignments.length === 0) {
      alert("No assignments to undo!");
      return;
    }

    const updatedAssignments = assignments.slice(0, -1); // Remove the last assignment
    setAssignments(updatedAssignments);
  };

  const handleUndoBroista = () => {
    if (addedBroistas.length === 0) {
      alert("No broistas to undo");
      return;
    }
    const updatedBroistas = addedBroistas.slice(0, -1);
    setAddedBroistas(updatedBroistas);
  };

  return (
    <div>
      <h2>Lineup Randomizer</h2>
      <Form.Group controlId="select-shift-type">
          <Form.Label>Select Shift Type</Form.Label>
          <Form.Select
            name="shiftType"
            value={shiftType}
            onChange={handleSelectChange}
          >
            <option value="">Select Shift Type</option>
            <option value="Morning">Morning</option>
            <option value="Mid">Mid</option>
            <option value="Night">Night</option>
          </Form.Select>
        </Form.Group>
        <br />

      <h4>Select Time Slot</h4>
      <Form.Group controlId="select-timeSlot">
        <Form.Label>Available Time Slots</Form.Label>
        <Form.Select
          value={selectedTimeSlot}
          onChange={(e) => setSelectedTimeSlot(e.target.value)}
        >
          <option value="" disabled>
            Select a Time Slot
          </option>
          {timeSlots.map((slot, idx) => (
            <option key={idx} value={slot}>
              {slot}
            </option>
          ))}
        </Form.Select>
      </Form.Group>
      <br />

      <h4>Select and Add Broistas</h4>
      <Form.Group controlId="select-broista">
        <Form.Label>Available Broistas</Form.Label>
        <Form.Select
          value={selectedBroista}
          onChange={(e) => setSelectedBroista(e.target.value)}
        >
          <option value="" disabled>
            Select a Broista
          </option>
          {dynamicBroistas.map((broista, idx) => (
            <option key={idx} value={broista}>
              {broista}
            </option>
          ))}
        </Form.Select>
      </Form.Group>
      <Button
        variant="primary"
        onClick={handleAddBroista}
        disabled={!selectedBroista}
      >
        Add Broista
      </Button>
      <br />
      <Button variant="secondary" onClick={handleUndoBroista}>
        Undo Last Added Broista
      </Button>
      <br />

      <div>
        <h4>Added Broistas</h4>
        <ul>
          {addedBroistas.map((broista, idx) => (
            <li key={idx}>{broista}</li>
          ))}
        </ul>
      </div>
      <br />

      <Button
        onClick={handleRandomizeAssignments}
        disabled={addedBroistas.length === 0 || !selectedTimeSlot}
      >
        Randomize Lineup for Selected Time Slot
      </Button>
      <Button
        variant="danger"
        onClick={handlePushToTable}
        disabled={assignments.length === 0}
      >
        Update Table
      </Button>
      <br />
      <Button
        onClick={handleUndoLast}
        variant="primary"
        disabled={assignments.length === 0}
      >
        Undo Last Randomized Assignment
      </Button>
      <br />
      <br />
      <LineupTable
        assignments={finalizedAssignments} // Use finalized data for the table
        timeSlots={timeSlots || []} // Provide fallback as an empty array
        addedBroistas={addedBroistas}
      />
    </div>
  );
};

export default LineupRandomizer;
