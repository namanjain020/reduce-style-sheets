// libs
import { ReactNode, Children, FC } from 'react';

// components
import { ModalHeader, ModalFooter, ModalBody } from '@sprinklr/spaceweb/modal';

export const SLOT_NAMES = {
  BODY: 'body',
  FOOTER: 'footer',
} as const;

const ContactCreationFormSlots: FC<
  React.PropsWithChildren<{
    name: Spr.ValueOf<typeof SLOT_NAMES>;
    children?: React.ReactNode;
  }>
> = () => null;

const ContactCreationFormLayout = ({ title, children }: { title: string; children: ReactNode }): JSX.Element => {
  const childrenArr = Children.toArray(children) as React.ReactElement[];

  const BodySlot = childrenArr.find((child: React.ReactElement) => child.props.name === SLOT_NAMES.BODY);
  const FooterSlot = childrenArr.find((child: React.ReactElement) => child.props.name === SLOT_NAMES.FOOTER);

  return (
    <>
      <ModalHeader className="text-20">{title}</ModalHeader>

      <ModalBody className="flex flex-col gap-4 py-4" data-testid="contactCreationFormBody">
        {BodySlot ? BodySlot.props.children : null}
      </ModalBody>

      <ModalFooter className="border-b-0 p-6 flex flex-row justify-end gap-3">
        {FooterSlot ? FooterSlot.props.children : null}
      </ModalFooter>
    </>
  );
};

ContactCreationFormLayout.Slot = ContactCreationFormSlots;

export default ContactCreationFormLayout;
