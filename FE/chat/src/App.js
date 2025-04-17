import { useState } from 'react';
import SetUsername from './Components/SetUsername';
import ChatApp from './Components/ChatApp';
import Title from './Components/Title';
import { useSignalR } from './Context/SignalRContext';

function App() {
  const [showChat, setShowChat] = useState(false);
  const { validationResult } = useSignalR();

  return (
    <div className="App">
      <Title />
      {!validationResult ? (
        <SetUsername onSuccess={() => setShowChat(true)} />
      ) : (
        <ChatApp />
      )}
    </div>
  );
}

export default App;