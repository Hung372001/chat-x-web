import { useModalContext } from '@/context/modal-context';

const useModal = () => {
  const { modals, setModals } = useModalContext();

  const openModal = (name: string) => {
    setModals({
      ...modals,
      [name]: true,
    });
  };

  const closeModal = (name: string) => {
    setModals({
      ...modals,
      [name]: false,
    });
  };

  return { modals, openModal, closeModal };
};

export default useModal;
