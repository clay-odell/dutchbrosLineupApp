import { useState, useEffect } from "react";
import {
  shiftLeadsData,
  broistasData,
  positions,
  shiftTypeLineupHours,
  storeHours,
} from "./DataForDutch";
import { Container, Form, Button, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { shiftLengthHelper } from "./utils/shiftLengthHelper";
import { shiftLengthBreakCalculator } from "./utils/shiftLengthHelper";
import LineupTable from "./LineupTable";
import LineupRandomizer from "./LineupRandomizer";

const LineupForm = () => {
  const [formData, setFormData] = useState({
    shop: "Owens",
    shiftLead: "",
    broista: "",
    shiftType: "",
    shiftStart: "",
    shiftEnd: "",
    position: "",
    timeSlot: "",
  });
  const [shiftLeads, setShiftLeads] = useState([]);
  const [broistas, setBroistas] = useState([]);
  const [lineup, setLineup] = useState([]);
  const [positionOptions, setPositionsOptions] = useState([]);
  const [timeSlot, setTimeSlot] = useState([]);

  useEffect(() => {
    setShiftLeads(shiftLeadsData[formData.shop] || []);
    setBroistas(broistasData[formData.shop] || []);
    setPositionsOptions(positions);

    const selectedShift = shiftTypeLineupHours.find(
      (shift) => shift.shiftType === formData.shiftType
    );
    setTimeSlot(selectedShift ? selectedShift.times : []);
  }, [formData.shop, formData.shiftType]);

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUndoLast = () => {
    setLineup((prevLineup) => prevLineup.slice(0, -1)); // Remove the last entry
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const shiftLength = shiftLengthHelper(
      formData.shiftStart,
      formData.shiftEnd
    );
    const { breakStartTime } = shiftLengthBreakCalculator(
      formData.shiftStart,
      formData.shiftEnd
    );

    const lineupEntry = {
      ...formData,
      shiftLength,
      breakTime: breakStartTime || "N/A",
    };

    setLineup((prevLineup) => {
      const updatedLineup = [...prevLineup, lineupEntry];

      return updatedLineup;
    });

    // Reset form fields
    setFormData({
      shop: "Owens",
      shiftLead: "",
      broista: "",
      shiftStart: "",
      shiftEnd: "",
      position: "",
      timeSlot: "",
      shiftType: formData.shiftType,
    });
  };

  return (
    <Container>
      <h1>Dutch Bros Lineup Maker App</h1>
      <Card>
      <h2>Shift Length & Break Time Calculator</h2>

      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="select-shop">
          <Form.Label>Select Shop</Form.Label>
          <Form.Select
            name="shop"
            value={formData.shop}
            onChange={handleSelectChange}
          >
            <option value="">Select a Shop</option>
            {Object.keys(shiftLeadsData).map((shopName, idx) => (
              <option key={idx} value={shopName}>
                {shopName}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <br />

        {shiftLeads.length > 0 && (
          <Form.Group controlId="select-lead">
            <Form.Label>Select a Shift Lead</Form.Label>
            <Form.Select
              name="shiftLead"
              value={formData.shiftLead}
              onChange={handleSelectChange}
            >
              <option value="">Select a Shift Lead</option>
              {shiftLeads.map((lead, idx) => (
                <option key={idx} value={lead}>
                  {lead}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        )}
        <br />

        <Form.Group controlId="select-shiftStart">
          <Form.Label>Select Shift Start Time</Form.Label>
          <Form.Select
            name="shiftStart"
            value={formData.shiftStart}
            onChange={handleSelectChange}
          >
            <option value="">Select Shift Start Time</option>
            {storeHours.map((hour, idx) => (
              <option key={idx} value={hour}>
                {hour}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <br />

        <Form.Group controlId="select-shiftEnd">
          <Form.Label>Select Shift End Time</Form.Label>
          <Form.Select
            name="shiftEnd"
            value={formData.shiftEnd}
            onChange={handleSelectChange}
          >
            <option value="">Select Shift End Time</option>
            {storeHours.map((hour, idx) => (
              <option key={idx} value={hour}>
                {hour}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <br />
        <Form.Group controlId="select-shift-type">
          <Form.Label>Select Shift Type</Form.Label>
          <Form.Select
            name="shiftType"
            value={formData.shiftType}
            onChange={handleSelectChange}
          >
            <option value="">Select Shift Type</option>
            <option value="Morning">Morning</option>
            <option value="Mid">Mid</option>
            <option value="Night">Night</option>
          </Form.Select>
        </Form.Group>
        <br />

        {broistas.length > 0 && (
          <Form.Group controlId="select-broista">
            <Form.Label>Select a Broista</Form.Label>
            <Form.Select
              name="broista"
              value={formData.broista}
              onChange={handleSelectChange}
            >
              <option value="">Select a Broista</option>
              {broistas.map((broista, idx) => (
                <option key={idx} value={broista}>
                  {broista}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        )}
        <br />

        <Button type="submit">Add to Lineup</Button>
        <Button variant="secondary" onClick={handleUndoLast}>
          Undo Last Lineup Entry
        </Button>
      </Form>
      <br />

      {lineup.length > 0 && (
        <div>
          <h3>Lineup:</h3>
          <ul>
            {lineup.map((entry, idx) => (
              <li key={idx}>
                {entry.shiftLead && entry.shiftLead.length > 0 ? (
                  <>
                    <strong> Shift Lead:</strong> {entry.shiftLead},
                  </>
                ) : (
                  <>
                    <strong> Broista:</strong> {entry.broista},
                  </>
                )}
                <ul>
                  <li>
                    
                    <strong> Shift Start</strong>: {entry.shiftStart}
                    <br /> 
                    <strong> Shift End</strong>: {entry.shiftEnd}
                    <br />
                    <strong> Shift Length:</strong> {entry.shiftLength} hours
                    <br />
                    {entry.shiftLength >= 4 ? (
                      <>
                        <strong> Break Time:</strong> {entry.breakTime}
                        <br />
                      </>
                    ) : (
                      <>
                        <strong> No Break</strong>
                      </>
                    )}
                  </li>
                  <hr />
                </ul>
              </li>
            ))}
          </ul>
        </div>
      )}
      </Card>
      <Card>
      <LineupRandomizer
        shiftType={formData.shiftType}
        handleSelectChange={handleSelectChange}
        shop={formData.shop}
        broistas={broistas}
        positionOptions={positionOptions}
        timeSlot={timeSlot}
      />
      </Card>
    </Container>
  );
};

export default LineupForm;
