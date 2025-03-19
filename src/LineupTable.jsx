import React from "react";
import { Card, Table } from "react-bootstrap";
import { positions } from "./DataForDutch";

const LineupTable = ({ assignments = [], timeSlots = [] }) => {
  // Debugging logs to track state and props
  

  return (
    <div>
      <Card>
      <h3>Lineup Table</h3>
      {assignments.length === 0 ? (
        <p>No data available. Please add and randomize assignments.</p>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Position</th>
              {timeSlots.map((timeSlot, index) => (
                <th key={index}>{timeSlot}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {positions.map((pos, posIndex) => (
              <tr key={posIndex}>
                <td>
                  <strong>{pos.position}</strong>
                </td>
                {timeSlots.map((timeSlot, timeIndex) => {
                  // Find the assignment for this position and time slot
                  const assignmentForCell = assignments.find(
                    (assignment) =>
                      assignment.timeSlot === timeSlot &&
                      assignment.assignments.some(
                        (a) => a.position.position === pos.position // Fix to access position property correctly
                      )
                  );

                  // Extract the broista's name if available
                  const broista = assignmentForCell
                    ? assignmentForCell.assignments.find(
                        (a) => a.position.position === pos.position
                      )?.broista
                    : null;

                  // Render the broista's name or leave the cell empty
                  return <td key={timeIndex}>{broista || ""}</td>;
                })}
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      </Card>
    </div>
  );
};

export default LineupTable;
