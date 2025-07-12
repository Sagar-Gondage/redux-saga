import './App.css';
import AddPost from './components/AddPost'; // Updated import path
import PostList from './components/PostList'; // Updated import path
import { Container } from 'reactstrap';

function App() {
  return (
    <div
      className="App py-3"
      style={{
        minHeight: '100vh',
        backgroundColor: '#f8f9fa',
        backgroundImage: 'linear-gradient(315deg, #f8f9fa 0%, #e9ecef 74%)',
      }}
    >
      <Container>
        <h1 className="text-center mb-3 text-primary">Redux-Saga Posts App</h1>
        <AddPost />
        <PostList />
      </Container>
    </div>
  );
}

export default App;
