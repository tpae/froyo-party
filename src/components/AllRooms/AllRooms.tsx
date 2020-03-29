import React from 'react';
import { Pane } from 'evergreen-ui';
import { Button, Table } from 'react-bootstrap';
import { IRoom } from '../../services/firebase';

const AllRooms: React.FC<{
  rooms: IRoom[];
}> = ({ rooms }) => (
  <Pane>
    <Pane display="flex" flexDirection="row" justifyContent="space-between" marginBottom="32px">
      <h3>
        All Rooms (
        {rooms.length}
        )
      </h3>
      <Pane>
        <Button variant="outline-secondary" style={{ marginRight: '12px' }}>Join Random Room</Button>
        <Button>Create Room</Button>
      </Pane>
    </Pane>
    <Pane>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Room Name</th>
            <th>Tags</th>
            <th>People</th>
            <th>Location</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>Mark</td>
            <td>Otto</td>
            <td>@mdo</td>
          </tr>
          <tr>
            <td>2</td>
            <td>Jacob</td>
            <td>Thornton</td>
            <td>@fat</td>
          </tr>
        </tbody>
      </Table>
    </Pane>
  </Pane>
);

export default AllRooms;
