import React from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { useForm, Controller } from 'react-hook-form';

const CreateRoomModal: React.FC<{
  show: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
}> = ({
  show, onClose, onSubmit,
}) => {
  const { handleSubmit, control, errors } = useForm();
  return (
    <Modal show={show} onHide={onClose}>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Header closeButton>
          <Modal.Title>Create Room</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="formRoomName">
            <Form.Label>Room Name</Form.Label>
            <Controller
              as={Form.Control}
              name="name"
              type="text"
              control={control}
              rules={{ required: 'Required' }}
              isInvalid={!!errors.name}
            />
            {errors.name && (
              <Form.Control.Feedback type="invalid">
                {errors.name.message}
              </Form.Control.Feedback>
            )}
          </Form.Group>
          <Form.Group controlId="formRoomLocation">
            <Form.Label>Location</Form.Label>
            <Controller
              as={Form.Control}
              name="location"
              type="text"
              control={control}
              rules={{ required: 'Required' }}
              isInvalid={!!errors.location}
            />
            {errors.location && (
              <Form.Control.Feedback type="invalid">
                {errors.location.message}
              </Form.Control.Feedback>
            )}
          </Form.Group>
          <Form.Group controlId="formRoomMaxUsers">
            <Form.Label>Max Users</Form.Label>
            <Controller
              as={Form.Control}
              name="maxUsers"
              type="number"
              control={control}
              rules={{ required: 'Required' }}
              isInvalid={!!errors.maxUsers}
            />
            {errors.maxUsers && (
              <Form.Control.Feedback type="invalid">
                {errors.maxUsers.message}
              </Form.Control.Feedback>
            )}
          </Form.Group>
          <Form.Group controlId="formRoomTopics">
            <Form.Label>Topics</Form.Label>
            <Controller
              as={Form.Control}
              name="topics"
              type="text"
              control={control}
              placeholder="Enter topics (commas)"
              rules={{ required: 'Required' }}
              isInvalid={!!errors.topics}
            />
            {errors.topics && (
              <Form.Control.Feedback type="invalid">
                {errors.topics.message}
              </Form.Control.Feedback>
            )}
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Save Changes
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default CreateRoomModal;
