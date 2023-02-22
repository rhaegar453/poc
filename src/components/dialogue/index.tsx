import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import React, { ReactNode } from 'react';
import './styles.css'

interface IModal extends Dialog.DialogProps {
    title: string,
    description?: string,
}

const Modal: React.FC<IModal> = ({ children, title, description, ...rest }) => (
    <Dialog.Root {...rest}>
        <Dialog.Portal >
            <Dialog.Overlay className="DialogOverlay" />
            <Dialog.Content className="DialogContent">
                <Dialog.Title className="DialogTitle">{title}</Dialog.Title>
                <Dialog.Description className="DialogDescription">
                    {description}
                </Dialog.Description>
                <div>
                    {children}
                </div>
                <Dialog.Close asChild>
                    <button className="IconButton" aria-label="Close">
                        <Cross2Icon />
                    </button>
                </Dialog.Close>
            </Dialog.Content>
        </Dialog.Portal>
    </Dialog.Root>
);

export default Modal;