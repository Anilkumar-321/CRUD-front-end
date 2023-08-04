import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  ListGroup,
  Alert,
} from "react-bootstrap";
import "./App.css";

const API_BASE_URL = "https://node.mhemanthkmr.live/api/todos/";

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodoText, setNewTodoText] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [variant, setVariant] = useState("");

  useEffect(() => {
    axios
      .get(API_BASE_URL)
      .then((response) => {
        setTodos(response.data);
      })
      .catch((error) => {
        console.error("Error fetching todos:", error);
      });
  }, []);

  const addTodo = () => {
    if (!newTodoText.trim()) return;

    axios
      .post(API_BASE_URL, { text: newTodoText })
      .then((response) => {
        setTodos([...todos, response.data]);
        setNewTodoText("");
        setAlertMessage("Todo added successfully");
        setVariant("success");
      })
      .catch((error) => {
        console.error("Error adding todo:", error);
        setAlertMessage("Error adding todo");
        setVariant("danger");
      });
  };

  const deleteTodo = (id) => {
    axios
      .delete(`${API_BASE_URL}/${id}`)
      .then(() => {
        setTodos(todos.filter((todo) => todo._id !== id));
        setAlertMessage("Todo deleted successfully");
        setVariant("success");
      })
      .catch((error) => {
        console.error("Error deleting todo:", error);
        setAlertMessage("Error deleting todo");
        setVariant("danger");
      });
  };

  const toggleComplete = (id) => {
    axios
      .put(`${API_BASE_URL}/${id}`, {
        completed: !todos.find((todo) => todo._id === id).completed,
      })
      .then((response) => {
        const updatedTodo = response.data;
        setTodos((prevTodos) =>
          prevTodos.map((todo) =>
            todo._id === updatedTodo._id ? updatedTodo : todo
          )
        );
        setAlertMessage("Todo updated successfully");
        setVariant("success");
      })
      .catch((error) => {
        console.error("Error updating todo:", error);
        setAlertMessage("Error updating todo");
        setVariant("danger");
      });
  };

  return (
    <Container className="mt-5">
      {alertMessage && (
        <Alert variant={variant} className="mb-3" dismissible>
          {alertMessage}
        </Alert>
      )}
      <h1 className="mb-4">Todo List</h1>
      <Form className="mb-3">
        <Row>
          <Col xs={9}>
            <Form.Control
              type="text"
              value={newTodoText}
              onChange={(e) => setNewTodoText(e.target.value)}
              placeholder="Enter a new todo"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault(); // Prevent the default "Enter" key behavior (form submission)
                  addTodo(); // Call the addTodo function
                }
              }}
            />
          </Col>
          <Col xs={3}>
            <Button
              onClick={addTodo}
              variant="primary"
              disabled={!newTodoText.trim()}
            >
              Add Todo
            </Button>
          </Col>
        </Row>
      </Form>
      <ListGroup>
        {todos.map((todo) => (
          <ListGroup.Item
            key={todo._id}
            className="d-flex justify-content-between align-items-center"
          >
            <div>
              <input
                className="form-check-input me-4"
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleComplete(todo._id)}
              />
              <span className={todo.completed ? "completed" : ""}>
                {todo.text}
              </span>
            </div>
            <Button
              onClick={() => deleteTodo(todo._id)}
              variant="danger"
              size="sm"
            >
              Delete
            </Button>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
}

export default App;
