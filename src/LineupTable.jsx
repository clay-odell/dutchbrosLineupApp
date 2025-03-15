import { Table, Spinner } from "react-bootstrap";
import { positions, shiftTypeLineupHours } from "./DataForDutch";
import "bootstrap/dist/css/bootstrap.min.css";

const LineupTable = ({ lineup, shiftType }) => {
  if (!shiftType) {
    return (
      <div className="loading">
        <p>Waiting on Shift Type...</p>
      </div>
    );
  }

  const shiftTimes =
    shiftTypeLineupHours.find((shift) => shift.shiftType === shiftType)?.times ||
    [];

  return (
    <>
      <h2>{shiftType} Position Chart</h2>
      {lineup.length === 0 ? (
        <p>No lineup data available for this shift type.</p>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Position</th>
              {shiftTimes.map((time, idx) => (
                <th key={idx}>{time}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {positions.map((positionObj, positionIdx) => (
              <tr key={positionIdx}>
                <td>{positionObj.position}</td>
                {shiftTimes.map((time, timeIdx) => {
                  const person = lineup.find(
                    (entry) =>
                      entry.position === positionObj.position &&
                      entry.timeSlot === time
                  );

                  return (
                    <td key={timeIdx}>
                      {person
                        ? person.shiftLead || person.broista
                        : "—"} {/* Display Shift Lead, Broista, or empty */}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default LineupTable;
