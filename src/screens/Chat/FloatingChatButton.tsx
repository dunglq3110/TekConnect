import React, { useState } from 'react';
import { 
  TouchableOpacity, 
  Modal, 
  View, 
  StyleSheet
} from 'react-native';
import { MessageCircle, X } from 'lucide-react-native';
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
        <MessageCircle color="black" size={24} />
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
            <X color="black" size={24} />
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
    top: 0,
    right: 0,
    backgroundColor: 'transparent',
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
  },
  closeButton: {
    alignSelf: 'flex-end',
    margin: 10,
  },
});

export default FloatingChatButton;