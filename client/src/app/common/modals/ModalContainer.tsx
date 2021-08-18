import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { Modal } from "semantic-ui-react";
import { RootStoreContext } from "../../stores/rootStore";

const ModalContainer = () => {
  const rootStore = useContext(RootStoreContext);
  const { modal: {open, body, image,footer,dimmer }, closeModal } = rootStore.modalStore;

  return (
    <Modal
     open={open} 
      onClose={closeModal}
      closeIcon
      dimmer={dimmer === "inverted" ? 'inverted' : "blurring"}
      closeOnEscape={true}
      closeOnDimmerClick={true}>
      <Modal.Content image={image}>
        {body}
      </Modal.Content>
      <Modal.Actions>
      {footer}
      </Modal.Actions>
    </Modal>
  );
};

export default observer(ModalContainer);
