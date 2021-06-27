import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { Modal } from "semantic-ui-react";
import { RootStoreContext } from "../../stores/rootStore";

const ModalContainer = () => {
  const rootStore = useContext(RootStoreContext);
  const { modal: {open, body, image}, closeModal } = rootStore.modalStore;

  return (
    <Modal
     open={open} 
      onClose={closeModal}
      closeIcon
      dimmer='blurring'
      closeOnEscape={true}
      closeOnDimmerClick={false}>
      <Modal.Content image={image}>
        {body}
      </Modal.Content>
      <Modal.Actions>
    
      </Modal.Actions>
    </Modal>
  );
};

export default observer(ModalContainer);
