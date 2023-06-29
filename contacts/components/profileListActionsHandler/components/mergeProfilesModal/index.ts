//libs
import dynamic from 'next/dynamic';

export const MergeProfilesModal = dynamic(
  () => import(/* webpackChunkName: "merge-profiles-modal" */ './MergeProfilesModal'),
  { ssr: false }
);
