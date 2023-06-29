//libs
import dynamic from 'next/dynamic';

export const AddToProfileListsModal = dynamic(
  () => import(/* webpackChunkName: "add-to-profile-lists-modal" */ './AddToProfileListsModal'),
  { ssr: false }
);
