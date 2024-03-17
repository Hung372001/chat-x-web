import { useDataContext } from '@/context/data-context';
import { useSocketContext } from '@/context/socket-context';
import { wait } from '@/lib/utils';
import { SendingMessage } from '@/types/chat-message';
import toast from 'react-hot-toast';

export const useSendCard = () => {
  const { socket } = useSocketContext();
  const { groupDetail, enqueueSendingMessage } = useDataContext();

  const sendCard = async (
    users: {
      id?: string;
      username?: string;
      avatar?: string;
      phoneNumber?: string;
      email?: string;
    }[]
  ) => {
    if (socket && groupDetail?.id) {
      for (let i = 0; i < users.length; i++) {
        const user = users[i];
        const newMessage: SendingMessage = {
          groupId: groupDetail.id,
          nameCardUserId: user.id,
        };

        socket.emit('onSendMessage', newMessage);
        enqueueSendingMessage({ ...newMessage, sentAt: new Date().toISOString() });

        await wait(1000);
      }
    }
  };

  return { sendCard };
};
