//libs
import dynamic from 'next/dynamic';

export const DeleteConfirmationModal = dynamic(
  () => import(/* webpackChunkName: "delete-confirmation-modal" */ './DeleteConfirmationModal'),
  { ssr: false }
);
