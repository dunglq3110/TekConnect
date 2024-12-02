import React, { useState } from 'react';
import { 
  TouchableOpacity, 
  Modal, 
  View, 
  StyleSheet 
} from 'react-native';
import { MessageCircle } from 'lucide-react-native';
import ChatBox from './ChatBox';

const FloatingChatButton: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <>
      <TouchableOpacity 
        style={styles.floatingButton} 
        onPress={toggleChat}
      >
        <MessageCircle color="white" size={24} />
      </TouchableOpacity>

      <Modal
        visible={isChatOpen}
        animationType="slide"
        onRequestClose={toggleChat}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={toggleChat}
          >
            <MessageCircle color="black" size={24} />
          </TouchableOpacity>
          <ChatBox />
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#007bff',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
    marginTop: 50,
  },
  closeButton: {
    alignSelf: 'flex-end',
    margin: 10,
  },
});

export default FloatingChatButton;