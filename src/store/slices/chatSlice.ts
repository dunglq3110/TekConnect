import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Define message interface
export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'gpt';
  timestamp: number;
}

// Define chat state interface
export interface ChatState {
  messages: ChatMessage[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// Initial state
const initialState: ChatState = {
  messages: [],
  status: 'idle',
  error: null,
};

// Async thunk for sending message and getting AI response
export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async (message: string, { getState, rejectWithValue }) => {
    try {
      // Get existing messages from state
      const state = getState() as { chat: ChatState };
      const existingMessages = state.chat.messages;

      const response = await fetch('http://192.168.1.9:1234/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.2-1b-instruct',
          messages: [
            { role: 'system', content: 'You are a helpful assistant.' },
            ...existingMessages.map((msg) => ({ 
              role: msg.sender === 'user' ? 'user' : 'assistant', 
              content: msg.text 
            })),
            { role: 'user', content: message },
          ],
        }),
      });

      const data = await response.json();
      const gptResponse = data.choices[0].message.content;

      return {
        userMessage: {
          id: `user_${Date.now()}`,
          text: message,
          sender: 'user' as const,
          timestamp: Date.now(),
        },
        gptMessage: {
          id: `gpt_${Date.now()}`,
          text: gptResponse,
          sender: 'gpt' as const,
          timestamp: Date.now(),
        },
      };
    } catch (error) {
      return rejectWithValue('Failed to send message');
    }
  }
);

// Create chat slice
const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    clearChat: (state) => {
      state.messages = [];
    },
  },
  extraReducers: (builder) => {
  builder
    .addCase(sendMessage.pending, (state) => {
      state.status = 'loading';
    })
    .addCase(sendMessage.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.messages.push({
        ...action.payload.userMessage,
        sender: 'user' as const
      });
      state.messages.push({
        ...action.payload.gptMessage, 
        sender: 'gpt' as const
      });
    })
    .addCase(sendMessage.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.payload as string;
    });
},
});

export const { clearChat } = chatSlice.actions;
export default chatSlice.reducer;